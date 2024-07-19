import { BOOKS_PER_PAGE } from "/data.js";
class PreviewOverlay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styles.css" />
        <dialog class="overlay" data-list-active>
          <div class="overlay__preview">
            <img class="overlay__blur" data-list-blur src="" />
            <img class="overlay__image" data-list-image src="" />
          </div>
          <div class="overlay__content">
            <h3 class="overlay__title" data-list-title></h3>
            <div class="overlay__data" data-list-subtitle></div>
            <p class="overlay__data overlay__data_secondary" data-list-description></p>
          </div>
          <div class="overlay__row">
            <button class="overlay__button overlay__button_primary" data-list-close>Close</button>
          </div>
        </dialog>
      `;

    this.shadowRoot
      .querySelector("[data-list-close]")
      .addEventListener("click", () => {
        this.close();
      });

    this.books = [];
    this.authors = {};
  }

  set data({ books, authors }) {
    this.books = books;
    this.authors = authors;
    this.renderBookPreviews();
  }

  close() {
    this.shadowRoot.querySelector("[data-list-active]").open = false;
  }

  show(book) {
    this.shadowRoot.querySelector("[data-list-active]").open = true;
    this.shadowRoot.querySelector("[data-list-blur]").src = book.image;
    this.shadowRoot.querySelector("[data-list-image]").src = book.image;
    this.shadowRoot.querySelector("[data-list-title]").innerText = book.title;
    this.shadowRoot.querySelector("[data-list-subtitle]").innerText = `${
      this.authors[book.author]
    } (${new Date(book.published).getFullYear()})`;
    this.shadowRoot.querySelector("[data-list-description]").innerText =
      book.description;
  }

  connectedCallback() {
    this.shadowRoot.addEventListener("click", (event) => {
      if (event.target.classList.contains("preview")) {
        this.previewBook(event);
      }
    });
  }

  renderBookPreviews() {
    const container = document.querySelector(".list__items");
    if (!container) return;

    container.innerHTML = "";
    const starting = document.createDocumentFragment();
    this.books.slice(0, BOOKS_PER_PAGE).forEach((book) => {
      const element = this.createBookPreview(book);
      starting.appendChild(element);
    });

    container.appendChild(starting);
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
    const pathArray = event.composedPath();
    const active = this.findActivePreview(pathArray);

    if (active) {
      this.show(active);
    }
  }

  findBookById(id) {
    return this.books.find((book) => book.id === id) || null;
  }

  findActivePreview(pathArray) {
    for (const node of pathArray) {
      if (node?.dataset?.preview) {
        return this.findBookById(node.dataset.preview);
      }
    }
    return null;
  }
}

customElements.define("preview-overlay", PreviewOverlay);
