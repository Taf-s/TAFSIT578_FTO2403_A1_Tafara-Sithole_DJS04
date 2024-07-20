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
