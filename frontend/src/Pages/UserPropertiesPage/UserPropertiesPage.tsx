import React, { Component, Fragment, ReactNode, useEffect, useState } from "react"
import { Route, Navigate } from 'react-router-dom';
import NavBar from "../../Component/NavBar/NavBar";
import "./UserPropertiesPage.css"
import { connect } from "react-redux";
import axios from "axios";

const UserPropertiesPage = ({user, isAuthenticated }) => {

    const [avatar, setAvatar] = useState('');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        
        name: '',
        description:''
    });

    useEffect(() => {
        if(user !== null){
            setFormData({ ...formData, name: user.name });
            setFormData({ ...formData, description: user.description });
        }
        
    }, [user]);
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

          return axios.request({
            method: 'POST',
            url: `${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/:id/upload_avatar/`.replace(":id", user.id),
            data: data,
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
        <div id="WidgetUser">
            {user && <Fragment>
            <form onSubmit={e => onSubmitAvatar(e)}>
                <h2>My account</h2> <br />
                <h5>Avatar</h5><img src={(user.avatar).replace("./frontend/public/", "../")}></img>
                <br />
                <label>Choose a profile picture:</label><br />
                <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={e => fileSelectHandler(e)}></input>
                <h3>{progress + " %"}</h3>
                {progress===100 && error &&<span style={{color: "red"}}>Upload not Success!</span>}
                {progress===100 && success &&<span style={{color: "green"}}>Upload Success!</span>}
                <button className="btn btn-danger" type="submit">change avatar</button>
            </form>
            <form onSubmit={e => onSubmitEditProfile(e)}>
                <h5>Username</h5><input type="text" className="form-control" placeholder="USERNAME" aria-label="Username" aria-describedby="basic-addon2" name="name" value={name} onChange={e => onChange(e)}></input>
                <br />
                <h5>Description</h5><textarea className="form-control" placeholder="Description" aria-label="Description" aria-describedby="basic-addon2" name="description" value={description} onChange={e => onChange(e)}></textarea>
                <button className="btn btn-danger" type="submit">change</button>
            </form>
            </Fragment>}
        </div >
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})


export default connect(mapStateToProps)(UserPropertiesPage);