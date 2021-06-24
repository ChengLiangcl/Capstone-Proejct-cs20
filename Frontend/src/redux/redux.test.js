import * as ActionTypes from './ActionTypes';
import { User } from './user';
import { ModelFiles } from './modelFiles';
import { AllModelFiles } from './allModels';
import { testModels, testDatasets } from '../testData';
import { DatasetFiles } from './datasetFiles';
import { AllDatasetFiles } from './allDatasetFiles';
import { Metadata } from './metadata';
import { emptyMetadata } from './metadataEmpty';
import { ConnectionFiles } from './connectionResult';

/** ================================== User =============================================== */
describe("user reducer", () => {
    it('should return the initial state', () => {
        expect(User(undefined, {})).toEqual(
            {
                isLoading: true,
                errMess: null,
                userInfo: null
            }
        )
    });

    it('should handle LOGIN', () => {
        expect(
            User(undefined, {
                type: ActionTypes.LOGIN,
                payload: 'test user'
            })
        ).toEqual(
            {
                isLoading: false,
                errMess: null,
                userInfo: 'test user'
            }
        );
    });

    it('should handle SIGN_UP', () => {
        expect(
            User(undefined, {
                type: ActionTypes.SIGN_UP
            })
        ).toEqual(
            {
                isLoading: true,
                errMess: null,
                userInfo: null
            }
        );
    });
});

/** =============================== Model ===========================================================*/
describe("model reducer", () => {
    it('should return the initial state', () => {
        expect(ModelFiles(undefined, {})).toEqual(
            {
                isLoading: true,
                isQuery: false,
                errMess: null,
                modelFiles: []
            }
        )
    });

    it('should handle ADD_MODELFILES', () => {
        expect(
            ModelFiles(undefined, {
                type: ActionTypes.ADD_MODELFILES,
                payload: testModels
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                modelFiles: testModels
            }
        );
    });

    it('should handle QUERY_MODELFILES', () => {
        expect(
            ModelFiles(undefined, {
                type: ActionTypes.QUERY_MODELFILES,
                payload: testModels
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: true,
                errMess: null,
                modelFiles: testModels
            }
        );
    });

    it('should handle MODELFILES_LOADING', () => {
        expect(
            ModelFiles(undefined, {
                type: ActionTypes.MODELFILES_LOADING
            })
        ).toEqual(
            {
                isLoading: true,
                isQuery: false,
                errMess: null,
                modelFiles: []
            }
        );
    });

    it('should handle MODELFILES_FAILED', () => {
        expect(
            ModelFiles(undefined, {
                type: ActionTypes.MODELFILES_FAILED,
                payload: "failed load"
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: "failed load",
                modelFiles: []
            }
        );
    });

    it('should handle UPLOAD_MODEL', () => {
        const existingModel = [{
            "uuid": "1130849f0980498ab13a19f5e975945a",
            "FileName": "test model.cod",
            "BriefInfo": "test model briefInfo",
            "Size": "16.517KB",
            "UserName": "test user1",
            "copy": 1
        }];
        expect(
            ModelFiles({
                isLoading: false,
                isQuery: false,
                errMess: null,
                modelFiles: existingModel
            }, {
                type: ActionTypes.UPLOAD_MODEL,
                payload: testModels
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                modelFiles: [...existingModel, ...testModels]
            }
        );
    });

    it('should handle REMOVE_MODEL', () => {
        const existingModel = testModels;
        expect(
            ModelFiles({
                isLoading: false,
                isQuery: false,
                errMess: null,
                modelFiles: existingModel
            }, {
                type: ActionTypes.REMOVE_MODEL,
                payload: "test1 model.cod"
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                modelFiles: [
                    {
                        "uuid": "1130849f0980498ab13a19f5e975945a",
                        "FileName": "test1 mode2.cod",
                        "BriefInfo": "test1 mode2 briefInfo",
                        "Size": "16.517KB",
                        "UserName": "test user2",
                        "copy": 1
                    },
                ]
            }
        );
    });

    it('should handle EDIT_MODEL_DESCRIPTION', () => {
        const existingModel = testModels;
        expect(
            ModelFiles({
                isLoading: false,
                isQuery: false,
                errMess: null,
                modelFiles: existingModel
            }, {
                type: ActionTypes.EDIT_MODEL_DESCRIPTION,
                payload: { modelName: "test1 model.cod", description: "new description" }
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                modelFiles: [
                    {
                        "uuid": "1130849f0980498ab13a19f5e975945a",
                        "FileName": "test1 model.cod",
                        "BriefInfo": "new description",
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
                ]
            }
        );
    });
});

/** ============================== All Model ========================================================= */
describe("all model reducer", () => {
    it('should return the initial state', () => {
        expect(AllModelFiles(undefined, {})).toEqual(
            {
                isLoading: true,
                errMess: null,
                isQuery: false,
                modelFiles: []
            }
        )
    });

    it('should handle ADD_ALL_MODELS', () => {
        expect(
            AllModelFiles(undefined, {
                type: ActionTypes.ADD_ALL_MODELS,
                payload: testModels
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                modelFiles: testModels
            }
        );
    });

    it('should handle QUERY_ALL_MODELS', () => {
        expect(
            AllModelFiles(undefined, {
                type: ActionTypes.QUERY_ALL_MODELS,
                payload: testModels
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: true,
                errMess: null,
                modelFiles: testModels
            }
        );
    });
});

/** =============================== Datasets ========================================================== */
describe("dataset reducer", () => {
    it('should return the initial state', () => {
        expect(DatasetFiles(undefined, {})).toEqual(
            {
                isLoading: true,
                isQuery: false,
                errMess: null,
                datasetFiles: []
            }
        )
    });

    it('should handle ADD_DATASETFILES', () => {
        expect(
            DatasetFiles(undefined, {
                type: ActionTypes.ADD_DATASETFILES,
                payload: testDatasets
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                datasetFiles: testDatasets
            }
        );
    });

    it('should handle DATASETFILES_LOADING', () => {
        expect(
            DatasetFiles(undefined, {
                type: ActionTypes.DATASETFILES_LOADING
            })
        ).toEqual(
            {
                isLoading: true,
                isQuery: false,
                errMess: null,
                datasetFiles: []
            }
        );
    });

    it('should handle QUERY_DATASETFILES', () => {
        expect(
            DatasetFiles(undefined, {
                type: ActionTypes.QUERY_DATASETFILES,
                payload: testDatasets
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: true,
                errMess: null,
                datasetFiles: testDatasets
            }
        );
    });

    it('should handle DATASETFILES_FAILED', () => {
        expect(
            DatasetFiles(undefined, {
                type: ActionTypes.DATASETFILES_FAILED,
                payload: "failed loading"
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: "failed loading",
                datasetFiles: []
            }
        );
    });

    it('should handle UPLOAD_DATASET', () => {
        const exitingDataset = [{
            "FileName": "reducer.dat",
            "BriefInfo": "test briefInfo",
            "Size": "4.93KB",
            "Description": "test description",
            "Source": "3",
            "Number_of_Attribute": 5,
            "Number_of_Instance": 96,
            "UserName": "test user1",
            "ModelName": ""
        }];

        expect(
            DatasetFiles({
                isLoading: false,
                isQuery: false,
                errMess: null,
                datasetFiles: exitingDataset
            },
                {
                    type: ActionTypes.UPLOAD_DATASET,
                    payload: testDatasets
                })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                datasetFiles: exitingDataset.concat(testDatasets)
            }
        );
    });

    it('should handle REMOVE_DATASET', () => {
        const existingDataset = testDatasets;
        expect(
            DatasetFiles({
                isLoading: false,
                isQuery: false,
                errMess: null,
                datasetFiles: existingDataset
            }, {
                type: ActionTypes.REMOVE_DATASET,
                payload: "test1.dat"
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                datasetFiles: [
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
                ]
            }
        );
    });

    it('should handle MODIFY_BRIFINFO', () => {
        const existingDataset = testDatasets;
        expect(
            DatasetFiles({
                isLoading: false,
                isQuery: false,
                errMess: null,
                datasetFiles: existingDataset
            }, {
                type: ActionTypes.MODIFY_BRIFINFO,
                payload: ["test1.dat", "new description"]
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                datasetFiles: [
                    {
                        "FileName": "test1.dat",
                        "BriefInfo": "new description",
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
                ]
            }
        );
    });
})

/** =============================== All datasets ======================================================= */
describe("all dataset reducer", () => {
    it('should return the initial state', () => {
        expect(AllDatasetFiles(undefined, {})).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                datasetFiles: []
            }
        )
    });

    it('should handle ADD_ALL_DATASETFILES', () => {
        expect(
            AllDatasetFiles(undefined, {
                type: ActionTypes.ADD_ALL_DATASETFILES,
                payload: testDatasets
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: null,
                datasetFiles: testDatasets
            }
        );
    });

    it('should handle ALL_DATASETFILES_LOADING', () => {
        expect(
            AllDatasetFiles(undefined, {
                type: ActionTypes.ALL_DATASETFILES_LOADING
            })
        ).toEqual(
            {
                isLoading: true,
                isQuery: false,
                errMess: null,
                datasetFiles: []
            }
        );
    });

    it('should handle QUERY_ALL_DATASETFILES', () => {
        expect(
            AllDatasetFiles(undefined, {
                type: ActionTypes.QUERY_ALL_DATASETFILES,
                payload: testDatasets
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: true,
                errMess: null,
                datasetFiles: testDatasets
            }
        );
    });

    it('should handle ALL_DATASETFILES_FAILED', () => {
        expect(
            AllDatasetFiles(undefined, {
                type: ActionTypes.ALL_DATASETFILES_FAILED,
                payload: "failed loading"
            })
        ).toEqual(
            {
                isLoading: false,
                isQuery: false,
                errMess: "failed loading",
                datasetFiles: []
            }
        );
    });

});

/** =============================== Metadata ======================================================= */
describe("metadata reducer", () => {
    it('should return the initial state', () => {
        expect(Metadata(undefined, {})).toEqual(
            {
                isLoading: true,
                errMess: null,
                metadata: emptyMetadata
            }
        )
    });

    it('should handle METADATA_LOADING', () => {
        expect(
            Metadata(undefined, {
                type: ActionTypes.METADATA_LOADING
            })
        ).toEqual(
            {
                isLoading: true,
                errMess: null,
                metadata: emptyMetadata
            }
        );
    });

    it('should handle METADATA_FAILED', () => {
        expect(
            Metadata(undefined, {
                type: ActionTypes.METADATA_FAILED,
                payload: "failed loading"
            })
        ).toEqual(
            {
                isLoading: false,
                errMess: "failed loading",
                metadata: emptyMetadata
            }
        );
    });
});

/** =============================== Connection result =========================================== */
describe("connection reducer", () => {
    it('should return the initial state', () => {
        expect(ConnectionFiles(undefined, {})).toEqual(
            {
                isLoading: true,
                errMess: null,
                connectionFiles: ["this is for a uploaded model", ["this is for uploaded datasets"]],
                uploadingStatus: ["", ""],
                bindedDatasets: [],
                umatrixDatasets: []
            }
        )
    });

    it('should handle ADD_CONNECTIONS', () => {
        expect(
            ConnectionFiles(undefined, {
                type: ActionTypes.ADD_CONNECTIONS,
                payload: ["this is for a uploaded model", ["this is for uploaded datasets"]]
            })
        ).toEqual(
            {
                isLoading: true,
                errMess: null,
                connectionFiles: ["this is for a uploaded model", ["this is for uploaded datasets"]],
                uploadingStatus: ["", ""],
                bindedDatasets: [],
                umatrixDatasets: []
            }
        );
    });

    it('should handle ADD_UMATRIXDATASETS', () => {
        expect(
            ConnectionFiles(undefined, {
                type: ActionTypes.ADD_UMATRIXDATASETS,
                payload: ["umatrix dataset"]
            })
        ).toEqual(
            {
                isLoading: false,
                errMess: null,
                connectionFiles: ["this is for a uploaded model", ["this is for uploaded datasets"]],
                uploadingStatus: ["", ""],
                bindedDatasets: [],
                umatrixDatasets: ["umatrix dataset"]
            }
        );
    });

    it('should handle UPDATE_UPLOADINGSTATUS', () => {
        expect(
            ConnectionFiles(undefined, {
                type: ActionTypes.UPDATE_UPLOADINGSTATUS,
                payload: ["update", "no update"]
            })
        ).toEqual(
            {
                isLoading: true,
                errMess: null,
                connectionFiles: ["this is for a uploaded model", ["this is for uploaded datasets"]],
                uploadingStatus: ["update", "no update"],
                bindedDatasets: [],
                umatrixDatasets: []
            }
        );
    });

    it('should handle CLEAR_CONNECTIONS', () => {
        expect(
            ConnectionFiles(undefined, {
                type: ActionTypes.CLEAR_CONNECTIONS
            })
        ).toEqual(
            {
                isLoading: true,
                errMess: null,
                connectionFiles:  ["", [""]],
                uploadingStatus: ["", ""],
                bindedDatasets: [],
                umatrixDatasets: []
            }
        );
    });

    it('should handle ADD_BINDDATASETS', () => {
        expect(
            ConnectionFiles(undefined, {
                type: ActionTypes.ADD_BINDDATASETS,
                payload: ["update", "no update"]
            })
        ).toEqual(
            {
                isLoading: false,
                errMess: null,
                connectionFiles: ["this is for a uploaded model", ["this is for uploaded datasets"]],
                uploadingStatus:  ["", ""],
                bindedDatasets: ["update", "no update"],
                umatrixDatasets: []
            }
        );
    });

    it('should handle BIND_LOADING', () => {
        expect(
            ConnectionFiles(undefined, {
                type: ActionTypes.BIND_LOADING
            })
        ).toEqual(
            {
                isLoading: true,
                errMess: null,
                connectionFiles: ["this is for a uploaded model", ["this is for uploaded datasets"]],
                uploadingStatus:  ["", ""],
                bindedDatasets: [],
                umatrixDatasets: []
            }
        );
    });
})