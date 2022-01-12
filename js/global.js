export let client = {
    table: '',
    time: '',
    order: []
};

export function clearClientObj() {
    client.table = '',
    client.time = '',
    order = []
}

export const categories = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}