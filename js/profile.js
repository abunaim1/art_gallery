const getTokenFromLocalStorage = () => {
  const tokens = localStorage.getItem("tokens");
  const parsedTokens = JSON.parse(tokens);
  const access = parsedTokens.access;
  const tokenParts = access.split(".");
  const decodedPayload = JSON.parse(atob(tokenParts[1]));
  return decodedPayload.username;
};

const artistProfile = () => {
    const username = getTokenFromLocalStorage();
    fetch("https://art-gallery-backend-2m0j.onrender.com/artwork/list/")
        .then((res) => res.json())
        .then((data) => {
            const artistData = data.filter((item) => item.artist.username === username);
            if (artistData.length > 0) {
                displayPrf(artistData[0], artistData);
            }
        });
};
const displayPrf = (artist, artworks) => {
    const parent = document.getElementById("artist-profile");
    let carouselItems = '';
    artworks.forEach((artwork, index) => {
        carouselItems += `
            <div class="carousel-item ${index === 0 ? 'active' : ''}" data-bs-interval="10000">
                <img src="${artwork.art_image}" class="d-block w-100 img-fluid" alt="${artwork.title}">
            </div>
        `;
    });

    parent.innerHTML = `
        <div class="profile-info">
            <h3>Your Profile Information: </h3>
            <p>Name: ${artist.artist.first_name} ${artist.artist.last_name}</p>
            <p>Username: ${artist.artist.username}</p>
            <p>Bio: ${artist.artist.bio}</p>
            <p>Email: ${artist.artist.email}</p>
        </div>
        <div>
            <h3>Your Artworks: </h3>
            <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${carouselItems}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div> 
    `;
};

artistProfile();
