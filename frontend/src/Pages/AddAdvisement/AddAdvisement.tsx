import React, { Component, ReactNode, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import { connect } from "react-redux";

const AddAdvisement = ({isAuthenticated, user}) => {
    const [formData, setFormData] = useState({
        position: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [idProject, setIdProject] = useState("");
    const { position, description } = formData;
    const location = window.location.pathname.split("/");

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        postObject();
    }

    

    const postObject = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/createAdvertisment/`.replace(":id", location[2]), {
            method: 'POST',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            body: JSON.stringify({ position, description })
        })
          .then(response => response.json())
          .then(responseJson => {
            setLoading(true);
        //setIdProject(responseJson.pk);
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
                <div id="LoginCard">
                    <h1>Add Advisement</h1>
                    <h3></h3>
                    <div className="input-group mb-3">
                        <form onSubmit={e => onSubmit(e)}>
                        <input type="text" className="form-control" name="position" value={position} onChange={e => onChange(e)} placeholder="Position" aria-label="Project name" aria-describedby="basic-addon2"/>
                        <textarea placeholder="description" name="description" value={description} onChange={e => onChange(e)}></textarea>
                        
                        <button className="btn btn-outline-secondary" type="submit">Add</button>
                       
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

export default connect(mapStateToProps)(AddAdvisement);