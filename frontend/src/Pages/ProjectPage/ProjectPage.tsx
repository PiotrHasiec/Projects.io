import React, { Component, ReactNode, useState, useEffect } from "react"
import NavBar from "../../Component/NavBar/NavBar";
import "./ProjectPage.css"
import { Link, Navigate } from 'react-router-dom';
import { connect } from "react-redux";
import CustomPopup from "../../Component/CustomPopup/CustomPopup";
import { saveAs } from 'file-saver'
import Carousel from 'react-bootstrap/Carousel'

const ProjectPage = ({ isAuthenticated }) => {

    const [project, setProject] = useState([]);
    const [imgPaths, setImgPaths] = useState([]);
    const [advertisments, setAdvertisments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingAdv, setLoadingAdv] = useState(true);
    const [error, setError] = useState(false);
    const [owner, setOwner] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const location = window.location.pathname.split("/");
    useEffect(() => {
        getObject();
        getProjectImages();
        isOwner();
        getAdvertisments();
    }, []);

    const onClick = e => {
        deleteObject();
    };

    const getObject = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/?format=json`.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                setProject([responseJson]);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                setError(true);
            });
    }

    const getAdvertisments = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/getAdvertisments/`.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                setAdvertisments(responseJson);
                console.log(responseJson);
                setLoadingAdv(false);
            })
            .catch(error => {
                setLoadingAdv(false);
                //setError(true);
            });

    }

    const isOwner = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/amOwner/?format=json`.replace(":id", location[2]), {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson === "True")
                    setOwner(true);
                //setLoading(false);
            })
            .catch(error => {
                //setError(true);
            });
    }

    const onClickGetProjectFIles = (e) => {
        getProjectFiles();
    }
    const getProjectFiles = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/download/`.replace(":id", location[2]), {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
            .then(response => response.blob())
            .then(blob => saveAs(blob, project[0]["Project"]["title"]))
            .catch(error => {
                //setError(true);
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

    const deleteObject = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/download/`.replace(":id", location[2]), {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
            .then(response => {
                setIsDeleted(true);
            })
            .catch(error => {
                //setError(true);
            });
    }

    if (isDeleted) {
        return <Navigate replace to="/" />
    }


    return (
        <div>
            {loading && <div>Loading...</div>}
            {!loading && !error && project.map(project =>
                <div id="Page-area" >
                    <div id="Promos">

                        <div id="Promos-title">
                            <h1><text>{project["Project"]["title"]} {owner && <div id="Owner">You are the owner</div>}</text></h1>
                        </div>
                        <div id="Carousel">
                            <Carousel>
                                {imgPaths && imgPaths.map(imgPath =>
                                    <Carousel.Item>
                                        <img
                                            className="d-block w-100"
                                            src={imgPath.replace("./frontend/public/", "../").replace("presentation", "presentation/")}
                                            alt="First slide"
                                        />
                                    </Carousel.Item>
                                )}

                            </Carousel>
                        </div>

                        <div id="Promos-text">
                            <h1><text>Description</text></h1>
                            <h3><text>{project["Project"]["description"]}</text></h3>
                        </div>

                    </div>

                    <div id="Details">
                        <div id="Details-text">
                            <h1><text>Details</text></h1>
                            <h4>
                                <div id="row">
                                    <div id="row">
                                        <div id="c1"><text>Title: </text></div>
                                        <div id="c2"><text>{project["Project"]["title"]}</text></div>
                                    </div>
                                    <div id="row">
                                        <div id="c1"> <text>Development state:</text></div>
                                        <div id="c2"> <text>{project["Project"]["stage"]}</text></div>
                                    </div>
                                    <div id="row">
                                        <div id="c1"><text>Owner:</text></div>
                                        <div id="c2"><text>{project["Meneger"]}</text></div>
                                    </div>
                                    <div id="row">
                                        <div id="c1"><text>Rate:</text></div>
                                        <div id="c2"><text>{project["Project"]["averageRate"]}</text></div>
                                    </div>
                                    {owner && isAuthenticated &&
                                        <div id="row">
                                            <div id="c1">
                                                <button className="btn btn-secondary" onClick={e => onClick(e)}>DELETE PROJECT </button>
                                            </div>
                                        </div>
                                    }
                                    {isAuthenticated && owner &&
                                        <div id="row">
                                            <div id="c1">
                                                <Link to={"/projects/:id/advisements/create".replace(":id", location[2])}>
                                                    <button className="btn btn-primary" >Add advisement</button>
                                                </Link>
                                            </div>
                                            <div id="c2">
                                                <button className="btn btn-primary" onClick={e => onClickGetProjectFIles(e)}>Download</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </h4>
                        </div>
                    </div >
                    <div>
                        {!loadingAdv && advertisments.map(advertisment =>
                            <div id="Apl">
                                <h1>{advertisment["namePosition"]}</h1>
                                <p>{advertisment["description"]}</p>
                                {!owner && <Link to={"/projects/:id/aplication/create".replace(":id", advertisment["idAdvertisment"])}>
                                    <button className="btn btn-primary" >Add application</button>
                                </Link>}
                            </div>
                        )
                        }
                    </div>
                </div>
            )}
            {error && <div>Error message</div>}

        </div >
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})

export default connect(mapStateToProps)(ProjectPage);


