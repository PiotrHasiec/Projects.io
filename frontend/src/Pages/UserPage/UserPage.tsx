import React, { Component, ReactNode, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import NavBar from "../../Component/NavBar/NavBar";
import "./UserPage.css"
import { connect } from "react-redux";

const UserPage = ({ }) => {
    return (
        <div id="Widget">
            <div id="Profile-card">
                <h1><text>User Page</text></h1>
                <img id="User-avatar" src="../logo512.png"></img>
                <div id="Name-card">
                    <h2><text>USERNAME</text></h2>
                    <h3><text>EMAIL</text></h3>
                </div>
                <div id="About-field">
                    <h4><text>ABOUT</text></h4>
                    <div id="About-text">
                        <b><text>Text</text></b>
                    </div>
                </div>
            </div>

            <div id="Details-card">
                <h1><text>Details</text></h1>
                <h4>
                    <table>
                        <tr>
                            <td><text>Averange rate:</text></td>
                            <td><text></text></td>
                        </tr>
                        <tr>
                            <td> <text>Took part in:</text></td>
                            <td> <text></text></td>
                        </tr>
                        <tr>
                            <td><text>Skills:</text></td>
                            <td><text></text></td>
                        </tr>
                    </table>
                </h4>
            </div>

            <div id="Owner-exclusive">
                <button type="button" className="btn">Edit profile</button>
                <button type="button" className="btn">Become developer</button>
                <button type="button" className="btn">Delete profile</button>
            </div>

        </div>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, {})(UserPage);