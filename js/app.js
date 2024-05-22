const loadGallery = () => {
  fetch("http://127.0.0.1:8000/artwork/list/")
    .then((res) => res.json())
    .then((data) => displayGallery(data));
};
const displayGallery = (data) => {
  const parent = document.getElementById("art");
  data.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("gallery-card-body");
    div.innerHTML = `
        <img class="img-fluid gallary-card-image" src=${item.art_image} alt="Card Image">
            <div class="card-body">                
                <h3 class="card-title">${item.title}</h3>
                <p class="card-description">by ${item.artist.first_name} ${item.artist.last_name}</p>
                <p class="card-description">Creation Time: ${item.creation_date}</p>
                <button  class="card-button btn btn-success">Explore</button>
            </div>
        `;
    parent.appendChild(div);
  });
};
loadGallery();
