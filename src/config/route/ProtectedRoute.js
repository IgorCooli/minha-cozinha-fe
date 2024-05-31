import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({path, element}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('x-token')) {
            navigate('/');
        }
    }, [navigate]);

    return element;
};

export default ProtectedRoute;
