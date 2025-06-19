import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../shared/styles/SharedStyles.css';

const NavigationBar = ({ title = "Minha Cozinha" }) => {
    return (
        <Navbar bg="white" expand="lg" className="shadow-sm mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <i className="fa-solid fa-kitchen-set me-2 text-primary"></i>
                    <span className="fw-semibold">{title}</span>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
