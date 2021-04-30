import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navbar, Nav, Jumbotron} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import PAGES from '../data/PAGES';

import { AuthContext } from '../contexts';

function HeaderBar() {
    const { authInfo } = useContext(AuthContext);
    const navItems = PAGES.map((item, index) =>
        <Nav.Link to={item.href}
            as={NavLink}
            style={{ color: 'white', textDecoration: 'none' }}
            key={index} >
            {item.label}
        </Nav.Link>
    );
    if (authInfo.authenticated) {
        return (
            <Navbar bg="primary">
                <Navbar.Collapse>
                    <Nav.Link to='/' as={NavLink}>
                        <FontAwesomeIcon icon="home" color="white" size="lg" />
                    </Nav.Link>
                    {navItems}
                </Navbar.Collapse>
                <span style={{ color: 'darkblue' }}>Welcome {authInfo.user} !</span>
            </Navbar>
        );
    } else {
        return (
            <Jumbotron style={{ backgroundColor: 'rgb(11, 97, 255)', color: 'white' }}>
                <h1>SAS Viya Demo Application</h1>
            </Jumbotron>
        );
    }
}

export default HeaderBar;