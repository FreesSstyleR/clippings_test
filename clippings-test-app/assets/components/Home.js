import React, { Component } from 'react';
import NavBar from './NavBar';
import { Route, Switch, Redirect, Link, withRouter } from 'react-router-dom';
import Form from './Form';

class Home extends Component {
    render() {
        return (
            <div>
                <Form />
            </div>
        )
    }
}

export default Home;
