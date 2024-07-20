import { BOOKS_PER_PAGE } from "/data.js";
class PreviewOverlay extends HTMLElement {
  constructor() {
    super();
    this.BOOKS_PER_PAGE = 10;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./styles.css" />
      <main class="list">
    <div class="list__items" data-list-items></div>
    <div class="list__message" data-list-message>No results found. Your filters
      might be too narrow.</div>
    <button class="list__button" data-list-button></button>
  </main>
  <dialog class="overlay" data-list-active>
    <div class="overlay__preview"><img class="overlay__blur" data-list-blur
        src="" /><img class="overlay__image" data-list-image src="" /></div>
    <div class="overlay__content">
      <h3 class="overlay__title" data-list-title></h3>
      <div class="overlay__data" data-list-subtitle></div>
      <p class="overlay__data overlay__data_secondary" data-list-description>
      </p>
    </div>
    <div class="overlay__row">
      <button class="overlay__button overlay__button_primary"
        data-list-close>Close</button>
    </div>
  </dialog>
    `;
  }

  /**
   * Sets the data for the component.
   *
   * @param {Object} data - An object containing the books and authors.
   * @param {Array} data.books - An array of books.
   * @param {Array} data.authors - An array of authors.
   * @return {void}
   */
  set data({ books, authors }) {
    this.books = books;
    this.authors = authors;
    this.page = 1; // Initialize or reset page
    this.matches = books; // Store all books as the initial set of matches
    this.renderBookPreviews();
  }

  connectedCallback() {
    this.addEventListeners();
  }

  /**
   * Add event listeners to the container, close button, and list button.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  addEventListeners() {
    const container = this.shadowRoot.querySelector(".list__items");
    const closeButton = this.shadowRoot.querySelector("[data-list-close]");
    const listButton = this.shadowRoot.querySelector("[data-list-button]");

    container.addEventListener("click", (event) => {
      if (event.target.closest(".preview")) {
        this.previewBook(event);
      }
    });

    closeButton.addEventListener("click", () => this.close());

    listButton.addEventListener("click", () => {
      this.loadMoreBooks();
    });
  }

  /**
   * Renders book previews based on the available books within the specified limit.
   *
   */
  renderBookPreviews() {
    const container = this.shadowRoot.querySelector(".list__items");
    if (!container) return;

    container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    this.books.slice(0, BOOKS_PER_PAGE).forEach((book) => {
      const element = this.createBookPreview(book);
      fragment.appendChild(element);
    });

    container.appendChild(fragment);
    this.updateShowMoreButton();
  }

  /**
   * Creates a book preview element with the specified author, id, image, and title.
   *
   * @param {Object} author - The author of the book.
   * @param {string} id - The ID of the book.
   * @param {string} image - The image URL of the book.
   * @param {string} title - The title of the book.
   * @return {HTMLElement} The created book preview element.
   */
  createBookPreview({ author, id, image, title }) {
    const element = document.createElement("button");
    element.classList.add("preview");
    element.setAttribute("data-preview", id);
    element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${this.authors[author]}</div>
        </div>
      `;
    return element;
  }

  /**
   * Handles the preview of a book when the corresponding button is clicked.
   *
   * @param {Event} event - The click event triggered by the button.
   * @return {void} This function does not return anything.
   */
  previewBook(event) {
    const button = event.target.closest(".preview");
    if (button) {
      const bookId = button.getAttribute("data-preview");
      const book = this.findBookById(bookId);
      if (book) {
        this.show(book);
      }
    }
  }

  /**
   * Updates the overlay with the details of the provided book.
   *
   * @param {Object} book - The book object containing information to display.
   */
  show(book) {
    const overlay = this.shadowRoot.querySelector("[data-list-active]");
    overlay.open = true;
    this.shadowRoot.querySelector("[data-list-blur]").src = book.image;
    this.shadowRoot.querySelector("[data-list-image]").src = book.image;
    this.shadowRoot.querySelector("[data-list-title]").innerText = book.title;
    this.shadowRoot.querySelector("[data-list-subtitle]").innerText = `${
      this.authors[book.author]
    } (${new Date(book.published).getFullYear()})`;
    this.shadowRoot.querySelector("[data-list-description]").innerText =
      book.description;
  }

  close() {
    this.shadowRoot.querySelector("[data-list-active]").close();
  }

  findBookById(id) {
    return this.books.find((book) => book.id === id) || null;
  }

  /**
   * Updates the show more button by creating book previews and appending them to the list items.
   *
   * @return {void}
   */
  updateShowMoreButton() {
    const fragment = document.createDocumentFragment();
    const booksToShow = this.matches.slice(
      this.page * this.this.BOOKS_PER_PAGE(this.page + 1) * this.BOOKS_PER_PAGE
    );
    const previewElements = booksToShow.map((book) =>
      this.createBookPreview(book)
    );
    previewElements.forEach((element) => fragment.appendChild(element));
    this.shadowRoot.querySelector("[data-list-items]").appendChild(fragment);
    this.page += 1;
  }
}

customElements.define("preview-overlay", PreviewOverlay);
