import React from 'react';
import NavBar from './NavBar';
import { Route, Switch, Redirect, Link, withRouter } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <Switch>
                    <Route exact path="/" />
                </Switch>
            </div>
        )
    }
}
