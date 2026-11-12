"""Student Enrollment web app server.
Run with: python app.py
Then visit: http://127.0.0.1:8000
Requires only Python 3; no pip installation needed.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os

HOST = "127.0.0.1"
PORT = 8000
PROJECT_DIR = Path(__file__).resolve().parent

class EnrollmentHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_DIR), **kwargs)

    def log_message(self, format, *args):
        print("%s - %s" % (self.address_string(), format % args))

if __name__ == "__main__":
    os.chdir(PROJECT_DIR)
    print(f"Student Enrollment is running at http://{HOST}:{PORT}")
    print("Keep this terminal open while using the app. Press Ctrl+C to stop.")
    try:
        ThreadingHTTPServer((HOST, PORT), EnrollmentHandler).serve_forever()
    except KeyboardInterrupt:
        print("\\nServer stopped.")
