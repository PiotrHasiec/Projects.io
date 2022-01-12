import React, { Component, ReactNode, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import NavBar from "../../Component/NavBar/NavBar";
import "./UserPropertiesPage.css"
import { connect } from "react-redux";

const UserPropertiesPage = ({ }) => {
    return (
        <div id="Widget">

        </div>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, {})(UserPropertiesPage);