import React, { Component } from 'react';
import "./NavBar.css"
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';


class NavBar extends Component{
    render(){
        return(
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="navbar" id="main">
                    <div id="title">
                        <span>Projects</span>  
                        <span>.io</span>
                    </div>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <button type="button" className='btn'>Sign in</button>
                    </Link>
                    <button type="button" className='btn'>Sign up</button>
                </div>
            </Link>
        );
    }
}

export default NavBar;