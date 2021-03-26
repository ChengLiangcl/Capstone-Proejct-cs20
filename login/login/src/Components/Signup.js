import React from 'react'
import { Grid, Paper,Avatar,Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import {Formik,Field,Form,ErrorMessage} from 'formik';
import * as Yup from 'yup'

const Signup=()=>{
    const paperStyle = {padding :20,height:'90vh',width:300,margin:"20px auto"}
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

const onSubmit=(values,props)=>{
    console.log(values)
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
                                <ErrorMessage name="name"/>
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
                                <ErrorMessage name="password"/>
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
                                <ErrorMessage name="confirmpassword"/>
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
                                <ErrorMessage name="email"/>
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








            

            </Paper>


       
    )
}

export default Signup;