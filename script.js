const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

// Object bookmarks
let bookmarks = {};

// Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false)); /*When click inside modal nothing should happen*/

// Validate Form (check if input match valid web adress)
function validate(nameValue, urlValue) {  
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM (Nya bookmark ska skapas funktion)
function buildBookmarks() {
    // Remove all bookmarks elements
    bookmarksContainer.textContent = ''; // this is reseting container
    // Build Items (skapar bookmark elementen)
    Object.keys(bookmarks).forEach((id) => { //forEach kommer köra igenom listan varje gång inkl befintliga objekt
       const { name, url } = bookmarks[id]; // destructuring name & url
        // Item
        const item = document.createElement('div');  // Av säkerhetsskäl undviker jag "innerHTML"
        item.classList.add('item');  
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${id}')`);
        // Favicon / Link Container (anchor element)
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`); //url will pull dynamically icons for the site
        favicon.setAttribute('alt', 'Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank'); //_blank allows opening in a new tab
        link.textContent = name; // Insted of innerText  (link name show up for user)
        // Append to bookmarks container (linkinfo) 
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item); 
    });
}

// Fetch Bookmarks (parse string JSON "stringified" object to JSON object)
function fetchBookmarks() {
    // Get bookmarks from local storage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localstorage (showcase "new" visitors without history)
        const id = `https://ikea.se`
        bookmarks[id]= 
            {
               name: 'ikea',
               url: 'https://ikea.se',
            }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(id) {
    if (bookmarks[id]) {
		delete bookmarks[id]
	}
    // Update bookmarks array in localstorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle Data Form
function storeBookmark(e) {
    e.preventDefault(); /* Catch values whitout submitting to webserver */
    const nameValue = websiteNameEl.value; /* To pull value from modal input */
    let urlValue = websiteUrlEl.value; 
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {  /* Url input won´t need the http only url name */
        urlValue = `https://${urlValue}`; /* adding http url adress to input string */
    };
    if (!validate(nameValue, urlValue)) {
        return false;
    }

    // Set bookmark objects, add to ARRAY
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks[urlValue] = bookmark;  // this will push objekt to array
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); // Saving objekts as string to localstorage
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);
// On load, Fetch Bookmarks 
fetchBookmarks();