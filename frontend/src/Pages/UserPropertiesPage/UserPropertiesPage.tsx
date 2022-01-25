import React, { Component, ReactNode, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import NavBar from "../../Component/NavBar/NavBar";
import "./UserPropertiesPage.css"
import { connect } from "react-redux";

const UserPropertiesPage = ({user }) => {

    const [avatar, setAvatar] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description:''
    });

    const fileSelectHandler = e => {
        setAvatar(e.target.files[0]);
    };
    const {name, description} = formData
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    const onSubmitAvatar = e => {
        e.preventDefault();
        postAvatar();
    }

    const onSubmitEditProfile = e => {
        e.preventDefault();
        putEditProfile();
    }
    
    const postAvatar = () => {

        let data = new FormData();  

        data.append("avatar", avatar); 

        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/:id/upload_avatar/`.replace(":id", user.id), {
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

    const putEditProfile = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/:id/`.replace(":id", user.id), {
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            mode: 'cors',
            body: JSON.stringify({ name, description })
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
                <h5>Avatar</h5><img src="../../logo512.png"></img>
                <br />
                <label>Choose a profile picture:</label><br />
                <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={e => fileSelectHandler(e)}></input>
                <button className="btn btn-outline-secondary" type="submit">zmień awatar</button>
            </form>
            <form onSubmit={e => onSubmitEditProfile(e)}>
                <h5>Username</h5><input type="text" className="form-control" placeholder="USERNAME" aria-label="Username" aria-describedby="basic-addon2" name="name" value={name} onChange={e => onChange(e)}></input>
                <br />
                <h5>Description</h5><input type="text" className="form-control" placeholder="Description" aria-label="Description" aria-describedby="basic-addon2" name="description" value={description} onChange={e => onChange(e)}></input>
                <button className="btn btn-outline-primary" type="submit">zmień</button>
            </form>
        </div >
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})


export default connect(mapStateToProps)(UserPropertiesPage);