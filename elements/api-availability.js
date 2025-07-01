/// <reference types="../global.d.ts" />

class ApiAvailability extends HTMLElement {
  /** @type {HTMLTableSectionElement | null} */
  $table = null;

  connectedCallback() {
    this.innerHTML = /*html*/ `
      <details id="api-availability" open>
        <summary>API availability</summary>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Exists</th>
              <th>Availability</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="api-availability-tbody"></tbody>
        </table>
      </details>
    `;

    this.$table = this.querySelector('#api-availability-tbody');
    this.checkApiAvailability();
  }

  getApiConfig() {
    return {
      Writer: {
        format: 'plain-text',
        tone: 'casual',
        length: 'short',
      },
      Rewriter: {
        format: 'plain-text',
        style: 'formal',
        length: 'shorter',
      },
      Summarizer: {
        format: 'plain-text',
        length: 'short',
        type: 'teaser',
      },
      Translator: {
        sourceLanguage: 'en',
        targetLanguage: 'es',
      },
      LanguageDetector: undefined,
      Proofreader: {
        includeCorrectionExplanations: true,
        expectedInputLanguagues: ['en'],
        correctionExplanationLanguage: 'en',
      },
      LanguageModel: {
        defaultTopK: 3,
        maxTopK: 8,
        defaultTemperature: 1.0,
      },
    };
  }

  async checkApiAvailability() {
    if (!this.$table) return;
    const apiConfig = this.getApiConfig();

    const missing = [];
    const unavailable = [];

    for (const [apiName, config] of Object.entries(apiConfig)) {
      const $row = document.createElement('tr');

      const $feature = document.createElement('td');
      $feature.textContent = apiName;
      $row.appendChild($feature);

      const $exists = document.createElement('td');
      const exists = !!window[apiName];
      $exists.textContent = exists ? '✅' : '⛔️';
      if (!exists) missing.push(apiName);

      $row.appendChild($exists);

      const $available = document.createElement('td');
      const $action = document.createElement('td');
      let availability = 'unknown';
      if (exists) {
        const api = window[apiName];

        availability = await api.availability(config);
        if (availability !== 'available') unavailable.push(apiName);
        $available.textContent = `"${availability}"`;

        const $actionWrapper = document.createElement('div');
        $actionWrapper.style.display = 'flex';
        $actionWrapper.style.height = '100%';
        $actionWrapper.style.alignItems = 'center';
        $actionWrapper.style.gap = '0.5rem';
        $actionWrapper.style.justifyContent = 'flex-end';

        const $progress = document.createElement('progress');
        $progress.value = availability === 'available' ? 100 : 0;
        $progress.max = 100;
        $progress.style.width = '100%';

        const $progressLabel = document.createElement('span');
        $progressLabel.textContent = `${$progress.value === 100 ? '✔︎' : `${$progress.value}%`}`;
        $progressLabel.style.minWidth = '3em';
        $progressLabel.style.textAlign = 'right';

        if (availability === 'downloadable' || availability === 'unavailable') {
          const $button = document.createElement('button');
          $button.classList.add('smol');
          $button.textContent = 'Download';
          $button.disabled = availability !== 'downloadable';

          $button.addEventListener('click', async (e) => {
            e.preventDefault();
            if ($button.disabled) return;

            $button.disabled = true;
            $button.textContent = 'Downloading...';

            const modelInstance = await api.create({
              ...config,
              monitor(monitor) {
                monitor.addEventListener('downloadprogress', (e) => {
                  console.info('downloadprogress', e);
                  $progress.value = e.loaded * 100;
                  $progressLabel.textContent = `${Math.round($progress.value)}%`;
                });
              },
            });

            modelInstance.destroy();
            $button.textContent = 'Downloaded';
            $progress.value = 100;
            $progressLabel.textContent = '100%';
          });
          $actionWrapper.appendChild($button);
        }

        $actionWrapper.appendChild($progress);
        $actionWrapper.appendChild($progressLabel);
        $action.appendChild($actionWrapper);
      } else {
        $available.textContent = '⛔️';
        unavailable.push(apiName);
      }
      $row.appendChild($available);
      $row.appendChild($action);

      this.$table.appendChild($row);
    }

    if (missing.length > 0) {
      const $main = document.querySelector('main');
      if ($main) {
        $main.innerHTML = '<p>This demo is not available in your browser. Please try a different browser.</p>';
      }
    }
    if (unavailable.length === 0) {
      const $details = this.querySelector('details');
      if ($details) $details.open = false;
    }
  }
}
customElements.define('api-availability', ApiAvailability);
