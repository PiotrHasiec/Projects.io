import { Component, ReactNode, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import "./SearchUser.css";

interface locationState {
    userName: string
}

const SearchUser = () => {


    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [down, setDown] = useState(0);
    const [up, setUp] = useState(2);
    const location = useLocation();
    

    const [formData, setFormData] = useState({
        nickname: '',
        direction: 'name'
    });
    const { nickname, direction } = formData;
    const [resolveState, setResolveState] = useState(false);
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        if(resolveState)
            getObject();
    },[formData]) 

    useEffect(() => {
        if(location.state as locationState !== null){
            const { userName } = location.state as locationState;
            setFormData({...formData, nickname: userName});
        } 
        setResolveState(true);
    }, []);

    useEffect(() => {
        getObject();
    }, [down, up])

    const changeRightState = (e) => {
        setDown(down + 2);
        setUp(up + 2);
    }

    const changeLeftState = (e) => {
        setDown(down - 2);
        setUp(up - 2);
    }
    const getObject = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/?namecontain=${nickname}&sort=${direction}&up=${up}&down=${down}`, {
            method: 'GET',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(responseJson => {
            setUsers(responseJson);
            setLoading(false);
        })
        .catch(error => {
            setLoading(false);
            setError(true);
        });
    }


    return (
        <div id="SearchCardUser">
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="User nickname" aria-label="Project name" aria-describedby="basic-addon2" name="nickname" value={nickname} onChange={e => onChange(e)}/>
            <div className="input-group-append">
              <button className="btn btn-outline-dark" aria-label="Left Align" type="button" name="direction" value="title" onClick={e => onChange(e)}><i className="fa fa-angle-down angle-up"></i></button>
              <button className="btn btn-outline-dark" aria-label="Left Align" type="button" name="direction" value="-title" onClick={e => onChange(e)}><i className="fa fa-angle-up"></i></button>
            </div>
          </div>
          {loading && <div>Loading...</div>}
          {!loading && !error && users.map(user => 
          <div className="card-body">
              <figure id="avatar">
                <img src={user["avatar"].replace("./frontend/public/", "../")}></img>
              </figure>
              <div id="project-name">
                <h2 className="card-title">{user["name"]}</h2>
                <p className="card-text"></p>
              </div>
              <div className="project-button">
                <Link to={"/user/"+user["id"]} style={{ textDecoration: 'none' }}>
                    <button className="btn btn-outline-danger" type="button">Show</button>
                </Link>
            </div>
          </div>
          )
          }
        <div id="arrows">
            {  !loading && !error && down !== 0 && <div id="left-div">
                    <button className="btn btn-outline-dark" id="left" aria-label="Left Align" onClick={e => changeLeftState(e)}type="button" title="Next" >
                        <i className="fa fa-arrow-left"></i>
                    </button> 
                </div>
            }
            {  !loading && !error && users.length === 2 && 
                <div id="right-div">
                <button className="btn btn-outline-dark" id="right" aria-label="Left Align" onClick={e => changeRightState(e)}type="button" title="Next" >
                        <i className="fa fa-arrow-right"></i>
                    </button> 
                </div>
            }
            
        </div>
         
          {error && <div>Error message</div>}
      </div>
    );
}

export default SearchUser;