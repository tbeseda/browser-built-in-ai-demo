/// <reference types="../global.d.ts" />

class LanguageModelSection extends HTMLElement {
  /** @type {HTMLFormElement | null} */
  $form = null;
  /** @type {HTMLTextAreaElement | null} */
  $textarea = null;
  /** @type {HTMLOutputElement | null} */
  $output = null;
  /** @type {HTMLButtonElement | null} */
  $button = null;
  /** @type {string | undefined} */
  rewritten = undefined;

  connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="language-model">
        <h2><strike>LanguageModel</strike></h2>
        <form>
          <fieldset>
            <legend>Ask me anything</legend>
            <label for="prompt">Prompt the <code>LanguageModel</code> about the story</label>
            <textarea name="prompt" placeholder="Access is unavailable 🫥"></textarea>
            <output name="result"></output>
          </fieldset>
          <button disabled type="submit">Ask</button>
        </form>
      </section>
    `;

    this.$form = this.querySelector('form');
    if (!this.$form) return;
    this.$textarea = this.$form.querySelector('textarea[name="prompt"]');
    this.$output = this.$form.querySelector('output[name="result"]');
    this.$button = this.$form.querySelector('button[type="submit"]');
    if (!this.$textarea || !this.$output || !this.$button) return;

    document.addEventListener('rewritten', this.onRewritten.bind(this));
    this.$form.addEventListener('submit', this.onSubmit.bind(this));
  }

  onRewritten(event) {
    if ('detail' in event) {
      this.rewritten = event.detail;
      // this.$button.disabled = false;
    }
  }

  onSubmit(event) {
    event.preventDefault();
    if (!this.$output || !this.$textarea) return;

    this.$output.textContent = `You asked: ${this.$textarea.value}`;
    this.$output.style.visibility = 'visible';
  }
}
customElements.define('language-model-section', LanguageModelSection);
