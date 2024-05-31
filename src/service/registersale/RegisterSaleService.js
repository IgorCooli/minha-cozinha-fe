import axios from 'axios';
import {getToken} from '../auth/AuthenticationService';

export const registerSale = async (saleDto) => {
    try {
        axios.defaults.withCredentials = true;
        const token = getToken();
        const response = await axios.post(
            'https://minha-cozinha-be-4ff98ced1599.herokuapp.com/api/register-sale',
            // 'http://localhost:8080/api/register-customer',
            JSON.stringify(saleDto),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },
            }
        );
    } catch (error) {
        if (error.response.status === 401) {
            console.log('Token expired');
            throw new Error('token.invalid_or_expired');
        }

        if (error.response.status !== 201) {
            console.log('Registration failed');
            throw new Error('registration.failed');
        }
        console.log("ERROR ON SERVICE: " + error)
        throw error;
    }
};