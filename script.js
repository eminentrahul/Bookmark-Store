const modal = document.getElementById('modal');
const showModal = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameElement = document.getElementById('website-name');
const websiteURLElement = document.getElementById('website-url');
const bookmarkContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Present modal
function presentModal() {
    modal.classList.remove('close-modal');
    modal.classList.add('show-modal');
    websiteNameElement.focus();
}

//Regex to check valid URL
function validate(nameValue, urlValue) {
    const expression = /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;

    const regex = new RegExp(expression);

    if (!nameValue || !urlValue) {
        alert('Provide values for both fields');
        return false;
    }
    if (urlValue.match(regex)) {
        return true;
    }

    if (!(urlValue.match(regex))) {
        alert('Enter valide URL.');
        return false;
    }
}

function deleteBookmark(url) {
    console.log(url);
    bookmarks.forEach((bookmark, index) => {
        if (bookmark.url === url) {
            bookmarks.splice(index, 1);
        }
    });
    localStorage.setItem('bookmark', JSON.stringify(bookmarks));
    fetchBookmarks();
}

function buildBookmarksDOM() {
    bookmarkContainer.textContent = '';
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');

        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        // Favicon
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');

        // Link

        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarkContainer.appendChild(item);

    });
}

function fetchBookmarks() {
    if(localStorage.getItem('bookmark')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmark'));
    } else {

    }

    buildBookmarksDOM();
}

function storeBookmark(event) {
    event.preventDefault();
    const name = websiteNameElement.value;
    let URLvalue = websiteURLElement.value;

    if (!URLvalue.includes('https://', 'http://')) {
        URLvalue = `https://${URLvalue}`;
    }

    if (!validate(name, URLvalue)) {
        return false;
    }

    const bookmark = {
        name: name,
        url: URLvalue
    }

    bookmarks.push(bookmark);
    localStorage.setItem('bookmark', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameElement.focus();

}

showModal.addEventListener('click', presentModal);
closeModal.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (event) => event.target === modal ? modal.classList.remove('show-modal') : false);

// Event Listners
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load
fetchBookmarks();