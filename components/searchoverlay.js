class SearchOverlay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `
        <link rel="stylesheet" href="./styles.css" />
        <dialog class="overlay" data-search-overlay>
          <div class="overlay__content">
            <form class="overlay__form" data-search-form id="search">
              <label class="overlay__field">
                <div class="overlay__label">Title</div>
                <input class="overlay__input" data-search-title name="title" placeholder="Any"></input>
              </label>
  
              <label class="overlay__field">
                <div class="overlay__label">Genre</div>
                <select class="overlay__input overlay__input_select" data-search-genres name="genre"></select>
              </label>
  
              <label class="overlay__field">
                <div class="overlay__label">Author</div>
                <select class="overlay__input overlay__input_select" data-search-authors name="author"></select>
              </label>
            </form>
  
            <div class="overlay__row">
              <button class="overlay__button" data-search-cancel>Cancel</button>
              <button class="overlay__button overlay__button_primary" type="submit" form="search">Search</button>
            </div>
          </div>
        </dialog>
      `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot
      .querySelector("[data-search-form]")
      .addEventListener("submit", this.searchFormSubmit.bind(this));

    this.shadowRoot
      .querySelector("[data-search-cancel]")
      .addEventListener("click", () => {
        this.shadowRoot.host.open = false;
      });

    this.populateGenresAndAuthors();
  }

  populateGenresAndAuthors() {
    const genreSelect = this.shadowRoot.querySelector("[data-search-genres]");
    const authorSelect = this.shadowRoot.querySelector("[data-search-authors]");

    if (!genres || !authors) {
      console.error("Genres or authors data is missing.");
      return;
    }

    const firstGenreOption = document.createElement("option");
    firstGenreOption.value = "any";
    firstGenreOption.innerText = "All Genres";
    genreSelect.appendChild(firstGenreOption);

    for (const [id, name] of Object.entries(genres)) {
      const option = document.createElement("option");
      option.value = id;
      option.innerText = name;
      genreSelect.appendChild(option);
    }

    const firstAuthorOption = document.createElement("option");
    firstAuthorOption.value = "any";
    firstAuthorOption.innerText = "All Authors";
    authorSelect.appendChild(firstAuthorOption);

    for (const [id, name] of Object.entries(authors)) {
      const option = document.createElement("option");
      option.value = id;
      option.innerText = name;
      authorSelect.appendChild(option);
    }
  }

  searchFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);

    const result = [];

    function applyFilters(book, filters) {
      if (!book || !book.genres) return false;

      const genreMatch =
        filters.genre === "any" || book.genres.includes(filters.genre);

      return (
        (filters.title.trim() === "" ||
          book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || book.author === filters.author) &&
        genreMatch
      );
    }

    if (!books) {
      console.error("Books data is missing.");
      return;
    }

    for (const book of books) {
      if (applyFilters(book, filters)) {
        result.push(book);
      }
    }

    page = 1;
    matches = result;

    const listMessage = document.querySelector("[data-list-message]");
    if (listMessage) {
      listMessage.classList.toggle("list__message_show", result.length < 1);
    }

    document.querySelector("[data-list-items]").innerHTML = "";

    showMoreButton(
      books,
      page,
      matches,
      BOOKS_PER_PAGE,
      document.querySelector("[data-list-button]")
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
    this.shadowRoot.host.open = false;
  }
}

customElements.define("search-overlay", SearchOverlay);
