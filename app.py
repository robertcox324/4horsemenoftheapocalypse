from flask import Flask, render_template, jsonify, redirect, request
from flask_pymongo import PyMongo
# from random import sample

app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb://localhost:27017/stack_overflow"
mongo = PyMongo(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data", ["ST"])
def data():
    if request.method == ["POST"]:

    developers = mongo.db.developers
    result = developers.find_one()
    return jsonify({"results": result['LanguageWorkedWith']})

if __name__ == "__main__":
    app.run(debug=True)
