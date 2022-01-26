import React, { Component, ReactNode, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import "./UploadProjectFiles.css"
import { connect } from "react-redux";
import axios from "axios";

const UploadProjectFiles = ({user }) => {

    const [document, setDocumet] = useState('');
    const location = window.location.pathname.split("/");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const [message, setMessage] = useState([]);
    const fileSelectHandler = e => {
        setDocumet(e.target.files[0]);
        setProgress(0);
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
               setProgress(Math.round(p.loaded / p.total * 100));
                //this.setState({
                    //fileprogress: p.loaded / p.total
                //})
        }})
          .then(response => {setSuccess(true);}
                
          )
          .catch(error => {
            setError(true);

          });
    }

   

    return (
        <div id="WidgetUpload">
            <form onSubmit={e => onSubmitAvatar(e)}>
                <h2>Change a project Files</h2> <br />
                <label>Choose a zip file:</label><br />
                <input type="file" id="document" name="document" accept=".zip" onChange={e => fileSelectHandler(e)} onLoad={e => loadBarHander(e)}></input>
                <h3>{progress + " %"}</h3>
                {progress===100 && error &&<span style={{color: "red"}}>Upload not Success!</span>}
                {progress===100 && success &&<span style={{color: "green"}}>Upload Success!</span>}
                <button className="btn btn-danger" type="submit">upload</button>
            </form>
        </div >
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})


export default connect(mapStateToProps)(UploadProjectFiles);