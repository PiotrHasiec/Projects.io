import React, { Component, ReactNode } from "react"
import NavBar from "../../Component/NavBar/NavBar";
import "./ProjectPage.css"
import { useLocation } from "react-router-dom";
import { convertToObject } from "typescript";
import { Params } from 'react-router-dom';
import { url } from "inspector";




class ProjectPage extends Component {

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
                {loading && <div>Loading...</div>}
                {!loading && !error && project.map(project =>
                    <div>
                        <div id="Promos">
                            <div className="square-body">
                                <div id="Promos-text">
                                    <h1><text>{project["Project"]["title"]}</text></h1>
                                </div>
                                <div id="Promos-image">
                                    <img src="../logo512.png"></img>
                                </div>

                                <div id="Promos-text">
                                    <h1><text>Description</text></h1>
                                    <h3><text>{project["Project"]["description"]}</text></h3>
                                </div>
                            </div>
                        </div>

                        <div id="Details">
                            <div id="Details-text">
                                <h1><text>Details</text></h1>
                                <h4>
                                    <table>
                                        <tr>
                                            <td><text>Title:</text></td>
                                            <td><text>{project["Project"]["title"]}</text></td>
                                        </tr>
                                        <tr>
                                            <td> <text>Development state:</text></td>
                                            <td> <text>{project["Project"]["stage"]}</text></td>
                                        </tr>
                                        <tr>
                                            <td><text>Owner:</text></td>
                                            <td><text>{project["Meneger"]}</text></td>
                                        </tr>
                                        <tr>
                                            <td><text>Rate:</text></td>
                                            <td><text>{project["Project"]["averageRate"]}</text></td>
                                        </tr>

                                    </table>
                                </h4>
                            </div>
                        </div >
                    </div>
                )}
                {error && <div>Error message</div>}

            </div >
        );
    }
}

export default ProjectPage;