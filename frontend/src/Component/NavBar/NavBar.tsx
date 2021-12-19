import React, { Component } from 'react';
import "./NavBar.css"
import { Button } from 'reactstrap';


class NavBar extends Component{
    render(){
        return(
            <div className="navbar" id="main">
                <div id="title">
                    <span>Projects</span>  
                    <span>.io</span>
                </div>
            </div>
        )
    }
}

export default NavBar