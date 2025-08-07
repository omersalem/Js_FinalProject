let currentPage = 0;
const baseUrl = "https://tarmeezacademy.com/api/v1";
const cards = document.querySelector("#posts");

const displayUserPosts = async () => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    setAlert("Please log in to view your posts.", "warning");
    return;
  }

  currentPage = currentPage + 1;

  let response = await fetchUserPosts(user.id, currentPage);
  if (!response || !response.data) {
    console.log("No valid response received");
    return;
  }
  
  let posts = response.data;
  let lastPage = response.meta ? response.meta.last_page : 1;
  
  if (response.meta && currentPage > lastPage) {
    return;
  }
  
  // If no posts found, show empty state
  if (!posts || posts.length === 0) {
    if (currentPage === 1) {
      showEmptyState();
    }
    return;
  }
  
  console.log("Rendering", posts.length, "posts");
  
  for (let post of posts) {
    const profileImage =
      post.author.profile_image && typeof post.author.profile_image === "string"
        ? post.author.profile_image
        : "./profile-pics/1.jpg";
    const postElement = document.createElement("div");
    postElement.className = "card"; // Add a class for styling
    const tags = await fetchTags(post.id);

    postElement.dataset.id = post.id;
    const postId = postElement.dataset.id;
    const user = JSON.parse(localStorage.getItem("user"));
    let editButton = "";
    let deleteButton = "";

    if (user && user.id === post.author.id) {
      editButton = `<button type="button" id="editPost" class="btn btn-outline-success" onclick="editPost('${encodeURIComponent(
        JSON.stringify(post)
      )}')">edit</button>`;
      deleteButton = `<button type="button" id="deletePost" class="btn btn-outline-danger" onclick="deletePost(${postId})">delete</button>`;
    }

    postElement.innerHTML = `
<div class="card col-9 mx-auto mt-5 mb-5 w-100 shadow">
          <div
            class="card-header bg-white py-3 d-flex justify-content-between position-relative  align-items-center"
          >
            <div class="d-flex align-items-center ">
              <img
                src="${profileImage}"
                class="rounded-circle avatar me-2 avatar-img"
                alt="User Avatar"
                style="width: 40px; height: 40px"
              />
              <span class="fw-bold username">@${post.author.username}</span>
              
              
            </div>
            <div id="edit-container" class="d-flex justify-content-end  w-100 ">
              ${deleteButton}
              ${editButton}
              </div>
           
          </div>

          <div class="card-body  d-flex flex-column align-content-center" onclick="showComments(${postId})">
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
          <div class="card-footer bg-white d-flex justify-content-between text-muted">
            <a href="#" class="text-decoration-none text-muted">
              <i class="bi bi-chat-left-text"></i> (${post.comments_count}) Comments
            </a>
            <div class="tags"></div>
          </div>
  </div>
`;
    const tagsContainer = postElement.querySelector(".tags");
    for (const tag of tags) {
      const tagElement = document.createElement("span");
      tagElement.className =
        "bg-success rounded-pill shadow-sm fs-5 p-2 text-danger";
      tagElement.textContent = tag.name;
      tagsContainer.appendChild(tagElement);
    }
    cards.appendChild(postElement);
  }
};
const fetchUserPosts = async (userId, currentPage = 1) => {
  try {
    // Fetch posts for a specific user
    const response = await axios.get(
      `${baseUrl}/users/${userId}/posts?limit=10&page=${currentPage}`
    );

    // The data from the API is usually in `response.data`
    posts = response.data;

    console.log("User posts fetched successfully! Found", posts.data ? posts.data.length : 0, "posts");
    return posts;
  } catch (error) {
    // If an error occurs, the catch block will run
    console.error("Error fetching user posts:", error);
    
    // If no posts found for user (404), show empty state instead of error
    if (error.response && error.response.status === 404) {
      return { data: [], meta: { last_page: 1 } };
    }
    
    setAlert("Error fetching user posts, please try again later.", "danger");
    return { data: [], meta: { last_page: 1 } };
  }
};
const fetchTags = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/posts/${id}`);
    const tags = response.data.data.tags;
    console.log(tags);
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};

// Show Comments Function
let showComments = (id) => {
  // Redirect to the details page with the correct ID
  window.location.href = `details.html?id=${id}`;
};

// Edit Post Function
let editPost = (postObject) => {
  let post = JSON.parse(decodeURIComponent(postObject));
  const modal = new bootstrap.Modal(document.getElementById("updatePostModal"));

  document.getElementById("updatepostTitle").value = post.title;
  document.getElementById("updatepostContent").value = post.body;
  document.getElementById("updatePostModalLabel").textContent = "Edit Post";
  const postId = post.id;
  const updateButton = document.querySelector(".update-btn");

  updateButton.id = postId;
  modal.show();
};

// Delete Post Function
let deletePost = async (postId) => {
  // Show confirmation dialog
  const confirmDelete = confirm(
    "Are you sure you want to delete this post? This action cannot be undone."
  );

  if (!confirmDelete) {
    return; // User cancelled the deletion
  }

  let token = localStorage.getItem("token");
  const URL = `${baseUrl}/posts/${postId}`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.delete(URL, config);
    setAlert("Post deleted successfully", "success");
    cards.innerHTML = "";
    currentPage = 0;
    displayUserPosts();
  } catch (error) {
    console.error("Error deleting post:", error);
    setAlert("Error deleting post. Please try again later.", "danger");
  }
};

// createPost Function
const createPost = async () => {
  showLoader(); // Show loader at the beginning

  const titleInput = document.getElementById("postTitle");
  const bodyInput = document.getElementById("postContent");
  const imageInput = document.getElementById("postImage");

  const title = titleInput.value;
  const body = bodyInput.value;
  const image = imageInput.files[0];

  // Client-side image size validation
  const MAX_IMAGE_SIZE_MB = 5;
  const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024; // 5MB

  if (image && image.size > MAX_IMAGE_SIZE_BYTES) {
    setAlert(
      `Image size exceeds the maximum limit of ${MAX_IMAGE_SIZE_MB}MB. Please choose a smaller image.`,
      "danger"
    );
    closeModal("createPostModal");
    hideLoader(); // Hide loader if validation fails
    return; // Stop the function execution
  }

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
    setAlert("Post created successfully", "success");
    cards.innerHTML = "";
    currentPage = 0;
    displayUserPosts();
  } catch (error) {
    console.error("Error during post creation:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error.response) {
      if (error.response.status === 413) {
        errorMessage = "Image too large. Please upload a smaller image.";
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      errorMessage = "Network error: No response received from server.";
    } else {
      errorMessage = error.message;
    }
    setAlert(errorMessage, "danger");
    closeModal("registerModal");
  } finally {
    hideLoader(); // Hide loader after success or error
  }

  titleInput.value = "";
  bodyInput.value = "";
  imageInput.value = "";
  closeModal("createPostModal");
};

// updatePost Function
const updatePost = async () => {
  const titleInput = document.getElementById("updatepostTitle");
  const bodyInput = document.getElementById("updatepostContent");
  const imageInput = document.getElementById("updatepostImage");

  const title = titleInput.value;
  const body = bodyInput.value;
  const image = imageInput.files[0];

  // Client-side image size validation
  const MAX_IMAGE_SIZE_MB = 5;
  const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024; // 5MB

  if (image && image.size > MAX_IMAGE_SIZE_BYTES) {
    setAlert(
      `Image size exceeds the maximum limit of ${MAX_IMAGE_SIZE_MB}MB. Please choose a smaller image.`,
      "danger"
    );
    closeModal("updatePostModal");

    return; // Stop the function execution
  }
  // here we will use formdata to send the image to the server and json is not
  // used to send the image only text data is sent by json
  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);
  formData.append("_method", "PUT"); // Use PUT method for update so when the api is laravel based we write psot instead of put
  // in the await axios.post(url, formData, config); but we add _method: "PUT" to the formData
  const updateButton = document.querySelector(".update-btn");
  const url = `https://tarmeezacademy.com/api/v1/posts/${updateButton.id}`;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(url, formData, config);
    setAlert("Post updated successfully", "success");
    cards.innerHTML = "";
    currentPage = 0;
    displayUserPosts();
  } catch (error) {
    console.error("Error during post update:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error.response) {
      if (error.response.status === 413) {
        errorMessage = "Image too large. Please upload a smaller image.";
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      errorMessage = "Network error: No response received from server.";
    } else {
      errorMessage = error.message;
    }
    setAlert(errorMessage, "danger");
    closeModal("updatePostModal");
  } finally {
    hideLoader(); // Hide loader after success or error
  }

  titleInput.value = "";
  bodyInput.value = "";
  imageInput.value = "";
  closeModal("updatePostModal");
};

// Function to show empty state message
const showEmptyState = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    cards.innerHTML = `
      <div class="text-center mt-5">
        <h3>No Posts Yet</h3>
        <p class="text-muted">You haven't created any posts yet. Click the + button to create your first post!</p>
      </div>
    `;
  } else {
    cards.innerHTML = `
      <div class="text-center mt-5">
        <h3>Please Log In</h3>
        <p class="text-muted">You need to log in to view your posts.</p>
      </div>
    `;
  }
};

// Function to refresh user posts (called after login)
const refreshUserPosts = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    cards.innerHTML = ""; // Clear existing content
    currentPage = 0; // Reset page counter
    displayUserPosts();
  } else {
    showEmptyState();
  }
};

// Missing function for login modal
const openLoginModal = () => {
  // This function is called by the login button but the modal opens via Bootstrap data attributes
  // So we don't need to do anything here, just prevent the error
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    displayUserPosts();
  } else {
    showEmptyState();
  }
});
