
let isAuthenticated = false;


// DOM Elements
const authOverlay = document.getElementById('authOverlay');
const passwordInput = document.getElementById('password');
const authSubmitBtn = document.getElementById('authSubmit');
const logoutButton = document.getElementById('logoutButton');
const addLinkButtons = document.querySelectorAll('.add-link-button');
const adminPanels = document.querySelectorAll('.admin-panel');
const submitButtons = document.querySelectorAll('[data-action="add-link"]');

// Load links from JSON file
async function loadLinks() {
    try {
        const response = await fetch('links.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading links:', error);
        return {
            'jpeg-links': [],
            'tutorials': [],
            'events': []
        };
    }
}

// Display links for each category
async function displayLinks() {
    const links = await loadLinks();
    
    // Display JPEG links
    const jpegContainer = document.getElementById('jpegLinksContainer');
    jpegContainer.innerHTML = '';
    if (links['jpeg-links']) {
        links['jpeg-links'].forEach(link => {
            const linkElement = createLinkElement(link, 'jpeg-links');
            jpegContainer.appendChild(linkElement);
        });
    }
}

// Create a link element with delete functionality if authenticated
// function createLinkElement(link, category) {
//     const linkDiv = document.createElement('div');
//     linkDiv.className = 'link-item';
    
    
//     const linkAnchor = document.createElement('a');
//     linkAnchor.href = link.url;
//     linkAnchor.target = '_blank';
//     linkAnchor.textContent = link.title;
//     linkDiv.appendChild(linkAnchor);
    
//     // Add delete button if authenticated
//     // if (isAuthenticated) {
//     //     const deleteButton = document.createElement('button');
//     //     deleteButton.textContent = 'Delete';
//     //     deleteButton.style.marginLeft = '10px';
//     //     deleteButton.style.padding = '3px 8px';
//     //     deleteButton.style.background = '#e74c3c';
//     //     deleteButton.style.color = 'white';
//     //     deleteButton.style.border = 'none';
//     //     deleteButton.style.borderRadius = '3px';
//     //     deleteButton.style.cursor = 'pointer';
        
//     //     deleteButton.addEventListener('click', () => {
//     //         alert('Please update the links.json file to remove this link');
//     //     });
        
//     //     linkDiv.appendChild(deleteButton);
//     // }
    
//     return linkDiv;
// }

function createLinkElement(link, category) {
    const linkDiv = document.createElement('div');
    linkDiv.className = 'link-item';
    
    // Assign category as a data attribute (optional)
    if (category) {
        linkDiv.setAttribute('data-category', category);
    }

    // Creating an inner div
    const innerDiv = document.createElement('div');
    innerDiv.className = 'link-content';

    // Creating title container for flexbox alignment
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';

    // Creating club logo
    const clublogo = document.createElement('img');
    clublogo.className = 'club_logo' ;
    clublogo.src = link.logo ;
    
    // Creating title element
    const titleElement = document.createElement('h4');
    titleElement.textContent = link.title;

    // Creating covered by element
    const coveredbyElement = document.createElement('p');
    coveredbyElement.className = 'covered_by';
    coveredbyElement.textContent = `Covered by: ${link.coveredby}`;

    // Append title and coveredBy inside titleContainer
    titleContainer.appendChild(clublogo);
    titleContainer.appendChild(titleElement);
    titleContainer.appendChild(coveredbyElement);

    // Creating paragraph with anchor tag
    const linkParagraph = document.createElement('p');
    const linkAnchor = document.createElement('a');
    linkAnchor.href = link.url;
    linkAnchor.target = '_blank';
    linkAnchor.textContent = 'Open Link'; 
    linkAnchor.className = 'link-anchor'; // Optional for styling

    linkParagraph.appendChild(linkAnchor);

    // Appending elements inside innerDiv
    innerDiv.appendChild(titleContainer);
    innerDiv.appendChild(linkParagraph);

    // Appending innerDiv inside linkDiv
    linkDiv.appendChild(innerDiv);

    return linkDiv;
}





// Authentication functions
function checkAuth() {
    passwordInput.value = '';
    const token = sessionStorage.getItem('photographerAuthToken');
    if (token === 'authenticated') {
        authenticateUser();
    }
}

function authenticateUser() {
    isAuthenticated = true;
    authOverlay.classList.add('hidden');
    logoutButton.classList.remove('hidden');
    sessionStorage.setItem('photographerAuthToken', 'authenticated');
    displayLinks(); // Refresh with delete buttons
}

function logout() {
    isAuthenticated = false;
    sessionStorage.removeItem('photographerAuthToken');
    logoutButton.classList.add('hidden');
    authOverlay.classList.remove('hidden');
    displayLinks(); // Refresh without delete buttons
    
    // Hide all admin panels
    adminPanels.forEach(panel => {
        panel.classList.remove('active');
    });
}
const CLUB_PASSWORD = "1111";
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
            alert('You need to login to view editing instructions');
            return;
        }
        
        alert('To add or remove links, please update the links.json file in the repository.');
    });
});

// Check for updates every 5 minutes
setInterval(displayLinks, 300000);

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    displayLinks();
    checkAuth();
});