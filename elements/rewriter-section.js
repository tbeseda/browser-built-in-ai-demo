class RewriterSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="rewriter">
        <h2>Rewriter</h2>
        <form>
          <fieldset>
            <legend>Script has to be 2+ hours these days</legend>
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
    `

    /** @type {HTMLFormElement | null} */
    const $form = this.querySelector('form')
    if (!$form) return;

    /** @type {HTMLSelectElement | null} */
    const $style = $form.querySelector('select[name="style"]')
    /** @type {HTMLSelectElement | null} */
    const $length = $form.querySelector('select[name="length"]')
    /** @type {HTMLButtonElement | null} */
    const $button = $form.querySelector('button[type="submit"]')
    /** @type {HTMLOutputElement | null} */
    const $output = $form.querySelector('output[name="result"]')
    if (!$style || !$length || !$output || !$button) return;

    // listen for writer-section to be updated
    let written
    document.addEventListener('written', (event) => {
      if ('detail' in event) {
        written = event.detail
        $button.disabled = false
      }
    })

    $form.addEventListener('submit', async (event) => {
      event.preventDefault()
      $output.textContent = 'Rewriting...'
      $output.style.visibility = 'visible'

      const rewriter = await Rewriter.create({
        sharedContext: 'Create an accurate retelling of the story.',
        format: 'plain-text',
        style: $style.value,
        length: $length.value,
      })

      const stream = rewriter.rewriteStreaming(written)
      $output.textContent = ''
      for await (const chunk of stream) $output.textContent += chunk

      rewriter.destroy()

      // emit "rewritten" event
      document.dispatchEvent(new CustomEvent('rewritten', { detail: $output.textContent }))
    })
  }
}
customElements.define('rewriter-section', RewriterSection);
