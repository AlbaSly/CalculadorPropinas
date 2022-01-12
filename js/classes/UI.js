import * as Global from '../global.js';
import DishesAPI from "../API/Dishes.js";
import { form_el } from "../selectors.js";
import {addDishToOrders, calcDishSubtotal, calcTip, deleteDishOrder} from '../app.js';

export default class UI {
    constructor() {}
    displayAlert(message, timing=2.5) {
        if (document.querySelector('.invalid-feedback')) return;
        
        const alert = document.createElement('div');
        alert.classList.add(
            'invalid-feedback',
            'd-block',
            'text-center'
        );
        alert.textContent = message;

        form_el.appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, timing*1000);
    }
    displaySections() {
        const hiddenSections = document.querySelectorAll('.d-none');
        hiddenSections.forEach(section => section.classList.remove('d-none'));
    }
    async displayDishes() {
        const content = document.querySelector('#platillos .contenido');

        const dishesResult = await new DishesAPI().getData_dishes();
        
        dishesResult.forEach(dish => {
            const {id, nombre, precio, categoria} = dish;

            const row_div = document.createElement('div');
            row_div.classList.add(
              'row',
              'border-top'  
            );

            const dishName_div = document.createElement('div');
            dishName_div.classList.add(
                'col-md-4',
                'py-3'
            );
            dishName_div.textContent = nombre;

            const dishCost_div = document.createElement('div');
            dishCost_div.classList.add(
                'col-md-3',
                'py-3',
                'fw-bold'
            );
            dishCost_div.textContent = `$${precio}`;

            const dishCat_div = document.createElement('div');
            dishCat_div.classList.add(
                'col-md-3',
                'py-3'
            );
            dishCat_div.textContent = Global.categories[categoria];

            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.min = 0;
            amountInput.value = 0;
            amountInput.id = `dish-${id}`;
            amountInput.classList.add('form-control');
            amountInput.onchange = () => {
                const amount = parseInt(amountInput.value);
                //spread operator para que nos cree un objeto anidado a amount
                addDishToOrders({...dish, amount});

                this.clearContentHTML();
                this.displayOrdersResume();
            }; 
            
            const add_div = document.createElement('div');
            add_div.classList.add('col-md-2', 'py-3');
            add_div.appendChild(amountInput);

            row_div.appendChild(dishName_div);
            row_div.appendChild(dishCost_div);
            row_div.appendChild(dishCost_div);
            row_div.appendChild(add_div);

            content.appendChild(row_div);
        });
    }
    clearPreviousAlert() {
        document.querySelector('.invalid-feedback').remove();
    }
    hideFormModal() {
        const formModal_el = document.querySelector('#formulario');
        const modal = bootstrap.Modal.getInstance(formModal_el);
        modal.hide();
    }
    displayOrdersResume() {
        const content = document.querySelector('#resumen .contenido');
        if (!Global.client.order.length) {
            content.innerHTML = `
            <p class="text-center">Añade los elementos del pedido</p>
            `;    
            return;
        }
        
        const resume_div = document.createElement('div');
        resume_div.classList.add(
            'col-md-6',
            'card',
            'py-5',
            'px-3',
            'shadow'
        );
        //Table_div
        const table_div = document.createElement('p');
        table_div.textContent = 'Mesa: ';
        table_div.classList.add('fw-bold');
        //Table_span inside Table_div
        const table_span = document.createElement('span');
        table_span.textContent = Global.client.table;
        table_span.classList.add('fw-normal');
        
        table_div.appendChild(table_span);

        //Time_p 
        const time_p = document.createElement('p');
        time_p.textContent = 'Hora: ';
        time_p.classList.add('fw-bold');
        //
        const time_span = document.createElement('span');
        time_span.textContent = Global.client.time;
        time_span.classList.add('fw-normal');

        time_p.appendChild(time_span);

        //
        const heading = document.createElement('h3');
        heading.textContent = `Platillos Pedidos`;
        heading.classList.add('my-4');

        const group = document.createElement('ul');
        group.classList.add('list-group');

        const {order} = Global.client;
        order.forEach(ord => {
            const  {id, nombre, precio, amount} = ord;

            const list = document.createElement('li');
            list.classList.add('list-group-item');

            const name_h4 = document.createElement('h4');
            name_h4.classList.add('text-center', 'my-4');
            name_h4.textContent = nombre;

            const amount_p = document.createElement('p');
            amount_p.classList.add('fw-bold');
            amount_p.textContent = 'Cantidad: ';

            const amountValue_span = document.createElement('span');
            amountValue_span.classList.add('fw-normal');
            amountValue_span.textContent = amount;

            const price_p = document.createElement('p');
            price_p.classList.add('fw-bold');
            price_p.textContent = 'Precio: ';

            const priceValue_span = document.createElement('span');
            priceValue_span.classList.add('fw-normal');
            priceValue_span.textContent = `${precio}`;

            const subTotal_p = document.createElement('p');
            subTotal_p.classList.add('fw-bold');
            subTotal_p.textContent = 'Subtotal: ';

            const subTotalValue_span = document.createElement('span');
            subTotalValue_span.classList.add('fw-normal');
            subTotalValue_span.textContent = calcDishSubtotal(ord);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-danger');
            deleteBtn.textContent = 'Eliminar Pedido';

            deleteBtn.onclick = () => {
                deleteDishOrder(id);
            };

            amount_p.appendChild(amountValue_span);
            price_p.appendChild(priceValue_span);
            subTotal_p.appendChild(subTotalValue_span);

            list.appendChild(name_h4);
            list.appendChild(amount_p);
            list.appendChild(price_p);
            list.appendChild(subTotal_p);
            list.appendChild(deleteBtn);

            group.appendChild(list);
        });

        resume_div.appendChild(table_div);
        resume_div.appendChild(time_p);
        resume_div.appendChild(heading);
        resume_div.appendChild(group);

        content.appendChild(resume_div);

        this.displayTipList();
    }
    displayTipList() {
        const content = document.querySelector('#resumen .contenido');
        
        const form = document.createElement('div');
        form.classList.add('col-md-6', 'formulario');
        
        const heading = document.createElement('h3');
        heading.classList.add('my-4');
        heading.textContent = 'Propina';
        
        const checkBox_10percent = document.createElement('input');
        checkBox_10percent.type = 'radio';
        checkBox_10percent.name = 'tip';
        checkBox_10percent.value = '10';
        checkBox_10percent.classList.add('form-check-input');
        checkBox_10percent.onclick = calcTip;

        const checkLabel_10percent = document.createElement('label');
        checkLabel_10percent.textContent = '10%';
        checkLabel_10percent.classList.add('form-check-label');

        const checkDiv_10percent = document.createElement('div');
        checkDiv_10percent.classList.add('form-check');

        checkDiv_10percent.appendChild(checkBox_10percent);
        checkDiv_10percent.appendChild(checkLabel_10percent);

    
        const checkBox_25percent = document.createElement('input');
        checkBox_25percent.type = 'radio';
        checkBox_25percent.name = 'tip';
        checkBox_25percent.value = '25';
        checkBox_25percent.classList.add('form-check-input');
        checkBox_25percent.onclick = calcTip;

        const checkLabel_25percent = document.createElement('label');
        checkLabel_25percent.textContent = '25%';
        checkLabel_25percent.classList.add('form-check-label');

        const checkDiv_25percent = document.createElement('div');
        checkDiv_25percent.classList.add('form-check');

        checkDiv_25percent.appendChild(checkBox_25percent);
        checkDiv_25percent.appendChild(checkLabel_25percent);


        const checkBox_50percent = document.createElement('input');
        checkBox_50percent.type = 'radio',
        checkBox_50percent.name = 'tip';
        checkBox_50percent.value = '50';
        checkBox_50percent.classList.add('form-check-input');
        checkBox_50percent.onclick = calcTip;

        const checkLabel_50percent = document.createElement('label');
        checkLabel_50percent.textContent = '50%';
        checkLabel_50percent.classList.add('form-check-label');

        const checkDiv_50percent = document.createElement('div');
        checkDiv_50percent.classList.add('form-check');

        checkDiv_50percent.appendChild(checkBox_50percent);
        checkDiv_50percent.appendChild(checkLabel_50percent);

        //Add to form

        form.appendChild(heading);
        form.appendChild(checkDiv_10percent);
        form.appendChild(checkDiv_25percent);
        form.appendChild(checkDiv_50percent);

        content.appendChild(form);
    }
    displayPayInfo(subTotal, tip, total) {
        this.clearPayInfoHTML();

        const total_div = document.createElement('div');
        total_div.classList.add('total-pagar');

        const subTotal_p = document.createElement('p');
        subTotal_p.classList.add('fs-3', 'fw-bold', 'mt-5');
        subTotal_p.textContent = 'Subtotal consumo: ';

        const subTotal_span = document.createElement('span');
        subTotal_span.classList.add('fw-normal');
        subTotal_span.textContent = `$${subTotal}`;
        
        subTotal_p.appendChild(subTotal_span);

        const tip_p = document.createElement('p');
        tip_p.classList.add('fs-3', 'fw-bold');
        tip_p.textContent = 'Propina: ';

        const tip_span = document.createElement('span');
        tip_span.classList.add('fw-normal');
        tip_span.textContent = `$${tip}`;

        tip_p.appendChild(tip_span);

        const total_p = document.createElement('p');
        total_p.classList.add('fs-3', 'fw-bold');
        total_p.textContent = 'Total a pagar: ';

        const total_span = document.createElement('span');
        total_span.classList.add('fw-normal');
        total_span.textContent = `$${total}`;

        total_p.appendChild(total_span);

        total_div.appendChild(subTotal_p);
        total_div.appendChild(tip_p);
        total_div.appendChild(total_p);

        const form = document.querySelector('.formulario');

        form.appendChild(total_div);
    }
    clearDishInputHTML(dishID) {
        document.querySelector(`#dish-${dishID}`).value = 0;
    }
    clearPayInfoHTML() {
        if (document.querySelector('.total-pagar')) {
            document.querySelector('.total-pagar').remove();
        }
    }
    clearContentHTML() {
        document.querySelector('#resumen .contenido').innerHTML = null;
    }
}