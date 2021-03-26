import React, { Component } from "react";

export default class Signin extends Component {
    render() {
        return(
            <div>
                <form>
                <div className="form-group">
                    <label htmlFor="username">username</label>
                    <input type="password" className="form-control" id="username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1"/>
                </div>
                <button type="submit" className="btn btn-primary">log in</button>
                </form>
            </div>
        );
    }
}