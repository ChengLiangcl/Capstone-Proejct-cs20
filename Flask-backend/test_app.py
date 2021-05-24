import unittest
from app import app, db
from flask import request
import json
from flask.wrappers import Response

class TestClass(unittest.TestCase):
    #This step is setting up the mock clint envrioment, so you don't have to pass a URL address
    def setup_class(self):
        app.config['TESTING'] = True  
        self.app = app.test_client()

    def teardown_class(self):
        """Do the testing """
        pass
    #The reason why i called response.data, beacuse the route funciton in app.py will return the data
    # you can check the return data type in app.py file 
    def test_login_sucessfully(self):
        data = {'username': '123@gmail.com', 'password': '12345678'}
        response = app.test_client().post('/login', data=json.dumps(data))
        self.assertEqual(response.data, b'"123@gmail.com"')
    def test_login_falied(self):
        data = {'username': 'jaypark@gmail.com', 'password': 'jayparkhlermusic'}
        response = app.test_client().post('/login', data=json.dumps(data))
        self.assertEqual(response.data, b'Invalid login credentials')

    def test_signup_sucessfully(self):
        data = {'password': '12345678', 'confirmpassword': '12345678', 'email': 'parkJae-beom@gmail.com',
            'question': 'What is your mother name', 'answer': 'Testing'}
        response = app.test_client().post('/sign-up', data=json.dumps(data))
        self.assertEqual(response.data, b'Add Sucessfully')
    def test_signup_falied(self):
        data = {'password': '12345678', 'confirmpassword': '12345678', 'email': 'parkJae-beom@gmail.com',
            'question': 'What is your mother name', 'answer': 'Testing'}
        response = app.test_client().post('/sign-up', data=json.dumps(data))
        self.assertEqual(response.data, b'username already exist')
        db.user.delete_one({"UserName": 'parkJae-beom@gmail.com'})
