import axios from "axios";
import ItemDto from "../../model/ItemDto";

const getShoppingListData = async (value) => {
    try {
        let data = await axios.get(
            `https://minha-cozinha-be-4ff98ced1599.herokuapp.com/shopping-list/search?name=${value}`,
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

const addShoppingListData = async (value) => {
    let stockData = new ItemDto(null, value)
    try {
        const response = await axios.post(
            'https://minha-cozinha-be-4ff98ced1599.herokuapp.com/shopping-list',
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

const removeShoppingListItem = async (id) => {
    try {
        const response = await axios.delete(
            `https://minha-cozinha-be-4ff98ced1599.herokuapp.com/shopping-list/${id}`
        );
    } catch (error) {
        console.log("ERROR ON SERVICE: " + error)
        throw error;
    }
}

export {getShoppingListData, addShoppingListData, removeShoppingListItem};