/// <reference types="../global.d.ts" />

class SummarizerSection extends HTMLElement {
  /** @type {HTMLFormElement | null} */
  $form = null;
  /** @type {HTMLOutputElement | null} */
  $output = null;
  /** @type {HTMLButtonElement | null} */
  $button = null;
  /** @type {string | undefined} */
  rewritten = undefined;

  connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="summarizer">
        <h2>Summarizer</h2>
        <form>
          <fieldset>
            <legend>Create a teaser! sry about spoilers</legend>
            <output name="result"></output>
          </fieldset>
          <button disabled type="submit">Summarize</button>
        </form>
      </section>
    `;

    this.$form = this.querySelector('form');
    if (!this.$form) return;
    this.$output = this.$form.querySelector('output[name="result"]');
    this.$button = this.$form.querySelector('button[type="submit"]');
    if (!this.$output || !this.$button) return;

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
    if (!this.$output) return;
    if (!this.rewritten) return;

    this.$output.textContent = 'Summarizing...';
    this.$output.style.visibility = 'visible';

    const summarizer = await Summarizer.create({
      sharedContext: 'An engaging teaser for a short story. Do not spoil the ending.',
      format: 'plain-text',
      length: 'short',
      type: 'teaser',
    });

    const stream = summarizer.summarizeStreaming(this.rewritten);
    this.$output.textContent = '';
    for await (const chunk of stream) this.$output.textContent += chunk;

    summarizer.destroy();
  }
}
customElements.define('summarizer-section', SummarizerSection);
