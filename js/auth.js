const registration = (event) => {
  event.preventDefault();
  const username = getValue("username");
  const first_name = getValue("first_name");
  const last_name = getValue("last_name");
  const email = getValue("email");
  const password = getValue("password");
  const info = {
    username,
    first_name,
    last_name,
    email,
    password,
  };
  console.log(info);
  fetch("http://127.0.0.1:8000/user/list/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(info),
  })
    .then((res) => res.json())
    .then((data) => {
        alert('Registration completed!')
        window.location.href = "login.html"
    });
};

const login = (event) => {
  event.preventDefault();
  const email = getValue("email");
  const password = getValue("password");
  const info = {
    email,
    password,
  };
  fetch("http://127.0.0.1:8000/auth/token/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(info),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.access && data.refresh) {
        const tokens = {
          access: data.access,
          refresh: data.refresh,
        };
        localStorage.setItem("tokens", JSON.stringify(tokens));
        const token_seizer = data.access.split(".");
        const tokenPayload = JSON.parse(atob(token_seizer[1]));
        console.log(tokenPayload.username);
        window.location.href = "index.html"
      } else {
        throw new Error("Access or refresh token missing in the response");
      }
    });
};

const getToken = () => {
  const token = localStorage.getItem("tokens");
  const tokens = JSON.parse(token);
  return tokens ? tokens.refresh : null;
};

const updateToken = (refresh) => {
  const info = {
    refresh,
  };
  fetch("http://127.0.0.1:8000/auth/token/refresh/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(info),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.access && data.refresh) {
        const tokens = {
          access: data.access,
          refresh: data.refresh,
        };
        localStorage.setItem("tokens", JSON.stringify(tokens));
        const token_seizer = data.access.split(".");
        const tokenPayload = JSON.parse(atob(token_seizer[1]));
        console.log(tokenPayload.username);
      }
    });
};

const interval = setInterval(() => {
  const refresh = getToken();
  if (refresh) {
    updateToken(refresh);
  } else {
    stopTokenUpdater();
  }
}, 2000);

const stopTokenUpdater = () => {
  clearInterval(interval);
  return stopTokenUpdater;
};

const getValue = (id) => {
  const value = document.getElementById(id).value;
  return value;
};

const navigation = () => {
  const token = getToken();
  const nav = document.getElementById("gallery-navigation");
  nav.innerHTML = `
      <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="index.html">Home</a>
      </li>
      ${
        token
        ? 
        `
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="profile.html">Profile</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" onclick="logout()">Logout</a>
            </li>
        `
        : 
        
        `
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="registration.html">Registration</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="login.html">Login</a>
            </li>
        `
      }
    `;
};

const logout = () => {
    alert("Logout Successfully")
    localStorage.removeItem("tokens");
    window.location.href = "login.html"
}

navigation();
