import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Row, Table, Pagination, Form } from 'react-bootstrap';
import NavigationBar from '../navbar/NavigationBar';
import { useNavigate } from 'react-router-dom';
import { addShoppingListData, getShoppingListData, removeShoppingListItem } from '../../service/shoppingList/ShoppingListService';
import { addStockData } from '../../service/stock/StockService';

const ShoppingList = () => {
    const [shoppingListData, setShoppingList] = useState([]);
    const [query, setQuery] = useState('');
    const [isFiltersVisible, setFiltersVisible] = useState(false);
    const [isRegisterVisible, setRegisterVisible] = useState(false);
    const [shoppingListItem, setShoppingListItem] = useState("");
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
        handleShoppingList();
    }, [pageSize]);

    const handleAddShoppingListItem = () => {
        if(shoppingListItem!== "") {
            addShoppingListData(shoppingListItem)
                .then(() => {
                    handleShoppingList();
                    setShoppingListItem("");
                    setQuery("")
                    handleShoppingList()
                })
                .catch((error) => {
                    console.error('Erro ao adicionar item a lista de compras', error);
                    // Trate o erro adequadamente
                });
        }
    };

    const handleShoppingList = () => {
        getShoppingListData(query)
            .then((data) => {
                // Verifica se o retorno é nulo antes de atualizar o estado
                if (data) {
                    setShoppingList(data);
                } else {
                    setShoppingList([]);
                }
            })
            .catch((error) => {
                console.error('Erro ao buscar dados da lista de compras', error);
                // Trate o erro adequadamente
            });
    };

    const cleanSearch = () => {
        setQuery('');
        handleShoppingList();
    };

    const handleSearchQuery = (value) => {
        setQuery(value);
        handleShoppingList();
    };

    const handleFilterVisibility = () => {
        setFiltersVisible(!isFiltersVisible);
    };
    
    const handleRegisterVisibility = () => {
        setRegisterVisible(!isRegisterVisible);
    };

    const handleRemoveItem = (id) => {
        removeShoppingListItem(id)
        .then(() => {
            handleShoppingList()
        })
        .catch((error) => {
            console.error('Erro ao remover item da lista de compras', error);
        });
    };

    const handlePurchaseItem = (item) => {
        addStockData(item.name)
        removeShoppingListItem(item.id)
        .then(() => {
            handleShoppingList()
        })
        .catch((error) => {
            console.error('Erro ao comprar item da lista de compras', error);
        });
    }

    const renderPaginationItems = () => {
        // Implemente a renderização dos itens de paginação conforme necessário
    };

    return (
        <div>
            <NavigationBar />
            <Container className="mt-4">
                <Card>
                    <Card.Header>
                        <Row>
                            <Col>
                                <Card.Title style={{ color: '#333333' }}>
                                    Adicionar
                                </Card.Title>
                            </Col>
                            <Col>
                                <div style={hideBlockButtonStyle}>
                                    <Button size="sm" onClick={handleRegisterVisibility} variant="outline-warning">
                                        {isRegisterVisible ? <i className="fa-solid fa-angle-up"></i> : <i className="fa-solid fa-angle-down"></i>}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Header>
                    {isRegisterVisible && (
                        <Card.Body>
                            <Row className="mt-4">
                                <Col sm={1}>
                                    Produto
                                </Col>
                                <Col sm={9}>
                                    <Form.Group className="mb-3" controlId="formGridProduct">
                                        <Form.Control
                                            type="text"
                                            id="formGridProduct"
                                            value={shoppingListItem}
                                            onChange={(e) => setShoppingListItem(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={2}>
                                    <Button
                                        style={{ width: '100%' }}
                                        onClick={handleAddShoppingListItem}
                                        variant="outline-success"
                                    >
                                        Salvar
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    )}
                </Card>
                <Card>
                    <Card.Header>
                        <Row>
                            <Col>
                                <Card.Title style={{ color: '#333333' }}>
                                    Filtros
                                </Card.Title>
                            </Col>
                            <Col>
                                <div style={hideBlockButtonStyle}>
                                    <Button size="sm" onClick={handleFilterVisibility} variant="outline-warning">
                                        {isFiltersVisible ? <i className="fa-solid fa-angle-up"></i> : <i className="fa-solid fa-angle-down"></i>}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Header>
                    {isFiltersVisible && (
                        <Card.Body>
                            <Row className="mt-4">
                                <Col sm={1}>
                                    Buscar
                                </Col>
                                <Col sm={9}>
                                    <Form.Group className="mb-3" controlId="formGridSearch">
                                        <Form.Control
                                            type="text"
                                            id="formGridSearch"
                                            value={query}
                                            onChange={(e) => handleSearchQuery(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={2}>
                                    <Button
                                        style={{ width: '100%' }}
                                        onClick={cleanSearch} // Limpa o campo de consulta
                                        variant="outline-secondary"
                                    >
                                        Limpar
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    )}
                </Card>
                <Card className="text-left">
                    <Card.Body>
                        <Row>
                            <Col>
                                <Card.Title style={{ color: '#333333' }}>Lista de Compras</Card.Title>
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
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {shoppingListData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td className='col-1'>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <i class="fa-solid fa-trash"></i>
                                            </Button>
                                        </td>
                                        <td className='col-1'>
                                            <Button
                                                variant="success"
                                                onClick={() => handlePurchaseItem(item)}
                                            >
                                                <i class="fa-solid fa-cart-plus"></i>
                                            </Button>
                                        </td>
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
                                    onChange={null}
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

export default ShoppingList;
