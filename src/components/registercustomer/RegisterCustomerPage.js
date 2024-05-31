import React, {useState} from 'react';
import {Button, Card, Col, Container, Form, Modal, Row} from 'react-bootstrap';
import {register} from '../../service/registercustomer/RegisterCustomerService';
import {logout} from "../../service/auth/AuthenticationService";
import {useNavigate} from 'react-router-dom';
import NavigationBar from '../navbar/NavigationBar';

const RegisterCustomerPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        preferences: '',
    });

    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [blankFieldsList, setBlankFieldsList] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const iconStyle = {
        color: '#ffc107',
        display: 'flex',
        justifyContent: 'flex-end',
    };

    const handleCloseAlert = () => setShowAlert(false);
    const handleShowSuccessModal = () => setShowSuccessModal(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePhoneInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: formatPhoneNumber(value),
        });
    };

    const formatPhoneNumber = (phoneNumber) => {
        const numericValue = phoneNumber.replace(/[^\d]/g, '');

        if (numericValue.length <= 2) {
            return `(${numericValue}`;
        } else if (numericValue.length <= 6) {
            const areaCode = numericValue.slice(0, 2);
            const firstPart = numericValue.slice(2, 6);
            return `(${areaCode}) ${firstPart}`;
        } else {
            const areaCode = numericValue.slice(0, 2);
            const firstPart = numericValue.slice(2, 7);
            const secondPart = numericValue.slice(7, 11);
            return `(${areaCode}) ${firstPart}-${secondPart}`;
        }
    };

    const handleRegister = () => {
        const blankFields = [];

        if (!formData.name) {
            blankFields.push('Name');
        }
        if (!formData.phoneNumber) {
            blankFields.push('Phone Number');
        }
        if (!formData.preferences) {
            blankFields.push('Preferences');
        }

        if (blankFields.length > 0 || !isValidPhoneNumber(formData.phoneNumber)) {
            showAlertModal('Please fill in all fields correctly', blankFields);
        } else {
            register(formData)
                .then(() => {
                    handleShowSuccessModal();
                })
                .catch((error) => {
                    if (error.message.includes("token.invalid_or_expired")) {
                        logout()
                        navigate('/')
                    }
                    console.error('Registration failed', error);
                    showAlertModal(`Registration failed: ${error}`);
                });
        }
    };

    const isValidPhoneNumber = (phoneNumber) => {
        const phonePattern = /^\(\d{2}\)\s\d{5}-\d{4}$/;
        return phonePattern.test(phoneNumber);
    };

    const registerFormStyle = {
        width: '100%',
        color: 'black',
    };

    const registerButtonStyle = {
        backgroundColor: '#333333',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        width: '50%',
        marginTop: '15px',
    };

    const registerSaleCardStyle = {
        marginTop: '20px',
        width: '100%',
    };

    const showAlertModal = (message, fields = []) => {
        setAlertMessage(message);
        setBlankFieldsList(fields);
        setShowAlert(true);
    };

    return (
        <div>
            <NavigationBar />
            <Container>
                <Card style={registerSaleCardStyle} className="text-left">
                    <Card.Body>
                        <Form style={registerFormStyle}>
                            <Row>
                                <Col>
                                    <Card.Title style={{color: '#333333'}}>Cadastrar cliente</Card.Title>
                                </Col>
                                <Col>
                                    <div style={iconStyle}>
                                        <i className="fa-regular fa-address-card"></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Form.Text className="text-muted">Primeiro e último nome</Form.Text>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group controlId="formPhoneNumber">
                                    <Form.Label>Celular</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handlePhoneInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group controlId="formPreferences">
                                    <Form.Label >Preferências</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        type="text"
                                        name="preferences"
                                        value={formData.preferences}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="justify-content-center mt-2">
                                <div className="text-center">
                                    <Button
                                        variant="warning"
                                        type="button"
                                        onClick={handleRegister}
                                    >
                                        Registrar
                                    </Button>
                                </div>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
                <Modal show={showAlert} onHide={handleCloseAlert}>
                    <Modal.Header closeButton className="bg-grey">
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {alertMessage}
                        {blankFieldsList.length > 0 && (
                            <div>
                                <p>The following fields are blank:</p>
                                <ul>
                                    {blankFieldsList.map((field, index) => (
                                        <li key={index}>{field}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleCloseAlert}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                    <Modal.Header closeButton className="bg-grey">
                        <Modal.Title>Sucesso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Registrado com sucesso.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default RegisterCustomerPage;
