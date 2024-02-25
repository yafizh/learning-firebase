const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");
const formEdit = document.querySelector("#edit-cafe-form");

const formFilter = document.querySelector("#filter-cafe-form");
const formOrder = document.querySelector("#order-cafe-form");

let filter = {};
let order = {};

const editModal = document.getElementById("editModal");

window.onclick = function (event) {
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
}

const renderCafe = (doc) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    const city = document.createElement("span");
    const action = document.createElement("div");
    const cross = document.createElement("span");
    const edit = document.createElement("span");

    li.setAttribute("data-id", doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';
    edit.textContent = 'e';

    li.appendChild(name);
    li.appendChild(city);

    action.appendChild(cross);
    action.appendChild(edit);

    li.appendChild(action);

    cafeList.appendChild(li);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });

    edit.addEventListener('click', (e) => {
        editModal.style.display = "block";
        formEdit.setAttribute('data-id', e.target.parentElement.parentElement.getAttribute('data-id'));
        formEdit.name.value = doc.data().name;
        formEdit.city.value = doc.data().city;
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

    cafeList.textContent = '';
    query.get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            renderCafe(doc);
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

formEdit.addEventListener('submit', (e) => {
    const id = formEdit.getAttribute('data-id');

    // set overidde
    // update just change value that we send
    db.collection('cafes').doc(id).update({
        name: formEdit.name.value,
        city: formEdit.city.value
    });
    editModal.style.display = "none";
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

db.collection('cafes').onSnapshot((snapshot) => {
    const initialData = (cafeList.textContent == '');
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
        if (change.type == 'added') {

            renderCafe(change.doc);

            if (initialData) {
                const optionName = document.createElement("option");
                optionName.textContent = change.doc.data().name;
                optionName.value = change.doc.data().name;

                const optionCity = document.createElement("option");
                optionCity.textContent = change.doc.data().city;
                optionCity.value = change.doc.data().city;

                formFilter['filter-name'].appendChild(optionName);
                formFilter['filter-city'].appendChild(optionCity);
            }
        } else if (change.type == 'removed') {
            let li = cafeList.querySelector(`[data-id='${change.doc.id}']`);
            cafeList.removeChild(li);
        } else if (change.type == 'modified') {
            let li = cafeList.querySelector(`[data-id='${change.doc.id}']`);
            cafeList.removeChild(li);
            renderCafe(change.doc);
        }
    });
})