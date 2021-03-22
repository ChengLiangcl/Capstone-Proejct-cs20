import React, { Component } from "react";

export default class Signup extends Component {
    state = {
        name:'',
        email: '',
        pwd:'',
        passwordconfirm:''


    };
    handleSubmit = e =>{
        e.preventDefault();
        console.log(this.state);

    }
    handleChange = e =>{
        this.setState({
            [e.target.name]: e.target.value
        });

    };
    render() {
        const { name,email,pwd,passwordconfirm} = this.state;
        return(
            <div>
                 <form onSubmit={this.handleSubmit}>
            
                <div className="form-group">
                    <label htmlFor="name">username</label>
                    <input type="text" className="form-control" id="name" name="name" defaultValue={name} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" defaultValue={email} onChange={this.handleChange}/>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="pwd">Password</label>
                    <input type="password" className="form-control" id="pwd" name="pwd" defaultValue={pwd} onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="passwordconfirm">Password Confirm</label>
                    <input type="password" className="form-control" id="passwordconfirm" name="passwordconfirm" defaultValue={passwordconfirm} onChange={this.handleChange}/>
                </div>
               
                <button type="submit" className="btn btn-primary">register</button>
                </form>
            </div>
        );
    }
}
