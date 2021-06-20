import unittest

from werkzeug.datastructures import ImmutableMultiDict, FileStorage

from app import app
import requests
from flask import request
import json
import pymongo
from bson.json_util import dumps
from bson.json_util import loads

class Testapp(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        print('start this test')

    def tearDown(self):
        print('end this test\n')
        pass

    def test_login(self):
        print('test login')
        url = "/login"
        data = {'username': '123@gmail.com', 'password': '12345678'}
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b'"123@gmail.com"')
        
    def test_login_failed(self):
        data = {'username': '123@qq.com', 'password': '123456'}
        response = app.test_client().post('/login', data=json.dumps(data))
        self.assertEqual(response.data, b'Invalid login credentials')


    def test_sign(self):
        print('test sign')
        url = "/sign-up"
        data = {'password': '12345678', 'confirmpassword': '12345678', 'email': '123456@qq.com',
                'question': 'What is your mother name', 'answer': '111'}
        data2 = {'password': '12345678', 'confirmpassword': '12345678', 'email': '741917776@qq.com',
                 'question': 'What is your mother name', 'answer': '111'}
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b'username already exist')
        # response = app.test_client().post(url, data=json.dumps(data2))
        # self.assertEqual(response.data, b'Add Successfully')


    def test_showMyDatasets(self):
        print('test showMyDatasets')
        url = "/datasetFiles"
        data = '123456@qq.com'
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(response.status_code, 200)
        expect = open('./Testing/result.json', 'r')
        values = json.load(expect)
        values = dumps(values, indent=2)
        values = json.loads(values)
        for element in values:
         del element['_id']
        expect=loads(response.data)
        for element in expect:
            del element['_id']
        self.assertEqual(values, expect)

    def test_showMyModelFiles(self):
        print('test showMyModelFiles')
        url = "/modelFiles"
        data = '123456@qq.com'
        data2 = '12345678@qq.com'
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(response.status_code, 200)
        expect = open('./Testing/result10.json', 'r')
        values = json.load(expect)
        values = dumps(values, indent=2)
        values = json.loads(values)
        for element in values:
            del element['_id']
        expect = loads(response.data)
        for element in expect:
            del element['_id']
        self.assertEqual(values, expect)

        response = app.test_client().post(url, data=json.dumps(data2))
        result = b'[]'
        expect = dumps(result)
        expect = loads(expect)
        fact = dumps(response.data)
        fact = loads(fact)
        self.assertEqual(expect, fact)


    def test_delete_binded_datasets(self):
        print('test delete_binded_datasets')
        url = "/delete-bindeddataset"
        data = ['LMYNB','123456@qq.com']
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(200, response.status_code)
        expect = b'LMYNB'
        self.assertEqual(expect, response.data)


    def test_bind_model(self):
        print('test bind_model')
        url = "/bind-model"
        data = ['Test1.cod', '123456@qq.com', 'ex_ndy.dat']
        data2 = ['Test1.cod', '123456@qq.com', 'ex_ndy3.dat']
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(200, response.status_code)
        expect = b'Bind success'
        self.assertEqual(expect, response.data)

        response = app.test_client().post(url, data=json.dumps(data2))
        expect = b'Bind success'
        self.assertEqual(expect, response.data)

    def test_editModelDescription(self):
        print('test editModelDescription')
        url = "/edit-model-desc"
        data = {'modelName': 'Test2.cod', 'description': '', 'userName': '123456@qq.com'}
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(200, response.status_code)
        expect = b'Test2.cod'
        self.assertEqual(expect, response.data)


    def test_queryDatasets(self):
        print('test queryDatasets')
        url = "/query-datasets"
        data = ['EX_nd', '123456@qq.com']
        data2 = ['.+[0-9].dat', '123456@qq.com']
        data3 = ['EX_nd&&.dat', '123456@qq.com']
        data4 = ['.+[0-9].dat||.[a-z].dat', '123456@qq.com']

        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(200, response.status_code)
        expect = open('./Testing/result1.json', 'r')
        values = json.load(expect)
        self.assertEqual(values, loads(response.data))
        response = app.test_client().post(url, data=json.dumps(data2))
        expect2 = open('./Testing/result2.json', 'r')
        values2 = json.load(expect2)
        self.assertEqual(values2, loads(response.data))

        response = app.test_client().post(url, data=json.dumps(data3))
        expect3 = open('./Testing/result14.json', 'r')
        values3 = json.load(expect3)
        self.assertEqual(values3, loads(response.data))

        response = app.test_client().post(url, data=json.dumps(data4))
        expect4 = open('./Testing/result15.json', 'r')
        values4 = json.load(expect4)
        self.assertEqual(values4, loads(response.data))
        # print(values)
        # print(loads(response.text))

    def test_query_model(self):
        print('test querymodel')
        url = "/query-models"
        data = ['131', '123456@qq.com']
        data2 = ['.+[0-9].cod', '123456@qq.com']
        data3 = ['.+[0-9].cod&&1312231', '123456@qq.com']
        data4 = ['2.cod||1312231', '123456@qq.com']
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(200, response.status_code)
        expect = open('./Testing/result3.json', 'r')
        values = json.load(expect)
        self.assertEqual(values, loads(response.data))
        response = app.test_client().post(url, data=json.dumps(data2))
        expect2 = open('./Testing/result4.json', 'r')
        values2 = json.load(expect2)
        self.assertEqual(values2, loads(response.data))

        response = app.test_client().post(url, data=json.dumps(data3))
        expect3 = open('./Testing/result16.json', 'r')
        values3 = json.load(expect3)
        self.assertEqual(values3, loads(response.data))

        response = app.test_client().post(url, data=json.dumps(data4))
        expect4 = open('./Testing/result17.json', 'r')
        values4 = json.load(expect4)
        self.assertEqual(values4, loads(response.data))
        # print(values)
        # print(loads(response.text))


    def test_deleteOneModel(self):
        print('test deleteOneModel')
        url = "/delete-model"
        data = ['Test3.cod', '123456@qq.com']
        data2 = ['Test4.cod', '123456@qq.com']
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(200, response.status_code)
        expect = b'Test3.cod'
        self.assertEqual(expect, response.data)
        response = app.test_client().post(url, data=json.dumps(data2))
        expect = b'Test4.cod'
        self.assertEqual(expect, response.data)
        # print(values)
        # print(loads(response.text))

    def test_deleteOneDataset(self):
        print('test deleteOneDataset')
        url = "/delete-dataset"
        data = ['ex_ndy2.dat', '123456@qq.com']
        data2 = ['ex_ndy4.dat', '123456@qq.com']
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(200, response.status_code)
        expect = b'ex_ndy2.dat'
        self.assertEqual(expect, response.data)
        response = app.test_client().post(url, data=json.dumps(data2))
        expect = b'ex_ndy4.dat'
        self.assertEqual(expect, response.data)
        # print(values)
        # print(loads(response.text))


    def test_passwordChange(self):
        print('test passwordChange')
        url = "/passwordChange"
        data = {'username': '123456@qq.com', 'password': '123456789', 'confirmpassword': '12345678',
                'email': '', 'question': 'What is your mother name', 'answer': 'LXQ'}
        data2 = {'username': '123456@qq.com', 'password': '12345678', 'confirmpassword': '12345678',
                 'email': '', 'question': 'What is your mother name', 'answer': 'LX'}
        data3 = {'username': '1234@qq.com', 'password': '12345678', 'confirmpassword': '12345678',
                 'email': '', 'question': 'What is your mother name', 'answer': 'LXQ'}
        data4 = {'username': '123456@qq.com', 'password': '12345678', 'confirmpassword': '12345678',
                 'email': '', 'question': 'What is your mother name', 'answer': 'LXQ'}

        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(200, response.status_code)
        expect = b'change successfully'
        self.assertEqual(expect, response.data)
        response = app.test_client().post(url, data=json.dumps(data2))
        expect = b'Update Failed, the question or answer does not match'
        self.assertEqual(expect, response.data)
        response = app.test_client().post(url, data=json.dumps(data3))
        expect = b'UserName deos not exist'
        self.assertEqual(expect, response.data)
        response = app.test_client().post(url, data=json.dumps(data4))
        expect = b'change successfully'
        self.assertEqual(expect, response.data)


    def test_queryAllDatasets(self):
        print('test queryAllDatasets')
        url = "/query-all-datasets"
        data = "LmY_"
        data2 = "Badclass.da"
        data3 = "LMY&&GOOD"
        data4 = "LMY_GOOD||LMY_BAD"
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(200, response.status_code)
        expect = open('./Testing/result5.json', 'r')
        values = json.load(expect)
        self.assertEqual(values, loads(response.data))
        response = app.test_client().post(url, data=json.dumps(data2))
        expect2 = open('./Testing/result6.json', 'r')
        values2 = json.load(expect2)
        self.assertEqual(values2, loads(response.data))

        response = app.test_client().post(url, data=json.dumps(data3))
        expect3 = open('./Testing/result11.json', 'r')
        values3 = json.load(expect3)
        self.assertEqual(values3, loads(response.data))

        response = app.test_client().post(url, data=json.dumps(data4))
        expect4 = open('./Testing/result12.json', 'r')
        values4 = json.load(expect4)
        self.assertEqual(values4, loads(response.data))
        # print(values)
        # print(loads(response.text))



    def test_queryAllModels(self):
        print('test test_queryAllModels')
        url = "/query-all-models"
        data = "LmY_"
        data2 = "Badclass.co"
        data3 = "lmy&&bad"
        data4 = "LMY_GOOD||LMY_BAD"
        response = app.test_client().post(url, data=json.dumps(data))
        self.assertEqual(200, response.status_code)
        expect = open('./Testing/result7.json', 'r')
        values = json.load(expect)
        self.assertEqual(values, loads(response.data))
        response = app.test_client().post(url, data=json.dumps(data2))
        expect2 = open('./Testing/result8.json', 'r')
        values2 = json.load(expect2)
        self.assertEqual(values2, loads(response.data))

        response = app.test_client().post(url, data=json.dumps(data3))
        expect3 = open('./Testing/result9.json', 'r')
        values3 = json.load(expect3)
        self.assertEqual(values3, loads(response.data))

        response = app.test_client().post(url, data=json.dumps(data4))
        expect4 = open('./Testing/result13.json', 'r')
        values4 = json.load(expect4)
        self.assertEqual(values4, loads(response.data))

        # print(values)
        # print(loads(response.text))

    def test_connect_upload(self):
        print('test test_connect_upload')
        url = "/connect-upload"
        f1 = open('./Testing/input/ex.cod','rb')
        upload2 = FileStorage(f1, 'ex.cod', name='ex.cod', content_type='application/octet-stream')
        f2 = open('./Testing/input/ex_ndy5.dat','rb')
        upload3 = FileStorage(f2, 'ex_ndy5.dat', name='ex_ndy5.dat', content_type='application/octet-stream')
        f3 = open('./Testing/input/ex_ndy2.dat','rb')
        upload4 = FileStorage(f3, 'ex_ndy2.dat', name='ex_ndy2.dat', content_type='application/octet-stream')

        upload1 = FileStorage(f3,'123456@qq.com', name='123456@qq.com', content_type='application/octet-stream')
        input = ImmutableMultiDict([('username', upload1), ('model', upload2), ('file0',upload3)])
        response = app.test_client().post(url, data=input)
        self.assertEqual(['ex.cod', ['ex_ndy5.dat']], loads(response.data))
        url = "/delete-dataset"
        data = ['ex_ndy5.dat', '123456@qq.com']
        response = app.test_client().post(url, data=json.dumps(data))
        url = "/delete-model"
        data = ['ex.cod', '123456@qq.com']
        response = app.test_client().post(url, data=json.dumps(data))
    '''
    def test_upload(self):
        print('test test_upload')
        url = "/upload"
        f = open('./Testing/input/ex_ndy2.dat', 'rb')
        upload3 = FileStorage(f, 'ex_ndy2.dat', name='ex_ndy2.dat', content_type='application/octet-stream')
        upload1 = FileStorage(f, '123456@qq.com', name='123456@qq.com', content_type='application/octet-stream')
        input = ImmutableMultiDict([('username', upload1), ('file0', upload3)])
        # print(input)
        response = app.test_client().post(url, data=input)
        self.assertEqual(['ex_ndy5.dat'], loads(response.data))
        url = "/delete-dataset"
        data = ['ex_ndy5.dat', '123456@qq.com']
        response = app.test_client().post(url, data=json.dumps(data))

    '''
    def test_sendNewdatasetFiles(self):
        print('test test_upload')
        url = "/newDataset"
        data = '123456@qq.com'
        response = app.test_client().post(url, data=json.dumps(data))
        expect = open('./Json/dataNewJson.json', 'r')
        values = json.load(expect)
        values = dumps(values, indent=2)
        values = json.loads(values)
        for element in values:
            del element['_id']
        expect = loads(response.data)
        for element in expect:
            del element['_id']
        self.assertEqual(values, expect)


if __name__ == '__main__':
    unittest.main()