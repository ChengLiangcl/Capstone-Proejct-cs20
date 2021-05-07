import React, {useEffect, useState} from 'react';
import {Grid, Paper, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {questions} from '../others/constants'

import {
  passwordChange
} from '../redux/ActionCreators';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = dispatch => ({
  passwordChange: (data) => {
    dispatch(passwordChange(data))
  },
});

const ForgetPassword = ({handleChange, ...props}) => {
  const paperStyle = {width: 340,textAlign:'center', padding: 20, height: '70vh auto', margin: "10vh auto 0"}
  let myStyle = {
    color: '#6495ED',
    fontSize: '48px',
    fontWeight: 'bold',
    fontStyle: 'italic'
  }

  let username = {
    margin: '30px'
  }
  let button = {
    margin: '30px',
    fontSize: '24px',
  }
  const initialValues = {
    username: '',
    password: '',
    confirmpassword: '',
    email: '',
    question: questions[0],
    answer: '',
  }
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("*Required!"),
    password: Yup.string().min(8, "The password length should be at least 8 digits ").required("*Required!"),
    confirmpassword: Yup.string().oneOf([Yup.ref('password')], "Password not matched").required("*Required!"),
    question: Yup.string().required("*Required!"),
    answer: Yup.string().required("*Required!"),
  })
  const onSubmit = (values) => {
    console.log(values);
    props.passwordChange(values,(res)=>{
      console.log(res);
    });
  }

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <div style={myStyle}> SOM</div>
        <h3>找回密码</h3>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {(props) => (
            <Form>
              <div>
                <div style={username}>
                  <Field as={TextField}
                         id="outlined-search"
                         label="username"
                         name="username"
                         type="search"
                         helperText={
                           <ErrorMessage name="username"/>
                         }
                         variant="outlined"/>
                </div>

                <div>
                  <Field as={TextField}
                         id="outlined-password-input"
                         label="Password"
                         name="password"
                         type="password"
                         autoComplete="current-password"
                         helperText={
                           <ErrorMessage name="password"/>
                         }
                         variant="outlined"/>
                </div>
                <div style={username}>
                  <Field as={TextField}
                         id="outlined-confirmpassword-input"
                         name="confirmpassword"
                         label="confirm password"
                         type="password"
                         autoComplete="current-password"
                         helperText={
                           <ErrorMessage name="confirmpassword">
                             {msg => <div style={{color: 'red'}}>{msg}</div>}
                           </ErrorMessage>
                         }
                         variant="outlined"/>
                </div>

                <div style={username}>
                  <Field as={(props)=><Select style={{width:195}} {...props}>
                    {questions.map(item=> <MenuItem value={item}>{item}</MenuItem>)}
                  </Select>}
                         name="question"
                         label="question"
                         helperText={
                           <ErrorMessage name="question">
                             {msg => <div style={{color: 'red'}}>{msg}</div>}
                           </ErrorMessage>
                         }
                         variant="outlined"/>
                </div>
                <div style={username}>
                  <Field as={TextField}
                         id="outlined-answer-input"
                         name="answer"
                         label="answer"
                         helperText={
                           <ErrorMessage name="answer">
                             {msg => <div style={{color: 'red'}}>{msg}</div>}
                           </ErrorMessage>
                         }
                         variant="outlined"/>
                </div>
              </div>
              <div style={button}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </div>
            </Form>
          )}


        </Formik>
      </Paper>
    </Grid>
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgetPassword));
