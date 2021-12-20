import React from 'react';
import logo from './logo.svg';
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap';
import NavBar from './Component/NavBar/NavBar';
import MainPage from './Pages/MainPage';

function App() {
  return (
    <div>
      <NavBar></NavBar>
      <MainPage></MainPage>
    </div>
    
  );
}

export default App;
