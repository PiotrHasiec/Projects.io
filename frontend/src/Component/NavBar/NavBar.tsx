import React, { Fragment, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../Actions/auth';
import { Nav } from 'reactstrap';

const NavBar = ({logout, isAuthenticated}) => {
    
    const [redirect, setRedirect] = useState(false);

    const logout_user = () => {
        logout();
        setRedirect(true);
    };

    const guestLinks = () => (
        <Fragment>
            <Link to="/login" style={{ textDecoration: 'none' }}>
                        <button type="button" className='btn'>Sign in</button>
            </Link>
            <button type="button" className='btn'>Sign up</button>
        </Fragment>
    );

    const authLinks = () => (
        <a className='nav-link' href='#!' style={{ textDecoration: 'none' }} onClick={logout_user}>
            <button type="button" className='btn'>Logout</button>
        </a>
    );


    return(
        <div>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="navbar" id="main">
                    <div id="title">
                        <span>Projects</span>  
                        <span>.io</span>
                    </div>
                    
                </div>
            </Link>
            {isAuthenticated ? authLinks() : guestLinks()}
        </div>
    )
        
        


}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {logout})(NavBar);