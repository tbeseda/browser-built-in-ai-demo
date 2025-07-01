class ApiAvailability extends HTMLElement {
  /** @type {HTMLTableSectionElement | null} */
  $table = null;

  connectedCallback() {
    this.innerHTML = `
      <details id="api-availability" open>
        <summary>API availability</summary>
        <table>
          <tbody id="api-availability-tbody"></tbody>
        </table>
      </details>
    `;
    this.$table = this.querySelector('#api-availability-tbody');
    this.checkApiAvailability();
  }

  checkApiAvailability() {
    const features = ['Translator', 'LanguageDetector', 'Summarizer', 'Writer', 'Rewriter', 'Proofreader', 'LanguageModel'];
    if (!this.$table) return;

    const missing = [];
    for (const feature of features) {
      const $row = document.createElement('tr');
      const $feature = document.createElement('td');
      $feature.textContent = feature;
      $row.appendChild($feature);

      const $status = document.createElement('td');

      if (window[feature]) {
        $status.textContent = '🟢 available';
      } else {
        $status.textContent = '⛔️ nope';
        missing.push(feature);
      }

      $row.appendChild($status);
      this.$table.appendChild($row);
    }

    if (missing.length > 0) {
      const $main = document.querySelector('main');
      if ($main) {
        $main.innerHTML = '<p>This demo is not available in your browser. Please try a different browser.</p>';
      }
    } else {
      const $details = this.querySelector('details');
      if ($details) {
        $details.open = false;
      }
    }
  }
}
customElements.define('api-availability', ApiAvailability);
