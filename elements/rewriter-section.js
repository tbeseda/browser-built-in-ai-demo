/// <reference types="../global.d.ts" />

class RewriterSection extends HTMLElement {
  /** @type {HTMLFormElement | null} */
  $form = null;
  /** @type {HTMLSelectElement | null} */
  $style = null;
  /** @type {HTMLSelectElement | null} */
  $length = null;
  /** @type {HTMLButtonElement | null} */
  $button = null;
  /** @type {HTMLOutputElement | null} */
  $output = null;
  /** @type {string | undefined} */
  written = undefined;

  connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="rewriter">
        <h2>Rewriter</h2>
        <form>
          <fieldset>
            <legend>Scripts should be 2+ hours these days</legend>
            <label for="style">Choose a <code>Rewriter</code> style</label>
            <select name="style">
              <option value="more-formal">More formal</option>
              <option value="as-is">As is</option>
              <option value="more-casual">More casual</option>
            </select>
            <label for="length">Length</label>
            <select name="length">
              <option value="longer">Longer</option>
              <option value="as-is">As is</option>
              <option value="shorter">Shorter</option>
            </select>
            <output name="result"></output>
          </fieldset>
          <button disabled type="submit">Rewrite</button>
        </form>
      </section>
    `;

    this.$form = this.querySelector('form');
    if (!this.$form) return;
    this.$style = this.$form.querySelector('select[name="style"]');
    this.$length = this.$form.querySelector('select[name="length"]');
    this.$button = this.$form.querySelector('button[type="submit"]');
    this.$output = this.$form.querySelector('output[name="result"]');
    if (!this.$style || !this.$length || !this.$output || !this.$button) return;

    document.addEventListener('written', this.onWritten.bind(this));
    this.$form.addEventListener('submit', this.onSubmit.bind(this));
  }

  onWritten(event) {
    if ('detail' in event) {
      this.written = event.detail;
      if (this.$button) this.$button.disabled = false;
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    if (!this.$output || !this.$style || !this.$length) return;
    if (!this.written) return;
    this.$output.textContent = 'Rewriting...';
    this.$output.style.visibility = 'visible';

    const rewriter = await Rewriter.create({
      sharedContext: 'Create an accurate retelling of the story.',
      format: 'plain-text',
      style: this.$style.value,
      length: this.$length.value,
    });

    const stream = rewriter.rewriteStreaming(this.written);
    this.$output.textContent = '';
    for await (const chunk of stream) this.$output.textContent += chunk;

    rewriter.destroy();

    document.dispatchEvent(new CustomEvent('rewritten', { detail: this.$output.textContent }));
  }
}
customElements.define('rewriter-section', RewriterSection);
