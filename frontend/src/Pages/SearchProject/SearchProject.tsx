import { Component, ReactNode, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { Card } from "reactstrap";
import { useLocation } from 'react-router-dom'
import "./SearchProject.css";

interface locationState {
  projectName: string
}

const SearchProject = () =>{
    
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const location = useLocation();
  const { projectName } = location.state as locationState;

  const [formData, setFormData] = useState({
    titlecontain: projectName
  });
  const { titlecontain } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/?titlecontain=${e.target.value}`, {
      method: 'GET',
      mode: 'cors',
      headers:{
          'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(responseJson => {
      setProjects(responseJson);
      setLoading(false);
    })
    .catch(error => {
      setLoading(false);
      setError(true);
    });
  }


  useEffect(() => {
    getObject();
  }, []);

  
  const getObject = () => {
      return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/?titlecontain=${titlecontain}`, {
          method: 'GET',
          mode: 'cors',
          headers:{
              'Content-Type': 'application/json',
          }
      })
      .then(response => response.json())
      .then(responseJson => {
        setProjects(responseJson);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        setError(true);
      });
  }

  
  return(
      <div id="SearchCard">
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Project name" aria-label="Project name" aria-describedby="basic-addon2" name="titlecontain" value={titlecontain} onChange={e => onChange(e)}/>
            <div className="input-group-append">
              <button className="btn btn-outline-dark" aria-label="Left Align" type="button"><i className="fa fa-angle-down angle-up"></i></button>
              <button className="btn btn-outline-dark" aria-label="Left Align" type="button"><i className="fa fa-angle-up"></i></button>
            </div>
          </div>
          {loading && <div>Loading...</div>}
          {!loading && !error && projects.map(project => 
          <div className="card-body">
              <h2 className="card-title">{project["Project"]["title"]}</h2>
              <p className="card-text">Author: {project["Meneger"]}</p>
              <Link to={"/Projects/"+project["Project"]["pk"]} style={{ textDecoration: 'none' }}>
                  <button className="btn btn-outline-secondary" type="button">Show</button>
              </Link>
          </div>)
          }
          {error && <div>Error message</div>}
      </div>
  )
}


export default SearchProject;