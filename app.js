const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

const formFilter = document.querySelector("#filter-cafe-form");
const formOrder = document.querySelector("#order-cafe-form");

let filter = {};
let order = {};

const renderCafe = (doc) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    const city = document.createElement("span");
    const cross = document.createElement("div");

    li.setAttribute("data-id", doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });
}

const getCafes = () => {
    let query = db.collection('cafes')

    if (Object.hasOwn(filter, 'name') || Object.hasOwn(filter, 'city')) {
        if (Object.hasOwn(filter, 'name'))
            query = query.where('name', '==', filter.name);

        if (Object.hasOwn(filter, 'city'))
            query = query.where('city', '==', filter.city);
    }

    if (Object.hasOwn(order, 'by') && Object.hasOwn(order, 'type'))
        query = query.orderBy(order.by, order.type);


    const initialData = (cafeList.textContent == '');
    cafeList.textContent = '';
    query.get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            renderCafe(doc);

            if (initialData) {
                const optionName = document.createElement("option");
                optionName.textContent = doc.data().name;
                optionName.value = doc.data().name;

                const optionCity = document.createElement("option");
                optionCity.textContent = doc.data().city;
                optionCity.value = doc.data().city;

                formFilter['filter-name'].appendChild(optionName);
                formFilter['filter-city'].appendChild(optionCity);
            }
        });
    });
}

form.addEventListener('submit', (e) => {
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
    e.preventDefault();
});

formFilter.addEventListener('submit', (e) => {
    if (formFilter['filter-name'].value)
        filter['name'] = formFilter['filter-name'].value;

    if (formFilter['filter-city'].value)
        filter['city'] = formFilter['filter-city'].value;

    getCafes();
    e.preventDefault();
});

formOrder.addEventListener('submit', (e) => {
    order['by'] = formOrder['order-by'].value;
    order['type'] = formOrder['order-type'].value;

    getCafes();
    e.preventDefault();
});

getCafes();