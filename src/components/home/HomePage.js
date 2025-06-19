import React, {useState, useEffect} from 'react';
import {Button, Card, Col, Container, Row} from 'react-bootstrap';
import NavigationBar from '../navbar/NavigationBar';
import './style/HomePage.css'
import {useNavigate} from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const redirectShoppingList = () => {
        navigate('/my-shopping-list')
    }
    const redirectMyStock = () => {
        navigate('/my-stock')
    }

    return (
        <div className="bg-light min-vh-100">
            <NavigationBar title="Minha Cozinha" />
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-sm">
                            <Card.Body className="p-4">
                                <div className="d-grid gap-3">
                                    <Button
                                        className="home-button d-flex align-items-center justify-content-between"
                                        onClick={redirectShoppingList}
                                        variant="white"
                                    >
                                        <div className="d-flex align-items-center">
                                            <i className="fa-solid fa-table me-3 text-primary"></i>
                                            <span className="fs-5">Lista de Compras</span>
                                        </div>
                                        <i className="fa-solid fa-angle-right text-primary"></i>
                                    </Button>

                                    <Button
                                        className="home-button d-flex align-items-center justify-content-between"
                                        onClick={redirectMyStock}
                                        variant="white"
                                    >
                                        <div className="d-flex align-items-center">
                                            <i className="fa-solid fa-chart-pie me-3 text-primary"></i>
                                            <span className="fs-5">Estoque</span>
                                        </div>
                                        <i className="fa-solid fa-angle-right text-primary"></i>
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HomePage;