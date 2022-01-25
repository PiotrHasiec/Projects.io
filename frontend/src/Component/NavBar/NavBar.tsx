import React, { Fragment, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../Actions/auth';
import { Dropdown } from 'react-bootstrap';
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
                        <button type="button" className='btn mybotton'>Sign in</button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
                <button type="button" className='btn mybotton' id="singup">Sign up</button>
            </Link>
        </div>
    );

    const userBar = () => (
        <Fragment>
            <span id="message">Welcome {user.name}</span>
            
        </Fragment>
        
    )

    const authLinks = () => ( 
        <div id="dropDownDiv">
            <Dropdown>
                <Dropdown.Toggle variant="danger" id="dropdown-basic">
                    { (user !== null) ? userBar() : null }
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>{(user !== null) ? <Link to={"/user/:id".replace(":id", user.id) } style={{ textDecoration: 'none', color: "#D51A46"  }}>My profile</Link>: "" }</Dropdown.Item>
                    <Dropdown.Item><Link to="/projects/create" style={{ textDecoration: 'none', color: "#D51A46" }}>Create project</Link></Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout_user}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
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