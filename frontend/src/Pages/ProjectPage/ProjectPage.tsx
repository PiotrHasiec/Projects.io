import React, { Component, ReactNode, useState, useEffect, Fragment } from "react"
import "./ProjectPage.css"
import { Link, Navigate } from 'react-router-dom';
import { connect } from "react-redux";
import CustomPopup from "../../Component/CustomPopup/CustomPopup";
import { saveAs } from 'file-saver';
import Carousel from 'react-bootstrap/Carousel';
import { Rating } from 'react-simple-star-rating';


const ProjectPage = ({ isAuthenticated }) => {

  const [project, setProject] = useState([]);
  const [imgPaths, setImgPaths] = useState([]);
  const [advertisments, setAdvertisments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdv, setLoadingAdv] = useState(true);
  const [error, setError] = useState(false);
  const [collaborator, setCollaborator] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [owner, setOwner] = useState(false);

  const [idAdv, setidAdv] = useState('');

  const [isDeleted, setIsDeleted] = useState(false);
  const [rate, setRate] = useState(0);
  const [advertismentId, setAdvertismentId] = useState('');
  const location = window.location.pathname.split("/");
  useEffect(() => {
    getObject();
    getCollaborators();
    getProjectImages();
  }, []);

  useEffect(() => {
    if (isAuthenticated === true) {
      getProjectImages();
      isOwner();
      getAdvertisments();
    }

  }, [isAuthenticated]);

  const onClickDelete = e => {
    deleteObject();
  };

  const handleRating = (rate: number) => {
    setRate(rate)
  }

  const [visibilityAdvertisment, setVisibilityAdvertisment] = useState(false);
  const [visibilityAplication, setVisibilityAplication] = useState(false);
  const [visibilityDelete, setVisibilityDelete] = useState(false);
  const [visibilityDeleteAdv, setVisibilityDeleteAdv] = useState(false);


  const popupDeleteCloseHandlerAdvertisment = (e) => {
    setVisibilityAdvertisment(e);
  };
  const popupDeleteCloseHandlerAplication = (e) => {
    setVisibilityAplication(e);
  };
  const popupDeleteCloseHandlerDelete = (e) => {
    setVisibilityDelete(e);
  };
  const popupDeleteCloseHandlerDeleteAdv = (e) => {
    setVisibilityDeleteAdv(e);
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
      headers: {
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
      headers: {
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

  const getCollaborators = () => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Collaborators/api/Collaborators/?project=:id`.replace(":id", location[2]), {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(responseJson => {
          setCollaborators(responseJson);
      })
      .catch(error => {
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
        else if (responseJson === "Collaborator")
          setCollaborator(true);
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
      .then(blob => saveAs(blob, project[0]["Project"]["title"]+".zip"))
      .catch(error => {
        //setError(true);
      });
  }



  const onClickRateProject = (e) => {
    rateProject();

  }
  const rateProject = () => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/mark/`.replace(":id", location[2]), {
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
        getObject();
        //setLoading(false);
      })
      .catch(error => {
        //setError(true);
      });

  }

  const onClickAcceptApplication = (e) => {
    acceptApplication2(e.target.value);
  }

  const acceptApplication2 = (id: string) => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Applications/api/Applications/:id/changeState/`.replace(":id", id), {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`
      },
      body: JSON.stringify({ "acceptionState": "A" })
    })
      .then(response => { })

      .catch(error => {
        //setError(true);
      });

  }



  const getProjectImages = () => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/getImages/`.replace(":id", location[2]), {
      method: 'GET',
      mode: 'cors',

      headers: {
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
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Projects/api/Projects/:id/`.replace(":id", location[2]), {
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

  const onClickDelAdv = (e) => {
    deleteAdv();
    setVisibilityDeleteAdv(!visibilityDeleteAdv);
  }
  const deleteAdv = () => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Advertisements/api/Advertisment/:id/`.replace(":id", idAdv ), {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`
      }
    })
      .then(response => {
        getAdvertisments();
      })
      .catch(error => {
        //setError(true);
      });
  }



  const onClickDeleteApplication = (e) => {
    deleteAplication(e.target.value);
  }
  const deleteAplication = (id: string) => {
    return fetch(`${process.env.REACT_APP_REMOTE_URL}/Advertisements/api/Advertisment/:id/createApplication/`.replace(":id", id), {
      method: 'DELETE',
      mode: 'cors',
      headers: {
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


  if (isDeleted) {
    return <Navigate replace to="/" />
  }


  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading && !error && project.map(project =>
        <div id="MainProjectDiv">
          <div id="Promos" className="detailsBox">

            <div id="Promos-title">
              <h1><span>{project["Project"]["title"]}</span> </h1>
              <div id="functionalButton">
                <button className="btn btn-danger" aria-label="Left Align" type="button" title="Share" onClick={e => navigator.clipboard.writeText(window.location.href)}>
                  <i className="fa fa-share"></i>
                </button>
              <a href="https://patronite.pl/" target="_blank">
              <button className="btn btn-danger" aria-label="Left Align" type="button" title="Donate">
                  <i className="fa fa-money"></i>
                </button>
              </a>
              {isAuthenticated && (owner || collaborator) && <Fragment>
                <button className="btn btn-danger" aria-label="Left Align" type="button" title="Download" onClick={e => onClickGetProjectFIles(e)}>
                  <i className="fa fa-download"></i>
                </button>
                <Link to={"/projects/:id/upload".replace(":id", location[2])} style={{ textDecoration: "none" }}>
                  <button className="btn btn-danger" aria-label="Left Align" type="button" title="Upload">
                    <i className="fa fa-upload"></i>
                  </button>
                </Link>
                <Link to={"/projects/:id/edit".replace(":id", location[2])} style={{ textDecoration: "none" }}>
                  <button className="btn btn-danger" aria-label="Left Align" type="button" title="Edit">
                    <i className="fa fa-edit"></i>
                  </button>
                </Link>
                
                </Fragment>
              }
              </div>
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
              <h1>Description</h1>
              <h3>{project["Project"]["description"]}</h3>
            </div>

          </div>


          <div id="Details" className="detailsBox">
            <div id="Details-text">
              <h1>Details</h1>
              <h4>
                <div id="row">
                  <div id="c1">Title: </div>
                  <div id="c2">{project["Project"]["title"]}</div>
                </div>
                <div id="row">
                  <div id="c1">Owner:</div>
                  <div id="c2">{project["Project"]["Manager"]}</div>
                </div>
                <div id="row">
                  <div id="c1"> Development state:</div>
                  <div id="c2"> {project["Project"]["stage"]}</div>
                </div>
                <div id="row">
                  <div id="c1">Rate:</div>
                  <div id="c2">{project["Project"]["averageRate"]}</div>
                </div>
              </h4>
              {isAuthenticated && owner &&
                <div>
                  <button className="btn btn-primary" onClick={(e) => setVisibilityAdvertisment(!visibilityAdvertisment)}>Add advisement</button>
                  <button className="btn btn-danger" onClick={(e) => setVisibilityDelete(!visibilityDelete)}>Delete</button>
                </div>
              }
              { isAuthenticated && <Fragment>
              <Rating onClick={handleRating} ratingValue={rate} style={{ zIndex: 1 }}/* Available Props */ />
              <button className="btn btn-primary" onClick={e => onClickRateProject(e)}>Rate</button></Fragment>}
              <div id="colabsDIv">
                  <h4>Creators: </h4>
                  <div id="colabs">
                  <Link to={"/user/"+project["Project"]["ManagerId"]}>
                  <figure>
                    <img title={project["Project"]["Manager"]} src={project["Project"]["Avatar"].replace("./frontend/public/", "../")}></img>
                  </figure>
                  </Link>
                  { collaborators && collaborators.map(colab => <Link to={"/user/"+colab["idUser"]}>
                  <figure>
                    <img title={colab["userName"]} src={colab["Avatar"].replace("./frontend/public/", "../")}></img>
                  </figure>
                  </Link>)}</div>
              </div>
            </div>
          </div >
          <div className="detailsBox" id="adventaizmentPage">
            {!loadingAdv && advertisments.map(advertisment =>
              <div id="Apl">
                <h1>{advertisment["namePosition"]}
                <button className="btn btn-danger" aria-label="Left Align" type="button" title="Delete" onClick={(e) => {setVisibilityDeleteAdv(!visibilityDeleteAdv); setidAdv(advertisment["idAdvertisment"]);}}>
                  <i className="fa fa-times"></i>
                </button>
                </h1>
                <p>{advertisment["description"]}</p>
                <div>
                  {!owner && advertisment["Aplications"].length === 0 &&
                    <button className="btn btn-primary" onClick={(e) => setIdApicationAndShowPopup(advertisment["idAdvertisment"])}>Add application</button>
                  }
                  {!owner && advertisment["Aplications"].length !== 0 &&
                    <div>
                      <h2>Your aplications:</h2>
                      {advertisment["Aplications"].length === 0 &&
                      <Link to={"/projects/:id/aplication/create".replace(":id", advertisment["idAdvertisment"])}>
                        <button className="btn btn-primary" >Add application</button>
                      </Link>}
                    </div>}
                  {advertisment["Aplications"].map(aplication =>
                    <div className="d-flex flex-row m-auto" id="aplication">
                      <h4 className="m-2">{aplication["description"]} </h4>
                      {owner &&
                        <Link to={"/user/:id".replace(":id", aplication["idUser"])}>
                          <h4>by {aplication["userName"]}</h4>
                        </Link>}
                      {owner && <button className="btn btn-outline-secondary" type="button" name="aplication" value={aplication["id"]} onClick={e => onClickAcceptApplication(e)}>Accept</button>}
                      {!owner && <div className="d-flex flex-row">
                        <button className="btn btn-primary" onClick={(e) => setIdApicationAndShowPopup(advertisment["idAdvertisment"])}>Edit</button>
                        <button className="btn btn-danger" name="aplication" value={advertisment["idAdvertisment"]} onClick={e => onClickDeleteApplication(e)}>Delete</button>
                      </div>
                      }
                    </div>)}
                </div>
              </div>
            )
            }
          </div>
          <CustomPopup
            onClose={popupDeleteCloseHandlerAplication}
            show={visibilityAplication}
            title="Aplication"
          >
            <div className="PopUpContener">
              <div className="input-group mb-3">
                <form onSubmit={e => onSubmitAplication(e)}>
                  <textarea placeholder="Why you want to join?" name="description" value={description} onChange={e => onChange(e)}></textarea>
                  <button className="btn btn-outline-secondary" type="submit">Add</button>
                </form>
              </div>
            </div>
          </CustomPopup>
          <CustomPopup
            onClose={popupDeleteCloseHandlerAdvertisment}
            show={visibilityAdvertisment}
            title="Add advertisment"
          >
            <div className="PopUpContener">
              <div className="input-group mb-3">
                <form onSubmit={e => onSubmitAdvisement(e)}>
                  <input type="text" className="form-control" name="position" value={position} onChange={e => onChange(e)} placeholder="Position" aria-label="Project name" aria-describedby="basic-addon2" />
                  <textarea placeholder="description" name="description" value={description} onChange={e => onChange(e)}></textarea>

                  <button className="btn btn-outline-secondary" type="submit">Add</button>

                </form>
              </div>
            </div>
          </CustomPopup>
          <CustomPopup
            onClose={popupDeleteCloseHandlerDelete}
            show={visibilityDelete}
            title="Are you sure you want delete?"
          >
            <button className="btn btn-danger" type="submit" onClick={(e) => onClickDelete(e)}>Delete</button>
          </CustomPopup>
          <CustomPopup
            onClose={popupDeleteCloseHandlerDeleteAdv}
            show={visibilityDeleteAdv}
            title="Are you sure you want delete?"
          >
            <button className="btn btn-danger" type="submit" onClick={(e) => onClickDelAdv(e)}>Delete</button>
          </CustomPopup>
        </div>

      )}
    </div>
  );
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
})

export default connect(mapStateToProps)(ProjectPage);


