import { Component, ReactNode, useState } from "react"
import { Link } from "react-router-dom";
import { Card } from "reactstrap";
import NavBar from "../../Component/NavBar/NavBar";

export interface Project{
    id: number,
    title: string,
    stage: string,
    description: string,
    folder: string,
    averageRate: string,
    idOwner: number
}

class SearchProject extends Component{
    
    state = {
        projects: [] ,
        loading: true,
        error: false
      }
    

    componentWillMount(){
        this.getObject();
    }
    
    getObject(){
        return fetch('http://127.0.0.1:8000/Projects/api/Projects/', {
            method: 'GET',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json'
            }
        })
          .then(response => response.json())
          .then(responseJson => this.setState ({
              projects: responseJson,
              loading: false
          }))
          .catch(error => this.setState ({
            error: true,
            loading: false
        }));
    }

    render(): ReactNode {
        const { projects, loading, error } = this.state;
        return(
            <div>
                <NavBar></NavBar>
                
                {loading && <div>Loading...</div>}
                {!loading && !error && projects.map(project => 
                <div className="card-body">
                    <h2 className="card-title">{project[0]["title"]}</h2>
                    <p className="card-text">Author: {project[1]}</p>
                    <Link to={"/Projects/"+project[0]["id"]} style={{ textDecoration: 'none' }}>
                        <button className="btn btn-outline-secondary" type="button">Show</button>
                    </Link>
                </div>)
                }
                {error && <div>Error message</div>}
            </div>
        )
    }
}


export default SearchProject;