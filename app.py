from flask import Flask, render_template, jsonify, redirect, request
import json
from pymongo import MongoClient
from flask_pymongo import PyMongo
from bson import json_util
from bson.json_util import dumps

# from random import sample

app = Flask(__name__)
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DATABASE_NAME = 'stack_overflow'
COLLECTION_NAME = 'developers_cleaned'
FIELDS = {'MainBranch': True, 'Hobbyist': True, 'Employment': True, 'DevType': True, 'Country': True, 'EdLevel': True, 'YearsCode': True, 'ConvertedComp': True, 'JobSat': True, 'JobSeek': True, 'LanguageWorkedWith': True, 'DatabaseWorkedWith': True, 'WebFrameWorkedWith': True, 'SOVisitFreq': True, 'Age': True, 'Gender': True, "_id": False}


# app.config['MONGO_URI'] = "mongodb://localhost:27017/stack_overflow"
# mongo = PyMongo(app)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/stack_overflow/developers_cleaned")
def build_project():
    try:
        connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
        collection = connection[DATABASE_NAME][COLLECTION_NAME]
        projects = collection.find(projection=FIELDS, limit=100)
        json_projects = []
        for project in projects:
            json_projects.append(project)
        json_projects = json.dumps(json_projects, default=json_util.default)
        connection.close()
        return json_projects
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
