// Initial Data and Web Components Import //
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import "./components/previewoverlay.js";
import "./components/searchoverlay.js";

document.addEventListener("DOMContentLoaded", () => {
  const previewOverlay = document.querySelector("preview-overlay");

  // Ensure books and authors are passed to the component
  previewOverlay.data = { books, authors, BOOKS_PER_PAGE };

  // Render initial book previews
  previewOverlay.renderBookPreviews(
    books,
    authors,
    "list__items",
    BOOKS_PER_PAGE
  );
});

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the search-overlay component
  const searchOverlay = document.querySelector("search-overlay");

  if (searchOverlay) {
    searchOverlay.data = { authors, genres, books };
  }
});

// Initialize variables

let page = 1;
let matches = books;
