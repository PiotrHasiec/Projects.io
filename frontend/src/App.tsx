import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap';
import NavBar from './Component/NavBar';

function App() {
  return (
    <div>
      <NavBar></NavBar>
      <Card>
      <CardHeader>
        Witam
      </CardHeader>
      <CardBody>
        body
      </CardBody>
      <CardFooter>
        Hel
      </CardFooter>
    </Card>
    </div>
    
  );
}

export default App;
