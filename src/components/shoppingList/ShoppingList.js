import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Row, Table, Form } from 'react-bootstrap';
import NavigationBar from '../navbar/NavigationBar';
import { useNavigate } from 'react-router-dom';
import { addShoppingListData, getShoppingListData, removeShoppingListItem } from '../../service/shoppingList/ShoppingListService';
import { addStockData } from '../../service/stock/StockService';
import '../shared/styles/SharedStyles.css';

const ShoppingList = () => {
    const [shoppingListData, setShoppingList] = useState([]);
    const [query, setQuery] = useState('');
    const [isFiltersVisible, setFiltersVisible] = useState(false);
    const [isRegisterVisible, setRegisterVisible] = useState(false);
    const [shoppingListItem, setShoppingListItem] = useState("");

    useEffect(() => {
        handleShoppingList();
    }, []);

    const handleAddShoppingListItem = () => {
        if(shoppingListItem !== "") {
            addShoppingListData(shoppingListItem)
                .then(() => {
                    handleShoppingList();
                    setShoppingListItem("");
                    setQuery("");
                })
                .catch((error) => {
                    console.error('Erro ao adicionar item a lista de compras', error);
                });
        }
    };

    const handleShoppingList = () => {
        getShoppingListData(query)
            .then((data) => {
                if (data) {
                    setShoppingList(data);
                } else {
                    setShoppingList([]);
                }
            })
            .catch((error) => {
                console.error('Erro ao buscar dados da lista de compras', error);
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

    return (
        <div className="page-container">
            <NavigationBar title="Lista de Compras" />
            <Container>                
                <Card className="content-card">
                    <Card.Header className="bg-white border-bottom-0">
                        <Row className="align-items-center">
                            <Col>
                                <h5 className="mb-0">Adicionar Item</h5>
                            </Col>
                            <Col xs="auto">
                                <Button 
                                    variant="light"
                                    className="success-button"
                                    onClick={handleRegisterVisibility}
                                >
                                    {isRegisterVisible ? 
                                        <i className="fa-solid fa-angle-up"></i> : 
                                        <i className="fa-solid fa-angle-down"></i>
                                    }
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    {isRegisterVisible && (
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col>
                                    <Form.Group className="mb-0">
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome do produto"
                                            value={shoppingListItem}
                                            onChange={(e) => setShoppingListItem(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="primary"
                                        onClick={handleAddShoppingListItem}
                                    >
                                        Adicionar
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    )}
                </Card>

                <Card className="content-card">
                    <Card.Header className="bg-white border-bottom-0">
                        <Row className="align-items-center">
                            <Col>
                                <h5 className="mb-0">Filtros</h5>
                            </Col>
                            <Col xs="auto">
                                <Button 
                                    variant="light"
                                    className="action-button"
                                    onClick={handleFilterVisibility}
                                >
                                    {isFiltersVisible ? 
                                        <i className="fa-solid fa-angle-up"></i> : 
                                        <i className="fa-solid fa-angle-down"></i>
                                    }
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    {isFiltersVisible && (
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col>
                                    <Form.Group className="mb-0">
                                        <Form.Control
                                            type="text"
                                            placeholder="Buscar item"
                                            value={query}
                                            onChange={(e) => handleSearchQuery(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={cleanSearch}
                                    >
                                        Limpar
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    )}
                </Card>

                <div className="table-container">
                    <Table className="custom-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th className="text-end">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shoppingListData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td className="text-end">
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handlePurchaseItem(item)}
                                            title="Comprar"
                                        >
                                            <i className="fa-solid fa-cart-plus"></i>
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.id)}
                                            title="Remover"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {shoppingListData.length === 0 && (
                                <tr>
                                    <td colSpan="2" className="text-center">
                                        Nenhum item encontrado
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    );
};

export default ShoppingList;
