import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import "./ProjectPropertiesPage.css"


const ProjectPropertiesPage = () => {


    const [formData, setFormData] = useState({
        title: '',
        description:'',
        stage: 'BS',
        image: '',
    });
    const [imgPaths, setImgPaths] = useState([]);
    const {title, description, stage, image} = formData
    const [filesArray, setFilesArray] = useState([]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const location = window.location.pathname.split("/");

    const fileSelectHandler = e => {
        setFilesArray([...filesArray, e.target.files[0]]);
    };

    useEffect(() => {
        getProjectImages();
    }, []);

    const onSubmitEditProject = e => {
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
    const onSubmitEditImages = (e) => {
        e.preventDefault();
        postAvatar();
    }
    const postAvatar = () => {

        let data = new FormData();  
        filesArray.map(files =>
            data.append("document", files)    
            )
        

            return axios.request({
                method: 'POST',
                url: `${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/upload_project_presentation/`.replace(":id", location[2]),
                data: data,
                headers:{
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                },
                onUploadProgress: (p) => {
                  console.log(p);
                    //this.setState({
                        //fileprogress: p.loaded / p.total
                    //})
            }})
              .then(response => {}
        
              )
              .catch(error => {
    
    
              });
    }
    
    const getProjectImages = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/getImages/`.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',

            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }

        })
            .then(response => response.json())
            .then(responseJson => {
                setImgPaths(responseJson);
            })
            .catch(error => {
                //setError(true);
            });

    }
    const onSubmitDeleteImages = (e) => {
        getDeleteImages(e.target.value);
    }
    const getDeleteImages = (img: string) => {
        if(img === ""){
            img = imgPaths[0].replace("./frontend/public/FileBase/1/123124/presentation", "");
        }
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/delete_project_presentation/`.replace(":id", location[2]), {
            method: 'DELETE',
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            body: JSON.stringify({ "image" : img })
        })
            .then(response => {getProjectImages()})

            .catch(error => {
                //setError(true);
            });

    }
    
    return (
        <div id="Widget">
            
            <form onSubmit={e => onSubmitEditProject(e)}>
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
                <button className="btn btn-outline-primary" type="submit">Change</button>
            </form>
            <div>
                {
                    imgPaths && <div>
                        <select name="image" value={image} onChange={e => onChange(e)}>
                        {imgPaths.map(path => <option value={path.replace("./frontend/public/FileBase/1/123124/presentation", "")}>{path.replace("./frontend/public/FileBase/1/123124/presentation", "")}</option> )}
                        </select>
                        <button className="btn btn-outline-primary" value={image} type="button" onClick={e => onSubmitDeleteImages(e)}>Delete</button>
                    </div>
                }
            </div>
            <form onSubmit={e => onSubmitEditImages(e)}>
                <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={e => fileSelectHandler(e)}></input>
                <button className="btn btn-outline-primary" type="submit">Change</button>
            </form>
        </div >
    );
}

export default ProjectPropertiesPage;