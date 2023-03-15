import { Component, ReactNode, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../Component/NavBar/NavBar";
import CustomPopup from "../../Component/CustomPopup/CustomPopup";
import "./MainPage.css";
//import PropTypes from "prop-types";




const MainPage = () => {


  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectname: '',
    userName: ''
  });

  useEffect(() => {
    getObject();
  }, []);

  
  const getObject = () => {
      return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/?sort=-averageRate&down=0&up=3`, {
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


  const { projectname, userName } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div id="mainPage">
      <div id="SearchProject" className="card">
        <div className="card-body">
          <h2 className="card-title">Discover the projects!</h2>
          <p className="card-text">Whole world is waiting for you to search your project now</p>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Project name" aria-label="Project name" aria-describedby="basic-addon2" name="projectname" value={projectname} onChange={e => onChange(e)} />
            <div className="input-group-append">
              <Link to="/Projects" state={{ projectName: projectname }} >
                <button className="btn btn-outline-secondary" type="button">Search!</button>
              </Link>
            </div>
          </div>
        </div>
        <figure>
          <img src={"../global.png"} className="fa fa-globe" alt="globe image"></img>
        </figure>
      </div>
      <div id="SearchUser" className="card">
        <div className="card-body">
          <figure>
            <img src={"../hands.png"} alt="globe image"></img>
          </figure>
          <h2 className="card-title">Search for co-workers</h2>
          <p className="card-text">Search for people with similar skills and create new outstanding project!</p>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Nickname" aria-label="Project name" aria-describedby="basic-addon2" name="userName" value={userName} onChange={e => onChange(e)} />
            <div className="input-group-append">
              <Link to="/user" state={{ userName: userName }} >
                <button className="btn btn-outline-secondary" type="button">Search!</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {!error && !loading && projects.map(project =>
      <div className="card cardProject" onClick={e => navigate(("/projects/:id").replace(":id", project["pk"]))}>
        <div className="card-body">
          <figure>
            <img src={"../podium.png"} alt="globe image"></img>
          </figure>
          <h2 className="card-title">{project["title"]} <br></br> mark: {project["averageRate"]}</h2>
          <p className="card-text">{project["description"]}</p>
          <div className="input-group mb-3">
            <div>Manager: {project["Manager"]}</div>
          </div>
        </div>
      </div>
       )}
    </div >
  );
}


export default MainPage;