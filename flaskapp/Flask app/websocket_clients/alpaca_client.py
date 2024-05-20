import asyncio
import http.client
import math
import random
# import boto3
# from botocore.exceptions import NoCredentialsError
import aiohttp
import websockets
import json
import openai
from openai import AsyncOpenAI
import asyncpg
import asyncio
from aiosmtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import requests
import pandas as pd
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from tiingo import TiingoClient
from sklearn.preprocessing import MinMaxScaler
import torch
import torch.nn as nn
from torch.autograd import Variable
import numpy as np
import os
from concurrent.futures import ThreadPoolExecutor
import time

openAi = "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"
gmailPass = "xeur affl zdkr yjwg"
username = 'u94q2hmdkutfig'
dbPass = "p93efda47086cc7c59d40f6f5e8d471f74d8095429e6e641c008fecfc8b26b046"
db = 'd7uuks355v9e6q'
hostname = 'ceu9lmqblp8t3q.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com'
polygon = "mplYkwRaoALynpt1vkySurApehLj8YoD"
vantageAPI = "BXOOKFPEOHCCGAHR"
token = "e366dfb2d40d714341d8f23d3845f45a6cafece8"
twilio_account_sid = "AC3e016f5aaba4c2c11358176763d4fe74"
twilio_auth_token = "0270a989ae083d3e2a5afc263eb82bf6" #Trial phone: +18447801837
twilio_sender_phone = "+18778392174"

# Asynchronously inserting data into the 'news_summaries' table in the database
async def insertDB(data):
    conn = await asyncpg.connect(user=username,
                                 password=dbPass,
                                 database=db,
                                 host=hostname)
    await conn.execute('''INSERT INTO news_summaries(summary, tickers, sentiment, level) VALUES($1, $2, $3, $4)''', data['summary'], data['tickers'], data['sentiment'], int(data['level']))
    await conn.close()

# Convert database records into a list of dictionaries for easier manipulation.
async def records_to_dict_list(records):
    dict_list = []
    for record in records:
        user_dict = {
            'user_id': record['user_id'],
            'username': record['username'],
            'email': record['email'],
            'tickers': record['tickers'],
            'phonesubbed': record['phonesubbed'],
            'emailsubbed': record['emailsubbed'],
            'phone_number': record['phone_number']
        }
        dict_list.append(user_dict)
    return dict_list

async def historical_records_to_dict(records):
    dict_list = []
    for record in records:
        user_dict = {
            'id': record['id'],
            'level': record['level'],
            'sentiment': record['sentiment'],
            'summary': record['summary'],
            'tickers': record['tickers']
        }
        dict_list.append(user_dict)
    return dict_list

# Fetch message subscriptions data from the database, check tickers for subscription, and notify users
async def fetchMessanging(tickers):
    conn = await asyncpg.connect(user=username,
                                 password=dbPass,
                                 database=db,
                                 host=hostname)
    usersRec = await conn.fetch('SELECT * FROM users')
    users = await records_to_dict_list(usersRec)
    print(users)
    await conn.close()
    subscribed_emails = []
    subscribed_numbers = []
    tickerList = []
    for user in users:
        user_tickers = user['tickers']
        if user_tickers and tickers:
            for ticker in tickers:
                if ticker in user_tickers:
                    subscribed_emails.append({user['email'] : user['emailsubbed']})
                    subscribed_numbers.append({user['phone_number'] : user['phonesubbed']})
                    tickerList.append(ticker)
        else:
            print(f"No tickers set for user {user['username']} with email {user['email']} and number {user['phone_number']}")
    return subscribed_emails, subscribed_numbers, tickerList

# Fetch historical data for testing from news_summaries table
async def getHistoricalDBData():
    conn = await asyncpg.connect(user=username,
                                 password=dbPass,
                                 database=db,
                                 host=hostname)
    usersData = await conn.fetch('SELECT * FROM news_summaries')
    Data = await historical_records_to_dict(usersData)
    return Data


# Main handler for processing incoming data, including inserting into DB, fetching subscribers, and sending notifications, with email formatting and attempted SMS inegration
async def handleMessage(emitted_data):
    tickers = emitted_data['tickers']
    await insertDB(emitted_data)
    subscribed_emails, subscribed_numbers, ticker_list = await fetchMessanging(tickers)
    print("Emails")
    print(subscribed_emails)
    tickerList = list(set(ticker_list))
    print("Users subscribed to {}: {}".format(tickers, subscribed_emails))
    with ThreadPoolExecutor() as executor:
        plotnames = await asyncio.gather(*[tiingoML(ticker, int(emitted_data['level'])) for ticker in tickerList])
        print(plotnames)
        email_body = f"""
        <html>
            <head>
                <style>
                    body {{
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 0;
                        color: #333;
                        text-align: center;
                        background-color: #f4f4f4;
                    }}
                    .container {{
                        background-color: #fff;
                        margin: 20px auto;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        max-width: 600px;
                    }}
                    h1 {{
                        color: #007BFF;
                    }}
                    p {{
                        font-size: 16px;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>News Subscription Report</h1>
                    <p>This is your news subscription report for <strong>{tickers}</strong>.</p>
                    <p><strong>Summary:</strong> {emitted_data['summary']}</p>
                    <p><strong>Tickers:</strong> {emitted_data['tickers']}</p>
                    <p><strong>Outlook:</strong> {emitted_data['sentiment']}</p>
                    <p><strong>Strength of Outlook (1-10):</strong> {emitted_data['level']}</p>
                </div>
            </body>
        </html>
        """
        for email_dict in subscribed_emails:
            for email, is_subscribed in email_dict.items():
                if is_subscribed:  # This checks if the value is True
                    await sendEmail(
                        email,
                        "News Subscription Report",
                        email_body,
                        attachment_paths=plotnames,
                        mime_type='text/html'  # Ensure the MIME type is set to 'text/html'
                    )
            else:
                print("No tickers found in DB")
        for phone in subscribed_numbers:
            for phone, is_subscribed in phone.items():
                if is_subscribed:
                    sendSMS(f'{phone}', f"News Subscription Report\n"
                                          f"This is your news subscription report for {tickers}.\n"
                                          f"Summary: {emitted_data['summary']}\nTickers: {emitted_data['tickers']}\n"
                                          f"Outlook: {emitted_data['sentiment']}\n"
                                          f"Strength of Outlook (1-10): {emitted_data['level']}", plotnames)



#Attempted SMS integration, not working due to toll-free messaged requiring verified phone numbers, still trying to work around it
def sendSMS(recipient_phone, message, plotnames):
    conn = http.client.HTTPSConnection("9l963y.api.infobip.com")
    payload = json.dumps({
        "messages": [
            {
                "destinations": [{"to": "13479253059"}],
                "from": "ServiceSMS",
                "text": "Congratulations on sending your first message.\nGo ahead and check the delivery report in the next step."
            }
        ]
    })
    headers = {
        'Authorization': 'App 4415a0b712214f407b65f0a376d650bb-f7d5a550-cc21-4c5e-878a-4b92f76adcde',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    conn.request("POST", "/sms/2/text/advanced", payload, headers)
    res = conn.getresponse()
    data = res.read()
    print(data)
    # Attempt to use amazon s3, unable to get it working
    # for plot in plotnames:
    #     upload_file_to_s3(plot, "capstone499", f"{random.randrange(1,10000000)}s3")
    print(f"SMS sent to {recipient_phone}")

#Attempt at uploading stock images to amazons3 for SMS integration, so users can be texted images
# def upload_file_to_s3(file_name, bucket, object_name=None):
#     if object_name is None:
#         object_name = file_name
#
#     s3_client = boto3.client('s3')
#     try:
#         response = s3_client.upload_file(file_name, bucket, object_name, ExtraArgs={'ACL': 'public-read'})
#         return f"https://{bucket}.s3.amazonaws.com/{object_name}"
#     except FileNotFoundError:
#         print("The file was not found")
#         return None
#     except NoCredentialsError:
#         print("Credentials not available")
#         return None

# Send emails to subscribed users, attaching relevant data and plots
async def sendEmail(recipient_email, subject, message_body, attachment_paths=None, mime_type='text/plain'):
    sender_email = "mshvorin@gmail.com"
    app_password = gmailPass
    response = ""
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject
    if mime_type == 'text/html':
        message.attach(MIMEText(message_body, 'html'))
    else:
        message.attach(MIMEText(message_body, 'plain'))

    if attachment_paths:
        for att in attachment_paths:
            if os.path.isfile(att):
                with open(att, 'rb') as attachment:
                    img = MIMEImage(attachment.read(), name=os.path.basename(att))
                    img.add_header('Content-Disposition', 'attachment', filename=os.path.basename(att))
                    message.attach(img)

    async with SMTP(hostname="smtp.gmail.com", port=465, use_tls=True) as smtp:
        await smtp.login(sender_email, app_password)
        await smtp.send_message(message)
        response = f"Email sent to {recipient_email}"

    return(response)

# Using OpenAI's GPT 3.5 to summarize news data and extract relevant financial details and format them in a way in which we can extract a sentiment analysis from it and get a clear and concise summary of the news
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


# Connect to Alpaca's WebSocket news stream, authenticate, and handle incoming messages.  handleMessage and summarize are the main functions, summarize gets the data formatted with analysis by AI,
# and then handleMessage does the machine learning and sends the graph and emails to the users subscribed to those tickers.
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
        time.sleep(1)
        # emit_message(auth_response)
        subscribe_message = {
            "action": "subscribe",
            "news": ["*"]
        }
        await websocket.send(json.dumps(subscribe_message))
        subscription_response = await websocket.recv()
        print(subscription_response)
        emit_message("Success")
        while True:
            print("waiting")
            message = await websocket.recv()
            message_data = json.loads(message)[0]
            print(str(message_data))
            print("Arrived")
            if message_data['T'] == 'n':
                response = await summarize(message_data)
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
                await handleMessage(emit_data)
                emit_message(str(emit_data))


def startAlpacaStream(emit_message):
    asyncio.run(alpacaNewsStream(emit_message))

# LSTM-based neural network for predicting future stock prices based on historical data
# LSTM used due to the fact that this is time-series data and we only need to iterate over a certain last sequence to get an idea of what will happen next
class LSTMModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_layers, output_dim, dropout_prob=0.5):
        super(LSTMModel, self).__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True, dropout=dropout_prob)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).requires_grad_()
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).requires_grad_()
        out, _ = self.lstm(x, (h0.detach(), c0.detach()))
        out = self.fc(out[:, -1, :])
        return out

# Compute technical indicators like EMA to be used as features for the LSTM model
def add_technical_indicators(df):
    # Calculate Exponential Moving Averages (EMAs) for 10 and 50 periods
    df['EMA_10'] = df['close'].ewm(span=10, adjust=False).mean()
    df['EMA_50'] = df['close'].ewm(span=50, adjust=False).mean()
    return df

# Prepare sequential data from the dataset for LSTM model training and testing
def prepare_sequences(data, sequence_length):
    X, y = [], []
    for i in range(len(data) - sequence_length):
        sequence = data[i:(i + sequence_length), :]
        target = data[i + sequence_length, -1]  # Assuming target is 'close' price
        X.append(sequence)
        y.append(target)
    return np.array(X), np.array(y)

# Generate future stock price predictions using the trained LSTM model, considering business hours constraints
def generate_future_timestamps(last_timestamp, num_predictions, start_hour=9, end_hour=17):
    future_timestamps = []
    if isinstance(last_timestamp, str):
        current_timestamp = datetime.strptime(last_timestamp, '%Y-%m-%d %H:%M')
    else:
        current_timestamp = last_timestamp

    for _ in range(num_predictions):
        current_timestamp += timedelta(hours=1)
        if current_timestamp.hour > end_hour or current_timestamp.hour < start_hour:
            hours_until_next_day = ((24 - current_timestamp.hour) + start_hour) % 24
            current_timestamp += timedelta(hours=hours_until_next_day)
        future_timestamps.append(current_timestamp)
    return future_timestamps


async def tiingoML(ticker, sentimentScore):
    try:
        # Set headers and define the date range for the API request
        headers = {
            'Content-Type': 'application/json',
        }
        start = "2023-05-01"
        end = "2024-03-18"

        # Construct the API URL for fetching stock prices
        url = f"https://api.tiingo.com/iex/{ticker}/prices?startDate={start}&endDate={end}&columns=open,high,low,close,volume&resampleFreq=1hour&token={token}"

        # Asynchronously fetch data from Tiingo API
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    ticker_price = pd.DataFrame(data)
                    print(ticker_price)
                else:
                    print(f"Failed to fetch data for {ticker}: {response.status}")

        # Process date column to the desired format
        ticker_price['date'] = pd.to_datetime(ticker_price['date']).dt.strftime('%Y-%m-%d %H:%M')
        df = ticker_price
        print(df.to_string())

        # Add technical indicators (EMA)
        df = add_technical_indicators(ticker_price)

        # Prepare the features for the model (close price and EMAs)
        features = df[['close', 'EMA_10', 'EMA_50']].values
        scaler = MinMaxScaler(feature_range=(-1, 1))
        features_normalized = scaler.fit_transform(features)

        # Prepare sequences for LSTM
        sequence_length = 20
        X, y = prepare_sequences(features_normalized, sequence_length)

        # Split data into training and testing sets (90% train, 10% test)
        train_size = int(len(X) * 0.9)
        X_train, y_train = X[:train_size], y[:train_size]
        X_test, y_test = X[train_size:], y[train_size:]

        # Convert data to PyTorch tensors
        X_train = torch.Tensor(X_train)
        y_train = torch.Tensor(y_train)
        X_test = torch.Tensor(X_test)
        y_test = torch.Tensor(y_test)

        # Initialize the LSTM model, loss function, and optimizer
        model = LSTMModel(input_dim=3, hidden_dim=64, num_layers=2, output_dim=1)
        criterion = nn.MSELoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

        # Train the model for 300 epochs
        epochs = 300
        for epoch in range(epochs):
            model.train()
            optimizer.zero_grad()
            outputs = model(X_train)
            loss = criterion(outputs, y_train)
            loss.backward()
            optimizer.step()
            print(f'Epoch {epoch + 1}/{epochs} Loss: {loss.item()}')

        # Evaluate the model on test data
        model.eval()
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        X_test_tensors = torch.Tensor(X_test).to(device)
        test_predict = model(X_test_tensors)

        # Convert predictions to numpy arrays for inverse scaling
        test_predict_np = test_predict.detach().cpu().numpy()
        temp_array = np.zeros((test_predict_np.shape[0], 3))
        temp_array[:, 0] = test_predict_np.squeeze()

        # Inverse transformation to get original scale predictions
        inverse_transformed_predictions = scaler.inverse_transform(temp_array)[:, 0]

        # Inverse transform actual values for comparison
        y_test_np = y_test.detach().cpu().numpy()
        y_test_scaled_back = scaler.inverse_transform(
            np.concatenate((y_test_np.reshape(-1, 1), np.zeros((y_test_np.shape[0], 2))), axis=1))[:, 0]

        # Calculate Mean Absolute Error (MAE)
        mae = np.mean(np.abs(inverse_transformed_predictions - y_test_scaled_back))
        print("Mean Absolute Error:", mae)

        # Get the last known price for future predictions
        last_known_price = df['close'].values[-1]
        acceptance_percentage = 0.05
        future_predictions = []
        last_sequence = X_test[-1].reshape(1, sequence_length, -1)
        volatility = 0.01

        # Predict 12 future steps
        for i in range(12):
            with torch.no_grad():
                last_sequence_tensor = torch.Tensor(last_sequence).to(device)
                future_pred = model(last_sequence_tensor)
                future_pred_np = future_pred.cpu().detach().numpy().flatten()
                temp_pred_array = np.zeros((1, 3))
                temp_pred_array[:, 0] = future_pred_np

                # Apply random walk for predictions
                random_walk = last_known_price * (1 + np.random.normal(0, volatility))
                future_pred_value = random_walk
                future_predictions.append(future_pred_value)
                last_known_price = future_pred_value  # Update last known price for next step

                # Prepare the new sequence for the next prediction
                new_sequence = np.roll(last_sequence.flatten(), -3)
                new_sequence[-3:] = future_pred_value
                last_sequence = new_sequence.reshape(1, sequence_length, -1)

        # Adjust predictions if they exceed a certain threshold
        if abs(future_predictions[0] - last_known_price) > last_known_price * acceptance_percentage:
            adjustment_factor = (last_known_price * acceptance_percentage) / abs(
                future_predictions[0] - last_known_price)
            future_predictions = [last_known_price + (p - last_known_price) * adjustment_factor for p in
                                  future_predictions]

        # Apply sentiment influence to predictions
        sentiment_score = sentimentScore
        offset = 0
        if future_predictions[0] / last_known_price > 0.05 or last_known_price / future_predictions[0] < 0.95:
            offset = (last_known_price - future_predictions[0]) * sentiment_score / abs(sentiment_score)

        for i, prediction in enumerate(future_predictions):
            sentiment_influence = (sentiment_score / 1000) * math.exp(-0.1 * i)  # Decay rate of 0.1
            future_predictions[i] = prediction * (1 + sentiment_influence) + offset

        # Combine historical and future prices
        extended_prices = np.concatenate((df['close'].values, future_predictions))
        extended_prices_series = pd.Series(extended_prices)

        # Calculate extended EMAs
        ema_10_extended = extended_prices_series.ewm(span=10, adjust=False).mean()
        ema_50_extended = extended_prices_series.ewm(span=50, adjust=False).mean()
        print(f"EMA 50: {ema_50_extended}")

        # Generate future timestamps for plotting
        future_dates_str = [date.strftime('%Y-%m-%d %H:%M') for date in
                            generate_future_timestamps(df['date'].iloc[-1], 12, 9, 17)]
        print("Future dates and predictions:")
        for date, prediction in zip(future_dates_str, future_predictions):
            print(f"{date}: {prediction}")

        # Plot the results
        plt.figure(figsize=(10, 6))
        df['date'] = pd.to_datetime(df['date'])
        all_dates = list(df['date'].dt.strftime('%Y-%m-%d %H:%M'))[-12:] + future_dates_str
        plt.plot(all_dates, np.concatenate((df['close'].values[-12:], future_predictions)),
                 label='Close Prices & Predictions', marker='o', linestyle='-')

        # Plot EMA 10 and EMA 50
        plt.plot(all_dates, ema_10_extended[-len(all_dates):], label='EMA 10', color='green', linestyle='-.')
        plt.plot(all_dates, ema_50_extended[-len(all_dates):], label='EMA 50', color='orange', linestyle='-.')

        plt.xlabel('Date and Time')
        plt.ylabel('Price')
        plt.title(f'Stock Price and EMA Prediction for {ticker}')
        plt.xticks(rotation=45, ha="right")
        plt.legend()
        plt.tight_layout()

        # Save the plot as an image
        plotname = f"../images/MLgraph{ticker}.png"
        directory = os.path.dirname(plotname)
        if not os.path.exists(directory):
            os.makedirs(directory)
        print(plotname)
        plt.savefig(plotname)
        plt.close()

        return plotname

    except Exception as e:
        print(f"Error with ML or tiingo. {e}")

# Test ticker runs
# asyncio.run(tiingoML("AAPL"))
# asyncio.run(tiingoML("MSFT"))
asyncio.run(tiingoML("TSLA",5))

# Test function to run if there is no news based on the first historical data pulled since it has TSLA in it
async def Historical():
    Data = await getHistoricalDBData()
    data = [d for d in Data if 'TSLA' in d['tickers']]
    await handleMessage(data[0])

# asyncio.run(Historical())
# startAlpacaStream(lambda emit_message: print("message"))