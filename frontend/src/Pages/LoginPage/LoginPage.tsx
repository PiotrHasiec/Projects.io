import React, { Component, ReactNode, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import NavBar from "../../Component/NavBar/NavBar";
import "./LoginPage.css";
import { connect } from "react-redux";
import { login } from "../../Actions/auth";

const LoginPage = ({login, isAuthenticated, errors}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        login(email, password);
        console.log(errors);
    }

    if (isAuthenticated) {
        return <Navigate to="/" />
    }

    const showErrors = () => {
        console.log(errors);
    }

    return (
        <div>
            <div>
                <div id="LoginCard">
                    <h1>WELCOME</h1>
                    <h3>Please sign in</h3>
                    <div className="input-group mb-3">
                        <form onSubmit={e => onSubmit(e)}>
                        <input type="text" className="form-control" name="email" pattern="\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b" title="Email must be in standard email format" placeholder="Email" aria-label="Project name" aria-describedby="basic-addon2" value={email}
                        onChange={e => onChange(e)}/>
                        <input type="password" name="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon2"  value={password}
                        onChange={e => onChange(e)}/>
                        {   errors && 
                        <div id="errormessage">{errors["detail"]}</div> }
                        <button className="btn btn-outline-secondary" type="submit">Sign in</button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.auth.errors
})

export default connect(mapStateToProps, { login })(LoginPage);