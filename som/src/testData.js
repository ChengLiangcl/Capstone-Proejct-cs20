
export const testDatasets = [
    {
      "FileName": "test1.dat",
      "BriefInfo": "test1 briefInfo",
      "Size": "4.93KB",
      "Description": "test1 description",
      "Source": "3",
      "Number_of_Attribute": 5,
      "Number_of_Instance": 96,
      "UserName": "test user1",
      "ModelName": ""
    },
    {
      "FileName": "test2.dat",
      "BriefInfo": "test2 briefInfo",
      "Size": "4.884KB",
      "Description": "test2 description",
      "Source": "1",
      "Number_of_Attribute": 5,
      "Number_of_Instance": 96,
      "UserName": "test user2",
      "ModelName": "test model"
    }
  ];
  
export  const testModels = [
    {
      "uuid": "1130849f0980498ab13a19f5e975945a",
      "FileName": "test1 model.cod",
      "BriefInfo": "test1 model briefInfo",
      "Size": "16.517KB",
      "UserName": "test user1",
      "copy": 1
    },
    {
      "uuid": "1130849f0980498ab13a19f5e975945a",
      "FileName": "test1 mode2.cod",
      "BriefInfo": "test1 mode2 briefInfo",
      "Size": "16.517KB",
      "UserName": "test user2",
      "copy": 1
    },
  ];

export const testMetadata = [
  {
          "FileName": "test dataset",
          "UserName": "test user1",
          "BriefInfo": "test BriefInfo",
          "Description": "test description",
          "Source": "from...",
          "Number_of_Instance": "4",
          "Number_of_Attribute": "5",
          "Keywords": ["One", "Two"],
          "AttrInfo": [
                  {
                      "attrName": "attrName 1",
                      "attrDescription": "attrDesc 1"
                  },
                  {
                    "attrName": "attrName 2",
                    "attrDescription": "attrDesc 2"
                }
          ]
  }
];

export const testDetailedData = [
  {
    "Coloumn 0": 17.193922,
    "Coloumn 1": 21.496441,
    "Coloumn 2": -4.047062,
    "Coloumn 3": -8.095073,
    "Coloumn 4": 403.402618
  },
  {
    "Coloumn 0": 16.861963,
    "Coloumn 1": 21.067974,
    "Coloumn 2": -4.04231,
    "Coloumn 3": -8.237827,
    "Coloumn 4": 402.641083
  },
  {
    "Coloumn 0": 16.486231,
    "Coloumn 1": 20.760134,
    "Coloumn 2": -3.997258,
    "Coloumn 3": -8.172029,
    "Coloumn 4": 402.056519
  },
  {
    "Coloumn 0": 16.178122,
    "Coloumn 1": 20.217403,
    "Coloumn 2": -4.040308,
    "Coloumn 3": -8.05302,
    "Coloumn 4": 403.584961
  }
];

export const testEmptyMetadata = [
  {
          "FileName": "",
          "UserName": "",
          "BriefInfo": "",
          "Description": "",
          "Source": "",
          "Number_of_Instance": "",
          "Number_of_Attribute": "",
          "Keywords": [],
          "AttrInfo": [
                  {
                      "attrName": "",
                      "attrDescription": ""
                  }
          ]
  }
];

export const testBindedDataset = [
  {
    "uuid": "1130849f0980498ab13a19f5e975945a",
    "FileName": "test1 model.cod",
    "BriefInfo": "test1 model briefInfo",
    "Size": "16.517KB",
    "UserName": "test user1",
    "copy": 1
  },
  {
    "FileName": "test1.dat",
    "BriefInfo": "test1 briefInfo",
    "Size": "4.93KB",
    "Description": "test1 description",
    "Source": "3",
    "Number_of_Attribute": 5,
    "Number_of_Instance": 96,
    "UserName": "test user1",
    "ModelName": ""
  },
  {
    "FileName": "test2.dat",
    "BriefInfo": "test2 briefInfo",
    "Size": "4.884KB",
    "Description": "test2 description",
    "Source": "1",
    "Number_of_Attribute": 5,
    "Number_of_Instance": 96,
    "UserName": "test user2",
    "ModelName": "test model"
  }
];

export const testNoBindedDataset = [
  {
    "uuid": "1130849f0980498ab13a19f5e975945a",
    "FileName": "test1 model.cod",
    "BriefInfo": "test1 model briefInfo",
    "Size": "16.517KB",
    "UserName": "test user1",
    "copy": 1
  }
];