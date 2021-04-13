from flask import Flask, flash, jsonify, request, render_template, make_response, redirect, url_for, abort, session
from werkzeug.utils import secure_filename
from flask_cors import CORS,cross_origin
from flask_restful import Api, Resource, reqparse
import os
import json

app = Flask(__name__)
app.secret_key = 'dljsaklqk24e21cjn!Ew@@dsa5'
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
        with open('./modelFiles.json') as f:
            data = json.load(f)
        #print(data)
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
        # TODO: (replace the code below) save the file to MongoDB
        uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))

        return filename

@app.route('/newModel', methods=["GET"])
def sendNewModelFiles():
     # TODO: (replace the code below) get the uploaded dataset from MongoDB with _id, FileName, Size
    # because frontend cannot show the new file until it is saved into the MongoDB, and frontend cannot generate _id itself
    # Here, I'll create a uploaded file JSON myself, please delete it when you finish this TODO
    new_model = [{"_id": {"$oid": "6061862b0d830ba54020706d"},"FileName": "ex_fdy.cod", "BriefInfo": "This is a description for new dataset", "Size": "4.68KB"}]

    return json.dumps(new_model)

@app.route('/delete-model', methods=["POST"])
@cross_origin()
def deleteOneModel():

    modelName = request.get_json(force=True)
    print(modelName) 
   
    return modelName



@app.route('/edit-model-desc', methods=["POST"])
@cross_origin()
def editModelDescription():

    data = request.get_json(force=True)
    print(data) 
   
    return data["modelName"]

@app.route('/login', methods=["POST"])
@cross_origin()
def login():

    data = request.get_json(force=True)
    print(data) 
    success=True
    if success:
        return json_util.dumps(data)
    else:
        return ""

@app.route('/sign-up', methods=["POST"])
@cross_origin()
def signUp():

    data = request.get_json(force=True)
    print(data) 
   
    success=True
    if success:
        return json_util.dumps(data)
    else:
        return ""

if __name__ == "__main__":
    app.run(debug = True)




