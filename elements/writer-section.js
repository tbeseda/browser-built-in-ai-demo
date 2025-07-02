/// <reference types="../global.d.ts" />

class WriterSection extends HTMLElement {
  /** @type {HTMLFormElement | null} */
  $form = null;
  /** @type {HTMLButtonElement | null} */
  $proofread = null;
  /** @type {HTMLTextAreaElement | null} */
  $textarea = null;
  /** @type {HTMLOutputElement | null} */
  $output = null;

  async connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="writer">
        <h2>Writer <strike>+ Proofreader</strike></h2>
        <form>
          <fieldset>
            <legend>Keep it short, McCarthy</legend>
            <label for="prompt">Prompt the <code>Writer</code> for a short story</label>
            <textarea name="prompt" placeholder="Your best movie elevator pitch. Or just a simple subject/idea."></textarea>
            <output name="result"></output>
          </fieldset>
          <button type="button" id="proofread">Proofread</button>
          <button type="submit">Write</button>
        </form>
      </section>
    `;

    this.$form = this.querySelector('form');
    if (!this.$form) return;
    this.$proofread = this.$form.querySelector('button#proofread');
    this.$textarea = this.$form.querySelector('textarea[name="prompt"]');
    this.$output = this.$form.querySelector('output[name="result"]');
    if (!this.$proofread || !this.$textarea || !this.$output) return;

    this.$proofread.disabled = true;
    this.$form.addEventListener('submit', this.onSubmit.bind(this));
  }

  async onSubmit(e) {
    e.preventDefault();
    if (!this.$output || !this.$textarea) return;
    this.$output.textContent = 'Writing...';
    this.$output.style.visibility = 'visible';

    const writer = await Writer.create({
      sharedContext: 'Create a short story with a beginning, middle, and end.',
      format: 'plain-text',
      tone: 'casual',
      length: 'short',
    });

    const stream = writer.writeStreaming(this.$textarea.value);
    this.$output.textContent = '';
    for await (const chunk of stream) this.$output.textContent += chunk;

    writer.destroy();

    document.dispatchEvent(new CustomEvent('written', { detail: this.$output.textContent }));
  }
}
customElements.define('writer-section', WriterSection);
