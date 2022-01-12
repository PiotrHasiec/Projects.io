import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './Pages/MainPage/MainPage';
import SearchProject from './Pages/SearchProject/SearchProject';
import App from './App';
import ProjectPage from './Pages/ProjectPage/ProjectPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import Layout from "./hocs/Layout/Layout"
import { Provider } from 'react-redux';
import store from './store';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import CreateProject from './Pages/CreateProject/CreateProject';
import UserPage from './Pages/UserPage/UserPage';
import UserPropertiesPage from './Pages/UserPropertiesPage/UserPropertiesPage';


const routing = (
  <div>
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/Projects" element={<SearchProject />} />
            <Route path="/Projects/:id" element={<ProjectPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/projects/create" element={<CreateProject />} />
            <Route path="/user/:id" element={<UserPage />} />
            <Route path="/user/:id/edit" element={<UserPropertiesPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  </div>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
