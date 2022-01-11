import React, { Component, ReactNode, useState, useEffect } from "react"
import NavBar from "../../Component/NavBar/NavBar";
import "./ProjectPage.css"
import { Navigate } from 'react-router-dom';
import { connect } from "react-redux";
import Popup from 'reactjs-popup';


const ProjectPage = ({isAuthenticated}) => {

    const [project, setProject] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [owner, setOwner] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        getObject();
        isOwner();
    }, []);

    const onClick = e =>{
        deleteObject();
    };

    const getObject = () => {
        const location = window.location.pathname.split("/");
        
        return fetch('http://127.0.0.1:8000/Projects/api/Projects/:id/?format=json'.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json',
            }
        })
          .then(response => response.json())
          .then(responseJson => {
            setProject([responseJson]);
            setLoading(false);
          })
          .catch(error => {
            setLoading(false);
            setError(true);
          });
    }

    const isOwner = () => {
        const location = window.location.pathname.split("/");
        return fetch('http://127.0.0.1:8000/Projects/api/Projects/:id/amOwner/?format=json'.replace(":id", location[2]), {
            method: 'POST',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
          .then(response => response.json())
          .then(responseJson => {
            setOwner(true);
            //setLoading(false);
          })
          .catch(error => {
            //setError(true);
          });
    }

    const deleteObject = () => {
        const location = window.location.pathname.split("/");
        return fetch('http://127.0.0.1:8000/Projects/api/Projects/:id/'.replace(":id", location[2]), {
            method: 'DELETE',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
          .then(response => {
              setIsDeleted(true);
          })
          .catch(error => {
            //setError(true);
          });
    }

    if(isDeleted){
        return <Navigate replace to="/" />
    }

    return (
        <div>
            {loading && <div>Loading...</div>}
            {!loading && !error && project.map(project =>
                <div>
                     <div id="Promos">
                <div className="square-body">
                    <div id="Promos-text">
                        <h1><text>{project["Project"]["title"]} {owner && <span>You are owner</span>}</text></h1>
                    </div>
                    <div id="Promos-image">
                        <img src="../logo512.png"></img>
                    </div>

                    <div id="Promos-text">
                        <h1><text>Description</text></h1>
                        <h3><text>{project["Project"]["description"]}</text></h3>
                    </div>
                </div>
            </div>

            <div id="Details">
                <div id="Details-text">
                    <h1><text>Details</text></h1>
                    <h4>
                        <table>
                            <tr>
                                <td><text>Title: </text></td>
                                <td><text>{project["Project"]["title"]}</text></td>
                            </tr>
                            <tr>
                                <td> <text>Development state:</text></td>
                                <td> <text>{project["Project"]["stage"]}</text></td>
                            </tr>
                            <tr>
                                <td><text>Owner:</text></td>
                                <td><text>{project["Meneger"]}</text></td>
                            </tr>
                            <tr>
                                <td><text>Rate:</text></td>
                                <td><text>{project["Project"]["averageRate"]}</text></td>
                            </tr>
                            { owner && isAuthenticated && 
                            <tr>
                                <td>
                                    <button className="btn btn-secondary" onClick={e => onClick(e)}>DELETE PROJECT </button>
                                </td>
                            </tr> 
                            }
                        </table>
                    </h4>
                </div>
            </div >
                </div>
            )}
            {error && <div>Error message</div>}
           
        </div >
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})

export default connect(mapStateToProps)(ProjectPage);


