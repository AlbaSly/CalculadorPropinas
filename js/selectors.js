import {saveClient} from './app.js';
import {client} from './global.js';

export const btnSaveClient_el = document.querySelector('#guardar-cliente');
export const orderTable_el = document.querySelector('#mesa');
export const orderHour_el = document.querySelector('#hora');
export const form_el =document.querySelector('.modal-body form');

export default function loadEventListenners() {
    form_el.reset();

    btnSaveClient_el.addEventListener('click', saveClient);

    orderTable_el.addEventListener('input', fillDataObj_client);
    orderHour_el.addEventListener('input', fillDataObj_client);
}

function fillDataObj_client(ev) {
    client[ev.target.name] = ev.target.value;
    console.log(client);
}