/// <reference types="../global.d.ts" />

class LanguageModelSection extends HTMLElement {
  /** @type {HTMLFormElement | null} */
  $form = null;
  /** @type {HTMLTextAreaElement | null} */
  $textarea = null;
  /** @type {HTMLButtonElement | null} */
  $button = null;
  /** @type {HTMLFieldSetElement | null} */
  $fieldset = null;
  /** @type {string | undefined} */
  rewritten = undefined;

  connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="language-model">
        <h2>LanguageModel</h2>
        <form>
          <fieldset>
            <legend>Ask about the rewrite</legend>
            <label for="prompt">Ask a question about the rewritten content</label>
            <textarea name="prompt" placeholder="e.g. Who should I cast as the main character?"></textarea>
          </fieldset>
          <button disabled type="submit">Ask</button>
        </form>
      </section>
    `;

    this.$form = this.querySelector('form');
    if (!this.$form) return;
    this.$textarea = this.$form.querySelector('textarea[name="prompt"]');
    this.$button = this.$form.querySelector('button[type="submit"]');
    this.$fieldset = this.$form.querySelector('fieldset');
    if (!this.$textarea || !this.$button || !this.$fieldset) return;

    document.addEventListener('rewritten', this.onRewritten.bind(this));
    this.$textarea.addEventListener('input', this.updateButtonState.bind(this));
    this.$form.addEventListener('submit', this.onSubmit.bind(this));
    this.updateButtonState();
  }

  onRewritten(event) {
    if ('detail' in event) {
      this.rewritten = event.detail;
      this.updateButtonState();
    }
  }

  updateButtonState() {
    if (!this.$button || !this.$textarea) return;
    this.$button.disabled = !(this.rewritten && this.$textarea.value.trim());
  }

  async onSubmit(event) {
    event.preventDefault();
    if (!this.$textarea || !this.rewritten || !this.$fieldset) return;

    const question = this.$textarea.value.trim();
    if (!question) return;

    const $output = document.createElement('output');
    $output.style.visibility = 'visible';
    $output.innerHTML = `<strong>${question}</strong><br><br>`;

    this.$fieldset.insertBefore($output, this.$textarea);

    this.$textarea.value = '';
    this.updateButtonState();

    const session = await LanguageModel.create({
      initialPrompts: [
        { role: 'system', content: 'You are a helpful assistant answering questions about a story.' },
        { role: 'user', content: `Here is a story:\n${this.rewritten}` }
      ]
    });

    for await (const chunk of session.promptStreaming(question)) {
      $output.innerHTML += chunk.replace(/\n/g, '<br>');
    }
    session.destroy();
  }
}
customElements.define('language-model-section', LanguageModelSection);
