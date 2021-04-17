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
client = pymongo.MongoClient("mongodb://123:123@cluster0-shard-00-00.nspcw.mongodb.net:27017,cluster0-shard-00-01.nspcw.mongodb.net:27017,cluster0-shard-00-02.nspcw.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-k7vjf4-shard-0&authSource=admin&retryWrites=true&w=majority",ssl=True,ssl_cert_reqs='CERT_NONE')
db = client.datasets

count = 0
app = Flask(__name__)
app.config['UPLOAD_PATH'] = './public' # to create a folder which is used to save the uploaded file
CORS(app)

@app.route('/upload', methods=["GET", "POST"])
@cross_origin()
def upload():
    if request.method == "POST":

        # # check if the post request has the file part
        # if 'file' not in request.files:
        #     flash("No file part")
        #     return redirect(request.url)

        # uploaded_file = request.files['file']
        # print(uploaded_file)
        # # if user does not select file browser also
        # # submit an empty part without filename
        # if uploaded_file.filename == '':
        #     flash('No selected file')
        #     return redirect(request.url)

        # # check if the post request has the file part
        # filename = secure_filename(uploaded_file.filename)
        # print(filename) # e.g. ex.csv
        # # TODO: PLEASE deal with the filename to avoid repeating name here
        # file_ext = os.path.splitext(filename)[1] # get extenson of a file, like .csv
        # # TODO: (replace the code below) save the file to MongoDB
        # uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))

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
        #Get file size:
        file_ext = os.path.splitext(filename)[1] # get extenson of a file, like .csv
        uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))
        #Get the path of the file
        paths = os.path.join(app.config['UPLOAD_PATH'], filename)
        #Get the size of the file
        size = os.path.getsize(paths)
        size_string = str(size/1000) + "KB"
        print(size_string)

        ID = "12795757"
        result =  db.files.find({"FileName":filename,"UserName":ID})
        result = loads(dumps(result))
        print(len(result))#Check the size of the json array
        f = open(paths,'r')
        count = 0
        first_num = 0
        lable = ""

        # start to read the file
        #Get the size of coloumn
        for i in f:
            count = count+1
            if count ==2:
                size = (len(i.split(" ")))
                break
        columnNames = [""] * size # size = the number of columns
        if int(first_num) < size:
            lable = "Yes"
        elif int(first_num) == size:
            lable = "No"
        else:
            lable = "Error"
       
        attributes_meta = size

        #Assign the coloumn ID
        for i in range(size):
            columnNames[i] = "Coloumn" + " " + str(i)
        #Generate a temporty file to re-format the dataset
        count = 0
        with open(paths,'r') as f:
            with open("./public/updated_test.csv",'w') as f1:
                f1.write(','.join(columnNames)+"\n")
                next(f) # skip the first line of the dataset
                for line in f:
                    lines =str(line)
                    lines = lines.split(" ")
                    f1.write(','.join(lines))
                    count = count + 1
        instance_meta = count

        print(lable)
        print(instance_meta)
        print(attributes_meta)
        #Read the format data and store the data
        data = pd.read_csv("./public/updated_test.csv")
        data = data.to_dict('records')

        #If the file is not exist
        if(len(result) ==0):
            print("DO this step")
            store_schema={
                "FileName":filename,
                "BriefInfo": "",
                "Size":size_string,
                "UserName":ID,
                "data": data
            }
            db.files.insert_one(store_schema)
            metadata = {
                "FileName":filename,
                "UserName":ID,
                "BriefInfo":"",
                "Description":"",
                "Source":"",
                "Label":lable,
                "Number_of_Attribute":attributes_meta,
                "Number_of_Instance":instance_meta,
                "Keywords":[],
                "AttrInfo":[

                    { 
                        "attrName":"",
                        "attrDescription":""
                    }
                ]
            }
            db.metadata.insert_one(metadata)
        #If the file is already exist
        else:
            print("to do here")
            filename = "copy_of_" + str(random.randint(100,999)) + filename
            store_schema={
                "FileName":filename,
                "BriefInfo":"",
                "Size":size_string,
                "UserName":ID,
                "data": data
            }
            db.files.insert_one(store_schema)
            metadata = {
                "FileName":filename,
                "UserName":ID,
                "BriefInfo":"",
                "Description":"",
                "Source":"",
                "Label":lable,
                "Number_of_Attribute":attributes_meta,
                "Number_of_Instance":instance_meta,
                "Keywords":[],
                "AttrInfo":[
                    {
                        "attrName":"",
                        "attrDescription":""
                    }

                ]
            }
            db.metadata.insert_one(metadata)


    return json.dumps(data)




@app.route('/datasetFiles', methods=["GET", "POST"])
def showAlldatasetFiles():
    if request.method == "GET":
        # read datasets JSON file
        # TODO: You should get the same format of (_id, FileName, Size) from MongoDB, then replace it
        # TODO: return a empty [] to me if there is no file in the MongoDB
        data_return = list(db.files.find( {"UserName":"12795757"}))
        result = db.metadata.find({"UserName":"12795757"})
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

        if(len(data_return)!=0):
            json_data = dumps(data_return, indent = 2)
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
            values = dumps(values, indent = 2)

            with open('./data.json_tem.json', 'w') as file:
                file.write(values)
            return values

        else:
            print("The user does not have any file")
            data = []
            return json.dumps(data)

@app.route('/newDataset', methods=["GET"])
def sendNewdatasetFiles():
    # TODO: (replace the code below) get the uploaded dataset from MongoDB with _id, FileName, Size
    # because frontend cannot show the new file until it is saved into the MongoDB, and frontend cannot generate _id itself
    # Here, I'll create a uploaded file JSON myself, please delete it when you finish this TODO
    data = db.files.find().sort('_id',-1).limit(1)#Find the newest data to insert
    json_data = dumps(data, indent = 2)
    with open('./dataNewJson.json', 'w') as file:
                file.write(json_data)
    jsonFile = open('./dataNewJson.json', 'r')
    values = json.load(jsonFile)
    for element in values:
        if 'data' in element:
            del element['data']
            break
    values = dumps(values, indent = 2)
    with open('./dataNewJson.json', 'w') as file:
        file.write(values)
    jsonFile = open('./dataNewJson.json', 'r')
    values = json.load(jsonFile)
    return json.dumps(values)

@app.route('/submit-metadata', methods=["POST"])
@cross_origin()
def submitMetadata():
    metadata = request.get_json(force=True)
    print(metadata)

    metadata_dict = metadata[0]
    FileName = metadata[0]["FileName"]
    UserName = metadata[0]["UserName"]
    BriefInfo = metadata[0]["BriefInfo"]
    Description = metadata[0]["Description"]
    Source = metadata[0]["Source"]
    Keywords = metadata[0]["Keywords"]
    AttrInfo = metadata[0]["AttrInfo"]
    schema = {
            "FileName":FileName,
            "UserName":UserName,
            "BriefInfo":BriefInfo,
            "Description":Description,
            "Source":Source,
            "Keywords":Keywords,
            "AttrInfo":AttrInfo
    }

    # print(metadata) # you can check the content of the matadata through this
    # the type of the returned matadata is a python list, you can operate on it to save into the MongoDB
    # print(type(metadata)) 
    #Define the schema for the dataset, and store all the
    if len(loads(dumps(db.metadata.find({"UserName":"12795757","FileName":FileName}))))==0:

        # db.metadata.insert_one(schema)
        db.metadata.update({"UserName": "12795757","FileName":FileName},
        {"$set": {
            "BriefInfo": BriefInfo,
            "Description": Description,
            "Source":Source,
            "Keywords":Keywords,
            "AttrInfo":AttrInfo
            }}
            ) 
        
        metadata_string = request.data
    else:
        db.metadata.update({"UserName": "12795757","FileName":FileName},
        {"$set": {
            "BriefInfo": BriefInfo,
            "Description": Description,
            "Source":Source,
            "Keywords":Keywords,
            "AttrInfo":AttrInfo
            }}
            ) 
        metadata_string = request.data




    # TODO save the metadata into MongoDB

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
    # delete corresponding dataset
    db.files.delete_one({"UserName": "12795757", "FileName": datasetName})
    # delete corresponding metadata in the same time
    db.metadata.delete_one({"UserName": "12795757", "FileName": datasetName})
    print("Done the delete")
    # this return must be string, which will be returned to the frontend immediately
    # so DO NOT modify the return 'metadata_string'
    return datasetName


# to receive the selected dataset name for getting corresponding detailed data and metadata
@app.route('/detailedData-name', methods=["POST"])
@cross_origin()
def getNameForDetailedData():

    # 1. you get the selected dataset name from the frontend, so that you know which dataset you will extract detailed data from
    datasetName = request.get_json(force=True)
    print(datasetName)  # you can check the dataset name through this
    # print(type(datasetName))  # string


    getDatasetName = False
    result = db.metadata.find({"FileName":str(datasetName),"UserName":"12795757"})
    result = loads(dumps(result))

    if(len(result)>0):
        # TODO to get detailed_data from MongoDB
        result = db.metadata.find({"FileName":str(datasetName),"UserName":"12795757"})
        result_detailed_data = db.files.find({"FileName":str(datasetName),"UserName":"12795757"})
        result = loads(dumps(result))
        result_detailed_data = loads(dumps(result_detailed_data))
        metadata = result
        detailed_data = result_detailed_data[0]['data']
        for element in metadata:
            if '_id' in element:
                del element['_id']

    else:
        with open('./detailedData.json') as f:
            detailed_data = json.load(f)
        with open('./metadata.json') as f:
            metadata = json.load(f)
    #Handeling the situation when it return a empty [], change to the relevent metadata.
    if(len(metadata)==0):
        result = db.metadata.find({"FileName":str(datasetName),"UserName":"12795757"})
        result = loads(dumps(result))
        metadata = result
        for element in metadata:
            if '_id' in element:
                del element['_id']
    print('sss')
    print(metadata)
    print('sss')

    return json_util.dumps([detailed_data, metadata])

# to query datasets based on the dataset name or key words
@app.route('/query-datasets', methods=["POST"])
@cross_origin()
def queryDatasets():

    # you will recieve a inputted word by a user from the frontend
    input_value = request.get_json(force=True)
    print(input_value) # you can check the inputted word through this
    print(type(input_value))  # string

    UserName="12795757"
    NameArray=[]
    # TODO you need to query the corresponding datasets from MongoDB
    # the input value may be the dataset name, or may be key words
    # this is the querying result I simulate, please REPLACE it when you get the real results
    returndata=db.metadata.find({"UserName":UserName,"Keywords":{"$in":[str(input_value)]} })
    json_data = dumps(returndata, indent=2)
    with open('./returnmetadata.json', 'w') as file:
        file.write(json_data)
    jsonFile = open('./returnmetadata.json', 'r')
    values = json.load(jsonFile)
    for element in values:
        if 'FileName' in element:
            NameArray.append(element['FileName'])

    #print(NameArray[0])
    #print(NameArray[1])

    returndataset=db.files.find({"FileName":{"$in":NameArray},"UserName":UserName})
    json_filedata = dumps(returndataset, indent=2)
    with open('./queryResultsForDatasets.json', 'w') as f:
         f.write(json_filedata)
    jsonFile = open('./queryResultsForDatasets.json', 'r')
    queried_datasets = json.load(jsonFile)

    return json.dumps(queried_datasets)


if __name__ == "__main__":
    app.run(debug = True)