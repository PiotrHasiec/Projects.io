import React, { Component, ReactNode, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import "./UploadProjectFiles.css"
import { connect } from "react-redux";
import axios from "axios";

const UploadProjectFiles = ({user }) => {

    const [document, setDocumet] = useState('');
    const location = window.location.pathname.split("/");
    const [progress, setProgress] = useState(0);
    const fileSelectHandler = e => {
        setDocumet(e.target.files[0]);
    };
    
    const loadBarHander = e => {

    }
    const onSubmitAvatar = e => {
        e.preventDefault();
        postAvatar();
    }

    const postAvatar = () => {

        let myData = new FormData();  

        myData.append("document", document); 
 
        return axios.request({
            method: 'POST',
            url: `${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/upload_project_files/`.replace(":id", location[2]),
            data: myData,
            headers:{
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            onUploadProgress: (p) => {
               setProgress(p.loaded / p.total * 100);
                //this.setState({
                    //fileprogress: p.loaded / p.total
                //})
        }})
          .then(response => {}
    
          )
          .catch(error => {


          });
    }

   

    return (
        <div id="Widget">
            <form onSubmit={e => onSubmitAvatar(e)}>
                <h2>My account</h2> <br />
                <br />
                <label>Choose a profile picture:</label><br />
                <input type="file" id="document" name="document" accept=".zip" onChange={e => fileSelectHandler(e)} onLoad={e => loadBarHander(e)}></input>
                <progress id="progressBar" value={progress} max="100"></progress>
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