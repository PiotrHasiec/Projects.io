import React, { Component, ReactNode, useState } from "react"
import NavBar from "../../Component/NavBar/NavBar";
import "./LoginPage.css";
import { connect } from "react-redux";
import { FC } from "react";
import {login} from "../../Actions/auth";

const LoginPage:FC = () => {
    const [formmData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formmData;

    const onChange = e => setFormData({ ...formmData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        login(email, password);
    }

    return (
        <div>
            <NavBar></NavBar>
            <div>
                <div id="LoginCard">
                    <h1>WELCOME</h1>
                    <h3>Please sign in</h3>
                    <div className="input-group mb-3">
                        <form onSubmit={e => onSubmit(e)}>
                            <input type="text" name="email" className="form-control" placeholder="Login" aria-label="Login" aria-describedby="basic-addon2" value={email} required/>

                            <input type="password" name="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon2" value={password} required/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="submit">Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(LoginPage);