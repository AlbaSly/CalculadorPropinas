export default class DishesAPI {
    constructor() {}
    async getData_dishes() {
        const URL = `http://localhost:4000/platillos`;

        let currentData;
        await fetch(URL).then(response => response.json()).then(data => {
            currentData = data;
        }).catch(error => error);
        return currentData; 
    }
}