import { useState } from "react";
import "./ProjectPropertiesPage.css"


const ProjectPropertiesPage = () => {


    const [formData, setFormData] = useState({
        title: '',
        description:'',
        stage: 'BS'
    });

    const {title, description, stage} = formData

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const location = window.location.pathname.split("/");


    const onSubmitEditProfile = e => {
        e.preventDefault();
        patchEditProject();
    }

    const patchEditProject = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/`.replace(":id", location[2]), {
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            mode: 'cors',
            body: JSON.stringify({ title, description, stage })
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
            
            <form onSubmit={e => onSubmitEditProfile(e)}>
                <h5>Name</h5><input type="text" className="form-control" placeholder="Title" aria-label="Title" aria-describedby="basic-addon2" name="title"  value={title} onChange={e => onChange(e)} ></input>
                <br />
                <h5>Description</h5><input type="text" className="form-control" placeholder="Description" aria-label="Description" aria-describedby="basic-addon2" name="description" value={description} onChange={e => onChange(e)}></input>
                <br />
                <h5>Project Stage</h5>
                <select name="stage" value={stage} onChange={e => onChange(e)}>
                    <option value="BS">Brain Storm</option>
                    <option value="EB">Early Birld</option>
                    <option value="PG">Play Ground</option>
                </select>
                <br />
                <button className="btn btn-outline-primary" type="submit">zmień</button>
            </form>
        </div >
    );
}

export default ProjectPropertiesPage;