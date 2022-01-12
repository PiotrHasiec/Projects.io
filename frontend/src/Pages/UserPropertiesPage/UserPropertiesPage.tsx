import React, { Component, ReactNode, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import NavBar from "../../Component/NavBar/NavBar";
import "./UserPropertiesPage.css"
import { connect } from "react-redux";

const UserPropertiesPage = ({ }) => {
    return (
        <div id="Widget">
            <form>
                <h2>My account</h2> <br />
                <h5>Avatar</h5><img src="../../logo512.png"></img>
                <br />
                <label>Choose a profile picture:</label><br />
                <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg"></input>
                <br /><br />
                <h5>Username</h5><input type="text" className="form-control" placeholder="USERNAME" aria-label="Username" aria-describedby="basic-addon2" name="Username" ></input>
                <br />
                <h5>Skills</h5><input type="text" className="form-control" placeholder="Skills" aria-label="Skills" aria-describedby="basic-addon2" name="Skills"></input>
                <br />
                <h5>Description</h5><input type="text" className="form-control" placeholder="Description" aria-label="Description" aria-describedby="basic-addon2" name="Description"></input>
            </form>
        </div >
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, {})(UserPropertiesPage);