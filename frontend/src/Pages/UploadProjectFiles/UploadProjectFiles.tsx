import React, { Component, ReactNode, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import "./UploadProjectFiles.css"
import { connect } from "react-redux";

const UploadProjectFiles = ({user }) => {

    const [document, setDocumet] = useState('');
    const location = window.location.pathname.split("/");

    const fileSelectHandler = e => {
        setDocumet(e.target.files[0]);
    };
    

    const onSubmitAvatar = e => {
        e.preventDefault();
        postAvatar();
    }

    const postAvatar = () => {

        let data = new FormData();  

        data.append("document", document); 

        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/upload_project_files/`.replace(":id", location[2]), {
            method: 'POST',
            headers:{
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            mode: 'cors',
            body: data
        })
          .then(response => response.json())
          .then(responseJson => {
    
        //setIdProject(responseJson.pk);
          })
          .catch(error => {


          });
    }

   

    return (
        <div id="Widget">
            <form onSubmit={e => onSubmitAvatar(e)}>
                <h2>My account</h2> <br />
                <br />
                <label>Choose a profile picture:</label><br />
                <input type="file" id="document" name="document" accept=".zip" onChange={e => fileSelectHandler(e)}></input>
                <progress id="progressBar" value="0" max="100"></progress>
                <button className="btn btn-outline-secondary" type="submit">zmień awatar</button>
            </form>
        </div >
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})


export default connect(mapStateToProps)(UploadProjectFiles);