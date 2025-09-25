import axios from "axios";
import ItemDto from "../../model/ItemDto";
import API_BASE_URL from "../../config/api";

const getStockData = async (value) => {
    try {
        let data = await axios.get(
            `${API_BASE_URL}/stock/search?name=${value}`,
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
            `${API_BASE_URL}/stock`,
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
            `${API_BASE_URL}/stock/${id}`
        );
    } catch (error) {
        console.log("ERROR ON SERVICE: " + error)
        throw error;
    }
}

export {getStockData, addStockData, removeStockItem};