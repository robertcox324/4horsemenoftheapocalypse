import pandas as pd
import matplotlib.pyplot as plt
import pymongo
from pymongo import MongoClient
import json
import bson
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/project")
def flask_project():
    connection = MongoClient(host=localhost, port=27017)

## code stuff goes here?!?!

    connection.close()
    return json_projects

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)