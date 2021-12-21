import { Component, ReactNode } from "react"
import NavBar from "../Component/NavBar/NavBar";
import "./ProjectPage.css"

class ProjectPage extends Component {
    render(): ReactNode {
        return (
            <div>
                <NavBar></NavBar>
                <div id="Promos">
                    <div className="square-body">
                        <div id="Promos-text">
                            <h1><text>Project title</text></h1>
                        </div>
                        <div id="Promos-image">
                            <img src="../logo512.png"></img>
                        </div>

                        <div id="Promos-text">
                            <h1><text>Description</text></h1>
                            <h3><text>This is the description for this project.</text></h3>
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
                                    <td><text>ProjectTitle</text></td>
                                </tr>
                                <tr>
                                    <td> <text>Development state:</text></td>
                                    <td> <text>ProjectDevelopmentState</text></td>
                                </tr>
                                <tr>
                                    <td><text>Release date:</text></td>
                                    <td><text>ProjectReleaseDate</text></td>
                                </tr>
                                <tr>
                                    <td><text>Owner:</text></td>
                                    <td><text>ProjectOwner</text></td>
                                </tr>
                                <tr>
                                    <td> <text>Co-developers:</text></td>
                                    <td><text>ProjectCo-developers</text></td>
                                </tr>
                                <tr>
                                    <td><text>Tags:</text></td>
                                    <td><text>ProjectTags</text></td>
                                </tr>
                                <tr>
                                    <td><text>Rate:</text></td>
                                    <td><text>ProjectRate</text></td>
                                </tr>
                            </table>
                        </h4>
                    </div>
                </div >
            </div >
        );
    }
}

export default ProjectPage;