/// <reference types="../global.d.ts" />

class TranslatorSection extends HTMLElement {
  /** @type {HTMLFormElement | null} */
  $form = null;
  /** @type {HTMLOutputElement | null} */
  $output = null;
  /** @type {HTMLButtonElement | null} */
  $button = null;
  /** @type {string | undefined} */
  teaser = undefined;

  connectedCallback() {
    this.innerHTML = /* html */ `
      <section id="translator">
        <h2>Translator</h2>
        <form>
          <fieldset>
            <legend>Translate the teaser for other markets</legend>
            <output name="result"></output>
          </fieldset>
          <button disabled type="submit">Translate</button>
        </form>
      </section>
    `;

    this.$form = this.querySelector('form');
    if (!this.$form) return;
    this.$output = this.$form.querySelector('output[name="result"]');
    this.$button = this.$form.querySelector('button[type="submit"]');
    if (!this.$output || !this.$button) return;

    document.addEventListener('teaser', this.onTeaser.bind(this));
    this.$form.addEventListener('submit', this.onSubmit.bind(this));
  }

  onTeaser(event) {
    if ('detail' in event) {
      this.teaser = event.detail;
      if (this.$button) this.$button.disabled = false;
    }
  }

  async *translateTeaserToLanguages(teaserText, languages) {
    for (const { code, label } of languages) {
      const translator = await Translator.create({
        sourceLanguage: 'en',
        targetLanguage: code,
      });
      const result = await translator.translate(teaserText);
      translator.destroy();
      yield { label, result };
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    if (!this.$output) return;
    if (!this.teaser) return;

    const teaserText = this.teaser;

    this.$output.textContent = 'Translating...';
    this.$output.style.visibility = 'visible';

    const languages = [
      { code: 'no', label: 'Norwegian' },
      { code: 'es', label: 'Spanish' },
      { code: 'fr', label: 'French' },
      { code: 'de', label: 'German' },
      { code: 'it', label: 'Italian' },
      { code: 'pt', label: 'Portuguese' },
      { code: 'ru', label: 'Russian' },
      { code: 'zh', label: 'Chinese' },
    ];

    this.$output.innerHTML = '';
    for await (const { label, result } of this.translateTeaserToLanguages(teaserText, languages)) {
      this.$output.innerHTML += `<strong>${label}:</strong><br>${result}<br><br>`;
    }
  }
}
customElements.define('translator-section', TranslatorSection);
