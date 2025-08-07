# UserPosts.js Code Explanation

This document explains every part of the `userPosts.js` file in simple, easy-to-understand English. This file handles displaying, creating, editing, and deleting posts for a specific user.

## 📋 Table of Contents
1. [Global Variables](#global-variables)
2. [Main Display Function](#main-display-function)
3. [API Functions](#api-functions)
4. [User Interaction Functions](#user-interaction-functions)
5. [CRUD Operations](#crud-operations)
6. [Helper Functions](#helper-functions)
7. [Initialization](#initialization)

---

## 🌐 Global Variables

```javascript
let currentPage = 0;
const baseUrl = "https://tarmeezacademy.com/api/v1";
const cards = document.querySelector("#posts");
```

**What this does:**
- `currentPage`: Keeps track of which page of posts we're currently viewing (starts at 0)
- `baseUrl`: The main web address for our API (where we get data from)
- `cards`: Finds the HTML element with ID "posts" where we'll display all the posts

**Why we need this:**
- `currentPage` helps us load more posts when the user scrolls down
- `baseUrl` avoids repeating the same web address everywhere
- `cards` gives us a place to put all the posts on the webpage

---

## 🎯 Main Display Function

### `displayUserPosts()` - The Heart of the Application

```javascript
const displayUserPosts = async () => {
```

**What "async" means:** This function can wait for things to happen (like getting data from the internet) without freezing the webpage.

#### Step 1: Check if User is Logged In

```javascript
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  setAlert("Please log in to view your posts.", "warning");
  return;
}
```

**What this does:**
- Looks in the browser's storage for user information
- `JSON.parse()` converts the stored text back into a JavaScript object
- If no user is found, shows a warning message and stops the function

**Why this is important:** Only logged-in users should see their posts!

#### Step 2: Prepare for Loading More Posts

```javascript
currentPage = currentPage + 1;
```

**What this does:** Increases the page number by 1 (so if we were on page 0, now we're on page 1)

**Why:** Each time we load posts, we want to get the next batch of posts

#### Step 3: Get Posts from the Server

```javascript
let response = await fetchUserPosts(user.id, currentPage);
if (!response || !response.data) {
  console.log("No valid response received");
  return;
}
```

**What this does:**
- Calls another function to get posts from the internet
- `await` means "wait until we get the posts before continuing"
- Checks if we actually got valid data back
- If not, stops the function

#### Step 4: Process the Response

```javascript
let posts = response.data;
let lastPage = response.meta ? response.meta.last_page : 1;

if (response.meta && currentPage > lastPage) {
  return;
}
```

**What this does:**
- `posts` gets the actual list of posts from the response
- `lastPage` finds out how many pages of posts exist (defaults to 1 if not specified)
- If we've already loaded all pages, stop trying to load more

#### Step 5: Handle Empty Results

```javascript
if (!posts || posts.length === 0) {
  if (currentPage === 1) {
    showEmptyState();
  }
  return;
}
```

**What this does:**
- Checks if we got no posts back
- If it's the first page and no posts exist, shows a "no posts" message
- Stops the function

#### Step 6: Display Each Post

```javascript
console.log("Rendering", posts.length, "posts");

for (let post of posts) {
  // ... (detailed explanation below)
}
```

**What this does:**
- Logs how many posts we're about to show
- Goes through each post one by one and displays it

##### For Each Post:

**A. Set Up Profile Image**
```javascript
const profileImage =
  post.author.profile_image && typeof post.author.profile_image === "string"
    ? post.author.profile_image
    : "./profile-pics/1.jpg";
```
- Uses the author's profile picture if it exists
- Otherwise uses a default image

**B. Create HTML Element**
```javascript
const postElement = document.createElement("div");
postElement.className = "card";
```
- Creates a new HTML div element
- Gives it the "card" class for styling

**C. Get Tags for the Post**
```javascript
const tags = await fetchTags(post.id);
```
- Gets any tags associated with this post (like #funny, #news, etc.)

**D. Set Up Edit/Delete Buttons**
```javascript
postElement.dataset.id = post.id;
const postId = postElement.dataset.id;
const user = JSON.parse(localStorage.getItem("user"));
let editButton = "";
let deleteButton = "";

if (user && user.id === post.author.id) {
  editButton = `<button type="button" id="editPost" class="btn btn-outline-success" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">edit</button>`;
  deleteButton = `<button type="button" id="deletePost" class="btn btn-outline-danger" onclick="deletePost(${postId})">delete</button>`;
}
```

**What this does:**
- Stores the post ID in the HTML element
- Checks if the current user is the author of this post
- If yes, creates edit and delete buttons
- If no, leaves the buttons empty (other people can't edit your posts!)

**E. Create the Post HTML**
```javascript
postElement.innerHTML = `
<div class="card col-9 mx-auto mt-5 mb-5 w-100 shadow">
  <div class="card-header bg-white py-3 d-flex justify-content-between position-relative align-items-center">
    <div class="d-flex align-items-center">
      <img src="${profileImage}" class="rounded-circle avatar me-2 avatar-img" alt="User Avatar" style="width: 40px; height: 40px" />
      <span class="fw-bold username">@${post.author.username}</span>
    </div>
    <div id="edit-container" class="d-flex justify-content-end w-100">
      ${deleteButton}
      ${editButton}
    </div>
  </div>

  <div class="card-body d-flex flex-column align-content-center" onclick="showComments(${postId})">
    <img src="${post.image}" class="card-img-top img-fluid content-img" alt="A large, sprawling tree with green leaves." />
    <p class="card-text time">
      <small class="text-muted">${post.created_at}</small>
    </p>
    <h5 class="card-title">${post.title}</h5>
    <p class="card-text">${post.body}</p>
  </div>
  
  <div class="card-footer bg-white d-flex justify-content-between text-muted">
    <a href="#" class="text-decoration-none text-muted">
      <i class="bi bi-chat-left-text"></i> (${post.comments_count}) Comments
    </a>
    <div class="tags"></div>
  </div>
</div>
`;
```

**What this creates:**
- A beautiful card showing the post
- Header with profile picture, username, and edit/delete buttons
- Body with post image, date, title, and content (clicking goes to comments)
- Footer with comment count and space for tags

**F. Add Tags to the Post**
```javascript
const tagsContainer = postElement.querySelector(".tags");
for (const tag of tags) {
  const tagElement = document.createElement("span");
  tagElement.className = "bg-success rounded-pill shadow-sm fs-5 p-2 text-danger";
  tagElement.textContent = tag.name;
  tagsContainer.appendChild(tagElement);
}
```

**What this does:**
- Finds the tags area in the post
- For each tag, creates a small colored pill
- Adds the tag name to the pill
- Puts the pill in the tags area

**G. Add the Post to the Page**
```javascript
cards.appendChild(postElement);
```
- Takes the complete post and adds it to the webpage

---

## 🌐 API Functions

### `fetchUserPosts()` - Getting Posts from the Server

```javascript
const fetchUserPosts = async (userId, currentPage = 1) => {
```

**What this does:** Gets posts for a specific user from the internet

#### The Try Block (When Things Go Right)

```javascript
try {
  const response = await axios.get(
    `${baseUrl}/users/${userId}/posts?limit=10&page=${currentPage}`
  );

  posts = response.data;

  console.log("User posts fetched successfully! Found", posts.data ? posts.data.length : 0, "posts");
  return posts;
}
```

**Step by step:**
1. `axios.get()` makes a request to the internet
2. The URL asks for posts from a specific user, 10 at a time, for a specific page
3. `await` waits for the response
4. Stores the response data
5. Logs how many posts were found
6. Returns the posts

#### The Catch Block (When Things Go Wrong)

```javascript
catch (error) {
  console.error("Error fetching user posts:", error);
  
  if (error.response && error.response.status === 404) {
    return { data: [], meta: { last_page: 1 } };
  }
  
  setAlert("Error fetching user posts, please try again later.", "danger");
  return { data: [], meta: { last_page: 1 } };
}
```

**What this handles:**
- Logs any errors that happen
- If error 404 (not found), returns empty data instead of showing error
- For other errors, shows an error message to the user
- Always returns something so the app doesn't crash

### `fetchTags()` - Getting Tags for a Post

```javascript
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
```

**What this does:**
- Gets detailed information about a specific post (including tags)
- Extracts just the tags from the response
- If it fails, returns an empty list instead of crashing

---

## 👆 User Interaction Functions

### `showComments()` - Going to Post Details

```javascript
let showComments = (id) => {
  window.location.href = `details.html?id=${id}`;
};
```

**What this does:**
- When someone clicks on a post, this function runs
- Takes them to a new page (details.html) showing that specific post and its comments
- The `?id=${id}` part tells the new page which post to show

### `editPost()` - Opening the Edit Modal

```javascript
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
```

**Step by step:**
1. `JSON.parse(decodeURIComponent(postObject))` converts the post data back to a usable format
2. Creates a Bootstrap modal (popup window)
3. Fills in the form fields with the current post title and content
4. Changes the modal title to "Edit Post"
5. Stores the post ID in the update button
6. Shows the modal to the user

**Why the complex conversion:** When we pass data through HTML, it gets encoded for safety. We need to decode it back.

---

## 🔧 CRUD Operations

CRUD stands for Create, Read, Update, Delete - the four basic operations you can do with data.

### CREATE - `createPost()` Function

```javascript
const createPost = async () => {
  showLoader(); // Show loading spinner
```

#### Step 1: Get Form Data
```javascript
const titleInput = document.getElementById("postTitle");
const bodyInput = document.getElementById("postContent");
const imageInput = document.getElementById("postImage");

const title = titleInput.value;
const body = bodyInput.value;
const image = imageInput.files[0];
```

**What this does:** Gets the title, content, and image that the user typed/selected

#### Step 2: Validate Image Size
```javascript
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024; // 5MB

if (image && image.size > MAX_IMAGE_SIZE_BYTES) {
  setAlert(`Image size exceeds the maximum limit of ${MAX_IMAGE_SIZE_MB}MB. Please choose a smaller image.`, "danger");
  closeModal("createPostModal");
  hideLoader();
  return;
}
```

**What this does:**
- Sets a maximum image size of 5MB
- Converts MB to bytes (computers count in bytes)
- If image is too big, shows error and stops

#### Step 3: Prepare Data for Sending
```javascript
const formData = new FormData();
formData.append("title", title);
formData.append("body", body);
formData.append("image", image);
```

**Why FormData:** When sending files (like images), we need to use FormData instead of regular JSON. It's like putting everything in a special envelope that can carry files.

#### Step 4: Send to Server
```javascript
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
}
```

**What this does:**
1. Sets the URL where to send the post
2. Gets the user's authentication token (proves they're logged in)
3. Creates config with the token
4. Sends the post to the server
5. If successful, shows success message
6. Clears the current posts and reloads them (so the new post appears)

#### Step 5: Handle Errors
```javascript
catch (error) {
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
}
```

**What this handles:**
- 413 error: File too large
- Server errors: Problems on the server side
- Network errors: Internet connection problems
- Other errors: Anything else that might go wrong

#### Step 6: Clean Up
```javascript
finally {
  hideLoader();
}

titleInput.value = "";
bodyInput.value = "";
imageInput.value = "";
closeModal("createPostModal");
```

**What this does:**
- `finally` runs whether the post creation succeeded or failed
- Hides the loading spinner
- Clears the form fields
- Closes the modal

### UPDATE - `updatePost()` Function

The update function is very similar to create, with a few key differences:

```javascript
formData.append("_method", "PUT");
const updateButton = document.querySelector(".update-btn");
const url = `https://tarmeezacademy.com/api/v1/posts/${updateButton.id}`;
```

**Key differences:**
- Adds `_method: "PUT"` to tell the server this is an update, not a new post
- Uses the post ID from the update button to know which post to update
- URL includes the specific post ID

### DELETE - `deletePost()` Function

```javascript
let deletePost = async (postId) => {
  const confirmDelete = confirm("Are you sure you want to delete this post? This action cannot be undone.");

  if (!confirmDelete) {
    return; // User cancelled
  }
```

**Step 1:** Shows a confirmation dialog. If user clicks "Cancel", stops the function.

```javascript
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
}
```

**Step 2:** 
- Gets the authentication token
- Uses `axios.delete()` instead of `axios.post()`
- If successful, clears and reloads posts

---

## 🛠️ Helper Functions

### `showEmptyState()` - When No Posts Exist

```javascript
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
```

**What this does:**
- If user is logged in but has no posts: Shows encouraging message to create first post
- If user is not logged in: Shows message to log in

### `refreshUserPosts()` - Refresh After Login

```javascript
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
```

**What this does:**
- Called automatically when user logs in
- Clears any existing content
- Resets to page 0
- Loads the user's posts

### `openLoginModal()` - Prevent Errors

```javascript
const openLoginModal = () => {
  // This function is called by the login button but the modal opens via Bootstrap data attributes
  // So we don't need to do anything here, just prevent the error
};
```

**Why this exists:** The HTML calls this function, but Bootstrap handles opening the modal automatically. This empty function prevents JavaScript errors.

---

## 🚀 Initialization

### When the Page Loads

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    displayUserPosts();
  } else {
    showEmptyState();
  }
});
```

**What this does:**
- `DOMContentLoaded` waits until the webpage is fully loaded
- Checks if a user is logged in
- If yes: Shows their posts
- If no: Shows the "please log in" message

**Why this is important:** We need to wait for the webpage to finish loading before we try to put posts on it!

---

## 🔄 How Everything Works Together

1. **Page loads** → Initialization runs
2. **User logs in** → `refreshUserPosts()` is called
3. **Posts are fetched** → `fetchUserPosts()` gets data from server
4. **Posts are displayed** → `displayUserPosts()` creates HTML for each post
5. **User interactions:**
   - Click post → `showComments()` → Go to details page
   - Click edit → `editPost()` → Open edit modal
   - Click delete → `deletePost()` → Confirm and delete
   - Create new post → `createPost()` → Send to server
   - Update post → `updatePost()` → Send changes to server

## 🎯 Key Concepts Explained

### Async/Await
- `async` functions can wait for things to happen
- `await` pauses the function until something finishes
- This prevents the webpage from freezing while waiting for internet requests

### LocalStorage
- Browser's way of remembering information
- Stores user login information and authentication tokens
- Persists even when you close and reopen the browser

### API Calls
- How we communicate with the server
- GET: Ask for information
- POST: Send new information
- PUT: Update existing information
- DELETE: Remove information

### Error Handling
- `try/catch` blocks handle when things go wrong
- Always provide fallbacks so the app doesn't crash
- Show helpful error messages to users

### DOM Manipulation
- Creating HTML elements with JavaScript
- Adding content to the webpage dynamically
- Responding to user clicks and interactions

This file creates a complete user post management system that handles viewing, creating, editing, and deleting posts while providing a smooth user experience!