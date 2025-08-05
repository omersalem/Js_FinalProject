// Variables
const avatar = document.querySelector(".avatar-img");
const main_image = document.querySelector(".content-img");
const username = document.querySelector(".username");
const time = document.querySelector(".time");
const title = document.querySelector(".card-title");
const text = document.querySelector(".card-text");
const comments_count = document.querySelector(".comments-count");
const cards = document.querySelector("#posts");
const loader = document.getElementById("loader");
let users = [];
const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let postId;
const fetchPost = async (postId) => {
  try {
    // 3. Use await to wait for the response
    // We are requesting data from a placeholder API
    const response = await axios.get(`${baseUrl}/posts/${postId}`);

    // 4. The data from the API is usually in `response.data`
    // We save the fetched data into our 'posts' variable
    posts = response.data;

    return posts;
  } catch (error) {
    // 5. If an error occurs, the catch block will run
    console.error("Error fetching data:", error);
    return []; // Return an empty array on error
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  showPost();
  displayCommentBar();
});

// Posts
let posts = [];

const sendButton = document.getElementById("comment-send");

// sendComment Function

let sendComment = async (event) => {
  const commentText = document.getElementById("comment-input").value;

  if (commentText.trim() === "") {
    setAlert("Comment cannot be empty.", "danger");
    return;
  }

  // --- THIS IS WHERE YOU WOULD GET YOUR TOKEN ---
  // In a real app, you would get this after the user logs in.
  const authToken = localStorage.getItem("token");

  try {
    const response = await axios.post(
      // 1. The API endpoint URL
      `${baseUrl}/posts/${postId}/comments`,

      // 2. The data payload (the object to send)
      {
        body: commentText,
        postId: postId,
      },

      // 3. The config object with the Authorization header
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json", // Often good practice to specify content type
        },
      }
    );
    const commentInput2 = document.getElementById("comment-input");
    commentInput2.value = "";
    showPost();
  } catch (error) {
    console.error("Error posting comment:", error);
    // Real APIs would return a 401 or 403 error if the token is invalid
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      setAlert("Authorization Failed: Please check your API token.", "danger");
    } else {
      setAlert("Error: Could not post your comment.", "danger");
    }
  }
};

const showPost = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  postId = urlParams.get("id");

  if (!postId) {
    document.body.innerHTML = "<h1>Error: Post ID not found.</h1>";
    return;
  }

  try {
    const post = await fetchPost(postId);
    if (post && post.data) {
      const postData = post.data;
      document.getElementById("post-title").textContent = postData.title;
      document.getElementById("post-body").textContent = postData.body;
      document.getElementById(
        "post-author"
      ).textContent = `@${postData.author.username}`;
      document.getElementById("post-image").src = postData.image;

      const commentsSection = document.getElementById("comments-section");

      if (postData.comments && postData.comments.length > 0) {
        let commentsHtml = "";

        postData.comments.forEach((comment) => {
          const profileImage =
            comment.author.profile_image &&
            typeof comment.author.profile_image === "string"
              ? comment.author.profile_image
              : "./profile-pics/1.jpg";
          commentsHtml += `
            <div class="comment">
              <img
                src="${profileImage}"
                class="rounded-circle avatar me-2 mb-1 avatar-img"
                alt="User Avatar"
                style="width: 40px; height: 40px"
              />
              <strong>@${comment.author.username}:</strong>
              <p>${comment.body}</p>
            </div>

          `;
        });
        commentsSection.innerHTML = commentsHtml;
        displayCommentBar();
      } else {
        commentsSection.textContent = "No comments yet.";
      }
    } else {
      document.getElementById("post-title").textContent = "Post not found";
      document.getElementById("post-body").textContent =
        "The requested post could not be loaded. Please try again later.";
    }
  } catch (error) {
    console.error("Error fetching post details:", error);
    document.getElementById("post-title").textContent = "Post not found";
    document.getElementById("post-body").textContent =
      "The requested post could not be loaded. Please try again later.";
  }
};

const displayCommentBar = () => {
  const commentInputSection = document.getElementById("comment-input-section");
  const token = localStorage.getItem("token");
  if (token) {
    commentInputSection.classList.remove("d-none");
  } else {
    commentInputSection.classList.add("d-none");
  }
};

// Fetch Posts

// Logout
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
