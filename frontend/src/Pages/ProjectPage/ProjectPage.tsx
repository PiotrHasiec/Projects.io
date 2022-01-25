import React, { Component, ReactNode, useState, useEffect } from "react"
import "./ProjectPage.css"
import { Link, Navigate } from 'react-router-dom';
import { connect } from "react-redux";
import CustomPopup from "../../Component/CustomPopup/CustomPopup";
import { saveAs } from 'file-saver';
import Carousel from 'react-bootstrap/Carousel';
import { Rating } from 'react-simple-star-rating';

const ProjectPage = ({isAuthenticated}) => {

  const [project, setProject] = useState([]);
  const [imgPaths, setImgPaths] = useState([]);
  const [advertisments, setAdvertisments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdv, setLoadingAdv] = useState(true);
  const [error, setError] = useState(false);
  const [owner, setOwner] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [rate, setRate] = useState(0);
  const [advertismentId, setAdvertismentId] = useState('');
  const location = window.location.pathname.split("/");
  useEffect(() => {
      getObject();
      getProjectImages();
      getCollaborators();
  }, []);

  useEffect(() => {
    if(isAuthenticated === true){
      isOwner();
      getAdvertisments();
    }

  }, [isAuthenticated]);

  const onClick = e =>{
      deleteObject();
  };

  const handleRating = (rate: number) => {
    setRate(rate)
  }

  const [visibilityAdvertisment, setVisibilityAdvertisment] = useState(false);
  const [visibilityAplication, setVisibilityAplication] = useState(false);

  const popupDeleteCloseHandlerAdvertisment = (e) => {
    setVisibilityAdvertisment(e);
  };
  const popupDeleteCloseHandlerAplication = (e) => {
    setVisibilityAplication(e);
  };


  //Advertisment
  const [formData, setFormData] = useState({
    position: '',
    description: '',
  });
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const { position, description } = formData;

  const onSubmitAdvisement = e => {
    e.preventDefault();
    postAdvisement();
  }

  const setIdApicationAndShowPopup = (e) => {
    setVisibilityAplication(true);
    setAdvertismentId(e);
  }

  const onSubmitAplication = e => {
    e.preventDefault();
    postAplication();
  }

  const postAdvisement = () => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/createAdvertisment/`.replace(":id", location[2]), {
      method: 'POST',
      mode: 'cors',
      headers:{
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: JSON.stringify({ position, description })
    })
      .then(response => response.json())
      .then(responseJson => {
        setVisibilityAdvertisment(false);
        getAdvertisments();
      })
      .catch(error => {

      });
  }

  const postAplication = () => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Advertisements/api/Advertisment/:id/createApplication/`.replace(":id", advertismentId), {
        method: 'POST',
        mode: 'cors',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({ description })
    })
      .then(response => {
        setVisibilityAplication(false);
        getAdvertisments();
      })
      
      .catch(error => {

      });
  }

  const getObject = () => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/?format=json`.replace(":id", location[2]), {
      method: 'GET',
      mode: 'cors',
      headers:{
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

  const getCollaborators = () => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Collaborators/api/Collaborators/?project=:id`.replace(":id", location[2]), {
      method: 'GET',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(responseJson => {

    })
    .catch(error => {
    });
  }

    const getAdvertisments = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/getAdvertisments/`.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',
            headers:{
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
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
          .then(response => response.json())
          .then(responseJson => {
            if(responseJson === "True")
                setOwner(true);
            //setLoading(false);
          })
          .catch(error => {
            //setError(true);
          });
    }

    const onClickGetProjectFIles = (e) =>{
        getProjectFiles();
    } 
    const getProjectFiles = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/download/`.replace(":id", location[2]), {
            method: 'POST',
            mode: 'cors',
            headers:{
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
          .then(response => response.blob())
          .then(blob => saveAs(blob, project[0]["Project"]["title"]))
          .catch(error => {
            //setError(true);
          });

    }


    const onClickRateProject = (e) =>{
        rateProject();
        
    } 
    const rateProject = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/mark/`.replace(":id", location[2]), {
            method: 'POST',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            body: JSON.stringify({rate: rate.toString()})
        })
            .then(response => response.json())
            .then(responseJson => {
              getObject();
            //setLoading(false);
            })
            .catch(error => {
            //setError(true);
            });

    }

  const onClickAcceptApplication = (e) =>{
    acceptApplication2(e.target.value);
  } 
  
  const acceptApplication2 = (id: string) => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Applications/api/Applications/:id/changeState/`.replace(":id", id), {
      method: 'POST',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: JSON.stringify({"acceptionState": "A"})
    })
      .then(response => {})
      
      .catch(error => {
      //setError(true);
      });

  }

    
    const getProjectImages = () => {
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/getImages/`.replace(":id", location[2]), {
            method: 'GET',
            mode: 'cors',
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
        return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/`.replace(":id", location[2]), {
            method: 'DELETE',
            mode: 'cors',
            headers:{
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


    const onClickDeleteApplication = (e) =>{
      deleteAplication(e.target.value);
    } 
    const deleteAplication = (id: string) => {
      return fetch(`${process.env.REACT_APP_REMOTE_URL}/Advertisements/api/Advertisment/:id/createApplication/`.replace(":id", id), {
          method: 'DELETE',
          mode: 'cors',
          headers:{
              'Content-Type': 'application/json',
              'Authorization': `JWT ${localStorage.getItem('access')}`
          }
      })
        .then(response => {
        })
        .catch(error => {
          //setError(true);
        });
  }

    if(isDeleted){
        return <Navigate replace to="/" />
    }


    return (
        <div>
            {loading && <div>Loading...</div>}
            {!loading && !error && project.map(project =>
                <div>
                     <div id="Promos">
                <div className="square-body">
                    <div id="Promos-text">
                        <h1><text>{project["Project"]["title"]} {owner && <span>You are owner</span>}</text></h1>
                    </div>
                    <div>
                        <Carousel>
                            { imgPaths && imgPaths.map(imgPath => 
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
            </div>

            <div id="Details">
                <div id="Details-text">
                    <h1><text>Details</text></h1>
                    <h4>
                        <table>
                            <tr>
                                <td><text>Title: </text></td>
                                <td><text>{project["Project"]["title"]}</text></td>
                            </tr>
                            <tr>
                                <td> <text>Development state:</text></td>
                                <td> <text>{project["Project"]["stage"]}</text></td>
                            </tr>
                            <tr>
                                <td><text>Owner:</text></td>
                                <td><text>{project["Project"]["Manager"]}</text></td>
                            </tr>
                            <tr>
                                <td><text>Rate:</text></td>
                                <td><text>{project["Project"]["averageRate"]}</text></td>
                            </tr>
                            { owner && isAuthenticated && 
                            <tr>
                                <td>
                                    <button className="btn btn-secondary" onClick={e => onClick(e)}>DELETE PROJECT </button>
                                </td>
                            </tr> 
                            }
                             { isAuthenticated && owner &&
                            <tr>
                                <td>
                                    <button className="btn btn-primary" onClick={(e) => setVisibilityAdvertisment(!visibilityAdvertisment)}>Add advisement</button>
                                    <CustomPopup
                                      onClose={popupDeleteCloseHandlerAdvertisment}
                                      show={visibilityAdvertisment}
                                      title="Add advertisment"
                                      >
                                        <div className="input-group mb-3">
                                          <form onSubmit={e => onSubmitAdvisement(e)}>
                                          <input type="text" className="form-control" name="position" value={position} onChange={e => onChange(e)} placeholder="Position" aria-label="Project name" aria-describedby="basic-addon2"/>
                                          <textarea placeholder="description" name="description" value={description} onChange={e => onChange(e)}></textarea>
                                          
                                          <button className="btn btn-outline-secondary" type="submit">Add</button>
                                      
                                          </form>
                                        </div>
                                    </CustomPopup>
                                    <button className="btn btn-primary"  onClick={e => onClickGetProjectFIles(e)}>Download</button>
                                    <br></br>
                                </td>
                            </tr> 
                            }
                            <tr>
                                <td>
                                    <Rating onClick={handleRating} ratingValue={rate} style={{ zIndex: 1}}/* Available Props */ />
                                    <button className="btn btn-primary"  onClick={e => onClickRateProject(e)}>Rate</button>
                                </td>
                            </tr> 
                        </table>
                    </h4>
                </div>
            </div >
            <div>
                { !loadingAdv &&  advertisments.map(advertisment => 
                    <div>
                        <h1>{advertisment["namePosition"]}</h1>
                        <p>{advertisment["description"]}</p>
                        { !owner && advertisment["Aplications"].length === 0 && 
                                        <button className="btn btn-primary" onClick={(e) => setIdApicationAndShowPopup(advertisment["idAdvertisment"])}>Add application</button>
                                    } 
                        { !owner && advertisment["Aplications"].length !== 0 && <h2>Your aplications:</h2>}
                        {  advertisment["Aplications"].map(aplication => 
                          <div>
                            <h3>{aplication["description"]}</h3>
                            { owner && 
                            <Link to={"/user/:id".replace(":id", aplication["idUser"])}>
                              {aplication["userName"]}
                            </Link> }
                            { owner && <button className="btn btn-outline-secondary" type="button" name="aplication" value={aplication["id"]} onClick={e => onClickAcceptApplication(e)}>Accept</button> }
                            { !owner && <div>
                                        <button className="btn btn-primary" onClick={(e) => setIdApicationAndShowPopup(advertisment["idAdvertisment"])}>Edit</button>
                                    <button className="btn btn-danger" name="aplication" value={advertisment["idAdvertisment"]} onClick={e => onClickDeleteApplication(e)}>Delete</button>
                                    </div>
                                    } 
                          </div>)}
                          <CustomPopup
                              onClose={popupDeleteCloseHandlerAplication}
                              show={visibilityAplication}
                              title="Aplication"
                              >
                            <div className="input-group mb-3">
                              <form onSubmit={e => onSubmitAplication(e)}>
                              <textarea placeholder="description" name="description" value={description} onChange={e => onChange(e)}></textarea>
                              
                              <button className="btn btn-outline-secondary" type="submit">Add</button>
                            
                              </form>
                            </div>
                          </CustomPopup>                       
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


