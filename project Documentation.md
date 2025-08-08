# Tarmeez Social Media Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [Getting Started](#getting-started)
4. [HTML Pages Explained](#html-pages-explained)
5. [JavaScript Files Explained](#javascript-files-explained)
6. [CSS Styling Explained](#css-styling-explained)
7. [Features and Functionality](#features-and-functionality)
8. [API Integration](#api-integration)
9. [User Authentication](#user-authentication)
10. [Post Management](#post-management)
11. [Comments System](#comments-system)
12. [Responsive Design](#responsive-design)

---

## Project Overview

This is a social media web application called "Tarmeez" that allows users to:
- View posts from all users (Home page)
- Create, edit, and delete their own posts
- View their profile with post statistics
- Comment on posts
- Register and login to the platform

The project uses vanilla JavaScript, Bootstrap for styling, and connects to a REST API for data management.

---

## File Structure

```
project/
├── home.html              # Main page showing all posts
├── userPosts.html         # User profile page with their posts
├── details.html           # Individual post view with comments
├── main.js               # Shared functions (login, alerts, etc.)
├── home.js               # Home page functionality
├── userPosts.js          # User profile page functionality
├── details.js            # Post details page functionality
├── style.css             # Custom styles and responsive design
├── profile-pics/         # Default profile images
└── node_modules/         # Bootstrap and Axios libraries
```

---

## Getting Started

### Prerequisites
- A web browser (Chrome, Firefox, Safari, etc.)
- Internet connection (for API calls)
- Local web server (optional, for file:// protocol issues)

### Setup Steps
1. Download all project files
2. Open `home.html` in your web browser
3. The application will automatically load posts from the API
4. Use the Login/Register buttons to create an account or sign in

---

## HTML Pages Explained

### 1. home.html - Main Feed Page

**Purpose**: Shows all posts from all users in a scrollable feed

**Key Sections**:

#### Head Section
```html
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <!-- Bootstrap CSS for styling -->
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css" />
    <!-- Custom styles -->
    <link rel="stylesheet" href="style.css" />
</head>
```
- **Font Awesome**: Provides icons like the plus button for creating posts
- **Bootstrap**: CSS framework for responsive design and components
- **Custom CSS**: Our own styles for specific design needs

#### Body Structure
```html
<body class="page-home">
```
- **page-home class**: Identifies this as the home page for specific styling

#### Loader Component
```html
<div id="loader" class="loader-overlay">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>
```
- **Purpose**: Shows a spinning animation while data loads
- **Bootstrap spinner**: Uses Bootstrap's built-in spinner component
- **Hidden by default**: Only shows when `showLoader()` function is called

#### Floating Add Post Button
```html
<div role="button" class="position-fixed bottom-0 mb-5 me-5 end-0 fs-1" 
     data-bs-toggle="modal" data-bs-target="#createPostModal">
    <i id="add-post" class="fa-solid fa-circle-plus" size="lg"></i>
</div>
```
- **Fixed position**: Stays in bottom-right corner when scrolling
- **Modal trigger**: Opens the create post modal when clicked
- **Font Awesome icon**: Plus circle icon for visual clarity

#### Navigation Bar
```html
<nav class="navbar shadow rounded navbar-expand-lg pt-3">
    <div class="container-fluid">
        <a class="navbar-brand" href="home.html">Tarmeez</a>
        <!-- Navigation links -->
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link active" href="#">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="userPosts.html">Profile</a>
            </li>
        </ul>
        <!-- User info and buttons -->
        <div id="user-info" class="d-flex w-100 justify-content-end">
            <!-- Login/Register buttons or User info -->
        </div>
    </div>
</nav>
```
- **Bootstrap navbar**: Responsive navigation component
- **Brand link**: "Tarmeez" logo/name that links to home
- **Active state**: Shows which page user is currently on
- **User info section**: Changes based on login status

#### Posts Container
```html
<div id="posts" class="bg-body mt-5" style="background-color: #f0ecff"></div>
```
- **posts ID**: JavaScript targets this to add post cards
- **Background color**: Light purple theme color
- **Empty initially**: Filled by JavaScript when page loads

### 2. userPosts.html - User Profile Page

**Purpose**: Shows the logged-in user's posts and profile statistics

**Key Differences from home.html**:

#### Profile Summary Section
```html
<div id="profile-summary-wrapper" class="mt-4">
    <div id="user-summary" class="user-summary-card">
        <div class="summary-left d-flex align-items-center gap-3">
            <!-- User avatar and name -->
        </div>
        <div class="summary-right d-flex align-items-center gap-4">
            <!-- Post and comment counts -->
        </div>
    </div>
</div>
```
- **Profile header**: Shows user's avatar, name, and statistics
- **Responsive layout**: Adapts to different screen sizes
- **Dynamic content**: Filled by JavaScript with real user data

#### User-Specific Features
- Only shows posts from the logged-in user
- Edit and delete buttons appear on user's own posts
- Empty state message when user has no posts

### 3. details.html - Post Detail Page

**Purpose**: Shows a single post with all its comments

**Key Features**:

#### Single Post Display
```html
<div class="card col-9 mx-auto mt-5 shadow">
    <div class="card-header bg-white py-3">
        <!-- Post author info -->
    </div>
    <div class="card-body">
        <!-- Post content -->
    </div>
    <div id="comments-section" class="card-footer">
        <!-- Comments will be loaded here -->
    </div>
</div>
```
- **Single card**: Unlike other pages, shows only one post
- **Comments section**: Dedicated area for post comments
- **No infinite scroll**: Shows complete post and all comments

#### Comment Input
```html
<div id="comment-input-section" class="comment d-flex">
    <input type="text" id="comment-input" placeholder="Write your comment here..." />
    <button id="comment-send" class="btn btn-primary" onclick="sendComment()">Send</button>
</div>
```
- **Comment form**: Allows users to add new comments
- **Only visible when logged in**: Hidden for anonymous users

---

## JavaScript Files Explained

### 1. main.js - Shared Functionality

**Purpose**: Contains functions used across all pages

#### Loader Functions
```javascript
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
```
- **showLoader()**: Makes the loading spinner visible
- **hideLoader()**: Hides the loading spinner
- **Safety check**: Ensures loader element exists before manipulating it

#### Alert System
```javascript
function setAlert(message, type) {
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    if (alertPlaceholder) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert"></button>',
            "</div>",
        ].join("");
        alertPlaceholder.append(wrapper);
        setTimeout(() => {
            alertPlaceholder.innerHTML = "";
        }, 2000);
    }
}
```
- **Dynamic alerts**: Creates Bootstrap alert components
- **Auto-dismiss**: Alerts disappear after 2 seconds
- **Multiple types**: success, danger, warning, info
- **Example usage**: `setAlert("Login successful", "success")`

#### Navigation Bar Management
```javascript
function navBar() {
    const token = localStorage.getItem("token");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const logoutBtn = document.getElementById("logout-btn");
    
    if (token) {
        // User is logged in - show user info, hide login/register
        const user = JSON.parse(localStorage.getItem("user"));
        if (loginBtn) loginBtn.classList.add("d-none");
        if (registerBtn) registerBtn.classList.add("d-none");
        if (logoutBtn) logoutBtn.classList.remove("d-none");
        // Show user avatar and name
    } else {
        // User is not logged in - show login/register buttons
        if (loginBtn) loginBtn.classList.remove("d-none");
        if (registerBtn) registerBtn.classList.remove("d-none");
        if (logoutBtn) logoutBtn.classList.add("d-none");
    }
}
```
- **Token check**: Determines if user is logged in
- **Dynamic UI**: Shows/hides buttons based on login status
- **User data**: Displays user's name and avatar when logged in
- **Bootstrap classes**: Uses `d-none` to hide/show elements

#### Login Function
```javascript
const login = async () => {
    const userInput = document.getElementById("user-input");
    const passwordInput = document.getElementById("password-input");
    
    const username = userInput.value;
    const password = passwordInput.value;
    
    try {
        const response = await axios.post("https://tarmeezacademy.com/api/v1/login", {
            username: username,
            password: password,
        });
        
        const user = response.data.user;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(user));
        
        setAlert("Login successful", "success");
        navBar(); // Update navigation
        closeModal("loginModal");
    } catch (error) {
        setAlert("Login failed", "danger");
    }
};
```
- **Async function**: Uses modern JavaScript async/await
- **Form data**: Gets username and password from input fields
- **API call**: Sends POST request to login endpoint
- **Local storage**: Saves user token and info for future requests
- **Error handling**: Shows appropriate messages for success/failure
- **UI updates**: Refreshes navigation bar and closes modal

#### Register Function
```javascript
const register = async () => {
    const usernameInput = document.getElementById("username-reg");
    const passwordInput = document.getElementById("password-reg");
    const nameInput = document.getElementById("user-reg");
    const emailInput = document.getElementById("email-reg");
    const imageInput = document.getElementById("imageReg");
    
    // Get form data
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
        
        const response = await axios.post("https://tarmeezacademy.com/api/v1/register", formData);
        
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        setAlert("Registration successful", "success");
        navBar();
        closeModal("registerModal");
    } catch (error) {
        setAlert(error.response.data.message, "danger");
    }
};
```
- **FormData**: Required for file uploads (profile image)
- **File handling**: Gets selected image file from input
- **Multiple fields**: Collects all registration information
- **Same flow as login**: Saves token and updates UI on success

#### Logout Function
```javascript
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navBar();
    // Refresh specific page functions if they exist
    if (typeof displayCommentBar === "function") {
        displayCommentBar();
    }
    if (typeof refreshUserPosts === "function") {
        refreshUserPosts();
    }
}
```
- **Clear storage**: Removes user token and data
- **UI refresh**: Updates navigation bar
- **Page-specific updates**: Calls page functions if they exist
- **Safety checks**: Only calls functions if they're defined

### 2. home.js - Home Page Functionality

**Purpose**: Manages the main feed of posts

#### Variables and Setup
```javascript
let currentPage = 1;
const baseUrl = "https://tarmeezacademy.com/api/v1";
const cards = document.querySelector("#posts");
let posts = [];
```
- **currentPage**: Tracks pagination for infinite scroll
- **baseUrl**: API endpoint base URL
- **cards**: Reference to posts container element
- **posts**: Array to store fetched posts

#### Infinite Scroll
```javascript
window.addEventListener("scroll", () => {
    const endofPage = window.scrollY + window.innerHeight + 1 >= 
                     document.documentElement.scrollHeight;
    if (endofPage) {
        displayPosts();
    }
});
```
- **Scroll listener**: Detects when user reaches bottom of page
- **Math calculation**: Checks if scroll position + window height >= total page height
- **Auto-load**: Automatically loads more posts when scrolling down

#### Fetch Posts Function
```javascript
const fetchPosts = async (currentPage = 1) => {
    try {
        const response = await axios.get(`${baseUrl}/posts?limit=10&page=${currentPage}`);
        posts = response.data;
        console.log("Data fetched successfully!");
        return posts;
    } catch (error) {
        console.error("Error fetching data:", error);
        setAlert("Error fetching posts, please try again later.", "danger");
        return [];
    }
};
```
- **Pagination**: Requests specific page with limit of 10 posts
- **Error handling**: Shows user-friendly error message
- **Return data**: Returns posts array or empty array on error
- **Logging**: Helps with debugging during development

#### Display Posts Function
```javascript
const displayPosts = async () => {
    currentPage = currentPage + 1;
    
    let response = await fetchPosts(currentPage);
    if (!response.meta) return;
    
    let posts = response.data;
    let lastPage = response.meta.last_page;
    
    if (currentPage > lastPage) return;
    
    for (let post of posts) {
        // Create post element
        const postElement = document.createElement("div");
        postElement.className = "card";
        
        // Get profile image with fallback
        const profileImage = post.author.profile_image && 
                            typeof post.author.profile_image === "string"
                            ? post.author.profile_image
                            : "./profile-pics/1.jpg";
        
        // Check if user can edit/delete this post
        const user = JSON.parse(localStorage.getItem("user"));
        let editButton = "";
        let deleteButton = "";
        
        if (user && user.id === post.author.id) {
            editButton = `<button onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">edit</button>`;
            deleteButton = `<button onclick="deletePost(${post.id})">delete</button>`;
        }
        
        // Create HTML for post
        postElement.innerHTML = `
            <div class="card col-9 mx-auto mt-5 mb-5 w-100 shadow">
                <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="${profileImage}" class="rounded-circle avatar me-2" 
                             style="width: 40px; height: 40px" />
                        <span class="fw-bold">@${post.author.username}</span>
                    </div>
                    <div class="d-flex justify-content-end w-100">
                        ${deleteButton}
                        ${editButton}
                    </div>
                </div>
                <div class="card-body d-flex flex-column" onclick="showComments(${post.id})">
                    <img src="${post.image}" class="card-img-top img-fluid" />
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
        
        // Add tags
        const tags = await fetchTags(post.id);
        const tagsContainer = postElement.querySelector(".tags");
        for (const tag of tags) {
            const tagElement = document.createElement("span");
            tagElement.className = "bg-success rounded-pill shadow-sm fs-5 p-2 text-danger";
            tagElement.textContent = tag.name;
            tagsContainer.appendChild(tagElement);
        }
        
        cards.appendChild(postElement);
    }
};
```

**Step-by-step breakdown**:

1. **Increment page**: Moves to next page for pagination
2. **Fetch data**: Gets posts from API
3. **Check pagination**: Stops if no more pages available
4. **Loop through posts**: Creates HTML for each post
5. **Profile image fallback**: Uses default image if none provided
6. **Permission check**: Shows edit/delete buttons only for post owner
7. **HTML creation**: Builds complete post card structure
8. **Tag handling**: Fetches and displays post tags
9. **DOM insertion**: Adds completed post to page

#### Show Comments Function
```javascript
let showComments = (id) => {
    window.location.href = `details.html?id=${id}`;
};
```
- **Navigation**: Redirects to details page
- **URL parameter**: Passes post ID for details page to load

#### Create Post Function
```javascript
const createPost = async () => {
    showLoader();
    
    const titleInput = document.getElementById("postTitle");
    const bodyInput = document.getElementById("postContent");
    const imageInput = document.getElementById("postImage");
    
    const title = titleInput.value;
    const body = bodyInput.value;
    const image = imageInput.files[0];
    
    // Image size validation
    const MAX_IMAGE_SIZE_MB = 5;
    const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    
    if (image && image.size > MAX_IMAGE_SIZE_BYTES) {
        setAlert(`Image size exceeds ${MAX_IMAGE_SIZE_MB}MB limit`, "danger");
        hideLoader();
        return;
    }
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);
    
    const token = localStorage.getItem("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    try {
        const response = await axios.post(`${baseUrl}/posts`, formData, config);
        setAlert("Post created successfully", "success");
        
        // Refresh posts
        cards.innerHTML = "";
        currentPage = 0;
        displayPosts();
        
        // Clear form
        titleInput.value = "";
        bodyInput.value = "";
        imageInput.value = "";
        closeModal("createPostModal");
    } catch (error) {
        let errorMessage = "An unexpected error occurred.";
        if (error.response?.status === 413) {
            errorMessage = "Image too large. Please upload a smaller image.";
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        setAlert(errorMessage, "danger");
    } finally {
        hideLoader();
    }
};
```

**Key concepts**:
- **FormData**: Required for file uploads
- **Authorization header**: Includes user token for authentication
- **File validation**: Checks image size before upload
- **Error handling**: Provides specific error messages
- **UI refresh**: Reloads posts and clears form on success
- **Loading states**: Shows/hides loader during operation

### 3. userPosts.js - User Profile Functionality

**Purpose**: Manages user's personal posts and profile information

#### Key Differences from home.js

#### User-Specific Data Fetching
```javascript
const fetchUserPosts = async (userId, currentPage = 1) => {
    try {
        const response = await axios.get(
            `${baseUrl}/users/${userId}/posts?limit=10&page=${currentPage}`
        );
        posts = response.data;
        return posts;
    } catch (error) {
        if (error.response?.status === 404) {
            return { data: [], meta: { last_page: 1 } };
        }
        setAlert("Error fetching user posts", "danger");
        return { data: [], meta: { last_page: 1 } };
    }
};
```
- **User-specific endpoint**: Only gets posts from specific user
- **404 handling**: Returns empty data instead of error for users with no posts

#### Profile Summary Functions
```javascript
const fetchUserDetails = async (userId) => {
    try {
        const res = await axios.get(`${baseUrl}/users/${userId}`);
        return res.data?.data || null;
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
};

const renderUserSummary = async () => {
    const container = document.getElementById("user-summary");
    if (!container) return;
    
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
        container.innerHTML = `
            <div class="user-summary-card d-flex align-items-center justify-content-center text-muted">
                Please log in to view your profile overview.
            </div>
        `;
        return;
    }
    
    const [details, postsTotal] = await Promise.all([
        fetchUserDetails(user.id),
        fetchUserPostsTotal(user.id),
    ]);
    
    const profileImage = user.profile_image || "./profile-pics/1.jpg";
    const displayName = details?.name || user.username;
    const postsCount = details?.posts_count || postsTotal || 0;
    const commentsCount = details?.comments_count || 0;
    
    container.innerHTML = `
        <div class="user-summary-card">
            <div class="summary-left d-flex align-items-center gap-3">
                <img src="${profileImage}" alt="avatar" class="avatar-xl rounded-circle" />
                <div class="d-flex flex-column">
                    <span class="fw-semibold fs-5">${displayName}</span>
                    <span class="text-muted">@${user.username}</span>
                </div>
            </div>
            <div class="summary-right d-flex align-items-center gap-4">
                <div class="text-center">
                    <div class="kpi-circle">${postsCount}</div>
                    <div class="kpi-label">Posts</div>
                </div>
                <div class="text-center">
                    <div class="kpi-circle">${commentsCount}</div>
                    <div class="kpi-label">Comments</div>
                </div>
            </div>
        </div>
    `;
};
```

**Profile summary features**:
- **Parallel requests**: Uses `Promise.all()` to fetch multiple data sources simultaneously
- **Fallback data**: Uses multiple sources for counts (API details, posts total, defaults)
- **Responsive layout**: Uses CSS classes for mobile-friendly design
- **Login check**: Shows appropriate message for non-logged-in users

#### Empty State Handling
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
- **Different messages**: Shows different content based on login status
- **User guidance**: Provides clear instructions on what to do next

### 4. details.js - Post Details Functionality

**Purpose**: Shows individual post with comments system

#### URL Parameter Handling
```javascript
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
```
- **URL parsing**: Gets post ID from URL parameter
- **Example**: `details.html?id=123` → `postId = "123"`

#### Single Post Display
```javascript
const displayPost = async (postId) => {
    try {
        const response = await axios.get(`${baseUrl}/posts/${postId}`);
        const post = response.data.data;
        
        // Update page elements with post data
        document.getElementById("post-author-image").src = post.author.profile_image || "./profile-pics/1.jpg";
        document.getElementById("post-author").textContent = `@${post.author.username}`;
        document.getElementById("post-image").src = post.image;
        document.getElementById("post-time").textContent = post.created_at;
        document.getElementById("post-title").textContent = post.title;
        document.getElementById("post-body").textContent = post.body;
        
        displayComments(postId);
    } catch (error) {
        setAlert("Error loading post", "danger");
    }
};
```
- **Single post fetch**: Gets specific post by ID
- **Direct DOM updates**: Updates specific elements instead of creating new HTML
- **Comments loading**: Automatically loads comments for the post

#### Comments System
```javascript
const displayComments = async (postId) => {
    try {
        const response = await axios.get(`${baseUrl}/posts/${postId}/comments`);
        const comments = response.data.data;
        
        const commentsSection = document.getElementById("comments-section");
        commentsSection.innerHTML = "";
        
        for (const comment of comments) {
            const commentElement = document.createElement("div");
            commentElement.className = "comment-item p-3 border-bottom";
            
            commentElement.innerHTML = `
                <div class="d-flex align-items-start">
                    <img src="${comment.author.profile_image || './profile-pics/1.jpg'}" 
                         class="rounded-circle me-3" style="width: 32px; height: 32px;">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-1">
                            <strong class="me-2">@${comment.author.username}</strong>
                            <small class="text-muted">${comment.created_at}</small>
                        </div>
                        <p class="mb-0">${comment.body}</p>
                    </div>
                </div>
            `;
            
            commentsSection.appendChild(commentElement);
        }
    } catch (error) {
        console.error("Error loading comments:", error);
    }
};
```
- **Comments endpoint**: Fetches all comments for specific post
- **Dynamic creation**: Creates HTML elements for each comment
- **Threaded layout**: Shows author info and comment content in organized format

#### Add Comment Function
```javascript
const sendComment = async () => {
    const commentInput = document.getElementById("comment-input");
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        setAlert("Please enter a comment", "warning");
        return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
        setAlert("Please log in to comment", "warning");
        return;
    }
    
    try {
        const response = await axios.post(
            `${baseUrl}/posts/${postId}/comments`,
            { body: commentText },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        setAlert("Comment added successfully", "success");
        commentInput.value = "";
        displayComments(postId); // Refresh comments
    } catch (error) {
        setAlert("Error adding comment", "danger");
    }
};
```
- **Input validation**: Checks for empty comments
- **Authentication check**: Ensures user is logged in
- **JSON data**: Sends comment as JSON (not FormData)
- **Refresh comments**: Reloads all comments to show new one

---

## CSS Styling Explained

### 1. Global Styles

#### Card Hover Effects
```css
.card {
    border-radius: 0.5rem;
    transition: box-shadow 0.25s ease, transform 0.2s ease;
    background-clip: border-box;
}

.card:hover {
    box-shadow: 0 10px 28px rgba(99, 102, 241, 0.22), 0 0 0 3px rgba(99, 102, 241, 0.12);
    transform: translateY(-2px);
}
```
- **Smooth transitions**: Cards animate when hovered
- **Glow effect**: Creates colored shadow around cards
- **Lift effect**: Cards move up slightly on hover

#### Home Page Specific Styling
```css
.page-home #posts .card:hover {
    box-shadow: 0 8px 24px rgba(253, 224, 71, 0.35), 0 0 0 3px rgba(253, 224, 71, 0.18);
    transform: translateY(-2px);
}
```
- **Page-specific**: Only applies to home page posts
- **Yellow glow**: Different color for home page cards
- **Scoped styling**: Uses page class to target specific pages

### 2. User Summary Styling

#### Profile Card Layout
```css
.user-summary-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    
background: #ffffff;
    border-radius: 12px;
    padding: 16px 24px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.05);
}
```
- **Flexbox layout**: Arranges profile info and stats horizontally
- **White background**: Clean card appearance
- **Rounded corners**: Modern design with 12px border radius
- **Subtle shadow**: Gives card depth without being overwhelming
- **Responsive gap**: 24px space between elements

#### Avatar and KPI Circles
```css
.avatar-xl {
    width: clamp(48px, 8vw, 64px);
    height: clamp(48px, 8vw, 64px);
    object-fit: cover;
}

.kpi-circle {
    width: clamp(44px, 7vw, 56px);
    height: clamp(44px, 7vw, 56px);
    border-radius: 50%;
    border: 2px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: clamp(14px, 2.8vw, 20px);
    color: #2f2f2f;
    background: #fff;
}
```
- **Responsive sizing**: Uses `clamp()` for fluid sizing across devices
- **Perfect circles**: Equal width and height with 50% border radius
- **Centered content**: Flexbox centers numbers inside circles
- **Subtle borders**: Light gray borders for definition

### 3. Responsive Design

#### Mobile Breakpoints
```css
@media (max-width: 768px) {
    .summary-right {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
    }
}

@media (max-width: 480px) {
    .user-summary-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
    .summary-right {
        width: 100%;
        justify-content: space-between;
    }
}
```
- **Tablet layout**: Stats spread evenly across width
- **Mobile layout**: Stacks profile info and stats vertically
- **Flexible spacing**: Adjusts gaps for smaller screens

#### Posts Layout Fix
```css
#posts .card {
    width: 100% !important;
    height: auto !important;
    background-image: none !important;
    background: #fff !important;
}
```
- **Override conflicts**: Ensures posts stay full width
- **Important declarations**: Overrides any conflicting styles
- **Clean background**: Removes any unwanted background effects

---

## Features and Functionality

### 1. User Authentication

#### Registration Process
1. **User clicks "Register" button**
2. **Modal opens with registration form**
3. **User fills in required fields**:
   - Username (unique identifier)
   - Full name (display name)
   - Email address
   - Password
   - Profile image (optional)
4. **Form validation occurs**:
   - All fields except image are required
   - Email format validation
   - Password strength requirements
5. **Data sent to API via FormData**
6. **On success**:
   - User token saved to localStorage
   - User data saved to localStorage
   - Navigation bar updates
   - Success message shown
   - Modal closes automatically

#### Login Process
1. **User clicks "Login" button**
2. **Modal opens with login form**
3. **User enters credentials**:
   - Username or email
   - Password
4. **Credentials sent to API**
5. **On success**:
   - Token and user data stored
   - UI updates to show logged-in state
   - User can now create posts and comments

#### Session Management
```javascript
// Check if user is logged in
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (token && user) {
    // User is authenticated
    // Show user-specific features
} else {
    // User is not authenticated
    // Show login/register options
}
```
- **Persistent sessions**: Login state survives browser refresh
- **Token-based auth**: Uses JWT tokens for API authentication
- **Automatic logout**: Clears data when user logs out

### 2. Post Management

#### Creating Posts
1. **User clicks floating "+" button**
2. **Create post modal opens**
3. **User fills form**:
   - Title (required)
   - Content/body (required)
   - Image (optional, max 5MB)
4. **Client-side validation**:
   - Checks for required fields
   - Validates image size
5. **FormData sent to API with auth token**
6. **On success**:
   - Success message shown
   - Posts list refreshes
   - Form clears and modal closes

#### Editing Posts
1. **User sees "Edit" button on their own posts**
2. **Clicks edit button**
3. **Update modal opens with current data**
4. **User modifies content**
5. **PUT request sent to API**
6. **Posts refresh to show changes**

#### Deleting Posts
1. **User sees "Delete" button on their own posts**
2. **Clicks delete button**
3. **Confirmation dialog appears**
4. **If confirmed, DELETE request sent to API**
5. **Post removed from display**
6. **Success message shown**

#### Post Display Features
- **Infinite scroll**: Automatically loads more posts when scrolling
- **Pagination**: Handles large numbers of posts efficiently
- **Author information**: Shows username and profile picture
- **Timestamps**: Displays when post was created
- **Images**: Supports image uploads and display
- **Tags**: Shows categorization tags for posts
- **Comment counts**: Displays number of comments per post

### 3. Comments System

#### Viewing Comments
1. **User clicks on any post**
2. **Redirected to details page**
3. **Post content displayed at top**
4. **All comments loaded below**
5. **Comments show**:
   - Author username and avatar
   - Comment text
   - Timestamp

#### Adding Comments
1. **User must be logged in**
2. **Comment input box appears at bottom**
3. **User types comment**
4. **Clicks "Send" button**
5. **Comment sent to API**
6. **Comments list refreshes to show new comment**

#### Comment Features
- **Real-time updates**: Comments appear immediately after posting
- **Author identification**: Shows who wrote each comment
- **Chronological order**: Comments displayed in order posted
- **Responsive design**: Works on all device sizes

### 4. Profile Management

#### Profile Statistics
- **Posts count**: Total number of posts created
- **Comments count**: Total comments made by user
- **Profile image**: User's avatar displayed
- **Username and display name**: User identification

#### Profile Page Features
- **Personal posts only**: Shows only logged-in user's posts
- **Edit/delete controls**: Full control over own content
- **Empty state handling**: Helpful message when no posts exist
- **Responsive summary card**: Adapts to different screen sizes

---

## API Integration

### 1. Base Configuration

#### API Endpoint
```javascript
const baseUrl = "https://tarmeezacademy.com/api/v1";
```
- **RESTful API**: Follows REST conventions
- **HTTPS**: Secure connection for all requests
- **Versioned**: v1 allows for future API updates

#### Authentication Headers
```javascript
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' // or multipart/form-data for files
    }
};
```
- **Bearer token**: Standard JWT authentication
- **Content-Type**: Varies based on request type

### 2. API Endpoints Used

#### Authentication Endpoints
- **POST /login**: User login
  - Body: `{ username, password }`
  - Returns: `{ token, user }`

- **POST /register**: User registration
  - Body: FormData with username, password, name, email, image
  - Returns: `{ token, user }`

#### Posts Endpoints
- **GET /posts**: Get all posts (paginated)
  - Query: `?limit=10&page=1`
  - Returns: `{ data: [posts], meta: { last_page, current_page } }`

- **GET /posts/{id}**: Get specific post
  - Returns: `{ data: post }`

- **POST /posts**: Create new post
  - Body: FormData with title, body, image
  - Requires: Authentication
  - Returns: `{ data: post }`

- **PUT /posts/{id}**: Update post
  - Body: FormData with title, body, image, _method: "PUT"
  - Requires: Authentication + ownership
  - Returns: `{ data: post }`

- **DELETE /posts/{id}**: Delete post
  - Requires: Authentication + ownership
  - Returns: Success status

#### User Endpoints
- **GET /users/{id}**: Get user details
  - Returns: `{ data: { name, username, posts_count, comments_count } }`

- **GET /users/{id}/posts**: Get user's posts
  - Query: `?limit=10&page=1`
  - Returns: `{ data: [posts], meta: pagination }`

#### Comments Endpoints
- **GET /posts/{id}/comments**: Get post comments
  - Returns: `{ data: [comments] }`

- **POST /posts/{id}/comments**: Add comment
  - Body: `{ body: "comment text" }`
  - Requires: Authentication
  - Returns: `{ data: comment }`

### 3. Error Handling

#### Network Errors
```javascript
try {
    const response = await axios.get(url);
    // Handle success
} catch (error) {
    if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data.message;
        
        if (status === 404) {
            // Not found - handle gracefully
        } else if (status === 413) {
            // File too large
        } else if (status === 401) {
            // Unauthorized - redirect to login
        }
    } else if (error.request) {
        // Network error - no response received
        setAlert("Network error. Please check your connection.", "danger");
    } else {
        // Other error
        setAlert("An unexpected error occurred.", "danger");
    }
}
```

#### Common Error Scenarios
- **401 Unauthorized**: Token expired or invalid
- **404 Not Found**: Resource doesn't exist
- **413 Payload Too Large**: File upload too big
- **422 Validation Error**: Invalid input data
- **500 Server Error**: API server issues

---

## User Experience Features

### 1. Loading States

#### Loader Component
```javascript
const showLoader = () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.classList.add("show");
    }
};
```
- **Visual feedback**: Users know something is happening
- **Prevents multiple clicks**: Discourages impatient clicking
- **Professional appearance**: Shows app is working

#### Loading Scenarios
- **Login/Register**: During authentication
- **Creating posts**: During upload process
- **Page navigation**: While fetching data
- **Image uploads**: During file processing

### 2. User Feedback

#### Alert System
```javascript
setAlert("Post created successfully", "success");
setAlert("Error occurred", "danger");
setAlert("Please fill all fields", "warning");
setAlert("Information saved", "info");
```
- **Color-coded**: Different colors for different message types
- **Auto-dismiss**: Messages disappear after 2 seconds
- **Non-intrusive**: Doesn't block user interaction
- **Consistent placement**: Always appears in same location

#### Success Messages
- "Login successful"
- "Post created successfully"
- "Comment added successfully"
- "Post updated successfully"
- "Post deleted successfully"

#### Error Messages
- "Login failed - check credentials"
- "Error creating post - try again"
- "Image too large - max 5MB"
- "Network error - check connection"
- "Please log in to continue"

### 3. Navigation

#### Breadcrumb Navigation
- **Home**: Shows all posts from all users
- **Profile**: Shows current user's posts only
- **Post Details**: Shows individual post with comments

#### URL Structure
- `home.html` - Main feed
- `userPosts.html` - User profile
- `details.html?id=123` - Specific post details

#### Navigation States
- **Active page**: Highlighted in navigation bar
- **Login status**: Different options based on authentication
- **User info**: Shows avatar and username when logged in

### 4. Responsive Behavior

#### Mobile Optimizations
- **Touch-friendly buttons**: Larger tap targets
- **Readable text**: Appropriate font sizes
- **Scrollable content**: Works with touch scrolling
- **Collapsible navigation**: Hamburger menu on small screens

#### Tablet Adaptations
- **Flexible layouts**: Adjusts to medium screen sizes
- **Optimal spacing**: Comfortable gaps between elements
- **Readable content**: Good text-to-background contrast

#### Desktop Features
- **Hover effects**: Visual feedback on mouse over
- **Keyboard navigation**: Tab through interactive elements
- **Larger images**: Takes advantage of screen space
- **Multi-column layouts**: Efficient use of width

---

## Development Best Practices

### 1. Code Organization

#### Separation of Concerns
- **HTML**: Structure and content
- **CSS**: Styling and layout
- **JavaScript**: Behavior and functionality

#### File Structure
- **Shared code**: `main.js` for common functions
- **Page-specific**: Separate JS files for each page
- **Modular CSS**: Organized sections with comments

#### Function Naming
```javascript
// Clear, descriptive names
const fetchUserPosts = async (userId) => { };
const displayPosts = async () => { };
const showEmptyState = () => { };
const renderUserSummary = async () => { };
```

### 2. Error Handling

#### Graceful Degradation
- **Fallback images**: Default avatars when none provided
- **Empty states**: Helpful messages when no data
- **Network failures**: Retry options and clear error messages
- **Validation**: Client-side checks before API calls

#### User-Friendly Messages
```javascript
// Instead of technical errors
catch (error) {
    if (error.response?.status === 413) {
        setAlert("Image too large. Please choose a smaller image.", "danger");
    } else {
        setAlert("Something went wrong. Please try again.", "danger");
    }
}
```

### 3. Performance Considerations

#### Lazy Loading
- **Infinite scroll**: Only loads posts as needed
- **Image optimization**: Proper sizing and formats
- **API pagination**: Limits data per request

#### Caching Strategy
- **LocalStorage**: Saves user session data
- **Browser cache**: Leverages HTTP caching headers
- **Minimal requests**: Combines related data when possible

#### Memory Management
- **Event cleanup**: Removes unused event listeners
- **DOM management**: Clears old content before adding new
- **Image handling**: Proper disposal of large images

### 4. Security Considerations

#### Input Validation
- **Client-side**: Immediate feedback for users
- **Server-side**: Actual security validation
- **File uploads**: Size and type restrictions
- **XSS prevention**: Proper content escaping

#### Authentication Security
- **Token storage**: Secure localStorage usage
- **Token expiration**: Handles expired sessions
- **HTTPS only**: Secure data transmission
- **No sensitive data**: Passwords never stored locally

---

## Troubleshooting Guide

### 1. Common Issues

#### Posts Not Loading
**Symptoms**: Empty posts container, no content appears
**Possible Causes**:
- Network connection issues
- API server down
- JavaScript errors in console

**Solutions**:
1. Check browser console for errors
2. Verify internet connection
3. Try refreshing the page
4. Check if API endpoint is accessible

#### Login Not Working
**Symptoms**: Login form submits but user not logged in
**Possible Causes**:
- Incorrect credentials
- API authentication issues
- LocalStorage problems

**Solutions**:
1. Verify username and password
2. Clear browser localStorage
3. Check network tab for API responses
4. Try different browser

#### Images Not Uploading
**Symptoms**: Posts create but images don't appear
**Possible Causes**:
- File size too large (>5MB)
- Unsupported file format
- Network timeout

**Solutions**:
1. Reduce image file size
2. Use common formats (JPG, PNG)
3. Check file size before upload
4. Try smaller images first

### 2. Browser Compatibility

#### Supported Browsers
- **Chrome**: Version 80+
- **Firefox**: Version 75+
- **Safari**: Version 13+
- **Edge**: Version 80+

#### Required Features
- **ES6 Support**: Arrow functions, async/await
- **Fetch API**: For HTTP requests (via Axios)
- **LocalStorage**: For session management
- **CSS Grid/Flexbox**: For layouts

### 3. Development Setup

#### Local Development
1. **Install dependencies**: Ensure Bootstrap and Axios are available
2. **Use local server**: Avoid CORS issues with file:// protocol
3. **Enable developer tools**: For debugging and testing
4. **Test on multiple devices**: Ensure responsive design works

#### Debugging Tips
- **Console logging**: Use `console.log()` for debugging
- **Network tab**: Monitor API requests and responses
- **Elements tab**: Inspect HTML structure and CSS
- **Application tab**: Check localStorage contents

---

## Future Enhancements

### 1. Potential Features

#### Social Features
- **Like/Unlike posts**: Heart button with counts
- **Follow users**: Subscribe to specific users' posts
- **Share posts**: Social media integration
- **Direct messaging**: Private conversations

#### Content Features
- **Video uploads**: Support for video content
- **Multiple images**: Photo galleries in posts
- **Rich text editing**: Formatted text in posts
- **Hashtags**: Searchable tags system

#### User Experience
- **Dark mode**: Alternative color scheme
- **Notifications**: Real-time updates
- **Search functionality**: Find posts and users
- **Bookmarks**: Save posts for later

### 2. Technical Improvements

#### Performance
- **Image compression**: Automatic optimization
- **Caching strategy**: Better data management
- **Progressive loading**: Faster initial page load
- **Service workers**: Offline functionality

#### Security
- **Two-factor authentication**: Enhanced security
- **Content moderation**: Automated filtering
- **Rate limiting**: Prevent spam
- **CSRF protection**: Enhanced security measures

#### Architecture
- **Component system**: Reusable UI components
- **State management**: Centralized data handling
- **TypeScript**: Better code reliability
- **Testing framework**: Automated testing

---

## Conclusion

This Tarmeez social media application demonstrates modern web development practices using vanilla JavaScript, Bootstrap, and REST API integration. The project showcases:

- **Clean code organization** with separation of concerns
- **Responsive design** that works on all devices
- **User-friendly interface** with intuitive navigation
- **Robust error handling** for better user experience
- **Secure authentication** with token-based sessions
- **Real-time features** like comments and posts
- **Professional styling** with hover effects and animations

The documentation provides a comprehensive guide for understanding, maintaining, and extending the application. Whether you're a beginner learning web development or an experienced developer reviewing the codebase, this guide offers detailed explanations of every component and feature.

The modular structure makes it easy to add new features, modify existing functionality, or adapt the design for different use cases. The project serves as an excellent foundation for building more complex social media applications or learning modern web development techniques.

---

## CSS Styling Explained

### 1. Global Styles

#### Card Hover Effects
```css
.card {
    border-radius: 0.5rem;
    transition: box-shadow 0.25s ease, transform 0.2s ease;
    background-clip: border-box;
}

.card:hover {
    box-shadow: 0 10px 28px rgba(99, 102, 241, 0.22), 0 0 0 3px rgba(99, 102, 241, 0.12);
    transform: translateY(-2px);
}
```
- **Smooth transitions**: Cards animate when hovered
- **Glow effect**: Creates colored shadow around cards
- **Lift effect**: Cards move up slightly on hover

#### Home Page Specific Styling
```css
.page-home #posts .card:hover {
    box-shadow: 0 8px 24px rgba(253, 224, 71, 0.35), 0 0 0 3px rgba(253, 224, 71, 0.18);
    transform: translateY(-2px);
}
```
- **Page-specific**: Only applies to home page posts
- **Yellow glow**: Different color for home page cards
- **Scoped styling**: Uses page class to target specific pages

### 2. User Summary Styling

#### Profile Card Layout
```css
.user-summary-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;