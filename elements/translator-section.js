class TranslatorSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="translator">
        <h2>Translator</h2>
        <form>
          <fieldset>
            <legend>No, Canadian is not an option</legend>
            <label for="language"><code>Translator</code> output language</label>
            <select name="language">
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
              <option value="no">Norwegian</option>
            </select>
            <output name="result"></output>
          </fieldset>
          <button disabled type="submit">Translate</button>
        </form>
      </section>
    `

    /** @type {HTMLFormElement | null} */
    const $form = this.querySelector('form')
    if (!$form) return;

    /** @type {HTMLSelectElement | null} */
    const $select = $form.querySelector('select[name="language"]')
    if (!$select) return;
    /** @type {HTMLOutputElement | null} */
    const $output = $form.querySelector('output[name="result"]')
    if (!$output) return;
    /** @type {HTMLButtonElement | null} */
    const $button = $form.querySelector('button[type="submit"]')
    if (!$button) return;

    let rewritten
    document.addEventListener('rewritten', (event) => {
      if ('detail' in event) {
        rewritten = event.detail
        $button.disabled = false
      }
    })

    $form.addEventListener('submit', async (event) => {
      event.preventDefault()
      $output.textContent = 'Translating...'
      $output.style.visibility = 'visible'

      const translator = await Translator.create({
        sourceLanguage: 'en',
        targetLanguage: $select.value,
      })

      const stream = translator.translateStreaming(rewritten)
      $output.textContent = ''
      for await (const chunk of stream) $output.textContent += chunk

      translator.destroy()
    })
  }
}
customElements.define('translator-section', TranslatorSection);
