import asyncio
import websockets
import json
import openai
from openai import AsyncOpenAI
import asyncpg
import asyncio
from aiosmtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

openAi = ""
gmailPass = ""
username = 'postgres'
dbPass = "Your password here"
db = 'newsData'
hostname = 'localhost'

async def insertDB(data):
    conn = await asyncpg.connect(user=username,
                                 password=dbPass,
                                 database=db,
                                 host=hostname)
    await conn.execute('''INSERT INTO news_summaries(summary, tickers, sentiment, level) VALUES($1, $2, $3, $4)''', data['summary'], data['tickers'], data['sentiment'], data['level'])
    await conn.close()

async def fetchEmails(tickers):
    conn = await asyncpg.connect(user=username,
                                 password=dbPass,
                                 database=db,
                                 host=hostname)
    users = await conn.fetch('SELECT * FROM users')
    await conn.close()
    subscribed_emails = []
    for user in users:
        for ticker in tickers:
            if ticker in user['tickers']:
                subscribed_emails.append(user['email'])
    return subscribed_emails


async def handleMessage(emitted_data):
    tickers = emitted_data['tickers']
    await insertDB(emitted_data)
    subscribed_emails = await fetchEmails(tickers)
    print("Users subscribed to {}: {}".format(tickers, subscribed_emails))
    for email in subscribed_emails:
        await sendEmail(
            email,
            "News subscription report",
            f"This is your news subscription report for {tickers} : \n"
            f" Summary : {emitted_data['summary']} \n"
            f" Tickers : {emitted_data['tickers']} \n" 
            f" Outlook : {emitted_data['sentiment']} \n"
            f" Strength of outlook (1-10) : {emitted_data['level']}"
        )

async def sendEmail(recipient_email, subject, message_body):
    sender_email = "mshvorin@gmail.com"
    app_password = gmailPass

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject
    message.attach(MIMEText(message_body, "plain"))

    async with SMTP(hostname="smtp.gmail.com", port=465, use_tls=True) as smtp:
        await smtp.login(sender_email, app_password)
        await smtp.send_message(message)

        print(f"Email sent to {recipient_email}")

async def summarize(news):
    client = AsyncOpenAI(api_key=openAi)
    content = f"{news['headline']} {news['content']} {news['symbols']}"
    try:
        input_text = f"Given '{content}', give me a summary of what happened along with a sentiment analysis (only the words positive, negative, or neutral, just one of them) in the form of a dictionary, as well as the stock tickers affected by it, denoted by 'summary', 'sentiment', and 'tickers', respectively. Make it all in one line so one may call json.loads on it. In addition, add another value called level with the 'level' of the sentiment on it from 1 to 10. Use double quotes and not single quotes please. Return it as a dictionary, with the keys being denoted by the double quotes and not single quotes with no double quotes around the response, in the format, {{(doublequote)summary(doublequote):(doublequote)field(doublequote),...'}}"
        stream = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": input_text}]
        )
        print(stream.choices[0].message.content)
        return stream.choices[0].message.content
    except Exception as exception:
        print(f"Error: {exception}")
        return "Error. Try again."

async def alpacaNewsStream(emit_message):
    uri = "wss://stream.data.alpaca.markets/v1beta1/news"
    async with websockets.connect(uri) as websocket:
        auth_data = {
            "action": "auth",
            "key": "PK970OQ1UBZE59CTHWNW",
            "secret": "AeeuhktfclPna1HpOtc3lmGDVdr0UT28lb2eWfPu"
        }
        await websocket.send(json.dumps(auth_data))
        auth_response = await websocket.recv()
        print(auth_response)
        emit_message(auth_response)
        # emit_message(auth_response)
        subscribe_message = {
            "action": "subscribe",
            "news": ["*"]
        }
        await websocket.send(json.dumps(subscribe_message))
        subscription_response = await websocket.recv()
        print(subscription_response)
        emit_message("Success!")
        while True:
            print("waiting")
            message = await websocket.recv()
            message_data = json.loads(message)[0]
            print(str(message_data))
            print("Arrived")
            if message_data['T'] == 'n':
                response = await summarize(message_data)
                try:
                    print(json.loads(response))
                    print(json.loads(response)['summary'])
                    print(json.loads(response)['tickers'])
                    print(json.loads(response)['sentiment'])
                    print(json.loads(response)['level'])
                    parsed_response = json.loads(response)
                    emit_data = {"summary": parsed_response.get("summary"),
                                 "tickers": parsed_response.get("tickers"),
                                 "sentiment": parsed_response.get("sentiment"),
                                 "level": parsed_response.get("level")}
                    print(emit_data)
                    emit_message(emit_data)
                    await handleMessage(emit_data)
                except:
                    print(response)

def startAlpacaStream(emit_message):
    asyncio.run(alpacaNewsStream(emit_message))