import json

with open('./datasetFiles.json') as f:
            data = json.load(f)
print(type(data))
