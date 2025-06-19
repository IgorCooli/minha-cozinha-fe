import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Row, Table, Form } from 'react-bootstrap';
import NavigationBar from '../navbar/NavigationBar';
import { useNavigate } from 'react-router-dom';
import { getStockData, addStockData, removeStockItem } from '../../service/stock/StockService';
import { addShoppingListData } from '../../service/shoppingList/ShoppingListService';
import '../shared/styles/SharedStyles.css';

const MyStock = () => {
    const [stockData, setStock] = useState([]);
    const [query, setQuery] = useState('');
    const [isFiltersVisible, setFiltersVisible] = useState(false);
    const [isRegisterVisible, setRegisterVisible] = useState(false);
    const [stockItem, setStockItem] = useState("");

    useEffect(() => {
        handleStock();
    }, []);

    const handleAddStockItem = () => {
        if(stockItem !== "") {
            addStockData(stockItem)
                .then(() => {
                    handleStock();
                    setStockItem("");
                    setQuery("");
                })
                .catch((error) => {
                    console.error('Erro ao adicionar item ao estoque', error);
                });
        }
    };

    const handleStock = () => {
        getStockData(query)
            .then((data) => {
                if (data) {
                    setStock(data);
                } else {
                    setStock([]);
                }
            })
            .catch((error) => {
                console.error('Erro ao buscar dados do estoque', error);
            });
    };

    const cleanSearch = () => {
        setQuery('');
        handleStock();
    };

    const handleSearchQuery = (value) => {
        setQuery(value);
        handleStock();
    };

    const handleFilterVisibility = () => {
        setFiltersVisible(!isFiltersVisible);
    };
    
    const handleRegisterVisibility = () => {
        setRegisterVisible(!isRegisterVisible);
    };

    const handleRemoveItem = (id) => {
        removeStockItem(id)
        .then(() => {
            handleStock()
        })
        .catch((error) => {
            console.error('Erro ao remover item do estoque', error);
        });
    };

    const handleAddToShoppingList = (item) => {
        addShoppingListData(item.name)
        .then(() => {
            removeStockItem(item.id)
            .then(() => {
                handleStock()
            })
            .catch((error) => {
                console.error('Erro ao remover item do estoque', error);
            });
        })
        .catch((error) => {
            console.error('Erro ao adicionar item à lista de compras', error);
        });
    };

    return (
        <div className="page-container">
            <NavigationBar title="Meu Estoque" />
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
                                    className="action-button"
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
                                            value={stockItem}
                                            onChange={(e) => setStockItem(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="primary"
                                        onClick={handleAddStockItem}
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
                            {stockData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td className="text-end">
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleAddToShoppingList(item)}
                                            title="Adicionar à Lista de Compras"
                                        >
                                            <i className="fa-solid fa-list"></i>
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
                            {stockData.length === 0 && (
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

export default MyStock;
