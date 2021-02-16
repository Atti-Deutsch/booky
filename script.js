const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

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
    /* Regular expression regexr.com test*/
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

// Handle Data Form
function storeBookmark(e) {
    e.preventDefault(); /* Catch values whitout submitting to webserver */
    const nameValue = websiteNameEl.value; /* To pull value from modal input */
    let urlValue = websiteUrlEl.value; 
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {  /* Url input won´t need the http only url name */
        urlValue = `https://${urlValue}`; /* adding http url adress to input string */
    };
    console.log(nameValue, urlValue);
    if (!validate(nameValue, urlValue)) {
        return false;
    }
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);