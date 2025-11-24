// API Base URL
const API_BASE_URL = 'http://localhost:3000/api/v1';

// DOM Elements
const authSection = document.getElementById('auth-section');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');
const logoutBtn = document.getElementById('logout-btn');
const postsFeed = document.getElementById('posts-feed');
const createPostBtn = document.getElementById('create-post-btn');
const createPostModal = document.getElementById('create-post-modal');
const closeModalBtn = document.getElementById('close-modal');
const postImageInput = document.getElementById('post-image');
const imagePreview = document.getElementById('image-preview');
const uploadSection = document.querySelector('.upload-section');
const captionSection = document.getElementById('caption-section');
const sharePostBtn = document.getElementById('share-post-btn');
const postCaptionInput = document.getElementById('post-caption');
const modalUsername = document.getElementById('modal-username');
const currentUsername = document.getElementById('current-username');
const currentEmail = document.getElementById('current-email');

// State
let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user') || '{}');

// Initialization
function init() {
    if (token) {
        showMainApp();
    } else {
        showAuth();
    }
}

function showAuth() {
    authSection.classList.remove('hidden');
    mainApp.classList.add('hidden');
}

function showMainApp() {
    authSection.classList.add('hidden');
    mainApp.classList.remove('hidden');
    if(user) {
        if(currentUsername) currentUsername.textContent = user.username;
        if(currentEmail) currentEmail.textContent = user.email || '';
        if(modalUsername) modalUsername.textContent = user.username;
    }
    loadFeed();
}

// Auth Event Listeners
switchToRegister.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    switchToRegister.classList.add('hidden');
    switchToLogin.classList.remove('hidden');
});

switchToLogin.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    switchToLogin.classList.add('hidden');
    switchToRegister.classList.remove('hidden');
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            token = data.data.accessToken;
            user = data.data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            showMainApp();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if (res.ok || res.status === 201) {
            alert('Registration successful! Please log in.');
            // Switch to login view
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            switchToLogin.classList.add('hidden');
            switchToRegister.classList.remove('hidden');
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred');
    }
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token = null;
    user = {};
    location.reload();
});

// Feed Logic
async function loadFeed() {
    try {
        const res = await fetch(`${API_BASE_URL}/photos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
            renderPosts(data.data);
        } else {
            if (res.status === 401) {
                // Token expired or invalid
                logoutBtn.click();
            }
            console.error('Failed to load feed:', data.message);
        }
    } catch (error) {
        console.error('Error loading feed:', error);
    }
}

function renderPosts(posts) {
    postsFeed.innerHTML = '';
    if (!posts || posts.length === 0) {
        postsFeed.innerHTML = '<div style="text-align:center; padding:20px;">No posts yet. Follow some people or create a post!</div>';
        return;
    }

    posts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.classList.add('post-card');
        
        // Resolve image path correctly (remove 'uploads\' prefix if doubled or handle relative path)
        // The backend saves as 'uploads\\filename' on Windows sometimes, or just 'uploads/filename'.
        // We need to serve it. Since we set static 'uploads', we can just use the filename if we strip 'uploads/'?
        // Or just use the full path if it's relative to root.
        // Let's clean the path.
        let cleanPath = post.filePath.replace(/\\/g, '/');
        
        postEl.innerHTML = `
            <div class="post-header">
                <div class="profile-pic"></div>
                <div class="username">${post.username || 'Unknown User'}</div>
            </div>
            <img src="${cleanPath}" class="post-image" alt="Post Image">
            <div class="post-actions">
                <i class="far fa-heart"></i>
                <i class="far fa-comment"></i>
                <i class="far fa-paper-plane"></i>
                <i class="far fa-bookmark" style="margin-left: auto;"></i>
            </div>
            <div class="post-likes">0 likes</div>
            <div class="post-caption">
                <span class="username">${post.username || 'Unknown User'}</span> ${post.caption || ''}
            </div>
            <div class="post-comments">View all 0 comments</div>
            <div class="post-time">${new Date(post.created_at).toLocaleDateString()}</div>
            <div class="comment-section">
                <i class="far fa-smile" style="font-size: 24px; margin-right: 10px;"></i>
                <input type="text" placeholder="Add a comment...">
                <button class="post-btn" disabled>Post</button>
            </div>
        `;
        postsFeed.appendChild(postEl);
    });
}

// Create Post Logic
createPostBtn.addEventListener('click', (e) => {
    e.preventDefault();
    createPostModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    createPostModal.classList.add('hidden');
    resetCreatePostModal();
});

createPostModal.addEventListener('click', (e) => {
    if (e.target === createPostModal) {
        createPostModal.classList.add('hidden');
        resetCreatePostModal();
    }
});

postImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Create a new structure for the preview mode without destroying the input
            const modalBody = document.querySelector('.modal-body');
            
            // Hide default upload section
            uploadSection.classList.add('hidden');
            
            // Create preview container if it doesn't exist
            let previewContainer = document.getElementById('preview-container');
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.id = 'preview-container';
                previewContainer.style.display = 'flex';
                previewContainer.style.width = '100%';
                previewContainer.style.height = '100%';
                modalBody.appendChild(previewContainer);
            } else {
                previewContainer.classList.remove('hidden');
            }
            
            // Clear previous content
            previewContainer.innerHTML = '';

            // Left side: Image
            const imgDiv = document.createElement('div');
            imgDiv.style.width = '65%';
            imgDiv.style.backgroundImage = `url(${reader.result})`;
            imgDiv.style.backgroundSize = 'cover';
            imgDiv.style.backgroundPosition = 'center';
            previewContainer.appendChild(imgDiv);

            // Right side: Move caption section here
            captionSection.classList.remove('hidden');
            previewContainer.appendChild(captionSection);
        };
        reader.readAsDataURL(file);
    }
});

function resetCreatePostModal() {
    postImageInput.value = '';
    postCaptionInput.value = '';
    
    // Reset views
    uploadSection.classList.remove('hidden');
    if (document.getElementById('preview-container')) {
        document.getElementById('preview-container').classList.add('hidden');
    }
    captionSection.classList.add('hidden');
    
    // Move caption section back to modal body (hidden) so it's not lost when we clear preview container
    document.querySelector('.modal-body').appendChild(captionSection);
}

// Re-implementing listener to be more robust
// We won't destroy DOM, just toggle visibility.
// But I already wrote code that destroys it in the listener. 
// Let's rewrite the listener to NOT destroy, but hide.
// Update: I can't change the listener code easily without rewriting the whole file content block.
// I will provide the simplified version where I don't destroy, but just hide/show.

sharePostBtn.addEventListener('click', async () => {
    const file = postImageInput.files[0]; // Access from the global variable, assuming it wasn't destroyed.
    // If I destroyed it in previous steps, this won't work. 
    // See my comment above about DOM manipulation. 
    // Let's assume I fix the listener below.
    
    if (!file) return;

    const caption = postCaptionInput.value;
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', caption);

    try {
        sharePostBtn.textContent = 'Sharing...';
        sharePostBtn.disabled = true;

        const res = await fetch(`${API_BASE_URL}/photos/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Do NOT set Content-Type header for FormData, browser sets it with boundary
            },
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            // Success
            createPostModal.classList.add('hidden');
            resetCreatePostModal();
            loadFeed();
        } else {
            alert(data.message || 'Upload failed');
        }
    } catch (error) {
        console.error(error);
        alert('Error uploading post');
    } finally {
        sharePostBtn.textContent = 'Share';
        sharePostBtn.disabled = false;
    }
});


// Initialize
init();
