import React, {useState} from 'react'
import { Grid, Paper,Avatar,Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import {Formik,Field,Form,ErrorMessage} from 'formik';
import * as Yup from 'yup'


import {
  signUp, updateUser
} from '../redux/ActionCreators';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
const mapDispatchToProps = dispatch => ({
  signUp: (data,cb) => { dispatch(signUp(data,cb)) },
});
const Signup=(props)=>{
    const paperStyle = {padding :20,height:'90vh',margin:"20px auto"}
    let myStyle={
        color:'#6495ED',
        fontSize:'48px',
        fontWeight:'bold',
        fontStyle:'italic'
    }
    let username={
        margin:'10px'
    }
    let password={
        margin:'10px'
    }
    let confirmpassword={
        margin:'10px'
    }
    let button={
        margin:'20px',
        fontSize:'24px',
    }
const initialValues={
    name:'',
    password:'',
    confirmpassword:'',
    email:'',
   
}
const validationSchema=Yup.object().shape({
    name:Yup.string().required("*Required!"),
    email:Yup.string().email("Enter vaild email!").required("*Required!"),
    password:Yup.string().min(8,"The password length should be at least 8 digits ").required("*Required!"),
    confirmpassword:Yup.string().oneOf([Yup.ref('password')],"Password not matched").required("*Required!")
   
})

  const [isModalOpen, setModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handlenNoBtn = () => {
    setModal(!isModalOpen);
  };


  const onSubmit=(values)=>{
    console.log(values)
  props.signUp(values,res=>{
    setModal(true)
    console.log(res);
    setModalContent(res.toString())
  })
}
    return(
        
            <Paper elevation={10} style={paperStyle}>
            <Grid >
            <div style={myStyle}> SOM </div>
            <h3>Sign Up</h3>
            <Typography variant='caption'>Please register your own account</Typography>
            </Grid>
            
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {(props)=>(
                    <Form>
                        <div style={username}>
                        <Field as={TextField}
                            id="outlined-search" 
                            name="name"
                            label="username" 
                            type="search" 
                            placeholder="Enter your name"
                            helperText={
                                <ErrorMessage name="name">
                                  { msg => <div style={{ color: 'red' }}>{msg}</div> }
                                </ErrorMessage>
                            }
                            variant="outlined" />
                        </div>
                        <div style={password}>
                        <Field as={TextField}
                            id="outlined-password-input"
                            name="password"
                            label="password"
                            type="password"
                            autoComplete="current-password"
                            helperText={
                                <ErrorMessage name="password">
                                  { msg => <div style={{ color: 'red' }}>{msg}</div> }
                                </ErrorMessage>
                            }
                            variant="outlined"/>
                        </div>
                        <div style={confirmpassword}>
                        <Field as={TextField}
                            id="outlined-confirmpassword-input"
                            name="confirmpassword"
                            label="confirm password"
                            type="password"
                            autoComplete="current-password"
                            helperText={
                                <ErrorMessage name="confirmpassword">
                                  { msg => <div style={{ color: 'red' }}>{msg}</div> }
                                </ErrorMessage>
                            }
                            variant="outlined"/>
                        </div>
                        <Field as={TextField}
                            id="outlined-email-input"
                            name="email"
                            label="email"
                            type="search"
                            autoComplete="current-password"
                            helperText={
                                <ErrorMessage name="email">
                                  { msg => <div style={{ color: 'red' }}>{msg}</div> }
                                </ErrorMessage>
                            }
                            variant="outlined"/>

                        <div style={button}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                        Sign Up
                        </Button>
                        </div> 
    
                    </Form>
                )}




            </Formik>
              <Modal isOpen={isModalOpen} centered={true}>
                <ModalBody>
                  <p>{modalContent}</p>
                  <Row>
                    <Col>
                      <Button onClick={handlenNoBtn}>Ok</Button>
                    </Col>
                  </Row>
                </ModalBody>
              </Modal>
            </Paper>


       
    )
}
export default withRouter(connect(null, mapDispatchToProps)(Signup));
