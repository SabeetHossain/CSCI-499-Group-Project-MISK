import pytest
from unittest.mock import patch, MagicMock
from unittest.mock import AsyncMock
from alpaca_client import *
import os

@pytest.mark.asyncio
async def test_insertDB():
    # Set up mock connection and context managers for asyncpg
    mock_conn = MagicMock()
    mock_conn.__aenter__ = AsyncMock(return_value=mock_conn)
    mock_conn.__aexit__ = AsyncMock()
    mock_conn.execute = AsyncMock()
    mock_conn.close = AsyncMock()

    # Patch the asyncpg.connect to use the mock connection
    with patch('asyncpg.connect', AsyncMock(return_value=mock_conn)):
        await insertDB({'summary': 'test', 'tickers': ['AAPL'], 'sentiment': 'positive', 'level': 5})
        # Verify the SQL execute command is called with correct parameters
        mock_conn.execute.assert_awaited_once_with(
            '''INSERT INTO news_summaries(summary, tickers, sentiment, level) VALUES($1, $2, $3, $4)''',
            'test', ['AAPL'], 'positive', 5
        )
        # Ensure the connection is closed after the operation
        assert mock_conn.close.await_count > 0, "Close was not called."


@pytest.mark.asyncio
async def test_handleMessage(capfd):  # Use capfd to capture and suppress print outputs in tests
    # Data to be processed by the handleMessage function
    emitted_data = {
        'tickers': ['AAPL'],
        'summary': 'Apple stock rises sharply',
        'sentiment': 'positive',
        'level': 5
    }
    expected_email = 'test@example.com'
    expected_subject = "News Subscription Report"
    # Mock dependencies of handleMessage
    with patch('alpaca_client.insertDB', new_callable=AsyncMock) as mock_insertDB, \
            patch('alpaca_client.fetchMessanging', new_callable=AsyncMock) as mock_fetchMessanging, \
            patch('alpaca_client.sendEmail', new_callable=AsyncMock) as mock_sendEmail:
        mock_fetchMessanging.return_value = ([{'test@example.com': True}], [{'1234567890': True}], ['AAPL'])
        mock_insertDB.return_value = None
        # Execute the function
        await handleMessage(emitted_data)
        # Capture and ignore output
        capfd.readouterr()
        # Check function call correctness
        mock_insertDB.assert_awaited_once_with(emitted_data)
        mock_fetchMessanging.assert_awaited_once_with(['AAPL'])
        actual_call_args, actual_call_kwargs = mock_sendEmail.await_args_list[0]
        assert expected_email == actual_call_args[0]
        assert expected_subject == actual_call_args[1]
        assert actual_call_kwargs['attachment_paths'] == ['../images/MLgraphAAPL.png']
        assert actual_call_kwargs['mime_type'] == 'text/html'

@pytest.mark.asyncio
async def test_sendEmail():
    # Parameters for the email to be sent
    recipient_email = 'test@example.com'
    subject = 'Test Email'
    message_body = 'This is a test email.'
    attachment_paths = ['path/to/test/image.png']
    # Mock SMTP server interaction
    with patch('aiosmtplib.SMTP') as mock_smtp:
        smtp_instance = mock_smtp.return_value
        smtp_instance.login = AsyncMock()
        smtp_instance.send_message = AsyncMock()
        # Call the function and capture the response
        response = await sendEmail(recipient_email, subject, message_body, attachment_paths, 'text/plain')
        # Verify response
        assert response == f"Email sent to {recipient_email}"


@pytest.mark.asyncio
async def test_tiingoML_integration(capfd):
    # Inputs for the function
    ticker = 'AAPL'
    sentimentScore = 5
    expected_file_path = '../images/MLgraphAAPL.png'
    # Execute tiingoML function
    result_path = await tiingoML(ticker, sentimentScore)
    # Use capfd to suppress print statements for cleaner test output
    capfd.readouterr()
    # Verify the file exists and has content
    assert os.path.exists(result_path), f"Output file {result_path} does not exist"
    assert result_path == expected_file_path, "Correct File Path"
    assert os.path.getsize(result_path) > 0, "File is empty"
