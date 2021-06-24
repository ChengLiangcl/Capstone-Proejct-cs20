import * as ActionTypes from './ActionTypes';
import { updateUser, login } from './ActionCreators';
import { connectUploading, getBindedDatasets, deleteOneBindedDataset, 
    fetchAllModels, fetchModelFiles, uploadModel, fetchUploadedModel,
    deleteOneModel, editModelDescription, queryAllModels, queryModels,
    updateUploadingStatus, clearConnections, addConnections, addBindedDatasets,
    bindedDatasetsLoading, removeOneBindedDataset } from './ActionCreators';
import { fetchDatasetFiles, uploadDataset, fetchAllDatasetFiles, queryAllDatasets, 
    fetchUploadedDataset, deleteOneDataset, queryDatasets  } from './ActionCreators';
import * as actions from './ActionCreators';
import { submitMetadata, sendNameForDetailedData, getUMatrixDatasets  } from './ActionCreators';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(axios);
const store = mockStore();

/**================== user ================== */
describe("user redux", () => {
    beforeEach(() => {
        store.clearActions();
    });

    it('creates LOGIN when a user log in', () => {
        mock.onGet('http://localhost:5000/login').reply(200, { response: "test user" });

        store.dispatch(login("test user")).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.LOGIN,
                    payload: "test user"
                }
            ];
            expect(store.getActions()).toEqual(expectedActions)
        });
    });
});

describe("user action", () => {
    it('should create an action to update', () => {
        const userInfo = 'test user';
        const expectedAction = {
            type: ActionTypes.LOGIN,
            payload: userInfo
        };
        expect(updateUser(userInfo)).toEqual(expectedAction);
    });
})

/** ====================== Model ==================================== */
describe("model", () => {
    describe("uploading", () => {
        it('should create ADD_CONNECTIONS after connect uploading', () => {
            mock.onGet('http://localhost:5000/connect-upload').reply(200, { response: ["animal.cod", ["ex_fts.dat"]] });

            store.dispatch(connectUploading()).then(() => {
                let expectedActions = [
                    {
                        type: ActionTypes.ADD_CONNECTIONS,
                        payload: ["animal.cod", ["ex_fts.dat"]]
                    }
                ];
                expect(store.getActions()).toEqual(expectedActions)
            });
        });
    });

    it('should create ADD_BINDDATASETS after checking binded dataset', () => {
        mock.onGet('http://localhost:5000/get-bindedDatasets').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, [{FileName: "ex_ndy.png", BriefInfo: "", Size: "4.93KB", UserName: "17888813173@163.com", copy: 0}]] });

        store.dispatch(getBindedDatasets()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.ADD_BINDDATASETS,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, [{FileName: "ex_ndy.png", BriefInfo: "", Size: "4.93KB", UserName: "17888813173@163.com", copy: 0}]]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    // it('should create REMOVE_DATASET after releting a binded dataset', () => {
    //     mock.onGet('http://localhost:5000/delete-bindeddataset').reply(200, { response: "ex_ndy.png" });

    //     store.dispatch(deleteOneBindedDataset()).then(() => {
    //         let expectedActions = [
    //             {
    //                 type: ActionTypes.REMOVE_DATASET,
    //                 payload:  "ex_ndy.png"
    //             }
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     });
    // });

    it('should create ADD_ALL_MODELS after feteching all usersdatasets', () => {
        mock.onGet('http://localhost:5000/allmodels').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}] });

        store.dispatch(fetchAllModels()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.ADD_ALL_MODELS,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create ADD_MODELFILES after featching models', () => {
        mock.onGet('http://localhost:5000/modelFiles').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}] });

        store.dispatch(fetchModelFiles()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.ADD_MODELFILES,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create UPLOAD_MODEL after uploading a model', () => {
        mock.onGet('http://localhost:5000/upload-model').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}] });

        store.dispatch(uploadModel()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.UPLOAD_MODEL,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create UPLOAD_MODEL after fetching uploaded model', () => {
        mock.onGet('http://localhost:5000/newModel').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}] });

        store.dispatch(fetchUploadedModel()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.UPLOAD_MODEL,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    // it('should create REMOVE_MODEL after deleting one model', () => {
    //     mock.onGet('http://localhost:5000/delete-model').reply(200, { response: "ex.ccc" });

    //     store.dispatch(deleteOneModel()).then(() => {
    //         let expectedActions = [
    //             {
    //                 type: ActionTypes.REMOVE_MODEL,
    //                 payload:  "ex.ccc"
    //             }
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     });
    // });

    it('should create EDIT_MODEL_DESCRIPTION after editing one model description', () => {
        mock.onGet('http://localhost:5000/edit-model-desc').reply(200, { response: "ex.ccc" });

        store.dispatch(editModelDescription()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.EDIT_MODEL_DESCRIPTION,
                    payload:  "ex.ccc"
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create QUERY_ALL_MODELS after querying all users models', () => {
        mock.onGet('http://localhost:5000/query-all-models').reply(200, { response: "ex.ccc" });

        store.dispatch(queryAllModels()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.QUERY_ALL_MODELS,
                    payload:  "ex.ccc"
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create QUERY_MODELFILES after querying models', () => {
        mock.onGet('http://localhost:5000/query-models').reply(200, { response: "ex.ccc" });

        store.dispatch(queryModels()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.QUERY_MODELFILESDELS,
                    payload:  "ex.ccc"
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

describe("model action", () => {
    it('should create an action to update uploading status', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.UPDATE_UPLOADINGSTATUS,
            payload: modelInfo
        };
        expect(updateUploadingStatus(modelInfo)).toEqual(expectedAction);
    });

    it('should create an action to clear connection', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.CLEAR_CONNECTIONS
        };
        expect(clearConnections()).toEqual(expectedAction);
    });

    it('should create an action to add connection', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.ADD_CONNECTIONS,
            payload: modelInfo
        };
        expect(addConnections(modelInfo)).toEqual(expectedAction);
    });

    it('should create an action to load bind model', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.BIND_LOADING
        };
        expect(bindedDatasetsLoading()).toEqual(expectedAction);
    });

    it('should create an action to remove one binded dataset', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.REMOVE_DATASET
        };
        expect(actions.removeOneBindedDataset()).toEqual(expectedAction);
    });

    it('should create an action to get all users model', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.ADD_ALL_MODELS,
            payload: modelInfo
        };
        expect(actions.addAllModels(modelInfo)).toEqual(expectedAction);
    });

    it('should create an action to load models', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.MODELFILES_LOADING
        };
        expect(actions.modelFilesLoading()).toEqual(expectedAction);
    });

    it('should create an action to fail model loading', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.MODELFILES_FAILED
        };
        expect(actions.modelFilesFailed()).toEqual(expectedAction);
    });

    it('should create an action to get models', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.ADD_MODELFILES,
            payload: modelInfo
        };
        expect(actions.addModelFiles(modelInfo)).toEqual(expectedAction);
    });

    it('should create an action to upload a model', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.UPLOAD_MODEL,
            payload: modelInfo
        };
        expect(actions.addModel(modelInfo)).toEqual(expectedAction);
    });

    it('should create an action to remove a model', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.REMOVE_MODEL,
            payload: modelInfo
        };
        expect(actions.removeOneModel(modelInfo)).toEqual(expectedAction);
    });

    it('should create an action to edit a model description', () => {
        const modelName = 'test model';
        const description = 'brief model';
        const expectedAction = {
            type: ActionTypes.EDIT_MODEL_DESCRIPTION,
            payload: {modelName, description}
        };
        expect(actions.editOneModelDescription(modelName, description)).toEqual(expectedAction);
    });

    it('should create an action to query all models', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.QUERY_ALL_MODELS,
            payload: modelInfo
        };
        expect(actions.checkQueryALLModels(modelInfo)).toEqual(expectedAction);
    });

    it('should create an action to query all users models', () => {
        const modelInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.QUERY_MODELFILES,
            payload: modelInfo
        };
        expect(actions.checkQueryModels(modelInfo)).toEqual(expectedAction);
    });
})

/** ====================== Dataset ==================================== */
describe("dataset", () => {
    it('should create ADD_DATASETFILES after fetching datasets', () => {
        mock.onGet('http://localhost:5000/datasetFiles').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}] });

        store.dispatch(fetchDatasetFiles()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.ADD_DATASETFILES,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create ADD_ALL_DATASETFILES after fetching all users datasets', () => {
        mock.onGet('http://localhost:5000/alldatasetFiles').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}] });

        store.dispatch(fetchAllDatasetFiles()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.ADD_ALL_DATASETFILES,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create QUERY_ALL_DATASETFILES after querying datasets', () => {
        mock.onGet('http://localhost:5000/query-all-datasets').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}] });

        store.dispatch(queryAllDatasets()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.QUERY_ALL_DATASETFILES,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create UPLOAD_DATASET after uploading datasets', () => {
        mock.onGet('http://localhost:5000/upload').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}] });

        store.dispatch(uploadDataset()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.UPLOAD_DATASET,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create UPLOAD_DATASET after fecthing uploaded datasets', () => {
        mock.onGet('http://localhost:5000/newDataset').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}] });

        store.dispatch(fetchUploadedDataset()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.UPLOAD_DATASET,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    // it('should create REMOVE_DATASET after deleting a dataset', () => {
    //     mock.onGet('http://localhost:5000/delete-dataset').reply(200, { response: "ex.ccc" });

    //     store.dispatch(deleteOneDataset()).then(() => {
    //         let expectedActions = [
    //             {
    //                 type: ActionTypes.REMOVE_DATASET,
    //                 payload:  "ex.ccc"
    //             }
    //         ];
    //         expect(store.getActions()).toEqual(expectedActions);
    //     });
    // });

    it('should create QUERY_DATASETFILES after querying datasets', () => {
        mock.onGet('http://localhost:5000/query-datasets').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}] });

        store.dispatch(queryDatasets()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.QUERY_DATASETFILES,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex_ndy.png", BriefInfo: ""}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

describe("dataset action", () => {
    it('should create an action to load datasets', () => {
        const datasetInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.DATASETFILES_LOADING
        };
        expect(actions.datasetFilesLoading()).toEqual(expectedAction);
    });

    it('should create an action to fail datasets loading', () => {
        const datasetInfo = 'test model';
        const expectedAction = {
            type: ActionTypes.DATASETFILES_FAILED,
            payload: datasetInfo
        };
        expect(actions.datasetFilesFailed(datasetInfo)).toEqual(expectedAction);
    });

    it('should create an action to add datasets', () => {
        const datasetInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ADD_DATASETFILES,
            payload: datasetInfo
        };
        expect(actions.addDatasetFiles(datasetInfo)).toEqual(expectedAction);
    });

    it('should create an action to add datasets', () => {
        const datasetInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.UPLOAD_DATASET,
            payload: datasetInfo
        };
        expect(actions.addDataset(datasetInfo)).toEqual(expectedAction);
    });

    it('should create an action to load all users datasets', () => {
        const datasetInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ALL_DATASETFILES_LOADING
        };
        expect(actions.allDatasetFilesLoading()).toEqual(expectedAction);
    });

    it('should create an action to fail all datasets loading', () => {
        const datasetInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ALL_DATASETFILES_FAILED,
            payload: datasetInfo
        };
        expect(actions.allDatasetFilesFailed(datasetInfo)).toEqual(expectedAction);
    });

    it('should create an action to upload datasets', () => {
        const datasetInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ADD_ALL_DATASETFILES,
            payload: datasetInfo
        };
        expect(actions.addAllDatasetFiles(datasetInfo)).toEqual(expectedAction);
    });

    it('should create an action to remove one dataset', () => {
        const datasetInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.REMOVE_DATASET,
            payload: datasetInfo
        };
        expect(actions.removeOneDataset(datasetInfo)).toEqual(expectedAction);
    });

    it('should create an action to query datasets', () => {
        const datasetInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.QUERY_DATASETFILES,
            payload: datasetInfo
        };
        expect(actions.checkQueryDatasets(datasetInfo)).toEqual(expectedAction);
    });
})

/** ============================= Metadata ==================================================== */
describe("metadata", () => {
    it('should create ADD_METADATA after submitting metadata', () => {
        mock.onGet('http://localhost:5000/submit-metadata').reply(200, { response: {FileName: "ex.ccc", BriefInfo: "aaaa"}});

        store.dispatch(submitMetadata()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.ADD_METADATA,
                    payload:  {FileName: "ex.ccc", BriefInfo: "aaaa"}
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create ADD_DETAILEDDATA, ADD_METADATA, MODIFY_BRIFINFO after requesting SOM data and metadata', () => {
        mock.onGet('http://localhost:5000/detailedData-name').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}, {FileName: "ex.ccc", BriefInfo: "aaaa"}]});

        store.dispatch(sendNameForDetailedData()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.ADD_DETAILEDDATA,
                    payload:  {FileName: "ex.ccc", BriefInfo: "aaaa"}
                },
                {
                    type: ActionTypes.ADD_METADATA,
                    payload:  {FileName: "ex.ccc", BriefInfo: "aaaa"}
                },
                {
                    type: ActionTypes.MODIFY_BRIFINFO,
                    payload:  {FileName: "ex.ccc", BriefInfo: "aaaa"}
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

describe("metadata actions", () => {
    it('should create an action to get metadata', () => {
        const metadataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ADD_METADATA,
            payload: metadataInfo
        };
        expect(actions.addMetadata(metadataInfo)).toEqual(expectedAction);
    });

    it('should create an action to get all metadata', () => {
        const metadataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ADD_ALLMETADATA,
            payload: metadataInfo
        };
        expect(actions.addAllMetadata(metadataInfo)).toEqual(expectedAction);
    });

    it('should create an action to fail all metadata loading', () => {
        const metadataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.METADATA_FAILED,
            payload: metadataInfo
        };
        expect(actions.metadataFailed(metadataInfo)).toEqual(expectedAction);
    });

    
    it('should create an action to load all metadata', () => {
        const metadataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.METADATA_LOADING,
        };
        expect(actions.metadataLoading()).toEqual(expectedAction);
    });

    it('should create an action to fail all users metadata', () => {
        const metadataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ALLMETADATA_FAILED,
            payload: metadataInfo
        };
        expect(actions.allMetadataFailed(metadataInfo)).toEqual(expectedAction);
    });

    it('should create an action to load all users', () => {
        const metadataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ALLMETADATA_LOADING
        };
        expect(actions.allMetadataLoading()).toEqual(expectedAction);
    });
});

/**=========================== Detailed data ======================================== */
describe("SOM data actions", () => {
    it('should create an action to modify brief info', () => {
        const dataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.MODIFY_BRIFINFO,
            payload: dataInfo
        };
        expect(actions.modifyBriefInfo(dataInfo)).toEqual(expectedAction);
    });

    it('should create an action to add DetailedData', () => {
        const dataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ADD_DETAILEDDATA,
            payload: dataInfo
        };
        expect(actions.addDetailedData(dataInfo)).toEqual(expectedAction);
    });

    it('should create an action to fail detailed data loading', () => {
        const dataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.DETAILEDDATA_FAILED,
            payload: dataInfo
        };
        expect(actions.detailedDataFailed(dataInfo)).toEqual(expectedAction);
    });

    it('should create an action to loading', () => {
        const dataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.DETAILEDDATA_LOADING
        };
        expect(actions.detailedDataLoading(dataInfo)).toEqual(expectedAction);
    });

    it('should create an action to get detailed data', () => {
        const dataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ADD_ALLDETAILEDDATA,
            payload: dataInfo
        };
        expect(actions.addAllDetailedData(dataInfo)).toEqual(expectedAction);
    });

    it('should create an action to fail all users detailed data loading', () => {
        const dataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ALLDETAILEDDATA_FAILED,
            payload: dataInfo
        };
        expect(actions.detailedAllDataFailed(dataInfo)).toEqual(expectedAction);
    });

    it('should create an action to load all users detailed data', () => {
        const dataInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ALLDETAILEDDATA_LOADING
        };
        expect(actions.detailedAllDataLoading(dataInfo)).toEqual(expectedAction);
    });
})



/** ============================= Umatrix ==================================================== */
describe("umatrix", () => {
    it('should create ADD_UMATRIXDATASETS after getting umatrixDatasets', () => {
        mock.onGet('http://localhost:5000/get-umatrixDatasets').reply(200, { response: [{FileName: "ex.ccc", BriefInfo: "aaaa"}]});

        store.dispatch(getUMatrixDatasets()).then(() => {
            let expectedActions = [
                {
                    type: ActionTypes.ADD_UMATRIXDATASETS,
                    payload:  [{FileName: "ex.ccc", BriefInfo: "aaaa"}]
                }
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
})

describe("umatrix actions", () => {
    it('should create an action to load all users', () => {
        const umatrixInfo = 'test dataset';
        const expectedAction = {
            type: ActionTypes.ADD_UMATRIXDATASETS,
            payload: umatrixInfo
        };
        expect(actions.addUmatrixDatasets(umatrixInfo)).toEqual(expectedAction);
    });
})