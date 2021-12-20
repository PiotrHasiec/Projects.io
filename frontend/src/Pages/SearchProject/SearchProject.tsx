import { Component, ReactNode } from "react"



class SearchProject extends Component{

    constructor(props: any) {
        super(props);
        this.state = {};
    }
    
    componentWillMount(){
        this.getObject();
    }
    
    getObject(){
        return fetch('http://127.0.0.1:8000/Projects/api/Projects/', {
            method: 'GET',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json'
            }
        })
          .then(response => response.json())
          .then(responseJson => {
              this.setState({responseJson : responseJson});
             return responseJson;
          })
          .catch(error => {
            console.error(error);
          });
    }

    render(): ReactNode {
        return(
            <div>
            </div>
        )
    }
}


export default SearchProject;