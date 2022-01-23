import { Component, ReactNode, useState } from "react"
import { Link } from "react-router-dom";
import NavBar from "../../Component/NavBar/NavBar";
import CustomPopup from "../../Component/CustomPopup/CustomPopup";
import "./MainPage.css";
//import PropTypes from "prop-types";


const MainPage = () =>
{

    return(
      <div>
      <div id="Search" className="card">
        <div className="card-body">
          <h2 className="card-title">Discover the projects!</h2>
          <p className="card-text">Whole world is waiting for you to search your project now</p>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Project name" aria-label="Project name" aria-describedby="basic-addon2"/>
            <div className="input-group-append">
            <Link to="/Projects">
              <button className="btn btn-outline-secondary" type="button">Search!</button>
              </Link>
            </div>
          </div>
        </div>
        <figure>
            <img src={"../global.png"} className="fa fa-globe" alt="globe image"></img>
        </figure>
      </div>
    </div>
    );
}


export default MainPage;