const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

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