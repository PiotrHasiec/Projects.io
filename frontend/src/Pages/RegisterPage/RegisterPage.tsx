import React, { useState } from "react"
import "./RegisterPage.css"
import { connect } from "react-redux";
import { signup } from "../../Actions/auth";
import { Link, Navigate } from "react-router-dom";




const RegisterPage = ({ signup, isAuthenticated }) => {

    const [accountCreated, setAccountCreated] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        re_password: ''
    });

    const { name, email, password, re_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        debugger;
        if (password === re_password) {
            signup(name, email, password, re_password)
        }
    };

    if (isAuthenticated) {
        return <Navigate to='/' />
    }
    if (accountCreated) {
        return <Navigate to='/login' />
    }
    
    return (
        <div>
            <div>
                <div id="RegisterCard">
                    <h1>WELCOME</h1>
                    <h3>Please sign up</h3>
                    <div className="input-group mb-3">
                        <form onSubmit={e => onSubmit(e)}>
                            <input type="text" className="form-control" placeholder="Name" aria-label="Name" aria-describedby="basic-addon2" name="name" value={name} onChange={e => onChange(e)}/>
                            <input type="email" className="form-control" placeholder="E-mail" aria-label="E-mail" name="email" value={email} onChange={e => onChange(e)} aria-describedby="basic-addon2" />
                            <input type="password" className="form-control" placeholder="Password" aria-label="Password" name="password" value={password} onChange={e => onChange(e)} aria-describedby="basic-addon2" />
                            <input type="password" className="form-control" placeholder="Confirm password" aria-label="Confirm password" name="re_password" value={re_password} onChange={e => onChange(e)} aria-describedby="basic-addon2" />
                            <button className="btn btn-outline-secondary" type="submit">Sign up</button>
                        </form>
                        <p className='m-auto'>
                            Already have an account? <Link to='/login'>Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>


        </div >
    );
 
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {signup})(RegisterPage);