class LanguageModelSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="language-model">
        <h2>LanguageModel</h2>
        <form>
          <fieldset>
            <legend>Magic 8-ball</legend>
            <label for="prompt">Ask the <code>LanguageModel</code> about the story</label>
            <textarea name="prompt" placeholder=""></textarea>
            <output name="result"></output>
          </fieldset>
          <button disabled type="submit">Ask</button>
        </form>
      </section>
    `

    /** @type {HTMLFormElement | null} */
    const $form = this.querySelector('form')
    if (!$form) return;

    /** @type {HTMLTextAreaElement | null} */
    const $textarea = $form.querySelector('textarea[name="prompt"]')
    /** @type {HTMLOutputElement | null} */
    const $output = $form.querySelector('output[name="result"]')
    if (!$textarea || !$output) return;
    /** @type {HTMLButtonElement | null} */
    const $button = $form.querySelector('button[type="submit"]')
    if (!$button) return;

    let rewritten
    document.addEventListener('rewritten', (event) => {
      if ('detail' in event) {
        rewritten = event.detail
        // $button.disabled = false
      }
    })

    $form.addEventListener('submit', (event) => {
      event.preventDefault()
      $output.textContent = `You asked: ${$textarea.value}`
      $output.style.visibility = 'visible'
    })
  }
}
customElements.define('language-model-section', LanguageModelSection);
