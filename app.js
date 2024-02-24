const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

const renderCafe = (doc) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    const city = document.createElement("span");

    li.setAttribute("data-id", doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;

    li.appendChild(name);
    li.appendChild(city);

    cafeList.appendChild(li);
}

db.collection('cafes').get().then((snapshot) => {
    snapshot.docs.forEach((doc) => {
        renderCafe(doc);
    });
});

form.addEventListener('submit', (e) => {
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
    e.preventDefault();
});