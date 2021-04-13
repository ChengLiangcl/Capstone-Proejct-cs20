from flask import Flask, flash, jsonify, request, render_template, make_response, redirect, url_for, abort,session
from werkzeug.utils import secure_filename
from flask_cors import CORS,cross_origin
from flask_restful import Api, Resource, reqparse
import os
import json
import pymongo
from bson.json_util import dumps
from bson.json_util import loads
from bson import json_util
import random
import pandas as pd
import numpy as np
import csv
client = pymongo.MongoClient("mongodb://741917776:520569@cluster-shard-00-00.zz90r.mongodb.net:27017,cluster-shard-00-01.zz90r.mongodb.net:27017,cluster-shard-00-02.zz90r.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-kqdxs0-shard-0&authSource=admin&retryWrites=true&w=majority",ssl=True,ssl_cert_reqs='CERT_NONE')
db = client.WebProject
app = Flask(__name__)
app.config['UPLOAD_PATH'] = 'public' # to create a folder which is used to save the uploaded file
CORS(app)

@app.route('/upload', methods=["GET", "POST"])
@cross_origin()
def upload():
    if request.method == "POST":

        # check if the post request has the file part
        if 'file' not in request.files:
            flash("No file part")
            return redirect(request.url)
        
        uploaded_file = request.files['file']
        print(uploaded_file)
        # if user does not select file browser also
        # submit an empty part without filename
        if uploaded_file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        # check if the post request has the file part
        filename = secure_filename(uploaded_file.filename)
        print(filename) # e.g. ex.csv
        # TODO: PLEASE deal with the filename to avoid repeating name here
        file_ext = os.path.splitext(filename)[1] # get extenson of a file, like .csv
        # TODO: (replace the code below) save the file to MongoDB
        uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))

        return filename


@app.route('/datasetFiles', methods=["GET", "POST"])
def showAlldatasetFiles():
    if request.method == "GET":
        # read datasets JSON file
        # TODO: You should get the same format of (_id, FileName, Size) from MongoDB, then replace it
        # TODO: return a empty [] to me if there is no file in the MongoDB
        with open('./datasetFiles.json') as f:
            data = json.load(f)
        #print(data)
    return json.dumps(data)


@app.route('/newDataset', methods=["GET"])
def sendNewdatasetFiles():
    # TODO: (replace the code below) get the uploaded dataset from MongoDB with _id, FileName, Size
    # because frontend cannot show the new file until it is saved into the MongoDB, and frontend cannot generate _id itself
    # Here, I'll create a uploaded file JSON myself, please delete it when you finish this TODO
    new_dataset = [{"_id": {"$oid": "6061862b0d830ba54020706d"},"FileName": "ex_fdy.csv", "BriefInfo": "This is a description for new dataset", "Size": "4.68KB"}]

    return json.dumps(new_dataset)


# to receive the metadata submitted from the frontend and save it into the MongoDB
@app.route('/submit-metadata', methods=["POST"])
@cross_origin()
def submitMetadata():

    # to get the metadata info from the frontend
    metadata = request.get_json(force=True)
    print(metadata) # you can check the content of the matadata through this
    # the type of the returned matadata is a python list, you can operate on it to save into the MongoDB
    print(type(metadata)) 
    print(metadata[0]["UserName"])
    # TODO save the metadata into MongoDB
    

    metadata_string = request.data
    # this return must be string, which will be returned to the frontend immediately
    # so DO NOT modify the return 'metadata_string'
    return metadata_string


# to delete the selected dataset
@app.route('/delete-dataset', methods=["POST"])
@cross_origin()
def deleteOneDataset():

    # to get the selected dataset name from the frontend
    datasetName = request.get_json(force=True)
    print(datasetName) # you can check the gotten dataset name
    print(type(datasetName))  # string
    # TODO delete the corresponding dataset in the MongoDB based on the datasetName

    # this return must be string, which will be returned to the frontend immediately
    # so DO NOT modify the return 'metadata_string'
    return datasetName


# to receive the selected dataset name for getting corresponding detailed data and metadata
@app.route('/detailedData-name', methods=["POST"])
@cross_origin()
def getNameForDetailedData():

    # 1. you get the selected dataset name from the frontend, so that you know which dataset you will extract detailed data from
    datasetName = request.get_json(force=True)
    session['tem_file'] = datasetName
    print(datasetName) # you can check the dataset name through this
    print(type(datasetName))  # string
    print("1")

    getDatasetName = True
    if(getDatasetName):
        # TODO to get detailed_data from MongoDB
        with open('./detailedData.json') as f:
            detailed_data = json.load(f)
        print(detailed_data)

        # TODO to get meta_data from MongoDB
        with open('./metadata.json') as f:
            metadata = json.load(f)
        print(metadata)
    else:
        detailed_data = []
   

    return json.dumps([detailed_data, metadata])


@app.route('/modelFiles', methods=["GET", "POST"])
@cross_origin()
def showAllModelFiles():
    if request.method == "GET":
        # read datasets JSON file
        # TODO: You should get the same format of (_id, FileName, Size) from MongoDB, then replace it
        # TODO: return a empty [] to me if there is no file in the MongoDB
        data_return = list(db.models.find({"UserName": "741917776"}))
        result = db.modelmetadata.find({"UserName": "741917776"})
        result = loads(dumps(result))
        size = len(result)
        description = list()
        fileName = list()
        for i in range(size):
            description.append(result[i]['BriefInfo'])
            fileName.append(result[i]['FileName'])
        dicts = {}
        for key in fileName:
            for value in description:
                dicts[key] = value
                description.remove(value)
                break
        print(dicts)

        if (len(data_return) != 0):
            json_data = dumps(data_return, indent=2)
            with open('./data.json_tem.json', 'w') as file:
                file.write(json_data)
            jsonFile = open('./data.json_tem.json', 'r')
            values = json.load(jsonFile)
            for element in values:
                if 'data' in element:
                    del element['data']

            json_size = len(values)
            for i in range(len(values)):
                fileName = str(values[i]["FileName"])
                if fileName in dicts:
                    values[i]["BriefInfo"] = dicts[fileName]
            values = dumps(values, indent=2)

            with open('./data.json_tem.json', 'w') as file:
                file.write(values)
            return values

        else:
            print("The user does not have any file")
            data = []
            return json.dumps(data)

@app.route('/upload-model', methods=["GET", "POST"])
@cross_origin()
def uploadModel():
    if request.method == "POST":

        # check if the post request has the file part
        if 'file' not in request.files:
            flash("No file part")
            return redirect(request.url)
        
        uploaded_file = request.files['file']
        print(uploaded_file)
        # if user does not select file browser also
        # submit an empty part without filename
        if uploaded_file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        # check if the post request has the file part
        filename = secure_filename(uploaded_file.filename)
        print(filename) # e.g. ex.csv
        # TODO: PLEASE deal with the filename to avoid repeating name here
        file_ext = os.path.splitext(filename)[1] # get extenson of a file, like .csv
        uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))
        #Get the path of the file
        paths = os.path.join(app.config['UPLOAD_PATH'], filename)
        #Get the size of the file
        size = os.path.getsize(paths)
        size_string = str(size/1000) + "KB"
        print(size_string)
        ID = "741917776"
        newf= paths
        print(newf)
        f = open(newf)
        lines = f.readlines()
        # copy the content in lines to new list named data
        data = lines

        results = db.models.find({"FileName": filename, "UserName": "741917776"})
        for result in results:

            while (result["FileName"] == filename):
                Prefix = "copy_of_"
                filename = Prefix + str(random.randint(100,999)) +filename
                print(filename)
        store_schema = {
            "FileName": filename,
            "BriefInfo": "",
            "Size": size_string,
            "UserName": ID,
            "data": data
        }

        db.models.insert_one(store_schema)

        return json.dumps(filename)

@app.route('/newModel', methods=["GET"])
def sendNewModelFiles():
     # TODO: (replace the code below) get the uploaded dataset from MongoDB with _id, FileName, Size
    # because frontend cannot show the new file until it is saved into the MongoDB, and frontend cannot generate _id itself
    # Here, I'll create a uploaded file JSON myself, please delete it when you finish this TODO

     data = db.models.find().sort('_id', -1).limit(1)  # Find the newest data to insert
     json_data = dumps(data, indent=2)


     with open('./dataNewJson.json', 'w') as file:
         file.write(json_data)

     jsonFile = open('./dataNewJson.json', 'r')
     values = json.load(jsonFile)
     for element in values:
         if 'data' in element:
             del element['data']
             break
     values = dumps(values, indent=2)
     with open('./dataNewJson.json', 'w') as file:
         file.write(values)
     jsonFile = open('./dataNewJson.json', 'r')
     values = json.load(jsonFile)

     return json.dumps(values)






@app.route('/delete-model', methods=["POST"])
@cross_origin()
def deleteOneModel():

     # to get the selected dataset name from the frontend
    modelName = request.get_json(force=True)
    print(modelName) # you can check the gotten dataset name
    print(type(modelName))  # string
    # TODO delete the corresponding dataset in the MongoDB based on the datasetName
    # delete corresponding dataset

   
    print("Done the delete")
    # this return must be string, which will be returned to the frontend immediately
    # so DO NOT modify the return 'metadata_string'
   
    return modelName






if __name__ == "__main__":
    app.run(debug = True)