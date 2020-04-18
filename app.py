from flask import Flask, render_template, jsonify, redirect, request
from flask_pymongo import PyMongo
from bson.json_util import dumps
# from random import sample

app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb://localhost:27017/stack_overflow"
mongo = PyMongo(app)

@app.route("/", methods = ["GET"])
def index():
    # return render_template("index.html")
    try:
        developers = mongo.db.developers
        result = developers.find({})
        return render_template("index.html", result = result)
        # return jsonify({"results": result['LanguageWorkedWith']})
    except Exception as e:
        return dumps({"error": str(e)})

# @app.route("/data", methods = ["GET"])
# def data():
#     try:
#         developers = mongo.db.developers
#         result = developers.find_one()
#         return render_template("index.html", result = result)
#         # return jsonify({"results": result['LanguageWorkedWith']})
#     except Exception as e:
#         return dumps({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
