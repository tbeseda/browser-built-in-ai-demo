class SummarizerSection extends HTMLElement {
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
    `

    /** @type {HTMLFormElement | null} */
    const $form = this.querySelector('form')
    if (!$form) return;

    /** @type {HTMLOutputElement | null} */
    const $output = $form.querySelector('output[name="result"]')
    /** @type {HTMLButtonElement | null} */
    const $button = $form.querySelector('button[type="submit"]')
    if (!$output || !$button) return;

    let rewritten
    document.addEventListener('rewritten', (event) => {
      if ('detail' in event) {
        rewritten = event.detail
        $button.disabled = false
      }
    })

    $form.addEventListener('submit', async (event) => {
      event.preventDefault()
      $output.textContent = 'Summarizing...'
      $output.style.visibility = 'visible'

      const summarizer = await Summarizer.create({
        sharedContext: 'An engaging teaser for a short story. Do not spoil the ending.',
        format: 'plain-text',
        length: 'short',
        type: 'teaser',
      })

      const stream = summarizer.summarizeStreaming(rewritten)
      $output.textContent = ''
      for await (const chunk of stream) $output.textContent += chunk

      summarizer.destroy()
    })
  }
}
customElements.define('summarizer-section', SummarizerSection);
