const cafeList = document.querySelector("#cafe-list");

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