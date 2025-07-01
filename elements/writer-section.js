class WriterSection extends HTMLElement {
  get result() {
    return this.textContent
  }

  async connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="writer">
        <h2>Writer <strike>+ Proofreader</strike></h2>
        <form>
          <fieldset>
            <legend>Keep it short, McCarthy</legend>
            <label for="prompt">Prompt the <code>Writer</code></label>
            <textarea name="prompt" placeholder=""></textarea>
            <output name="result"></output>
          </fieldset>
          <button type="button" id="proofread">Proofread</button>
          <button type="submit">Write</button>
        </form>
      </section>
    `


    /** @type {HTMLFormElement | null} */
    const $form = this.querySelector('form')
    if (!$form) return;

    /** @type {HTMLButtonElement | null} */
    const $proofread = $form.querySelector('button#proofread')
    if (!$proofread) return;
    /** @type {HTMLTextAreaElement | null} */
    const $textarea = $form.querySelector('textarea[name="prompt"]')
    /** @type {HTMLOutputElement | null} */
    const $output = $form.querySelector('output[name="result"]')
    if (!$textarea || !$output) return;

    $proofread.disabled = true;

    $form.addEventListener('submit', async (e) => {
      e.preventDefault();
      $output.textContent = 'Writing...'
      $output.style.visibility = 'visible'

      const writer = await Writer.create({
        sharedContext: 'Create a short story with a beginning, middle, and end.',
        format: 'plain-text',
        tone: 'casual',
        length: 'short',
      })

      const stream = writer.writeStreaming($textarea.value)
      $output.textContent = ''
      for await (const chunk of stream) $output.textContent += chunk

      writer.destroy()

      // emit "written" event
      document.dispatchEvent(new CustomEvent('written', { detail: $output.textContent }))
    })
  }
}
customElements.define('writer-section', WriterSection);
