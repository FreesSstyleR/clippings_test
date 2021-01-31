import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const NavBar = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">Symfony React Project</Link>
        </nav>
    )
}

export default withRouter(NavBar);