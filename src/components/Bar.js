import React from 'react';
import '../App.css';
import { Navbar, Nav } from 'react-bootstrap';

function Bar(props) {
    console.log(props.activeKey);
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">Make a Change</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto" defaultActiveKey={props.active}>
                <Nav.Link href="/" eventKey="1">Email</Nav.Link>
                <Nav.Link href="#link" eventKey="2">Donations</Nav.Link>
                <Nav.Link href="#link" eventKey="3">Petitions</Nav.Link>
                <Nav.Link href="#link" eventKey="4">Contact us</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default Bar;
