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
            </Navbar>
        </div>
    );
};

export default NavigationBar;
