class ModelAvailability extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <details id="model-availability" open>
        <summary>Model availability</summary>
        <table width="100%">
          <tbody id="model-availability-tbody"></tbody>
        </table>
      </details>
    `;
    this.checkModelAvailability();
  }
  async checkModelAvailability() {
    const $table = this.querySelector('#model-availability-tbody');
    if (!$table) return;

    const $row = document.createElement('tr');

    const $feature = document.createElement('td');
    const modelStatus = await window.Summarizer?.availability?.() ?? 'unknown';
    $feature.textContent = `Model download ("${modelStatus}")`;
    $row.appendChild($feature);

    const $action = document.createElement('td');
    $action.style.display = 'flex';
    $action.style.alignItems = 'center';
    $action.style.gap = '1rem';

    const $progress = document.createElement('progress');
    $progress.value = modelStatus === 'available' ? 100 : 0;
    $progress.max = 100;
    $progress.style.width = '100%';

    const $button = document.createElement('button');
    $button.textContent = modelStatus === 'available' ? 'Downloaded' : 'Download';
    $button.disabled = modelStatus !== 'downloadable';
    $button.addEventListener('click', async (e) => {
      e.preventDefault();
      if ($button.disabled) return;

      $button.disabled = true;
      $button.textContent = 'Downloading...';

      const summarizer = await Summarizer.create({
        type: 'tldr',
        length: 'short',
        monitor(monitor) {
          monitor.addEventListener('downloadprogress', (e) => {
            console.info('downloadprogress', e);
            $progress.value = e.loaded * 100;
          });
        },
      });

      summarizer.destroy();
      $button.textContent = 'Downloaded';
      $progress.value = 100;
    });

    $action.appendChild($button);
    $action.appendChild($progress);
    $row.appendChild($action);
    $table.appendChild($row);

    const $details = this.querySelector('details');
    if (modelStatus === 'available' && $details) {
      $details.open = false;
    }
  }
}
customElements.define('model-availability', ModelAvailability);
