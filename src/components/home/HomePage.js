import React, {useState, useEffect} from 'react';
import {Button, Card, Col, Container, Modal, Row} from 'react-bootstrap';
import NavigationBar from '../navbar/NavigationBar';
import './style/HomePage.css'
import {useNavigate} from "react-router-dom";

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // const handleLogout = () => {
    //     logout();
    //     navigate('/');
    // }

    const redirectShoppingList = () => {
        navigate('//')
    }
    const redirectMyStock = () => {
        navigate('/my-stock')
    }

    useEffect(() => {
        // This will open the modal when the component is mounted
        // setShowModal(true);
    }, []);

    const homeCardStyle = {
        width: '100%',
        height: '80vh',
    };

    const iconStyle = {
        color: '#ffc107',
        display: 'flex',
        justifyContent: 'flex-end',
    };

    const leftIconStyle = {
        color: '#333333',
        display: 'flex',
        justifyContent: 'flex-start',
    };

    const roundButtonStyle = {
        borderRadius: '100%',
        width: '200px',
        height: '200px',
        backgroundColor: '#E6E6FA',
        color: '#333333',
        borderColor: '#E6E6FA',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center',     // Center vertically
    };

    return (
        <div>
            <NavigationBar/>
            <Container className="mt-4">
                <Card className="text-left">
                    <Card.Body>
                        <Row>
                            <div className={"text-center"}>
                                <Button
                                    style={{
                                        borderRadius: '5%',
                                        width: '100%',
                                        height: '70px',
                                        padding: 'auto',
                                        backgroundColor: '#E6E6FA',
                                        color: '#333333',
                                        borderColor: '#E6E6FA',
                                        marginBottom: '2vh'
                                    }}
                                    className="text-center"
                                >
                                    <Row>
                                        <Col>
                                            <div style={leftIconStyle}>
                                                <i className="fa-solid fa-table"></i>
                                            </div>
                                        </Col>
                                        <Col className={"text-start"}
                                             style={{display: 'flex', alignItems: 'start', justifyContent: 'start'}}>
                                            Lista de Compras
                                        </Col>
                                        <Col>
                                            <div onClick={redirectShoppingList} style={iconStyle}>
                                                <i className="fa-solid fa-angle-right"></i>
                                            </div>
                                        </Col>
                                    </Row>
                                </Button>
                            </div>
                        </Row>
                        <Row>
                            <div className={"text-center"}>
                                <Button
                                    style={{
                                        borderRadius: '5%',
                                        width: '100%',
                                        height: '70px',
                                        padding: 'auto',
                                        backgroundColor: '#E6E6FA',
                                        color: '#333333',
                                        borderColor: '#E6E6FA',
                                    }}
                                    className="text-center"
                                >
                                    <Row>
                                        <Col>
                                            <div style={leftIconStyle}>
                                                <i className="fa-solid fa-chart-pie"></i>
                                            </div>
                                        </Col>
                                        <Col className={"text-start"}
                                             style={{display: 'flex', alignItems: 'start', justifyContent: 'start'}}>
                                            Estoque
                                        </Col>
                                        <Col>
                                            <div onClick={redirectMyStock} style={iconStyle}>
                                                <i className="fa-solid fa-angle-right"></i>
                                            </div>
                                        </Col>
                                    </Row>
                                </Button>
                            </div>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default HomePage;