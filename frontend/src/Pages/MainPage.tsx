import { Component, ReactNode } from "react"
import NavBar from "../Component/NavBar/NavBar";
import "./MainPage.css"

class MainPage extends Component
{
  render(): ReactNode {
    return(
      <div>
      <NavBar></NavBar>
      <div id="Search" className="card">
        <div className="card-body">
          <h2 className="card-title">Discover the projects!</h2>
          <p className="card-text">Whole world is waiting for you to search your project now</p>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Project name" aria-label="Project name" aria-describedby="basic-addon2"/>
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button">Search!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}


export default MainPage;