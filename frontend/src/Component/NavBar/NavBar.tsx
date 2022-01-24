import React, { Fragment, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../Actions/auth';
import './NavBar.css'

const NavBar = ({logout, isAuthenticated, user}) => {
    
    const [redirect, setRedirect] = useState(false);

    const logout_user = () => {
        logout();
        setRedirect(true);
    };

    const guestLinks = () => (
        <div>
            <Link to="/login" style={{ textDecoration: 'none' }}>
                        <button type="button" className='btn'>Sign in</button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
                <button type="button" className='btn' id="singup">Sign up</button>
            </Link>
        </div>
    );

    const userBar = () => (
        <Fragment>
            <span id="message">Welcome {user.name}</span>
            <Link to={"/user/:id".replace(":id", user.id) } style={{ textDecoration: 'none' }}>
                <button type="button" className='btn' >my profile</button>
            </Link>
        </Fragment>
        
    )

    const authLinks = () => ( 
        <div>
            { (user !== null) ? userBar() : null }
            
 
            <Link to="/projects/create" style={{ textDecoration: 'none' }}>
                <button type="button" className='btn' >create project</button>
            </Link>
            <button type="button" className='btn' onClick={logout_user}>Logout</button>
        </div>
    );


    return(
        <div className="navbar" id="main">
            <Link to="/" style={{ textDecoration: 'none', marginRight: 'auto' }}>
                <div id="title">
                    <span>Projects</span>  
                    <span>.io</span>
                </div>
            </Link>
            {isAuthenticated ? authLinks() : guestLinks()}
        </div>
    )
        
        


}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps, {logout})(NavBar);