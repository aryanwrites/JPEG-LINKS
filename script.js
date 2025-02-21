const linkStorage = {
    'jpeg-links': [
        { url: 'https://example.com/jpeg-guide', title: 'JPEG Compression Guide' },
        { url: 'https://example.com/photo-editors', title: 'Best Photo Editors 2025' }
    ],
    
};

// Club password (in a real app, this would be server-side validated)
const CLUB_PASSWORD = "1111";
let isAuthenticated = false;

// DOM Elements
const authOverlay = document.getElementById('authOverlay');
const passwordInput = document.getElementById('password');
const authSubmitBtn = document.getElementById('authSubmit');
const logoutButton = document.getElementById('logoutButton');
const addLinkButtons = document.querySelectorAll('.add-link-button');
const adminPanels = document.querySelectorAll('.admin-panel');
const submitButtons = document.querySelectorAll('[data-action="add-link"]');

// Load links from localStorage or use default data
function loadLinks() {
    const storedLinks = localStorage.getItem('photographerClubLinks');
    if (storedLinks) {
        return JSON.parse(storedLinks);
    }
    
    // Save default data to localStorage
    localStorage.setItem('photographerClubLinks', JSON.stringify(linkStorage));
    return linkStorage;
}

// Save links to localStorage
function saveLinks(links) {
    localStorage.setItem('photographerClubLinks', JSON.stringify(links));
}

// Display links for each category
function displayLinks() {
    const links = loadLinks();
    
    // Display JPEG links
    const jpegContainer = document.getElementById('jpegLinksContainer');
    jpegContainer.innerHTML = '';
    links['jpeg-links'].forEach(link => {
        const linkElement = createLinkElement(link, 'jpeg-links');
        jpegContainer.appendChild(linkElement);
    });
    
    // Display Tutorial links
    const tutorialsContainer = document.getElementById('tutorialsLinksContainer');
    tutorialsContainer.innerHTML = '';
    links['tutorials'].forEach(link => {
        const linkElement = createLinkElement(link, 'tutorials');
        tutorialsContainer.appendChild(linkElement);
    });
    
    // Display Event links
    const eventsContainer = document.getElementById('eventsLinksContainer');
    eventsContainer.innerHTML = '';
    links['events'].forEach(link => {
        const linkElement = createLinkElement(link, 'events');
        eventsContainer.appendChild(linkElement);
    });
}

// Create a link element with delete functionality if authenticated
function createLinkElement(link, category) {
    const linkDiv = document.createElement('div');
    linkDiv.className = 'link-item';
    
    const linkAnchor = document.createElement('a');
    linkAnchor.href = link.url;
    linkAnchor.target = '_blank';
    linkAnchor.textContent = link.title;
    linkDiv.appendChild(linkAnchor);
    
    // Add delete button if authenticated
    if (isAuthenticated) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.padding = '3px 8px';
        deleteButton.style.background = '#e74c3c';
        deleteButton.style.color = 'white';
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '3px';
        deleteButton.style.cursor = 'pointer';
        
        deleteButton.addEventListener('click', () => {
            deleteLink(link, category);
        });
        
        linkDiv.appendChild(deleteButton);
    }
    
    return linkDiv;
}

// Delete a link
function deleteLink(linkToDelete, category) {
    if (!isAuthenticated) return;
    
    const links = loadLinks();
    links[category] = links[category].filter(link => 
        link.url !== linkToDelete.url || link.title !== linkToDelete.title
    );
    
    saveLinks(links);
    displayLinks();
}

// Add a new link
function addLink(category) {
    if (!isAuthenticated) return;
    
    let urlInput, titleInput;
    
    if (category === 'jpeg-links') {
        urlInput = document.getElementById('linkUrl');
        titleInput = document.getElementById('linkTitle');
    } else if (category === 'tutorials') {
        urlInput = document.getElementById('tutorialLinkUrl');
        titleInput = document.getElementById('tutorialLinkTitle');
    } else if (category === 'events') {
        urlInput = document.getElementById('eventLinkUrl');
        titleInput = document.getElementById('eventLinkTitle');
    }
    
    const url = urlInput.value.trim();
    const title = titleInput.value.trim();
    
    if (!url || !title) {
        alert('Please enter both URL and title');
        return;
    }
    
    // Add http:// if missing
    const formattedUrl = url.startsWith('http') ? url : `http://${url}`;
    
    const links = loadLinks();
    links[category].push({ url: formattedUrl, title });
    saveLinks(links);
    
    // Clear inputs
    urlInput.value = '';
    titleInput.value = '';
    
    // Close admin panel
    document.querySelector(`.admin-panel[data-for="${category}"]`).classList.remove('active');
    
    // Refresh display
    displayLinks();
}

// Authentication functions
function checkAuth() {
    passwordInput.value = '';
    const token = localStorage.getItem('photographerAuthToken');
    if (token === 'authenticated') {
        authenticateUser();
    }
}

function authenticateUser() {
    isAuthenticated = true;
    authOverlay.classList.add('hidden');
    logoutButton.classList.remove('hidden');
    localStorage.setItem('photographerAuthToken', 'authenticated');
    displayLinks(); // Refresh with delete buttons
}

function logout() {
    isAuthenticated = false;
    localStorage.removeItem('photographerAuthToken');
    logoutButton.classList.add('hidden');
    authOverlay.classList.remove('hidden');
    displayLinks(); // Refresh without delete buttons
    
    // Hide all admin panels
    adminPanels.forEach(panel => {
        panel.classList.remove('active');
    });
}

// Event Listeners
authSubmitBtn.addEventListener('click', () => {
    if (passwordInput.value === CLUB_PASSWORD) {
        authenticateUser();
    } else {
        alert('Incorrect password');
    }
});

logoutButton.addEventListener('click', logout);

// Toggle admin panels
addLinkButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!isAuthenticated) {
            alert('You need to login to add links');
            return;
        }
        
        const category = button.getAttribute('data-category');
        const targetPanel = document.querySelector(`.admin-panel[data-for="${category}"]`);
        
        // Close all other panels
        adminPanels.forEach(panel => {
            if (panel !== targetPanel) {
                panel.classList.remove('active');
            }
        });
        
        // Toggle this panel
        targetPanel.classList.toggle('active');
    });
});

// Handle add link form submissions
submitButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        addLink(category);
    });
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    displayLinks();
    checkAuth();
});