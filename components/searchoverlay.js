import { genres } from "/data.js";
class SearchOverlay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styles.css" />
      <dialog class="overlay" data-search-overlay>
    <div class="overlay__content">
      <form class="overlay__form" data-search-form id="search">
        <label class="overlay__field">
          <div class="overlay__label">Title</div>
          <input class="overlay__input" data-search-title name="title"
            placeholder="Any"></input>
        </label>

        <label class="overlay__field">
          <div class="overlay__label">Genre</div>
          <select class="overlay__input overlay__input_select"
            data-search-genres name="genre"></select>
        </label>

        <label class="overlay__field">
          <div class="overlay__label">Author</div>
          <select class="overlay__input overlay__input_select"
            data-search-authors name="author">
          </select>
        </label>
      </form>

      <div class="overlay__row">
        <button class="overlay__button" data-search-cancel>Cancel</button>
        <button class="overlay__button overlay__button_primary" type="submit"
          form="search">Search</button>
      </div>
    </div>
  </dialog>
      `;
  }

  /**
   * Sets the data for the component.
   *
   * @param {Object} data - The data object containing authors, genres, and books.
   * @return {void}
   */
  set data({ authors, genres, books }) {
    this.authors = authors;
    this.genres = genres;
    this.books = books;
    this.populateGenresAndAuthors();
  }

  /**
   * Called when the custom element is inserted into a document.
   * Initializes the event listeners for the component.
   *
   * @return {void}
   */
  connectedCallback() {
    this.addEventListeners();
  }

  /**
   * Adds event listeners to handle search overlay functionality.
   */
  addEventListeners() {
    const overlay = this.shadowRoot.querySelector("[data-search-overlay]");
    const headerSearchButton = document.querySelector("[data-header-search]");
    const cancelButton = this.shadowRoot.querySelector("[data-search-cancel]");
    const searchForm = this.shadowRoot.querySelector("[data-search-form]");

    headerSearchButton?.addEventListener("click", () => {
      overlay.showModal();
      overlay.querySelector("[data-search-title]").focus();
    });

    cancelButton.addEventListener("click", () => {
      overlay.close();
    });

    searchForm.addEventListener("submit", (event) => {
      this.searchFormSubmit(event);
    });
  }

  /**
   * Populates the genre and author select elements with data.
   *
   */
  populateGenresAndAuthors() {
    const genreSelect = this.shadowRoot.querySelector("[data-search-genres]");
    const authorSelect = this.shadowRoot.querySelector("[data-search-authors]");

    if (!this.genres || !this.authors) {
      console.error("Genres or authors data is missing.");
      return;
    }

    genreSelect.innerHTML = '<option value="any">All Genres</option>';
    authorSelect.innerHTML = '<option value="any">All Authors</option>';

    for (const [id, name] of Object.entries(this.genres)) {
      const option = document.createElement("option");
      option.value = id;
      option.innerText = name;
      genreSelect.appendChild(option);
    }

    for (const [id, name] of Object.entries(this.authors)) {
      const option = document.createElement("option");
      option.value = id;
      option.innerText = name;
      authorSelect.appendChild(option);
    }
  }

  /**
   * Handles the form submission for searching books based on filters.
   *
   * @param {Event} event - The event object representing the form submission.
   * @return {void} This function does not return a value.
   */
  searchFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    function applyFilters(book, filters) {
      let genreMatch = filters.genre === "any";

      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }

      if (
        (filters.title.trim() === "" ||
          book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || book.author === filters.author) &&
        genreMatch
      ) {
        return true;
      } else {
        return false;
      }
    }

    for (const book of this.books) {
      if (applyFilters(book, filters)) {
        result.push(book);
      }
    }

    this.page = 1;
    this.matches = result;

    const listMessage = this.shadowRoot.querySelector("[data-list-message]");
    listMessage.classList.toggle("list__message_show", result.length < 1);

    const listItems = this.shadowRoot.querySelector(".list__items");
    listItems.innerHTML = "";

    this.renderBooks(result.slice(0, this.BOOKS_PER_PAGE));

    showMoreButton(
      this.books,
      this.page,
      this.matches,
      this.BOOKS_PER_PAGE,
      this.shadowRoot.querySelector("[data-list-button]")
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Renders the list of books on the page.
   *
   * @param {Array} books - The array of books to be rendered.
   */
  renderBooks(books) {
    const listItemsContainer = this.shadowRoot.querySelector(".list__items");

    const fragment = document.createDocumentFragment();
    books.forEach((book) => {
      const element = this.createBookElement(book);
      fragment.appendChild(element);
    });

    listItemsContainer.appendChild(fragment);
  }

  /**
   * Creates a book element with the provided book information.
   *
   * @param {Object} book - The book object containing the image, title, and author.
   * @return {HTMLElement} The created book element.
   */
  createBookElement(book) {
    const element = document.createElement("div");
    element.classList.add("book");
    element.innerHTML = `
        <img src="${book.image}" alt="${book.title}" />
        <div class="book-info">
          <h3>${book.title}</h3>
          <p>${this.authors[book.author]}</p>
        </div>
      `;
    return element;
  }
}

customElements.define("search-overlay", SearchOverlay);
