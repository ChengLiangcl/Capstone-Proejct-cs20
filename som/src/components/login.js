import React, {useEffect} from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import {Formik,Field,Form,ErrorMessage} from 'formik';
import * as Yup from 'yup'

import {
  login
} from '../redux/ActionCreators';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
const mapStateToProps = state => {
  return {
    user: state.user,
  }
}
const mapDispatchToProps = dispatch => ({
  login: (data) => { dispatch(login(data)) },
});
const Login=({handleChange,...props}) => {
    const paperStyle = {padding :20,height:'70vh',margin:"20px auto"}
    let myStyle={
        color:'#6495ED',
        fontSize:'48px',
        fontWeight:'bold',
        fontStyle:'italic'
    }
    let root= {
        '& .MuiTextField-root': {
          margin: '20ch',
          width: '25ch',
        }
      }
      let username={
        margin:'30px'
    }
    let button={
        margin:'30px',
        fontSize:'24px',
    }
const initialValues={
    username:'',
    password:''

}
const onSubmit=(values)=>{
    console.log(values)
  props.login(values)
}
useEffect(()=>{
  if (props.user.loginSuccess){
    props.history.replace('/')
  }
},[props.user.loginSuccess])
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
            <div style={myStyle}> SOM </div>
            <h3>Sign In</h3>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
                {(props)=>(
                    <Form>
                        <div>
                        <div style={username}>
                        <Field as={TextField} 
                            id="outlined-search" 
                            label="username" 
                            name="username"

                        
                            type="search" 
                            variant="outlined" />
                        </div>

                        <div>
                        <Field as={TextField}
                            id="outlined-password-input"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"/>
                        </div>

                        </div>
                      <div style={button}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Sign In
                      </Button>
                      </div>
                    </Form>
            )} 


            </Formik>

            <div style={button}>

            
            <Typography> don't have an account yet?
                <Link href="#" onClick={()=>handleChange("event",1)}>
                    Sign up
                </Link>
            </Typography>
            </div>

            </Paper>
            
          
        </Grid>

    )

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
