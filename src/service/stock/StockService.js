import axios from "axios";

const findSales = async (years, month, query, page, size) => {
    try {
        axios.defaults.withCredentials = true;
        return await axios.get(
            `https://minha-cozinha-be-4ff98ced1599.herokuapp.com/api/sales?year=${years}&month=${month}&page=${page}&size=${size}&query=${query}`,
            // `http://localhost:8080/api/sales?year=${years}&month=${month}&page=${page}&size=${size}&query=${query}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        if (error.response.status === 401) {
            console.log('Token expired');
            throw new Error('token.invalid_or_expired');
        }

        if (error.response.status !== 200) {
            console.log('Search failed');
            throw new Error('search.failed');
        }
        console.log("ERROR ON SERVICE: " + error)
        throw error;
    }

};

const getStockData = async (value) => {
    try {
        let data = await axios.get(
            `https://minha-cozinha-be-4ff98ced1599.herokuapp.com/stock/search?name=${value}`,
            // 'http://localhost:8080/api/sales?page=${page}&size=${size}',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return data
    } catch (error) {
        console.log("ERROR ON SERVICE: " + error)
        throw error;
    }

};

export {findSales, getStockData};