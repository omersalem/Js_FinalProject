// Loader Functions
const showLoader = () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("show");
  }
};

const hideLoader = () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.remove("show");
  }
};

// Close Modal
const closeModal = (modalType) => {
  const modalElement = document.getElementById(modalType);
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
};

// Alert
function setAlert(message, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  if (alertPlaceholder) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.append(wrapper);
    setTimeout(() => {
      alertPlaceholder.innerHTML = "";
    }, 2000);
  }
}

// Navbar Function
function navBar() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const navUsername = document.getElementById("nav-username");
  const navPic = document.getElementById("nav-pic");
  const addPostBtn = document.getElementById("add-post");

  if (token) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (loginBtn) loginBtn.classList.add("d-none");
    if (registerBtn) registerBtn.classList.add("d-none");
    if (logoutBtn) logoutBtn.classList.remove("d-none");
    if (navUsername) {
      navUsername.innerHTML = user.username;
      navUsername.classList.remove("d-none");
    }
    if (navPic) {
      navPic.src = user.profile_image;
      navPic.classList.remove("d-none");
    }
    if (addPostBtn) addPostBtn.classList.remove("d-none");
  } else {
    if (loginBtn) loginBtn.classList.remove("d-none");
    if (registerBtn) registerBtn.classList.remove("d-d-none");
    if (logoutBtn) logoutBtn.classList.add("d-none");
    if (navUsername) navUsername.classList.add("d-none");
    if (navPic) navPic.classList.add("d-none");
    if (addPostBtn) addPostBtn.classList.add("d-none");
  }
}

// Login Function
const login = async () => {
  const userInput = document.getElementById("user-input");
  const passwordInput = document.getElementById("password-input");
  const messageContainer = document.getElementById("message-container");

  const username = userInput.value;
  const password = passwordInput.value;

  if (messageContainer) {
    messageContainer.innerHTML = `<div class="alert alert-info">Attempting to log in...</div>`;
  }

  try {
    const response = await axios.post(
      "https://tarmeezacademy.com/api/v1/login",
      {
        username: username,
        password: password,
      }
    );
    const user = response.data.user;

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(user));
    
    if (messageContainer) {
      messageContainer.innerHTML = `<div class="alert alert-success"><strong>Success!</strong> Logged in </div>`;
    }

    setAlert("Login successful", "success");
    navBar();
    if (typeof displayCommentBar === "function") {
      displayCommentBar();
    }
    // Refresh user posts if on userPosts page
    if (typeof refreshUserPosts === "function") {
      refreshUserPosts();
    }
    // I will explain this to the user and then mark the task as complete. The code `if (typeof displayCommentBar === "function")` is a safety check. Here's what it does:

    // 1. `typeof displayCommentBar`: This checks the type of the `displayCommentBar` variable.
    // 2. `=== "function"`: This compares the type to the string "function".

    // The entire expression is `true` only if `displayCommentBar` is a function.

    // This check is necessary because the `login` and `logout` functions are in `main.js`, which is used by both `home.html` and `details.html`. However, the `displayCommentBar` function is only defined in `details.js`.

    // Without this check, when you are on `home.html` and you log in or out, the code would try to call `displayCommentBar()`, which doesn't exist on that page, and this would cause an error.

    // By adding this check, we ensure that `displayCommentBar()` is only called when it actually exists, which is on the `details.html` page.

    closeModal("loginModal");
  } catch (error) {
    console.error("Error:", error);
    if (messageContainer) {
      messageContainer.innerHTML = `<div class="alert alert-danger"><strong>Login Failed:</strong> An unexpected error occurred.</div>`;
    }
    setAlert("login failed", "danger");
    navBar();
    closeModal("loginModal");
  }

  userInput.value = "";
  passwordInput.value = "";
};

// Register
const register = async () => {
  const usernameInput = document.getElementById("username-reg");
  const passwordInput = document.getElementById("password-reg");
  const nameInput = document.getElementById("user-reg");
  const emailInput = document.getElementById("email-reg");
  const imageInput = document.getElementById("imageReg");

  const username = usernameInput.value;
  const password = passwordInput.value;
  const name = nameInput.value;
  const email = emailInput.value;
  const image = imageInput.files[0];

  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("image", image);
    const url = "https://tarmeezacademy.com/api/v1/register";

    const response = await axios.post(url, formData);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    closeModal("registerModal");
    setAlert("Registration successful", "success");
    navBar();
  } catch (error) {
    setAlert(error.response.data.message, "danger");
    navBar();
    closeModal("registerModal");
  }
};

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navBar();
  if (typeof displayCommentBar === "function") {
    displayCommentBar();
  }
  // Refresh user posts if on userPosts page
  if (typeof refreshUserPosts === "function") {
    refreshUserPosts();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  navBar();
});
