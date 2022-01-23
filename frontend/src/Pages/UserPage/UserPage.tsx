import React, { Component, ReactNode, useEffect, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import NavBar from "../../Component/NavBar/NavBar";
import "./UserPage.css"
import { connect } from "react-redux";

const UserPage = ({ }) => {

    const [profile, setProfile] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [error, setError] = useState(false);
    const location = window.location.pathname.split("/");

    useEffect(() => {
        getProfile();
    }, []);


    const getProfile = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/:id/`.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
          .then(response => response.json())
          .then(responseJson => {
            setProfile([responseJson]);
            setLoadingProfile(false);
          })
          .catch(error => {
            setLoadingProfile(false);
            setError(true);
          });
    }

    return (
        <div>
            { !loadingProfile && !error && profile.map(profile =>
            <div id="Widget">
            
            <div id="Profile-card">
                <h1><text>User Page</text></h1>
                <img id="User-avatar" src=""></img>
                <div id="Name-card">
                    <h2><text>{profile["User"]["name"]}</text></h2>
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
            { profile["isOwner"] == "True" && 
                <div id="Owner-exclusive">
                    <button type="button" className="btn">Edit profile</button>
                    <button type="button" className="btn">Become developer</button>
                    <button type="button" className="btn">Delete profile</button>
                </div>
            }
        </div>
            )
        }
       </div>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, {})(UserPage);