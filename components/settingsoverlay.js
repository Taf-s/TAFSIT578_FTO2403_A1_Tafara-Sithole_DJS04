class SettingsOverlay extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const html = `
       <link rel="stylesheet" href="./styles.css" />
      <dialog class="overlay" data-settings-overlay>
        <div class="overlay__content">
          <form class="overlay__form" data-settings-form id="settings">
            <label class="overlay__field">
              <div class="overlay__label">Theme</div>
              <select class="overlay__input overlay__input_select"
                data-settings-theme name="theme">
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>
            </label>
          </form>
          <div class="overlay__row">
            <button class="overlay__button" data-settings-cancel>Cancel</button>
            <button class="overlay__button overlay__button_primary" type="submit"
              form="settings">Save</button>
          </div>
        </div>
      </dialog>
    `;
    shadow.innerHTML = html;

    const cancelButton = this.shadowRoot.querySelector(
      "[data-settings-cancel]"
    );
    cancelButton.addEventListener("click", () => {
      this.shadowRoot.querySelector("[data-settings-overlay]").open = false;
    });

    const form = this.shadowRoot.querySelector("[data-settings-form]");
    form.addEventListener("submit", this.toggleThemeSettings.bind(this));

    // Event listener for opening the data setting overlay
    document
      .querySelector("[data-header-settings]")
      .addEventListener("click", () => {
        this.shadowRoot.querySelector("[data-settings-overlay]").open = true;
      });
    // Event listener for closing the data setting overlay
    document
      .querySelector("[data-list-close]")
      .addEventListener("click", () => {
        document.querySelector("[data-list-active]").open = false;
      });
  }

  toggleThemeSettings(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === "night") {
      this.setTheme("255, 255, 255", "10, 10, 20");
    } else {
      this.setTheme("10, 10, 20", "255, 255, 255");
    }

    this.shadowRoot.querySelector("[data-settings-overlay]").open = false;
  }

  setTheme(colorDark, colorLight) {
    document.documentElement.style.setProperty("--color-dark", colorDark);
    document.documentElement.style.setProperty("--color-light", colorLight);
  }
}

customElements.define("settings-overlay", SettingsOverlay);

export { SettingsOverlay };
