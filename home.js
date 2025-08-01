//store the html elements in variables
const avatar = document.querySelector(".avatar-img");
const main_image = document.querySelector(".content-img");
const username = document.querySelector(".username");
const time = document.querySelector(".time");
const title = document.querySelector(".card-title");
const text = document.querySelector(".card-text");
const comments_count = document.querySelector(".comments-count");
const cards = document.querySelector("#posts");

// 1. Import axios

// This will hold our fetched data
let posts = [];

// 2. Create an async function to get the data
const fetchPosts = async () => {
  try {
    // 3. Use await to wait for the response
    // We are requesting data from a placeholder API
    const response = await axios.get(
      "https://tarmeezacademy.com/api/v1/posts?limit=20"
    );

    // 4. The data from the API is usually in `response.data`
    // We save the fetched data into our 'posts' variable
    posts = response.data;

    console.log("Data fetched and saved successfully!");
    console.log(posts.data); // Log the fetched posts
    if (posts.data && posts.data.length > 0) {
      console.log("First post image:", posts.data[0].image);
    }
    return posts.data;
  } catch (error) {
    // 5. If an error occurs, the catch block will run
    console.error("Error fetching data:", error);
    return []; // Return an empty array on error
  }
};

const displayPosts = async () => {
  cards.innerHTML = "";
  let posts = await fetchPosts();
  for (post of posts) {
    const postElement = document.createElement("div");

    postElement.innerHTML = `
<div class="card col-9 mx-auto mt-5 shadow">
          <div
            class="card-header bg-white py-3 d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center">
              <img
                src="./profile-pics/1.jpg"
                class="rounded-circle avatar me-2 avatar-img"
                alt="User Avatar"
                style="width: 40px; height: 40px"
              />
              <span class="fw-bold username">@${post.author.username}</span>
            </div>
            <a href="#" class="text-secondary"
              ><i class="bi bi-three-dots"></i
            ></a>
          </div>

          <div class="card-body  d-flex flex-column align-content-center">
            <img
              src="${post.image}"
              class="card-img-top img-fluid  content-img"
              alt="A large, sprawling tree with green leaves."
            />
            <p class="card-text time">
              <small class="text-muted">${post.created_at}</small>
            </p>
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">
              ${post.body}
            </p>
          </div>
          <div class="card-footer bg-white text-muted">
            <a href="#" class="text-decoration-none text-muted">
              <i class="bi bi-chat-left-text"></i> (${post.comments_count}) Comments
            </a>
          </div>
  </div>


        
`;
    cards.appendChild(postElement);
  }
};
displayPosts();
const register = async () => {
  const usernameInput = document.getElementById("username-reg");
  const passwordInput = document.getElementById("password-reg");
  const nameInput = document.getElementById("user-reg");
  const emailInput = document.getElementById("email-reg");

  const username = usernameInput.value;
  const password = passwordInput.value;
  const name = nameInput.value;
  const email = emailInput.value;

  try {
    const response = await axios.post(
      "https://tarmeezacademy.com/api/v1/register",
      {
        username: username,
        password: password,
        name: name,
        email: email,
      }
    );

    console.log("Success:", response.data.token);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    console.log(localStorage.getItem("user"));
    closeModal("registerModal");
    const message = "Registration successful";
    const type = "success";
    setAlert(message, type);
    navBar();
  } catch (error) {
    console.error("Error:", error.response.data.message);
    setAlert(error.response.data.message, "danger");
    navBar();
    closeModal("registerModal");
  }
};
const createPost = async () => {
  const titleInput = document.getElementById("postTitle");
  const bodyInput = document.getElementById("postContent");
  const imageInput = document.getElementById("postImage");

  const title = titleInput.value;
  const body = bodyInput.value;
  const image = imageInput.files[0];
// here we will use formdata to send the image to the server and json is not 
// used to send the image only text data is sent by json
  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);
  const url = "https://tarmeezacademy.com/api/v1/posts";
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(url, formData, config);
  } catch (error) {
    console.error("Error:", error);
  }

  titleInput.value = "";
  bodyInput.value = "";
  imageInput.value = "";
  closeModal("createPostModal");
  displayPosts();
};

const closeModal = (modalType) => {
  setTimeout(() => {
    const modal = bootstrap.Modal.getInstance(
      document.getElementById(modalType)
    );
    modal.hide();
  }, 500);
};
const login = async () => {
  const userInput = document.getElementById("user-input");
  const passwordInput = document.getElementById("password-input");
  const messageContainer = document.getElementById("message-container");

  const username = userInput.value;
  const password = passwordInput.value;

  messageContainer.innerHTML = `<div class="alert alert-info">Attempting to log in...</div>`;

  try {
    const response = await axios.post(
      "https://tarmeezacademy.com/api/v1/login",
      {
        username: username,
        password: password,
      }
    );

    console.log("Success:", response.data.token);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    messageContainer.innerHTML = `<div class="alert alert-success"><strong>Success!</strong> Logged in </div>`;

    const message = "Login successful";
    const type = "success";
    setAlert(message, type);
    navBar();
    closeModal("loginModal");
  } catch (error) {
    console.error("Error:", error);
    messageContainer.innerHTML = `<div class="alert alert-danger"><strong>Login Failed:</strong> An unexpected error occurred.</div>`;
    closeModal("loginModal");
    const message = "login failed";
    const type = "danger";
    setAlert(message, type);
    navBar();
  }

  // Clear the input fields
  userInput.value = "";
  passwordInput.value = "";

  // Close the login modal
};
function openLoginModal() {
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = "";
}
addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    login();
  }
});

function setAlert(message, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  alert(`${message}`, `${type}`);

  setTimeout(() => {
    alertPlaceholder.innerHTML = "";
  }, 2000);
}

function navBar() {
  if (localStorage.getItem("token")) {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user.username;
    console.log("token", localStorage.getItem("token"));

    document.getElementById("login-btn").classList.add("d-none");
    document.getElementById("register-btn").classList.add("d-none");
    document.getElementById("logout-btn").classList.remove("d-none");
    document.getElementById("nav-username").innerHTML = username;
    document.getElementById("nav-pic").src = user.profile_image;
    document.getElementById("nav-username").classList.remove("d-none");
    document.getElementById("nav-pic").classList.remove("d-none");
    document.getElementById("add-post").classList.remove("d-none");
  } else {
    document.getElementById("nav-username").classList.add("d-none");
    document.getElementById("nav-pic").classList.add("d-none");
    document.getElementById("login-btn").classList.remove("d-none");
    document.getElementById("register-btn").classList.remove("d-none");
    document.getElementById("logout-btn").classList.add("d-none");
    document.getElementById("add-post").classList.add("d-none");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navBar();
}
navBar();

// axios post login

// loginForm.addEventListener('submit', async (event) => {
//             // Prevent the default form submission behavior (which reloads the page)
//             event.preventDefault();

//             // Clear any previous messages
//             messageContainer.innerHTML = '';

//             // Get the values from the input fields
//             const username = document.getElementById('floatingUsername').value;
//             const password = document.getElementById('floatingPassword').value;

//             // Show a loading message
//             messageContainer.innerHTML = `<div class="alert alert-info">Attempting to log in...</div>`;

//             try {
//                 // --- AXIOS POST REQUEST ---
//                 // We send a POST request to a sample API endpoint.
//                 // In a real application, you would replace this URL with your own backend API endpoint.
//                 // The second argument to axios.post is the data payload (the object we want to send).
//                 const response = await axios.post('https://reqres.in/api/login', {
//                     email: username, // This sample API expects an 'email' field.
//                     password: password
//                 });

//                 // If the request is successful, the API will send back a response.
//                 // This sample API sends back a token.
//                 console.log('Success:', response.data);

//                 // Display a success message to the user
//                 messageContainer.innerHTML = `<div class="alert alert-success"><strong>Success!</strong> Logged in with token: ${response.data.token}</div>`;

//             } catch (error) {
//                 // If the request fails, the .catch() block will execute.
//                 console.error('Error:', error.response ? error.response.data : error.message);

//                 // Display an error message to the user.
//                 // This sample API returns an error message in `error.response.data.error`.
//                 const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
//                 messageContainer.innerHTML = `<div class="alert alert-danger"><strong>Login Failed:</strong> ${errorMessage}</div>`;
//             }
//         });
