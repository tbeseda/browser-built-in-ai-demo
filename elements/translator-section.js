/// <reference types="../global.d.ts" />

class TranslatorSection extends HTMLElement {
  /** @type {HTMLFormElement | null} */
  $form = null;
  /** @type {HTMLSelectElement | null} */
  $select = null;
  /** @type {HTMLOutputElement | null} */
  $output = null;
  /** @type {HTMLButtonElement | null} */
  $button = null;
  /** @type {string | undefined} */
  rewritten = undefined;

  connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="translator">
        <h2>Translator</h2>
        <form>
          <fieldset>
            <legend>No, Canadian is not an option</legend>
            <label for="language"><code>Translator</code> output language</label>
            <select name="language">
              <option value="no">Norwegian</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
            <output name="result"></output>
          </fieldset>
          <button disabled type="submit">Translate</button>
        </form>
      </section>
    `;

    this.$form = this.querySelector('form');
    if (!this.$form) return;
    this.$select = this.$form.querySelector('select[name="language"]');
    this.$output = this.$form.querySelector('output[name="result"]');
    this.$button = this.$form.querySelector('button[type="submit"]');
    if (!this.$select || !this.$output || !this.$button) return;

    document.addEventListener('rewritten', this.onRewritten.bind(this));
    this.$form.addEventListener('submit', this.onSubmit.bind(this));
  }

  onRewritten(event) {
    if ('detail' in event) {
      this.rewritten = event.detail;
      if (this.$button) this.$button.disabled = false;
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    if (!this.$output || !this.$select) return;
    if (!this.rewritten) return;

    this.$output.textContent = 'Translating...';
    this.$output.style.visibility = 'visible';

    const translator = await Translator.create({
      sourceLanguage: 'en',
      targetLanguage: this.$select.value,
    });

    const stream = translator.translateStreaming(this.rewritten);
    this.$output.textContent = '';
    for await (const chunk of stream) this.$output.textContent += chunk;

    translator.destroy();
  }
}
customElements.define('translator-section', TranslatorSection);
