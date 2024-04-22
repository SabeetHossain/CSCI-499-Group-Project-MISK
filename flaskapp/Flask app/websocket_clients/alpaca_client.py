import asyncio
import math
import random

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
import twilio.rest

<<<<<<< HEAD
openAi = ""
gmailPass = ""
username = ''
=======
openAi = ""  # OpenAI API Key
gmailPass = ""  # Gmail application-specific password
username = ""
>>>>>>> 3752e970516db67ea6464622098b3b3dd472ea2a
dbPass = ""
db = ""
hostname = ""
polygon = ""
vantageAPI = ""
token = ""
twilio_account_sid = "AC3e016f5aaba4c2c11358176763d4fe74"
twilio_auth_token = "0270a989ae083d3e2a5afc263eb82bf6" #Trial phone: +18778392174
twilio_sender_phone = ""

twilio_client = twilio.rest.Client(twilio_account_sid, twilio_auth_token)


async def insertDB(data):
    conn = await asyncpg.connect(
        user=username, password=dbPass, database=db, host=hostname
    )
    await conn.execute(
        """INSERT INTO news_summaries(summary, tickers, sentiment, level) VALUES($1, $2, $3, $4)""",
        data["summary"],
        data["tickers"],
        data["sentiment"],
        data["level"],
    )
    await conn.close()

<<<<<<< HEAD
async def records_to_dict_list(records):
    dict_list = []
    for record in records:
        user_dict = {
            'user_id': record['user_id'],
            'username': record['username'],
            'email': record['email'],
            'tickers': record['tickers']
        }
        dict_list.append(user_dict)
    return dict_list

async def fetchEmails(tickers):
    conn = await asyncpg.connect(user=username,
                                 password=dbPass,
                                 database=db,
                                 host=hostname)
    usersRec = await conn.fetch('SELECT * FROM users')
    users = await records_to_dict_list(usersRec)
    print(users)
=======

async def fetchEmails(tickers):
    conn = await asyncpg.connect(
        user=username, password=dbPass, database=db, host=hostname
    )
    users = await conn.fetch("SELECT * FROM users")
>>>>>>> 3752e970516db67ea6464622098b3b3dd472ea2a
    await conn.close()
    subscribed_emails = []
    tickerList = []
    for user in users:
<<<<<<< HEAD
        user_tickers = user['tickers']
        #checking if user_tickers is not None and is iterable
        if user_tickers and tickers:
            for ticker in tickers:
                if ticker in user_tickers:
                    subscribed_emails.append(user['email'])
                    tickerList.append(ticker)
        else:
            print(f"No tickers set for user {user['username']} with email {user['email']}")
=======
        for ticker in tickers:
            if ticker in user["tickers"]:
                subscribed_emails.append(user["email"])
                tickerList.append(ticker)
>>>>>>> 3752e970516db67ea6464622098b3b3dd472ea2a
    return subscribed_emails, tickerList


async def fetchNumbers(tickers):
    conn = await asyncpg.connect(
        user=username, password=dbPass, database=db, host=hostname
    )
    users = await conn.fetch("SELECT * FROM users WHERE phone_number IS NOT NULL")
    await conn.close()

    numbers = []
    tickerList = []

    for user in users:
        for ticker in tickers:
            if ticker in user["tickers"]:
                numbers.append(user["phone_number"])
                tickerList.append(ticker)

    return numbers, tickerList


async def getSettings():
    conn = await asyncpg.connect(
        user=username, password=dbPass, database=db, host=hostname
    )
    settings = await conn.fetchrow("SELECT * FROM settings LIMIT 1")
    await conn.close()

    return settings


async def handleMessage(emitted_data):
    tickers = emitted_data["tickers"]
    await insertDB(emitted_data)

    message = f"This is your news subscription report for {tickers} : \n"
    f" Summary : {emitted_data['summary']} \n"
    f" Tickers : {emitted_data['tickers']} \n"
    f" Outlook : {emitted_data['sentiment']} \n"
    f" Strength of outlook (1-10) : {emitted_data['level']}"

    settings = await getSettings()

    if settings["message_type"] == "SMS":
        subscribed_numbers, tickerList = await fetchNumbers(tickers)
        subscribed_numbers = list(set(subscribed_numbers))
        tickerList = list(set(tickerList))
        print("Users subscribed to {}: {}".format(tickers, subscribed_numbers))

        with ThreadPoolExecutor() as executor:
            plotnames = await asyncio.gather(
                *[tiingoML(ticker) for ticker in tickerList]
            )
            print(plotnames)

            for number in subscribed_numbers:
                sendSMS(
                    number,
                    message,
                )
            else:
                print("No tickers found in DB")
    else:
        subscribed_emails, tickerList = await fetchEmails(tickers)
        subscribed_emails = list(set(subscribed_emails))
        tickerList = list(set(tickerList))
        print("Users subscribed to {}: {}".format(tickers, subscribed_emails))

        with ThreadPoolExecutor() as executor:
            plotnames = await asyncio.gather(
                *[tiingoML(ticker) for ticker in tickerList]
            )
            print(plotnames)

            for email in subscribed_emails:
                await sendEmail(
                    email,
                    "News subscription report",
                    message,
                    attachment_paths=plotnames,
                )
            else:
                print("No tickers found in DB")


async def sendEmail(recipient_email, subject, message_body, attachment_paths=None):
    sender_email = "mshvorin@gmail.com"
    app_password = gmailPass

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject
    message.attach(MIMEText(message_body, "plain"))

    if attachment_paths:
        for att in attachment_paths:
            if os.path.isfile(att):
                with open(att, "rb") as attachment:
                    img = MIMEImage(attachment.read(), name=os.path.basename(att))
                    img.add_header(
                        "Content-Disposition",
                        "attachment",
                        filename=os.path.basename(att),
                    )
                    message.attach(img)

    async with SMTP(hostname="smtp.gmail.com", port=465, use_tls=True) as smtp:
        await smtp.login(sender_email, app_password)
        await smtp.send_message(message)

        print(f"Email sent to {recipient_email}")


def sendSMS(recipient_phone, message):
    twilio_client.messages.create(
        from_=twilio_sender_phone, to=recipient_phone, body=message
    )

    print(f"SMS sent to {recipient_phone}")


async def summarize(news):
    client = AsyncOpenAI(api_key=openAi)
    content = f"{news['headline']} {news['content']} {news['symbols']}"
    try:
        input_text = f"Given '{content}', give me a summary of what happened along with a sentiment analysis (only the words positive, negative, or neutral, just one of them) in the form of a dictionary, as well as the stock tickers affected by it, denoted by 'summary', 'sentiment', and 'tickers', respectively. Make it all in one line so one may call json.loads on it. In addition, add another value called level with the 'level' of the sentiment on it from 1 to 10. Use double quotes and not single quotes please. Return it as a dictionary, with the keys being denoted by the double quotes and not single quotes with no double quotes around the response, in the format, {{(doublequote)summary(doublequote):(doublequote)field(doublequote),...'}}"
        stream = await client.chat.completions.create(
            model="gpt-3.5-turbo", messages=[{"role": "user", "content": input_text}]
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
            "secret": "AeeuhktfclPna1HpOtc3lmGDVdr0UT28lb2eWfPu",
        }
        await websocket.send(json.dumps(auth_data))
        auth_response = await websocket.recv()
        print(auth_response)
        time.sleep(1)
        # emit_message(auth_response)
        subscribe_message = {"action": "subscribe", "news": ["*"]}
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
            if message_data["T"] == "n":
                response = await summarize(message_data)
<<<<<<< HEAD
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
=======
                try:
                    print(json.loads(response))
                    print(json.loads(response)["summary"])
                    print(json.loads(response)["tickers"])
                    print(json.loads(response)["sentiment"])
                    print(json.loads(response)["level"])
                    parsed_response = json.loads(response)
                    emit_data = {
                        "summary": parsed_response.get("summary"),
                        "tickers": parsed_response.get("tickers"),
                        "sentiment": parsed_response.get("sentiment"),
                        "level": parsed_response.get("level"),
                    }
                    print(emit_data)
                    emit_message(str(emit_data))
                    await handleMessage(emit_data)
                except:
                    print(response)
>>>>>>> 3752e970516db67ea6464622098b3b3dd472ea2a


def startAlpacaStream(emit_message):
    asyncio.run(alpacaNewsStream(emit_message))


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


def add_technical_indicators(df):
    # Calculate Exponential Moving Averages (EMAs) for 10 and 50 periods
    df['EMA_10'] = df['close'].ewm(span=10, adjust=False).mean()
    df['EMA_50'] = df['close'].ewm(span=50, adjust=False).mean()
    return df

def prepare_sequences(data, sequence_length):
    X, y = [], []
    for i in range(len(data) - sequence_length):
<<<<<<< HEAD
        sequence = data[i:(i + sequence_length), :]
        target = data[i + sequence_length, -1]  # Assuming target is 'close' price
        X.append(sequence)
        y.append(target)
    return np.array(X), np.array(y)
=======
        x.append(data[i : (i + sequence_length)])
        y.append(data[i + sequence_length])
    return np.array(x), np.array(y)
>>>>>>> 3752e970516db67ea6464622098b3b3dd472ea2a


def generate_future_timestamps(
    last_timestamp, num_predictions, start_hour=9, end_hour=17
):
    future_timestamps = []
    if isinstance(last_timestamp, str):
        current_timestamp = datetime.strptime(last_timestamp, "%Y-%m-%d %H:%M")
    else:
        current_timestamp = last_timestamp

    for _ in range(num_predictions):
        current_timestamp += timedelta(hours=1)
        if current_timestamp.hour > end_hour or current_timestamp.hour < start_hour:
            hours_until_next_day = ((24 - current_timestamp.hour) + start_hour) % 24
            current_timestamp += timedelta(hours=hours_until_next_day)
        future_timestamps.append(current_timestamp)
    return future_timestamps


async def tiingoML(ticker):
    try:
        headers = {
            "Content-Type": "application/json",
        }
        start = "2023-05-01"
        end = "2024-03-18"
        url = f"https://api.tiingo.com/iex/{ticker}/prices?startDate={start}&endDate={end}&columns=open,high,low,close,volume&resampleFreq=1hour&token={token}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    ticker_price = pd.DataFrame(data)
                    print(ticker_price)
                else:
                    print(f"Failed to fetch data for {ticker}: {response.status}")

        ticker_price["date"] = pd.to_datetime(ticker_price["date"]).dt.strftime(
            "%Y-%m-%d %H:%M"
        )
        df = ticker_price
        print(df.to_string())

        close_prices = df["close"].values.reshape(-1, 1)
        scaler = MinMaxScaler(feature_range=(-1, 1))
        df = add_technical_indicators(ticker_price)
        features = df[['close', 'EMA_10', 'EMA_50']].values
        scaler = MinMaxScaler(feature_range=(-1, 1))
        features_normalized = scaler.fit_transform(features)

        sequence_length = 20
        X, y = prepare_sequences(features_normalized, sequence_length)

        train_size = int(len(X) * 0.9)
        X_train, y_train = X[:train_size], y[:train_size]
        X_test, y_test = X[train_size:], y[train_size:]

        X_train = torch.Tensor(X_train)
        y_train = torch.Tensor(y_train)
        X_test = torch.Tensor(X_test)
        y_test = torch.Tensor(y_test)

        model = LSTMModel(input_dim=3, hidden_dim=64, num_layers=2, output_dim=1)
        criterion = nn.MSELoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
        epochs = 300
        for epoch in range(epochs):
            model.train()
            optimizer.zero_grad()
            outputs = model(X_train)
            loss = criterion(outputs, y_train)
            loss.backward()
            optimizer.step()
            print(f"Epoch {epoch + 1}/{epochs} Loss: {loss.item()}")

        model.eval()
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        X_test_tensors = torch.Tensor(X_test).to(device)
        test_predict = model(X_test_tensors)

        test_predict_np = test_predict.detach().cpu().numpy()

        temp_array = np.zeros((test_predict_np.shape[0], 3))
        temp_array[:, 0] = test_predict_np.squeeze()

        # Inverse transformation
        inverse_transformed_predictions = scaler.inverse_transform(temp_array)[:, 0]

        y_test_np = y_test.detach().cpu().numpy()
        y_test_scaled_back = scaler.inverse_transform(
            np.concatenate((y_test_np.reshape(-1, 1), np.zeros((y_test_np.shape[0], 2))), axis=1))[:, 0]

        # MAE calculation
        mae = np.mean(np.abs(inverse_transformed_predictions - y_test_scaled_back))
        print("Mean Absolute Error:", mae)

        last_known_price = df['close'].values[-1]
        acceptance_percentage = 0.05
        future_predictions = []
        last_sequence = X_test[-1].reshape(1, sequence_length, -1)
        volatility = 0.01
        for i in range(12):  # Predicting 12 steps into the future
            with torch.no_grad():
<<<<<<< HEAD
                last_sequence_tensor = torch.Tensor(last_sequence).to(device)
                future_pred = model(last_sequence_tensor)
                future_pred_np = future_pred.cpu().detach().numpy().flatten()
                temp_pred_array = np.zeros((1, 3))
                temp_pred_array[:, 0] = future_pred_np
                # Apply random walk
                random_walk = last_known_price * (1 + np.random.normal(0, volatility))
                future_pred_value = random_walk
                future_predictions.append(future_pred_value)
                last_known_price = future_pred_value  # Update last known price for next step
                # Prepare the new sequence for the next prediction
                new_sequence = np.roll(last_sequence.flatten(), -3)
                new_sequence[-3:] = future_pred_value
                last_sequence = new_sequence.reshape(1, sequence_length, -1)

        if abs(future_predictions[0] - last_known_price) > last_known_price * acceptance_percentage:
            adjustment_factor = (last_known_price * acceptance_percentage) / abs(future_predictions[0] - last_known_price)
            future_predictions = [last_known_price + (p - last_known_price) * adjustment_factor for p in future_predictions]

        sentiment_score = 3  # Subtle sentiment score (e.g., 1 for slightly positive, -1 for slightly negative)
        offset = 0
        print(future_predictions[0] / last_known_price)
        print( last_known_price / future_predictions[0])
        if future_predictions[0] / last_known_price > 0.05 or last_known_price / future_predictions[0] < 0.95:
            offset = (last_known_price - future_predictions[0]) * sentiment_score / abs(sentiment_score)
        print(offset)
        for i, prediction in enumerate(future_predictions):
            sentiment_influence = (sentiment_score / 1000) * math.exp(-0.1 * i)  # Decay rate of 0.1
            future_predictions[i] = prediction * (1 + sentiment_influence) + offset

        extended_prices = np.concatenate((df['close'].values, future_predictions))
        extended_prices_series = pd.Series(extended_prices)
        ema_10_extended = extended_prices_series.ewm(span=10, adjust=False).mean()
        ema_50_extended = extended_prices_series.ewm(span=50, adjust=False).mean()
        print(f"EMA 50: {ema_50_extended}")
        future_dates_str = [date.strftime('%Y-%m-%d %H:%M') for date in generate_future_timestamps(df['date'].iloc[-1], 12, 9, 17)]
=======
                future_pred = model(last_sequence)
                future_pred = scaler.inverse_transform(future_pred.detach().numpy())
                future_predictions.append(future_pred.flatten()[0])
                next_value = close_prices[i + len(X_test)]
                next_value_normalized = scaler.transform(
                    np.array([next_value]).reshape(-1, 1)
                )
                new_sequence = np.append(
                    last_sequence.numpy().flatten()[1:], next_value_normalized
                )
                last_sequence = torch.Tensor(new_sequence).reshape(
                    1, sequence_length, 1
                )

        actual_dates_str = [
            (datetime.strptime(date, "%Y-%m-%d %H:%M") - timedelta(hours=2)).strftime(
                "%Y-%m-%d %H:%M"
            )
            for date in df["date"][-12:]
        ]
        future_dates_str = [
            date.strftime("%Y-%m-%d %H:%M")
            for date in generate_future_timestamps(df["date"].iloc[-1], 12, 9, 17)
        ]

>>>>>>> 3752e970516db67ea6464622098b3b3dd472ea2a
        print("Future dates and predictions:")
        for date, prediction in zip(future_dates_str, future_predictions):
            print(f"{date}: {prediction}")
        plt.figure(figsize=(10, 6))
<<<<<<< HEAD
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
=======
        plt.plot(
            actual_dates_str,
            df["close"][-12:],
            label="Actual Prices",
            marker="o",
            linestyle="-",
        )
        plt.plot(
            future_dates_str,
            future_predictions,
            label="Predicted Prices",
            marker="o",
            linestyle="--",
        )

        plt.xlabel("Date and Time")
        plt.ylabel("Price")
        plt.title(f"Stock Price Prediction for {ticker}")
        plt.xticks(rotation=45)
>>>>>>> 3752e970516db67ea6464622098b3b3dd472ea2a
        plt.legend()
        plt.tight_layout()
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


# getLastDayPricesAV()
# getLastDayPricesPolygon()
# tiingoML("TSLA")
<<<<<<< HEAD
# asyncio.run(tiingoML("AAPL"))
# asyncio.run(tiingoML("MSFT"))
# asyncio.run(tiingoML("TSLA"))
=======
# asyncio.run(tiingoML("TSLA"))
>>>>>>> 3752e970516db67ea6464622098b3b3dd472ea2a
