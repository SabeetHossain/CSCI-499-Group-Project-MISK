import asyncio
from flask import Flask, render_template
from flask_socketio import SocketIO
from threading import Thread
from websocket_clients.alpaca_client import start_alpaca_stream

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True)

def emit_message(d):
    print(f'Emitting {d}')
    socketio.emit('new_message', {'data': d})

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    socketio.emit('new_message', {'data': 'Welcome!'})

def start_alpaca_stream_thread():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(start_alpaca_stream(emit_message))

if __name__ == '__main__':
    thread = Thread(target=start_alpaca_stream_thread)
    thread.start()
    thread.join(timeout=1)
    socketio.run(app, debug=True, use_reloader=False)
