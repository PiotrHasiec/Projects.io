import React, { useEffect } from 'react';
import Navbar from '../../Component/NavBar/NavBar';
import { connect } from 'react-redux';
import { checkAuthenticated, load_user, logout } from '../../Actions/auth';
import NavBar from '../../Component/NavBar/NavBar';

const Layout = ({ checkAuthenticated, load_user, children }) => {
    useEffect(() => {
        checkAuthenticated();
        load_user();
    }, []);

    return (
        <div>
            <NavBar></NavBar>
            {children}
        </div>
    );
};

export default connect(null, { checkAuthenticated, load_user })(Layout);