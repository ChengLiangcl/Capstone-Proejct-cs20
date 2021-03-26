import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import {Formik,Field,Form,ErrorMessage} from 'formik';
import * as Yup from 'yup'


const Login=({handleChange}) => {
    const paperStyle = {padding :20,height:'70vh',width:300,margin:"20px auto"}
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
const onSubmit=(values,props)=>{
    console.log(values)
}
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
            <div style={myStyle}> SOM </div>
            <h3>Sign In</h3>
            <form className={root} noValidate autoComplete="off">
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
                    </Form>
            )} 


            </Formik>

            </form>
            <div style={button}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
               Sign In
            </Button>
            
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

export default Login;