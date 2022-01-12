import UI from './classes/UI.js';
import * as Global from './global.js';
import loadEventListenners,* as Selectors from './selectors.js';

window.onload = () => {
    loadEventListenners();
}

export function saveClient() {
    if (validate(Global.client)) {
        new UI().hideFormModal();
        new UI().displaySections();
        new UI().displayDishes();
    }
}

/**
     * Actualiza el array de órdenes agregando el nuevo platillo y su cantidad
     * @param {dish} dish 
     */
export function addDishToOrders(dish) {
    //Obtener el array de órdenes
    let {order} = Global.client;

    if (order.some(ord => ord.id === dish.id)) {
        const orderUpdated = order.map(ord => {
            if (ord.id === dish.id) {
                ord.amount = dish.amount;
            }
            return ord;
        });

        Global.client.order = [...orderUpdated];
    } else {
        Global.client.order = [dish, ...Global.client.order];
    }
    //FILTRO FINAL
    Global.client.order = Global.client.order.filter(ord => ord.amount > 0);

    console.log(Global.client);
}
/**
 * Calcular el subtotal de un platillo
 * @param {dish} dish obj 
 */
export function calcDishSubtotal(dish) {
    return dish.amount * dish.precio;
}
export function deleteDishOrder(dishId) {
    Global.client.order = Global.client.order.filter(ord => ord.id !== dishId);
    
    new UI().clearDishInputHTML(dishId);
    new UI().clearContentHTML();
    new UI().displayOrdersResume();
}
export function calcTip() {
    const { order } = Global.client;
    
    let subTotal = 0;    
    order.forEach(ord => {
        subTotal += calcDishSubtotal(ord);
    });
    
    const radioSelected = document.querySelector('[name="tip"]:checked').value;
    const tip = ((subTotal * parseInt(radioSelected)) / 100);
    
    const total = tip + subTotal;

    new UI().displayPayInfo(subTotal, tip, total);
}
function validate(obj) {
    if (Object.values(obj).some(value => value === '' || value === 0)) {
        new UI().displayAlert('Todos los campos son obligatorios');
        return false;
    }
    return true;
}