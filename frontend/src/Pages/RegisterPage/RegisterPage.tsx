import React, { Component, ReactNode } from "react"
import NavBar from "../../Component/NavBar/NavBar";
import "./RegisterPage.css"
import { useLocation } from "react-router-dom";
import { convertToObject } from "typescript";
import { Params } from 'react-router-dom';




class RegisterPage extends Component {




    state = {
        project: [],
        loading: true,
        error: false
    };

    componentWillMount() {
        this.getObject();
    }

    getObject() {
        const location = window.location.pathname.split("/");

        return fetch('http://127.0.0.1:8000/Projects/api/Projects/:id/?format=json'.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(responseJson => this.setState({
                project: [responseJson],
                loading: false
            }))
            .catch(error => this.setState({
                error: true,
                loading: false
            }));
    }


    render(): ReactNode {
        const { project, loading, error } = this.state;

        return (
            <div>
                <NavBar></NavBar>

                <div>
                    <div id="RegisterCard">
                        <h1>WELCOME</h1>
                        <h3>Please sign up</h3>
                        <div className="input-group mb-3">
                            <table>
                                <input type="text" className="form-control" placeholder="First name" aria-label="First name" aria-describedby="basic-addon2" />

                                <input type="text" className="form-control" placeholder="Last name" aria-label="Last name" aria-describedby="basic-addon2" />

                                <input type="text" className="form-control" placeholder="Login" aria-label="Login" aria-describedby="basic-addon2" />

                                <input type="text" className="form-control" placeholder="E-mail" aria-label="E-mail" aria-describedby="basic-addon2" />

                                <input type="text" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon2" />

                                <input type="text" className="form-control" placeholder="Confirm password" aria-label="Confirm password" aria-describedby="basic-addon2" />

                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button">Sign up</button>
                                </div>
                            </table>
                        </div>
                    </div>
                </div>


            </div >
        );
    }
}

export default RegisterPage;