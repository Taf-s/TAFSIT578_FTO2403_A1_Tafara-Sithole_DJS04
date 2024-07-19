// Initial Data Import //
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import "./components/previewoverlay.js";

document.addEventListener("DOMContentLoaded", () => {
  const previewOverlay = document.querySelector("preview-overlay");

  // Ensure books and authors are passed to the component
  previewOverlay.data = { books, authors };

  // Render initial book previews
  previewOverlay.renderBookPreviews(
    books,
    authors,
    "list__items",
    BOOKS_PER_PAGE
  );
});

// Initialize variables

let page = 1;
let matches = books;

// /**
//  * Finds a book by its ID within the books array.
//  *
//  *
//  * @param {string} id - The ID of the book to find.
//  * @return {object | null} The book object if found, else null.
//  */
// function findBookById(id) {
//   let result = null;

//   for (const singleBook of books) {
//     if (result) break;
//     if (singleBook.id === id) result = singleBook;
//   }

//   return result;
// }

// // Book Preview Functions

// /**
//  * Creates a preview element with the given book information.
//  *
//  * @param {Object} book - The book object containing author, id, image, and title.
//  * @return {HTMLElement} The created preview element.
//  */
// function createBookPreview({ author, id, image, title }, authors) {
//   const element = document.createElement("button");
//   element.classList = "preview";
//   element.setAttribute("data-preview", id);
//   element.innerHTML = `
// 	    <img
// 		 class="preview__image"
// 		 src="${image}"
// 	    />

// 	    <div class="preview__info">
// 		 <h3 class="preview__title">${title}</h3>
// 		 <div class="preview__author">${authors[author]}</div>
// 	    </div>
// 	  `;

//   return element;
// }

// /**
//  * Creates preview elements based on the given books data, authors data, container selector, and books per page.
//  *
//  * @param {Array} books - The array of books data.
//  * @param {Object} authors - The object containing author data.
//  * @param {string} containerSelector - The selector for the container element.
//  * @param {number} booksPerPage - The number of books to display per page.
//  * @return {void}
//  */
// function renderBookPreview(books, authors, containerSelector, booksPerPage) {
//   const container = document.querySelector(containerSelector);
//   const starting = document.createDocumentFragment();
//   const previewElements = books
//     .slice(0, booksPerPage)
//     .map((book) => createBookPreview(book, authors));
//   previewElements.forEach((element) => starting.appendChild(element));
//   container.appendChild(starting);
// }

// /**
//  * Displays a preview of the active book by updating the DOM elements with the book's information.
//  *
//  * @param {Object} active - The active book object containing title, author, published date, image, and description.
//  */
// function showPreview(active) {
//   document.querySelector("[data-list-active]").open = true;
//   document.querySelector("[data-list-blur]").src = active.image;
//   document.querySelector("[data-list-image]").src = active.image;
//   document.querySelector("[data-list-title]").innerText = active.title;
//   document.querySelector("[data-list-subtitle]").innerText = `${
//     authors[active.author]
//   } (${new Date(active.published).getFullYear()})`;
//   document.querySelector("[data-list-description]").innerText =
//     active.description;
// }

// /**
//  * Displays a preview of the active book by updating the DOM elements with the book's information.
//  *
//  * @param {Event} event - The event triggering the function.
//  * @return {void} No return value.
//  */
// function previewBook(event) {
//   const pathArray = Array.from(event.path || event.composedPath());
//   const active = findActivePreview(pathArray);

//   if (active) {
//     showPreview(active);
//   }
// }

// /**
//  * Finds the active preview by iterating through the pathArray and checking for the presence of a preview dataset attribute.
//  *
//  * @param {Array} pathArray - The array containing the path elements to search through.
//  * @return {Object | null} The active preview if found, otherwise null.
//  */
// function findActivePreview(pathArray) {
//   let active = null;

//   for (const node of pathArray) {
//     if (active) break;

//     if (node?.dataset?.preview) {
//       active = findBookById(node?.dataset?.preview);
//     }
//   }

//   return active;
// }

// Search Functions //

/**
 * Opens the search overlay and initializes the genres and authors dropdown menus.
 */
// function openSearchOverlay() {
//   // Code to toggle the search overlay and to activate the search //
//   document
//     .querySelector("[data-header-search]")
//     .addEventListener("click", () => {
//       document.querySelector("[data-search-overlay]").open = true;
//       document.querySelector("[data-search-title]").focus();
//     });

//   // Code to populate the genres and authors dropdown menus //
//   const genreHtml = document.createDocumentFragment();
//   const firstGenreElement = document.createElement("option");
//   firstGenreElement.value = "any";
//   firstGenreElement.innerText = "All Genres";
//   genreHtml.appendChild(firstGenreElement);

//   for (const [id, name] of Object.entries(genres)) {
//     const element = document.createElement("option");
//     element.value = id;
//     element.innerText = name;
//     genreHtml.appendChild(element);
//   }

//   document.querySelector("[data-search-genres]").appendChild(genreHtml);

//   const authorsHtml = document.createDocumentFragment();
//   const firstAuthorElement = document.createElement("option");
//   firstAuthorElement.value = "any";
//   firstAuthorElement.innerText = "All Authors";
//   authorsHtml.appendChild(firstAuthorElement);

//   for (const [id, name] of Object.entries(authors)) {
//     const element = document.createElement("option");
//     element.value = id;
//     element.innerText = name;
//     authorsHtml.appendChild(element);
//   }

//   document.querySelector("[data-search-authors]").appendChild(authorsHtml);

//   // Code to handle cancel button to close the overlay//
//   document
//     .querySelector("[data-search-cancel]")
//     .addEventListener("click", () => {
//       document.querySelector("[data-search-overlay]").open = false;
//     });
// }

// document
//   .querySelector("[data-search-form]")
//   .addEventListener("submit", searchFormSubmit);

// // Main Function to handle Search  Form Submission and Display Results //

// /**
//  * Submits the search form and filters the books based on the provided filters.
//  *
//  * @param {Event} event - The event object.
//  * @return {void}
//  */
// function searchFormSubmit(event) {
//   event.preventDefault();
//   const formData = new FormData(event.target);
//   const filters = Object.fromEntries(formData);
//   const result = [];

//   /**
//    * Applies filters to a book and checks if it matches the filters.
//    *
//    * @param {Object} book - The book object to be filtered.
//    * @param {Object} filters - The filters to be applied.
//    * @param {string} filters.genre - The genre filter.
//    * @param {string} filters.title - The title filter.
//    * @param {string} filters.author - The author filter.
//    * @return {boolean} Returns true if the book matches the filters, false otherwise.
//    */
//   function applyFilters(book, filters) {
//     let genreMatch = filters.genre === "any";

//     for (const singleGenre of book.genres) {
//       if (genreMatch) break;
//       if (singleGenre === filters.genre) {
//         genreMatch = true;
//       }
//     }

//     if (
//       (filters.title.trim() === "" ||
//         book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
//       (filters.author === "any" || book.author === filters.author) &&
//       genreMatch
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   // To use the function:
//   for (const book of books) {
//     if (applyFilters(book, filters)) {
//       result.push(book);
//     }
//   }

//   page = 1;
//   matches = result;

//   result.length < 1
//     ? document
//         .querySelector("[data-list-message]")
//         .classList.add("list__message_show")
//     : document
//         .querySelector("[data-list-message]")
//         .classList.remove("list__message_show");

//   document.querySelector("[data-list-items]").innerHTML = "";

//   renderBookPreview(books, authors, "[data-list-items]", BOOKS_PER_PAGE);

//   showMoreButton(
//     books,
//     page,
//     matches,
//     BOOKS_PER_PAGE,
//     document.querySelector("[data-list-button]")
//   );

//   window.scrollTo({ top: 0, behavior: "smooth" });
//   document.querySelector("[data-search-overlay]").open = false;
// }

// Show More Button Function//
/**
 * Updates the show more button in the list view.
 *
 * @param {Array<Object>} books - The list of books.
 * @param {number} page - The current page.
 * @param {Array<Object>} matches - The list of books that match the current search.
 * @param {number} BOOKS_PER_PAGE - The number of books per page.
 * @param {HTMLElement} listButton - The show more button element.
 */
function showMoreButton(books, page, matches, BOOKS_PER_PAGE, listButton) {
  listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
  listButton.disabled = matches.length - page * BOOKS_PER_PAGE > 0;

  listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>
  `;
}

// showMoreButton(
//   books,
//   page,
//   matches,
//   BOOKS_PER_PAGE,
//   document.querySelector("[data-list-button]")
// );

// Event listeners //

// // Event Listener for Previewing Books//
// document
//   .querySelector("[data-list-items]")
//   .addEventListener("click", previewBook);

// Initial Render
// renderBookPreview(books, authors, "[data-list-items]", BOOKS_PER_PAGE);
openSearchOverlay();
