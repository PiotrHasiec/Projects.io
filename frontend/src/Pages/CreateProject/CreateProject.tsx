import React, { Component, ReactNode, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import "./CreateProject.css";
import { connect } from "react-redux";

const CreateProject = ({isAuthenticated, user}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [idProject, setIdProject] = useState("");
    const { title, description } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        postObject();
    }

    

    const postObject = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/`, {
            method: 'POST',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            body: JSON.stringify({ title, description })
        })
          .then(response => response.json())
          .then(responseJson => {
            setLoading(true);
            setIdProject(responseJson.pk);
          })
          .catch(error => {
            setLoading(false);
            setError(true);
          });
    }

    if(loading){
        if(idProject !== ""){
            return <Navigate replace to={"/Projects/"+idProject} />
        }
    }

    if (!isAuthenticated) {
        //return <Navigate replace to="/" /> TO DO nie wiem jak to naprawić
    }

    return (
        <div>
            <div>
                <div id="CreateCard">
                    <h1>Create Project</h1>
                    <div className="input-group mb-3">
                        <form onSubmit={e => onSubmit(e)}>
                        <input type="text" className="form-control" name="title" value={title} onChange={e => onChange(e)} placeholder="Title of the project" aria-label="Project name" aria-describedby="basic-addon2"/>
                        <textarea placeholder="Description" name="description" value={description} onChange={e => onChange(e)}></textarea>
                        
                        <button className="btn btn-outline-secondary" type="submit">Create</button>
                       
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})

export default connect(mapStateToProps)(CreateProject);