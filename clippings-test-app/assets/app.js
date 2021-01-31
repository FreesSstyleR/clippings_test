import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import NavBar from './components/NavBar';


class App extends Component {
    render() {
        return (
            <div className="container">
                <Router>
                    <NavBar />
                    <Switch>
                        <Route exact path="/" component={Home} />
                    </Switch>
                </Router>
            </div >
        )
    }
}

ReactDom.render(<App />, document.getElementById('root'));
