import axios from "axios";
import ItemDto from "../../model/ItemDto";

const getStockData = async (value) => {
    try {
        let data = await axios.get(
            `http://localhost:7000/stock/search?name=${value}`,
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
            'http://localhost:7000/stock',
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
            `http://localhost:7000/stock/${id}`
        );
    } catch (error) {
        console.log("ERROR ON SERVICE: " + error)
        throw error;
    }
}

export {getStockData, addStockData, removeStockItem};