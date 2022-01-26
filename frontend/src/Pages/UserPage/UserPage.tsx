import React, { Component, Fragment, ReactNode, useEffect, useState } from "react"
import { Route, Navigate, Link } from 'react-router-dom';
import NavBar from "../../Component/NavBar/NavBar";
import "./UserPage.css"
import { connect } from "react-redux";
import CustomPopup from "../../Component/CustomPopup/CustomPopup";
import { Rating } from 'react-simple-star-rating';

const UserPage = ({ isAuthenticated }) => {

    const [profile, setProfile] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [visibility, setVisibility] = useState(false);
    const [visibilitySkills, setVisibilitySkills] = useState(false);
    const [colab, setColab] = useState(false);
    const [rate, setRate] = useState(0);
    const [skillsFormData, setSkillsFormData] = useState([]);
    const [owner, setOwner] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        Cpp: false,
        CSharp: false,
        Python: false,
        SQL: false,
        Grapghic3D: false,
        Grapghic2DRaster: false,
        Grapghic2DVector: false,
        Assembler: false,
        Other: ''
    });
    const { password, Cpp, CSharp, Python, SQL, Grapghic3D, Grapghic2DRaster, Grapghic2DVector, Assembler, Other } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onCheck = e => setFormData({ ...formData, [e.target.name]: e.target.checked });

    const deleteProfile = e => {
        e.preventDefault();
        deleteProfileFun(password);
    }

    const location = window.location.pathname.split("/");

    useEffect(() => {
        getProfile();
        getSkillsForm();
        getProjects();
    }, []);

    useEffect(() => {
        if (isAuthenticated === true) {
            isCollaborator();
            getProfile();
        }

    }, [isAuthenticated]);

    const popupDeleteCloseHandler = (e) => {
        setVisibility(e);
    };

    const popupSkillsCloseHandler = (e) => {
        setVisibilitySkills(e);
    };
    const handleRating = (rate: number) => {
        setRate(rate)
    }

    const deleteProfileFun = (current_password) => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/auth/users/me/`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            body: JSON.stringify({ current_password })
        })
            .then(response => response.json())
            .then(responseJson => {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            })
            .catch(error => {

            });
    }

    const getProfile = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/:id/`.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': isAuthenticated ? `JWT ${localStorage.getItem('access')}` : ''
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                setProfile([responseJson]);
                setLoadingProfile(false);
                if (responseJson["isOwner"] == "True") {
                    setOwner(true)
                }
            })
            .catch(error => {
                setLoadingProfile(false);
                setError1(true);
            });
    }


    const getProjects = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/:id/getProjects/`.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                setProjects(responseJson);
                setLoadingProjects(false);
            })
            .catch(error => {
                setLoadingProjects(false);
                setError2(true);
            });
    }

    const isCollaborator = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/:id/amCollaborator/`.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson === "True") {
                    setColab(true);
                }
            })
            .catch(error => {

            });
    }


    const onClickRateProfile = (e) => {
        rateProfile();

    }
    const rateProfile = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/:id/mark/`.replace(":id", location[2]), {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            body: JSON.stringify({ rate: rate.toString() })
        })
            .then(response => response.json())
            .then(responseJson => {
                getProfile();
                //setLoading(false);
            })
            .catch(error => {
                //setError(true);
            });

    }





    const getSkillsForm = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/developer/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            mode: 'cors',
        })
            .then(response => response.json())
            .then(responseJson => {
                setSkillsFormData(Object.keys(responseJson));
            })
            .catch(error => {

            });
    }

    const onClickChangeSkills = (e) => {
        e.preventDefault();
        changeSkills();

    }
    const changeSkills = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Users/api/Users/developer/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            mode: 'cors',
            body: JSON.stringify({ Cpp, CSharp, Python, SQL, Grapghic3D, Grapghic2DVector, Grapghic2DRaster, Assembler, Other })
        })
            .then(response => response.json())
            .then(responseJson => {
            })
            .catch(error => {

            });
    }

    return (
        <div>
            {!loadingProfile && !error1 && profile.map(profile =>
                <div id="MainUserDiv" >
                    <div id="Profile-card">
                        <h1><span>{profile["User"]["name"]}</span>'s user page</h1>
                        <img id="User-avatar" src={profile["User"]["avatar"].replace("./frontend/public/", "../")}></img>
                        <div id="Name-card">
                            <b>{profile["User"]["description"]}</b>
                        </div>
                    </div>
                    <div id="Details-card">
                        <h1><text>Details</text></h1>
                        <h4>
                            <div id="row">
                                <div id="c1"><text>Averange rate:</text></div>
                                <div id="c2"><text>{profile["User"]["averageRate"]}</text></div>
                            </div>
                            <div >
                                <div id="row">
                                    <div id="c1"><text>Skills:</text></div></div>
                                <div className="row p-2 pl-3">

                                    {profile["Skills"]["Cpp"] ? <div>C++</div> : ""}
                                    {profile["Skills"]["CSharp"] ? <div>C#</div> : ""}
                                    {profile["Skills"]["Python"] ? <div>Python</div> : ""}
                                    {profile["Skills"]["SQL"] ? <div>SQL</div> : ""}
                                    {profile["Skills"]["Graphic3D"] ? <div>Graphic3D</div> : ""}
                                    {profile["Skills"]["Graphic2DRaster"] ? <div>Graphic2DRaster</div> : ""}
                                    {profile["Skills"]["Graphic2DVector"] ? <div>Graphic2DVector</div> : ""}
                                    {profile["Skills"]["Assembler"] ? <div>Assembler</div> : ""}
                                    {profile["Skills"]["Other"] ? <div>{profile["Skills"]["Other"]}</div> : ""}
                                </div>
                            </div>
                        </h4>
                        {colab && <Fragment>
                            <div id="row">
                                <Rating onClick={handleRating} ratingValue={rate} style={{ zIndex: 1 }}/* Available Props */ />
                            </div><div id="row">
                                <button className="btn btn-danger" onClick={e => onClickRateProfile(e)}>Rate</button>
                            </div></Fragment>}
                    </div>
                    {
                        profile["isOwner"] === "True" &&
                        <div id="Owner-exclusive">
                            <Link to="/user/edit" style={{ textDecoration: 'none' }}>
                                <button type="button" className="btn">Edit profile</button>
                            </Link>
                            <button type="button" className="btn" onClick={(e) => setVisibilitySkills(!visibilitySkills)}>{profile["User"]["is_developer"] ? "Edit Skills" : "Become Developer"}</button>

                            <button type="button" className="btn" onClick={(e) => setVisibility(!visibility)}>Delete profile</button>

                        </div>
                    }

                    <div id="Projects-card">
                        <h1>{owner ? <Fragment>My projects</Fragment> : <Fragment>Projects of {profile["User"]["name"]}</Fragment>}</h1>
                        {!loadingProjects && projects.map(project => <div>
                            <div className="card-body">
                                <div id="project-name">
                                    <h2 className="card-title">{project["Project"]["title"]}</h2>
                                    <p className="card-text">{project["Project"]["description"]}</p>
                                </div>
                                <div className="project-button">
                                    <Link to={"/Projects/" + project["Project"]["pk"]} style={{ textDecoration: 'none' }}>
                                        <button className="btn btn-outline-danger" type="button">Show</button>
                                    </Link>
                                </div>
                            </div>
                        </div>)}
                    </div>


                    <CustomPopup
                        onClose={popupSkillsCloseHandler}
                        show={visibilitySkills}
                        title={"Add Skills" + (profile["User"]["is_developer"] ? "" : " and become developer")}
                    ><div className="PopUpContener">
                            <form onSubmit={e => onClickChangeSkills(e)}>
                                {skillsFormData && skillsFormData.map(skill => <div>
                                    {skill}
                                    {(skill === "Other") ? <textarea name={skill} value={Other} onChange={e => onChange(e)} ></textarea> : <input type="checkbox" name={skill} onChange={e => onCheck(e)} />}
                                </div>)}

                                <button type="submit" className="btn">Add Skills</button>
                            </form>
                        </div>
                    </CustomPopup>
                    <CustomPopup
                        onClose={popupDeleteCloseHandler}
                        show={visibility}
                        title="Delete Profile"
                    ><div className="PopUpContener">
                            <h2>Enter your password to delete</h2>
                            <form onSubmit={e => deleteProfile(e)}>
                                <input type="password" name="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon2" value={password}
                                    onChange={e => onChange(e)} />
                                <button type="submit" className="btn">YES</button>
                            </form>
                        </div>
                    </CustomPopup>
                </div >
            )
            }
        </div >
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, {})(UserPage);