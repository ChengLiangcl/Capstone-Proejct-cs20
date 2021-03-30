from flask import Flask, flash, jsonify, request, render_template, make_response, redirect, url_for, abort
from werkzeug.utils import secure_filename
from flask_cors import CORS,cross_origin
from flask_restful import Api, Resource, reqparse
import os
import json

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
    new_dataset = [{"_id": {"$oid": "6061862b0d830ba54020706d"},"FileName": "ex_fdy.csv", "Size": "4.68KB"}]

    return json.dumps(new_dataset)


if __name__ == "__main__":
    app.run(debug = True)