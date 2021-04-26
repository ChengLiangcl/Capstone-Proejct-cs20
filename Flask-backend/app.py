from flask import Flask, flash, jsonify, request, render_template, make_response, redirect, url_for, abort, session, g
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
from flask_restful import Api, Resource, reqparse
import os
import json
import pymongo
from bson.json_util import dumps
from bson.json_util import loads
from bson import json_util
from passlib.hash import pbkdf2_sha256
import uuid
import random
import pandas as pd
import numpy as np
import csv

client = pymongo.MongoClient(
    "mongodb://123:123@cluster0-shard-00-00.nspcw.mongodb.net:27017,cluster0-shard-00-01.nspcw.mongodb.net:27017,cluster0-shard-00-02.nspcw.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-k7vjf4-shard-0&authSource=admin&retryWrites=true&w=majority",
    ssl=True, ssl_cert_reqs='CERT_NONE')
db = client.datasets
app = Flask(__name__)
app.secret_key = b'pj&\xe9\xd7\xd7\xabc\xe6KX\xbe\x9f<\x9f\x87'
app.config['UPLOAD_PATH'] = 'public'  # to create a folder which is used to save the uploaded file
CORS(app)

'''
Datasets and model upload
'''
@app.route('/connect-upload', methods=["POST"])
@cross_origin()
def connect_upload():
    index=0

    # get username
    userName = request.files['username'].filename
    print("connect username: ", userName)
    print("-------------------------------------")
    print("get file: ", request.files)
    print("-------------------------------------")
   
    #get model
    model = request.files['model']
    model_name = request.files['model'].filename
    # save th modle into the public folder
    # please remember to check the repeated model name
    model.save(os.path.join(app.config['UPLOAD_PATH'], model_name))
    print("model: ", model)
    print("model name:", model_name)
    print("--------------------------------------")
    uuid_combined = uuid.uuid4().hex
    print(uuid_combined)
    #get the file size
    size = os.path.getsize(os.path.join(app.config['UPLOAD_PATH'], model_name))
    size = str(size/1000) + "KB"
    output = open(os.path.join(app.config['UPLOAD_PATH'], model_name),'r')
    data = output.readlines()
    output.close()
  
    if len(list(db.models.find({"UserName":userName,"FileName":model_name})))>0:
        print('duplicated')
        model_name = "copy_of_" + str(random.randint(100,999)) + "_" + model_name
        store_schema = {
            "uuid":uuid_combined,
            "FileName": model_name,
            "BriefInfo": "",
            "Size": size,
            "UserName": userName,
            "data": data
        }
        db.models.insert_one(store_schema)
    else:
        store_schema = {
            "uuid":uuid_combined,
            "FileName": model_name,
            "BriefInfo": "",
            "Size": size,
            "UserName": userName,
            "data": data
        }
        db.models.insert_one(store_schema)
   
    
   #--------------------------Finish Model Uploading--------------------------------------------------------------------
    # get files list: multiple files are stored into an list
    files_list = [request.files['file'+str(i)] for i in range(0, len(request.files)-2)]
    print("file list is: ", files_list)
    print("file len is", len(files_list))
    session['uploaded_datasets_len'] = len(files_list)
    print("len is: ", session['uploaded_datasets_len'])
    print("check seesion: ",  session.items())

    # when a user only upload a model, then the file_list is []
    # please return a [""] file_name_list to the frontend
    if (len(files_list) != 0):
        # get the first file
        print("the first file: ", files_list[0])
        # get file-name list
        files_name_list = [secure_filename(request.files['file'+str(i)].filename) for i in range(0, len(request.files)-2)]
        print("file name list ", files_name_list) # ['ex.dat', 'ex_fdy.dat', 'ex_fts.dat']

        # check if the post request has the file part
        # if user does not select file browser also
        # submit an empty part without filename
        for uploaded_file in files_list:
            if uploaded_file.filename == '':
                flash('No selected file')
                return redirect(request.url)

        # PLEASE deal with the filename to avoid repeating name here
        # file_ext = os.path.splitext(filename)[1] # get extenson of a file, like .csv
        # (replace the code below) save the file to MongoDB
        for uploaded_file in files_list:
            uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename))

            # to get the number at the first line
            f = open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r')
            first_num = [line.rstrip() for line in f.readlines()[0]][0]

            # to get the column number
            f = open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r')
            size = [len(line.rstrip().split(' ')) for line in f.readlines()[1:2]][0]

            columnNames = [''] * size
            attributes_meta = size
            if int(first_num) < size:
                lable = "Yes"
            elif int(first_num) == size:
                lable = "No"
            else:
                lable = "Error"
            for i in range(size):

                columnNames[i] = "Coloumn" + " " + str(i)
            record = 0
            path_str = './public/' + str(index) + '.'+'dat'
            with open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r') as f:
                with open(path_str,'w') as f1:
                    f1.write(','.join(columnNames)+"\n")
                    next(f) # skip the first line of the dataset
                    for line in f:
                        lines =str(line)
                        lines = lines.split(" ")
                        f1.write(','.join(lines))
                        record = record + 1
            instance_meta = record
            index = index + 1
            data = pd.read_csv(path_str)
            data = data.to_dict('records')
            size = os.path.getsize(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename))
            size = str(size/1000) + "KB"
            if len(list(db.files.find({"UserName":userName,"FileName":uploaded_file.filename})))>0:
                FileName = "copy_of_" + str(random.randint(100,999)) + "_" +  uploaded_file.filename
                store_schema={
                    "uuid":uuid_combined,
                    "FileName":FileName,
                    "BriefInfo":"",
                    "Size":size,
                    "UserName":userName,
                    "data": data
                }
                db.files.insert_one(store_schema)
                metadata = {
                    "uuid":uuid_combined,
                    "FileName":FileName,
                    "UserName":userName,
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
            else:
                store_schema={
                    "uuid":uuid_combined,
                    "FileName":uploaded_file.filename,
                    "BriefInfo": "",
                    "Size":size,
                    "UserName":userName,
                    "data": data
                }
                db.files.insert_one(store_schema)
                metadata = {
                    "uuid":uuid_combined,
                    "FileName":uploaded_file.filename,
                    "UserName":userName,
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
            
        return json.dumps([model_name, files_name_list])

    files_name_list = [""]
    return json.dumps([model_name, files_name_list])


'''
Datasets
'''
@app.route('/upload', methods=["GET", "POST"])
@cross_origin()
def upload():
    file_name_list = list()
    index = 0
    uuid_combined = uuid.uuid4().hex
    if request.method == "POST":
        userName = request.files['username'].filename
        print("get username: ", userName)

        # TODO： 这是得到多个datasets的代码
        # get files list: multiple files are stored into an list
        files_list = [request.files['file'+str(i)] for i in range(0, len(request.files)-1)]
        print("file list is: ", files_list)

        # get the first file
        print("the first file: ", files_list[0])
        # get file-name list
        files_name_list = [secure_filename(request.files['file'+str(i)].filename) for i in range(0, len(request.files)-1)]
        print("file name list ", files_name_list) # ['ex.dat', 'ex_fdy.dat', 'ex_fts.dat']
        
        for uploaded_file in files_list:
            if uploaded_file.filename == '':
                flash('No selected file')
                return redirect(request.url)

        for uploaded_file in files_list:
            uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename))

            # to get the number at the first line
            f = open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r')
            first_num = [line.rstrip() for line in f.readlines()[0]][0]

            # to get the column number
            f = open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r')
            size = [len(line.rstrip().split(' ')) for line in f.readlines()[1:2]][0]

            columnNames = [''] * size
            attributes_meta = size
            
            if int(first_num) < size:
                lable = "Yes"
            elif int(first_num) == size:
                lable = "No"
            else:
                lable = "Error"
            for i in range(size):
                columnNames[i] = "Coloumn" + " " + str(i)
            record = 0
            index = index + 1
            path_str = './public/' + str(index) + '.'+'dat'
            with open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r') as f:
                with open(path_str,'w') as f1:
                    f1.write(','.join(columnNames)+"\n")
                    next(f) # skip the first line of the dataset
                    for line in f:
                        lines =str(line)
                        lines = lines.split(" ")
                        f1.write(','.join(lines))
                        record = record + 1
            instance_meta = record
            data = pd.read_csv(path_str)
            data = data.to_dict('records')
            size = os.path.getsize(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename))
            size = str(size/1000) + "KB"
            if len(list(db.files.find({"UserName":userName,"FileName":uploaded_file.filename})))>0:
                FileName = "copy_of_" + str(random.randint(100,999)) + "_" +  uploaded_file.filename
                file_name_list.append(FileName)
                store_schema={
                    "uuid":uuid_combined,
                    "FileName":FileName,
                    "BriefInfo":"",
                    "Size":size,
                    "UserName":userName,
                    "data": data
                }
                db.files.insert_one(store_schema)
                metadata = {
                    "uuid":uuid_combined,
                    "FileName":FileName,
                    "UserName":userName,
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
            else:
                # file_name_list.append(uploaded_file.filename)

                store_schema={
                    "uuid":uuid_combined,
                    "FileName":uploaded_file.filename,
                    "BriefInfo": "",
                    "Size":size,
                    "UserName":userName,
                    "data": data
                }
                db.files.insert_one(store_schema)
                metadata = {
                    "uuid":uuid_combined,
                    "FileName":uploaded_file.filename,
                    "UserName":userName,
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

    return json.dumps(file_name_list)

@app.route('/datasetFiles', methods=["POST"])
def showAlldatasetFiles():
    UserName = request.get_json(force=True)
    print("username get: ", UserName)
    # read datasets JSON file
    # TODO: You should get the same format of (_id, FileName, Size) from MongoDB, then replace it
    # TODO: return a empty [] to me if there is no file in the MongoDB
    data_return = list(db.files.find( {"UserName":UserName}))
    result = db.metadata.find({"UserName":UserName})
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
        print("am I here")
        json_data = dumps(data_return, indent = 2)
        with open('./data.json_tem.json', 'w') as file:
            file.write(json_data)
        jsonFile = open('./data.json_tem.json', 'r')
        values = json.load(jsonFile)
        for element in values:
            if 'data' in element:
                del element['data']
            if 'uuid' in element:
                del element['uuid']

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
    #uploaded_size = session['uploaded_datasets_len']
    print("get session", session.items())
    data = db.files.find().sort('_id',-1).limit(1)#Find the newest data to insert
    json_data = dumps(data, indent = 2)
    with open('./dataNewJson.json', 'w') as file:
                file.write(json_data)
    jsonFile = open('./dataNewJson.json', 'r')
    values = json.load(jsonFile)
    for element in values:
        if 'data' in element:
            del element['data']
        if 'uuid' in element:
            del element['uuid']
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
    if len(loads(dumps(db.metadata.find({"UserName":UserName,"FileName":FileName}))))==0:

        # db.metadata.insert_one(schema)
        db.metadata.update({"UserName": UserName,"FileName":FileName},
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
        db.metadata.update({"UserName": UserName,"FileName":FileName},
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
    dataset_userName = request.get_json(force=True)
    datasetName= dataset_userName[0]
    userName = dataset_userName[1]
    print(userName)

    # to get the selected dataset name from the frontend
    print(datasetName) # you can check the gotten dataset name
    print(type(datasetName))  # string
    # TODO delete the corresponding dataset in the MongoDB based on the datasetName
    # delete corresponding dataset
    db.files.delete_one({"UserName": userName, "FileName": datasetName})
    # delete corresponding metadata in the same time
    db.metadata.delete_one({"UserName":userName, "FileName": datasetName})
    print("Done the delete")
    # this return must be string, which will be returned to the frontend immediately
    # so DO NOT modify the return 'metadata_string'
    return datasetName


# to receive the selected dataset name for getting corresponding detailed data and metadata
@app.route('/detailedData-name', methods=["POST"])
@cross_origin()
def getNameForDetailedData():
    dataset_userName = request.get_json(force=True)
    datasetName= dataset_userName[0]
    userName = dataset_userName[1]
    print(userName)

    getDatasetName = False
    result = db.metadata.find({"FileName":str(datasetName),"UserName":str(userName)})
    result = loads(dumps(result))

    if(len(result)>0):
        # TODO to get detailed_data from MongoDB
        result = db.metadata.find({"FileName":str(datasetName),"UserName":str(userName)})
        result_detailed_data = db.files.find({"FileName":str(datasetName),"UserName":str(userName)})
        result = loads(dumps(result))
        result_detailed_data = loads(dumps(result_detailed_data))
        metadata = result
        detailed_data = result_detailed_data[0]['data']
        for element in metadata:
            if '_id' in element:
                del element['_id']
            if'uuid' in element:
                del element['uuid']

    else:
        with open('./detailedData.json') as f:
            detailed_data = json.load(f)
        with open('./metadata.json') as f:
            metadata = json.load(f)
    #Handeling the situation when it return a empty [], change to the relevent metadata.
    if(len(metadata)==0):
        result = db.metadata.find({"FileName":str(datasetName),"UserName":str(userName)})
        result = loads(dumps(result))
        metadata = result
        for element in metadata:
            if '_id' in element:
                del element['_id']
            if'_uuid' in element:
                del element['uuid']
    print('sss')
    print(metadata)
    print('sss')

    return json_util.dumps([detailed_data, metadata])

# to query datasets based on the dataset name or key words
@app.route('/query-datasets', methods=["POST"])
@cross_origin()
def queryDatasets():
    # you will recieve a inputted word by a user from the frontend
    input_value_username = request.get_json(force=True)
    input_value = input_value_username[0]
    UserName = input_value_username[1]
    print(input_value) # you can check the inputted word through this
    print(UserName)  # string
    NameArray=[]
    # TODO you need to query the corresponding datasets from MongoDB
    # the input value may be the dataset name, or may be key words
    # this is the querying result I simulate, please REPLACE it when you get the real results
    returndata=list(db.metadata.find({"UserName":UserName}))
    data= loads(dumps(returndata))
    lenth=len(data)
    print(lenth)
    T=True
    T2=False
    if '&&' in input_value:
     spstr=str(input_value).split("&&")
     for i in range(lenth):
        X=0
        for element in spstr:
         if (element in data[i]['FileName'] or element in data[i]['BriefInfo'] or element in data[i][
             'Description'] or element in data[i]['Keywords']):
            X=X+1
        if X==len(spstr):
         NameArray.append(data[i]['FileName'])
    elif '||' in input_value:
     spstr = str(input_value).split("||")
     for i in range(lenth):
        for element in spstr:
           if (element  in data[i]['FileName'] or element  in data[i]['BriefInfo'] or element  in data[i][
             'Description'] or element  in data[i]['Keywords']):
                   T2=True
        if T2 is True:
         NameArray.append(data[i]['FileName'])
         T2=False
    else:
     for i in range(lenth):
        if (input_value in data[i]['FileName']or input_value in data[i]['BriefInfo']or input_value in data[i]['Description'] or input_value in data[i]['Keywords']):
            NameArray.append(data[i]['FileName'])

    print("Now i am here")
    print(NameArray)
    data_return=list(db.files.find({"FileName":{"$in":NameArray},"UserName":UserName}))
    result=db.metadata.find({"UserName":UserName})
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
        with open('./queryResultsForDatasets.json', 'w') as file:
            file.write(json_data)
        jsonFile = open('./queryResultsForDatasets.json', 'r')
        values = json.load(jsonFile)
        for element in values:
            if 'data' in element:
                del element['data']
        for element in values:
            if 'uuid' in element:
                del element['uuid']

        json_size = len(values)
        for i in range(len(values)):
            fileName = str(values[i]["FileName"])
            if fileName in dicts:
                values[i]["BriefInfo"] = dicts[fileName]
        values = dumps(values, indent=2)



        with open('./queryResultsForDatasets.json', 'w') as file:
            file.write(values)
        return values
    else:
     print("The user does not have any file")
     data = []
    return json.dumps(data)


'''
Models
'''
@app.route('/modelFiles', methods=["POST"])
@cross_origin()
def showAllModelFiles():
    # read datasets JSON file
    # TODO: You should get the same format of (_id, FileName, Size) from MongoDB, then replace it
    # TODO: return a empty [] to me if there is no file in the MongoDB
    UserName = request.get_json(force=True)
    data_return = list(db.models.find({"UserName": UserName}))
    print(len(data_return))
    print(db.models.find({"UserName": UserName}))
    result = db.modelmetadata.find({"UserName": UserName})
    result = loads(dumps(result))
    size = len(result)
    description = list()
    fileName = list()
    for i in range(size):
        description.append(result[i]['Description'])
        fileName.append(result[i]['ModelName'])
    dicts = {}
    for key in fileName:
        for value in description:
            dicts[key] = value
            description.remove(value)
            break

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
        #userName = request.files['username']
        userName = request.files['username'].filename
        print(userName)
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
        print(filename)  # e.g. ex.csv
        # TODO: PLEASE deal with the filename to avoid repeating name here
        file_ext = os.path.splitext(filename)[1]  # get extenson of a file, like .csv
        uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))
        # Get the path of the file
        paths = os.path.join(app.config['UPLOAD_PATH'], filename)
        # Get the size of the file
        size = os.path.getsize(paths)
        size_string = str(size / 1000) + "KB"
        print(size_string)
        ID = userName
        print(ID)
        newf = paths
        print(newf)
        f = open(newf)
        lines = f.readlines()
        # copy the content in lines to new list named data
        data = lines
        Array = filename.split('.', 1)
        filename = Array[0] + ".cod"
        results = db.models.find({"FileName": filename, "UserName": userName})
        for result in results:
            while (result["FileName"] == filename):
                Prefix = "copy_of_"
                filename = Prefix + str(random.randint(100, 999)) + filename
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
    model_userName = request.get_json(force=True)
    print(model_userName)
    modelName = model_userName[0]
    userName = model_userName[1]

    # delete corresponding dataset
    db.models.delete_one({"UserName": userName, "FileName": modelName})
    # delete corresponding metadata in the same time
    db.modelmetadata.delete_one({"UserName": userName, "FileName": modelName})
    return modelName


@app.route('/edit-model-desc', methods=["POST"])
@cross_origin()
def editModelDescription():

    data = request.get_json(force=True)

    print("Here!")

    print(data)
    ModelName = data["modelName"]
    print(ModelName)
    Description = data["description"]
    userName = data["userName"]
    print(userName)

    record = {
            "ModelName":ModelName,
            "UserName":userName,
            "Description":Description,
    }
    if len(loads(dumps(db.modelmetadata.find({"UserName": userName, "ModelName": ModelName})))) == 0:
        db.modelmetadata.insert_one(record)


    print(Description)

    record = {
        "ModelName": ModelName,
        "UserName": userName,
        "Description": Description,
    }
    if len(loads(dumps(db.modelmetadata.find({"UserName": userName, "ModelName": ModelName})))) == 0:

        db.modelmetadata.insert_one(record)

    else:
        db.modelmetadata.delete_one({"UserName": userName, "ModelName": ModelName})
        db.modelmetadata.insert_one(record)

    return data["modelName"]


'''
Users
'''
@app.route('/login', methods=["POST"])
@cross_origin()
def login():
    data = request.get_json(force=True)
    print(data)
    user = db.user.find_one({
        "UserName": request.get_json(force=True)['username']
    })
    print(user)
    if user and pbkdf2_sha256.verify(request.get_json(force=True)['password'], user['password']):
        del user['password']
        session['login'] = True
        session['user'] = user
        print('Login Sucessfully')
        return json_util.dumps(user["UserName"])
    else:
        return "Invalid login credentials"

    # success = True
    # if success:
    #     return json_util.dumps(data)
    # else:
    #     return ""


@app.route('/sign-up', methods=["POST"])
@cross_origin()
def signUp():
    data = request.get_json(force=True)
    user = {
        "_id": uuid.uuid4().hex,
        "name": request.get_json(force=True)['name'],
        "password": request.get_json(force=True)['password'],
        "UserName": request.get_json(force=True)['email']
    }
    user['password'] = pbkdf2_sha256.encrypt(user['password'])
    print(data)
    if db.user.find_one({"UserName": user['UserName']}):
        print('email already exist')
        return 'Email already exist'
    else:
        db.user.insert_one(user)
        print('The user add sucessfully')
        return 'Add Sucessfully'

@app.route('/bind-model', methods=["POST"])
@cross_origin()
def bind_model():
    model_userName_datasetName = request.get_json(force=True)
    print("binding:", model_userName_datasetName)
    modelName = model_userName_datasetName[0]
    userName = model_userName_datasetName[1]
    datasetName = model_userName_datasetName[2]

    #TODO: 1. fine the uuid of the model 
    #TODO: 2. set the uuid to the dataset

    return "Bind success"

@app.route('/query-models', methods=["POST"])
@cross_origin()
def query_model():
    # you will recieve a inputted word by a user from the frontend
    input_value_username = request.get_json(force=True)
    input_value = input_value_username[0]
    username = input_value_username[1]
    print(input_value) # you can check the inputted word through this
    print(username)  # string

    # TODO you need to query the corresponding datasets from MongoDB
    # the input value may be the dataset name, or may be key words
    # this is the querying result I simulate, please REPLACE it when you get the real results
    with open('./queryResultsForModels.json') as f:
        queried_models = json.load(f)

    return json.dumps(queried_models)

if __name__ == "__main__":
    #sess = Session()
    #sess.init_app(app)
    app.run(debug=True)
