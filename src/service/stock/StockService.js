import axios from "axios";
import ItemDto from "../../model/ItemDto";

const getStockData = async (value) => {
    try {
        let data = await axios.get(
            `https://minha-cozinha-be-4ff98ced1599.herokuapp.com/stock/search?name=${value}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        let result = []

        data.data.map((item, index)=>{
            result.push(new ItemDto(item.id, item.name))
        })

        return result
    } catch (error) {
        console.log("ERROR ON SERVICE: " + error)
        throw error;
    }

};

const addStockData = async (value) => {
    let stockData = new ItemDto(null, value)
    try {
        const response = await axios.post(
            'https://minha-cozinha-be-4ff98ced1599.herokuapp.com/stock',
            JSON.stringify(stockData),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.log("ERROR ON SERVICE: " + error)
        throw error;
    }

};

const removeStockItem = async (id) => {
    try {
        const response = await axios.delete(
            `https://minha-cozinha-be-4ff98ced1599.herokuapp.com/stock/${id}`
        );
    } catch (error) {
        console.log("ERROR ON SERVICE: " + error)
        throw error;
    }
}

export {getStockData, addStockData, removeStockItem};