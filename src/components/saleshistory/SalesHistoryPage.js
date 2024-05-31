import React, {useState, useEffect} from 'react';
import {Card, Col, Container, Row, Table, Pagination, Form, Button} from 'react-bootstrap';
import NavigationBar from '../navbar/NavigationBar';
import {useNavigate} from 'react-router-dom';
import {logout} from '../../service/auth/AuthenticationService';
import {findSales, getSalesData} from '../../service/saleshistory/SalesHistoryService';

const SalesHistoryPage = () => {
    const [salesHistory, setSalesHistory] = useState([]);
    const [salesData, setSalesData] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [query, setQuery] = useState('');
    const [isMonthStatsVisible, setMonthStatsVisible] = useState(true);
    const [isFiltersVisible, setFiltersVisible] = useState(false);
    const [searchTimer, setSearchTimer] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const navigate = useNavigate();

    const iconStyle = {
        color: '#ffc107',
        display: 'flex',
        justifyContent: 'flex-end',
    };


    const hideBlockButtonStyle = {
        color: '#333333',
        display: 'flex',
        justifyContent: 'flex-end',
    };

    useEffect(() => {
        // Fetch initial data when the component mounts
        const page = 0;
        handleSalesSearch(page, pageSize);
        handleSalesData();
    }, [pageSize]);

    useEffect(() => {
        // Update the table whenever the month or year changes
        const page = 0;
        handleSalesSearch(page, pageSize);
    }, [month, year]);

    const handleSalesData = () => {
        getSalesData()
            .then((data) => {
                let response = data.data;
                setSalesData(response);
            })
            .catch((error) => {
                console.error('Sales data fetch failed', error);
                if (error.message.includes('token.invalid_or_expired')) {
                    logout();
                    navigate('/');
                }
            });
    };

    const handleSalesSearch = (page, size) => {
        findSales(year, month, query, page, size)
            .then((data) => {
                let totalPagesResponse = data.data.totalPages;
                setTotalPages(totalPagesResponse);
                let response = data.data.content;
                console.log(response);
                setSalesHistory(response);
            })
            .catch((error) => {
                console.error('Sales search failed', error);
                if (error.message.includes('token.invalid_or_expired')) {
                    logout();
                    navigate('/');
                }
            });
    };

    const handlePageChange = (page) => {
        // Update the current page and fetch data for the new page
        setCurrentPage(page);
        handleSalesSearch(page, pageSize);
    };

    const handleMonthOnChange = (e) => {
        const selectedMonth = e.target.value;
        setMonth(parseInt(selectedMonth, 10));
    };

    const handleYearOnChange = (e) => {
        const selectedYear = e.target.value;
        setYear(parseInt(selectedYear, 10));
    }

    const handlePageSizeChange = (event) => {
        // Update the page size when the input field changes
        const newSize = parseInt(event.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(0); // Reset to the first page
        handleSalesSearch(0, newSize);
    };

    const renderPaginationItems = () => {
        const items = [];
        for (let number = 0; number < totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number + 1}
                </Pagination.Item>
            );
        }
        return items;
    };

    const handleMonthVisibility = () => {
        setMonthStatsVisible(!isMonthStatsVisible)
    }

    const handleFilterVisibility = () => {
        setFiltersVisible(!isFiltersVisible)
    }

    const formatCurrency = (value) => {
        return value ? `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : "R$0,00";
    };

    const handleSearchQuery = (value) => {
        setQuery(value);

        if (searchTimer) {
            clearTimeout(searchTimer);
        }

        const newTimer = setTimeout(() => {
            handleSalesSearch(0, pageSize);
        }, 600);

        setSearchTimer(newTimer);
    };
    const handleCleanSearch = () => {
        setQuery('');

        setTimeout(()=>{
            handleSalesSearch(0, pageSize);
        }, 600)
    };


    return (
        <div>
            <NavigationBar/>
            <Container className="mt-4">
                <Card>
                    <Card.Header>
                        <Row>
                            <Col>
                                <Card.Title style={{color: '#333333'}}>
                                    Filtros
                                </Card.Title>
                            </Col>
                            <Col>
                                <div style={hideBlockButtonStyle}>
                                    <Button size="sm"  onClick={handleFilterVisibility} variant="outline-warning">
                                        {
                                            isFiltersVisible && (
                                                <i className="fa-solid fa-angle-up"></i>
                                            )
                                        }
                                        {
                                            !isFiltersVisible && (
                                                <i className="fa-solid fa-angle-down"></i>
                                            )
                                        }
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Header>
                    {
                        isFiltersVisible && (
                            <Card.Body>
                                <Row className="mt-2">
                                    <Col sm={1}>
                                        Ano
                                    </Col>
                                    <Col sm={5}>
                                        <Form.Group as={Col} controlId="formGridYear">
                                            <Form.Select
                                                value={year}
                                                onChange={handleYearOnChange}
                                            >
                                                <option>2023</option>
                                                <option>2024</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={1}>
                                        Mês
                                    </Col>
                                    <Col sm={5}>
                                        <Form.Group as={Col} controlId="formGridMonth">
                                            <Form.Select
                                                value={month}
                                                onChange={handleMonthOnChange}
                                            >
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                                <option>9</option>
                                                <option>10</option>
                                                <option>11</option>
                                                <option>12</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col sm={1}>
                                        Buscar
                                    </Col>
                                    <Col sm={9}>
                                        <Form.Group className="mb-3" controlId="formGridProduct">
                                            <Form.Control
                                                type="text"
                                                id="formGridProduct"
                                                value={query}
                                                onChange={(e => handleSearchQuery(e.target.value))}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={2}>
                                        <Button
                                            style={{width: '100%'}}
                                            onClick={handleCleanSearch}
                                            variant="outline-secondary"
                                        >
                                            Limpar
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        )
                    }
                </Card>
                <Card>
                    <Card.Header style={{color: '#333333'}}>
                        <Row>
                            <Col>
                                <Card.Title>Relatório</Card.Title>
                            </Col>
                            <Col>
                                <div style={hideBlockButtonStyle}>
                                    <Button size="sm" onClick={handleMonthVisibility} variant="outline-warning">
                                        {
                                            isMonthStatsVisible && (
                                                <i className="fa-solid fa-angle-up"></i>
                                            )
                                        }
                                        {
                                            !isMonthStatsVisible && (
                                                <i className="fa-solid fa-angle-down"></i>
                                            )
                                        }
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Header>
                    {
                        isMonthStatsVisible && (

                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card className="text-left">
                                            <Card.Body>
                                                <Row>
                                                    <Col>
                                                        <Card.Title style={{color: '#333333'}}>Total</Card.Title>
                                                    </Col>
                                                    <Col>
                                                        <div style={iconStyle}>
                                                            <i className="fa-solid fa-money-bill"></i>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Card.Text>{formatCurrency(salesData?.totalSalesValue)}</Card.Text>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    {/* Profit Card */}
                                    <Col>
                                        <Card className="text-left">
                                            <Card.Body>
                                                <Row>
                                                    <Col>
                                                        <Card.Title style={{color: '#333333'}}>Lucro</Card.Title>
                                                    </Col>
                                                    <Col>
                                                        <div style={iconStyle}>
                                                            <i className="fa-solid fa-chart-line"></i>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Card.Text>{formatCurrency(salesData?.totalProfit)}</Card.Text>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        )
                    }
                </Card>
                <Card className="text-left">
                    <Card.Body>
                        <Row>
                            <Col>
                                <Card.Title style={{color: '#333333'}}>Histórico</Card.Title>
                            </Col>
                            <Col>
                                <div style={iconStyle}>
                                    <i className="fa-solid fa-table"></i>
                                </div>
                            </Col>
                        </Row>
                        <Table striped hover responsive>
                            <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Data</th>
                                <th>Pagamento</th>
                                <th>Valor</th>
                                <th>Cliente</th>
                                <th>X</th>
                            </tr>
                            </thead>
                            <tbody>
                            {salesHistory.map((item, index) => (
                                <tr key={index}>
                                    <td className="col-3">{item.product}</td>
                                    <td className="col-1">{item.date}</td>
                                    <td className="col-2">{item.paymentMethod}</td>
                                    <td className="col-2">{formatCurrency(item.value)}</td>
                                    <td className="col-2">{item.customerName}</td>
                                    <td className="col-2">{item.installments}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-between">
                            <Form.Group>
                                <Form.Control
                                    as="select"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </Form.Control>
                            </Form.Group>
                            <Pagination>{renderPaginationItems()}</Pagination>
                        </div>
                    </Card.Footer>
                </Card>
            </Container>
        </div>
    );
};

export default SalesHistoryPage;
