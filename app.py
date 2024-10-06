from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import csv
import time
import json
import io
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "https://polskanow.pl",
    "https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3-jgrpyr8h--3000--134daa3c.local-credentialless.webcontainer-api.io",
    "http://localhost:3000",
    "https://*.webcontainer.io"
]}})

# ... rest of the code remains the same

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 4005)))