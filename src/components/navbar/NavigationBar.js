import React, {useState} from 'react';
import {Button, Nav, Navbar} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const NavigationBar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const iconStyle = {
        color: '#E6E6FA',
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: '5%'
    };

    return (
        <div style={{marginBottom: '2vh', backgroundColor: '#E6E6FA'}}>
            <Navbar className="bg-body-tertiary mb-3" expand={"large"}>
                <Navbar.Brand href="/" style={{marginLeft: '5%'}}>Minha Cozinha</Navbar.Brand>
                <div style={iconStyle}>
                    <Button style={{borderStyle: 'none'}} size={"sm"} variant={"outline-secondary"} href="/">
                        <i className="fa-solid fa-house-chimney"></i>
                    </Button>
                </div>
                {/*<Navbar.Toggle aria-controls={`offcanvasNavbar-expand-large`} />*/}
                {/*<Navbar.Collapse id={`offcanvasNavbar-expand-large`} className="text-end">*/}
                {/*    <Nav className="justify-content-end flex-grow-1 pe-3">*/}
                {/*        <Nav.Link style={{ color: '#333333' }} href="/home">*/}
                {/*            Home*/}
                {/*        </Nav.Link>*/}
                {/*        <div style={{ background: 'linear-gradient(100deg, transparent, #333333)', height: '1px' }}></div>*/}
                {/*        <Nav.Link style={{ color: '#333333' }} href="/register-sale">*/}
                {/*            Nova venda*/}
                {/*        </Nav.Link>*/}
                {/*        <div style={{ background: 'linear-gradient(100deg, transparent, #333333)', height: '1px' }}></div>*/}
                {/*        <Nav.Link style={{ color: '#333333' }} href="/sales-history">*/}
                {/*            Histórico de vendas*/}
                {/*        </Nav.Link>*/}
                {/*        <div style={{ background: 'linear-gradient(100deg, transparent, #333333)', height: '1px' }}></div>*/}
                {/*        <Nav.Link style={{ color: '#333333' }} href="/register-customer">*/}
                {/*            Cadastrar cliente*/}
                {/*        </Nav.Link>*/}
                {/*        <div style={{ background: 'linear-gradient(100deg, transparent, #333333)', height: '1px' }}></div>*/}
                {/*        <Nav.Link style={{ color: '#333333' }} onClick={handleLogout}>*/}
                {/*            Logout*/}
                {/*        </Nav.Link>*/}
                {/*    </Nav>*/}
                {/*</Navbar.Collapse>*/}
            </Navbar>
        </div>
    );
};

export default NavigationBar;
