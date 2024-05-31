import React, {useState, useEffect} from 'react';
import {Button, Card, Col, Container, Form, Modal, Row, Table} from 'react-bootstrap';
import Select from 'react-select';
import {findCustomersByName} from '../../service/findcustomer/FindCustomerService';
import NavigationBar from '../navbar/NavigationBar';
import {useNavigate} from 'react-router-dom';
import {logout} from '../../service/auth/AuthenticationService';
import CustomerDto from '../../model/CustomerDto';
import {registerSale} from "../../service/registersale/RegisterSaleService";
import SaleDto from "../../model/SaleDto";
import ItemSaleDto from "../../model/ItemSaleDto";

const RegisterSalePage = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [totalValue, setTotalValue] = useState(0.0);
    const [installments, setInstallments] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const [valorInput, setValorInput] = useState('');
    const [formattedDate, setFormattedDate] = useState(''); // Added for the formatted date
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [blankFieldsList, setBlankFieldsList] = useState([]);

    const handleCloseAlert = () => setShowAlert(false);

    const handleCustomersSearch = (inputValue) => {
        findCustomersByName(inputValue)
            .then((data) => {
                const rawList = data.data.customers;
                const list = rawList.map((rawCustomer) => ({
                    label: rawCustomer.name,
                    value: rawCustomer.phoneNumber,
                }));

                setCustomerList(list);

                if (list.length === 1) {
                    const firstCustomer = list[0];
                    const customerDto = new CustomerDto(
                        firstCustomer.label,
                        firstCustomer.value,
                        'Customer Preferences' // Replace with actual preferences
                    );

                    setSelectedCustomer(customerDto);
                }
            })
            .catch((error) => {
                console.error('Search failed', error);
                if (error.message.includes('token.invalid_or_expired')) {
                    logout();
                    navigate('/');
                }
            });
    };

    const handleCustomerSelect = (selectedOption) => {
        setSelectedOption(selectedOption);

        if (selectedOption) {
            const customerDto = new CustomerDto(
                selectedOption.label,
                selectedOption.value,
                'Customer Preferences' // Replace with actual preferences
            );

            setSelectedCustomer(customerDto);
        }
    };

    const validateFormFields = () => {
        const missing = [];
        if (!document.getElementById('formGridProduct').value) missing.push('Produto');
        if (!document.getElementById('formGridData').value) missing.push('Data');
        if (document.getElementById('formGridPaymentMethod').value === 'Selecione...') missing.push('Método de Pagamento');
        if (isNaN(parseFloat(valorInput.replace(/[^\d.]/g, '')))) missing.push('Valor');
        return missing;
    };

    //INFO função para transformar em numerico antes de enviar valor
    function getNumericValue() {
        const cleanedValue = valorInput.replace(/[^\d,]/g, '');
        return parseFloat(cleanedValue.replace(',', '.'));
    }


    const handleAddToTable = () => {
        let missing = validateFormFields();

        if (missing.length > 0) {
            setBlankFieldsList(missing);
            setShowAlert(true);
        } else {
            const produto = document.getElementById('formGridProduct').value;
            const data = document.getElementById('formGridData').value;
            const pagamento = document.getElementById('formGridPaymentMethod').value;

            console.log(valorInput)

            const numericValue = getNumericValue(valorInput);

            console.log(numericValue)
            const newItem = {produto, data, pagamento, valor: numericValue};

            setTotalValue(totalValue + numericValue);
            setTableData([...tableData, newItem]);
            setIsTableVisible(true);

            // Clear the form fields
            document.getElementById('formGridProduct').value = '';
            document.getElementById('formGridData').value = '';
            document.getElementById('formGridPaymentMethod').value = 'Selecione...';
            setValorInput('');
            setFormattedDate('');
        }
    };

    useEffect(() => {
        if (valorInput) {
            const numericValue = valorInput.replace(/[^\d]/g, '');

            if (numericValue.length >= 3) {
                const wholePart = numericValue.slice(0, -2);
                const decimalPart = numericValue.slice(-2);
                const formattedValue = `R$${wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimalPart}`;
                setValorInput(formattedValue);
            }
        }
    }, [valorInput]);

    const handleDateChange = (e) => {
        const input = e.target.value;
        const numbersOnly = input.replace(/[^0-9]/g, '');
        const formattedInput = numbersOnly
            .slice(0, 8)
            .replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');

        setFormattedDate(formattedInput);
    };

    const handleShowSuccessModal = () => setShowSuccessModal(true);

    const showAlertModal = (message, fields = []) => {
        setAlertMessage(message);
        setBlankFieldsList(fields);
        setShowAlert(true);
    };


    const showConfirmationAlertModal = (message, fields = []) => {
        setAlertMessage(message);
        setBlankFieldsList(fields);
        setShowAlert(true);
    };

    const PaymentMethodEnum = {
        Crédito: "CREDIT",
        Débito: "DEBIT",
        Dinheiro: "MONEY",
        Pix: "PIX",
    };

    const translateTableDataToItemSaleDto = (tableData) => {
        return tableData.map((item) => {
            const translatedPaymentMethod = PaymentMethodEnum[item.pagamento];
            return new ItemSaleDto(item.produto, item.data, translatedPaymentMethod, item.valor);
        });
    };

    const handleConfirmSale = () => {
        const blankFields = [];

        if (!selectedCustomer) {
            blankFields.push('Customer');
        }
        if (tableData.length === 0) {
            blankFields.push('Products');
        }

        if (blankFields.length > 0) {
            showConfirmationAlertModal('Please fill in all required fields correctly', blankFields);
        } else {
            const translatedTableData = translateTableDataToItemSaleDto(tableData);

            const data = new SaleDto(selectedCustomer.name, translatedTableData, installments);

            registerSale(data)
                .then(() => {
                    setTableData([])
                    setIsTableVisible(false)
                    setTotalValue(0.0)
                    handleShowSuccessModal();
                })
                .catch((error) => {
                    if (error.message.includes("token.invalid_or_expired")) {
                        logout();
                        navigate('/');
                    }
                    console.error('Registration failed', error);
                    showAlertModal(`Registration failed: ${error}`);
                });
        }
    };

    const handleRemoveFromTable = (index, item) => {
        const updatedTableData = tableData.filter((_, i) => i !== index);
        setTotalValue(totalValue - item.valor);
        setTableData(updatedTableData);
        setIsTableVisible(updatedTableData.length > 0);
    };

    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber && phoneNumber.length === 11) {
            return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7)}`;
        } else {
            return phoneNumber;
        }
    };

    const registerSaleCardStyle = {
        marginTop: '20px',
        width: '100%',
    };

    const iconStyle = {
        color: '#ffc107',
        display: 'flex',
        justifyContent: 'flex-end',
    };

    return (
        <div>
            <NavigationBar/>
            <Container className="mt-4">
                <Card style={registerSaleCardStyle} className="text-left">
                    <Card.Body>
                        <Row>
                            <Col>
                                <Card.Title style={{color: '#333333'}}>Nova venda</Card.Title>
                            </Col>
                            <Col>
                                <div style={iconStyle}>
                                    <i className="fa-solid fa-coins"></i>
                                </div>
                            </Col>
                        </Row>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridName">
                                    <Form.Label>Nome</Form.Label>
                                    <Select
                                        value={selectedOption}
                                        onChange={handleCustomerSelect}
                                        onInputChange={handleCustomersSearch}
                                        options={customerList}
                                        isSearchable={true}
                                        placeholder="Pesquisar"
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridPhoneNumber">
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phoneNumber"
                                        value={selectedCustomer ? formatPhoneNumber(selectedCustomer.phoneNumber) : ''}
                                        readOnly
                                        required
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formGridProduct">
                                        <Form.Label>Produto</Form.Label>
                                        <Form.Control type="text" id="formGridProduct"/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group as={Col} controlId="formGridData">
                                        <Form.Label>Data</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="formGridData"
                                            value={formattedDate}
                                            onChange={handleDateChange} // Handle the date formatting
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col sm={6}>
                                    <Form.Group as={Col} controlId="formGridPaymentMethod">
                                        <Form.Label>Pagamento</Form.Label>
                                        <Form.Select defaultValue="Choose..." id="formGridPaymentMethod">
                                            <option>Selecione...</option>
                                            <option>Crédito</option>
                                            <option>Débito</option>
                                            <option>Dinheiro</option>
                                            <option>Pix</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col sm={4}>
                                    <Form.Group as={Col} controlId="formGridValue">
                                        <Form.Label>Valor</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="formGridValue"
                                            value={valorInput}
                                            onChange={(e) => setValorInput(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={2}>
                                    <Form.Group as={Col} controlId="formGridInstallment">
                                        <Form.Label>Parcelas</Form.Label>
                                        <Form.Select
                                            value={installments}
                                            onChange={(e) => setInstallments(e.target.value)}
                                        >
                                            <option value={1}>1 x</option>
                                            <option value={2}>2 x</option>
                                            <option value={3}>3 x</option>
                                            <option value={4}>4 x</option>
                                            <option value={5}>5 x</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <div className="text-center">
                                    <Button variant="warning" onClick={handleAddToTable}>
                                        Adicionar
                                    </Button>
                                </div>
                            </Row>
                        </Form>
                    </Card.Body>
                    {isTableVisible && (
                        <div>
                            <Card.Body>
                                <Form.Group as={Col} controlId="formGridTotalValue">
                                    <Row className="justify-content-md-center">
                                        <Col xs lg="2">
                                            <Form.Label style={{fontWeight: 'bold', color: 'black'}}>Valor total da
                                                compra:</Form.Label>
                                        </Col>
                                        <Col md="auto">
                                            <Form.Control
                                                disabled="true"
                                                type="text"
                                                id="formGridTotalValue"
                                                value={`R$ ${totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Card.Body>
                            <Table striped hover responsive className={"text-center"}>
                                <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Data</th>
                                    <th>Pagamento</th>
                                    <th>Valor</th>
                                    <th>Remover</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tableData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="col-3">{item.produto}</td>
                                        <td className="col-1">{item.data}</td>
                                        <td className="col-2">{item.pagamento}</td>
                                        <td className="col-2">{`R$ ${item.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}</td>
                                        <td className="col-1">
                                            <Button variant="danger"
                                                    onClick={() => handleRemoveFromTable(index, item)}>
                                                X
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <Row className="justify-content-center">
                                <div className="text-center">
                                    <Button
                                        variant={"success"}
                                        onClick={handleConfirmSale}
                                    >
                                        Confirmar
                                    </Button>
                                </div>
                            </Row>
                        </div>
                    )}
                </Card>
                <Modal show={showAlert} onHide={handleCloseAlert}>
                    <Modal.Header closeButton className="bg-grey">
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Please fill in all fields correctly. The following fields are missing or invalid:</p>
                        <ul>
                            {blankFieldsList.map((field, index) => (
                                <li key={index}>{field}</li>
                            ))}
                        </ul>
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

export default RegisterSalePage;
