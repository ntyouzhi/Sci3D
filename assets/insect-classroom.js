(() => {
  const workspace = document.querySelector('#life-classroom .workspace');
  const entry = document.getElementById('insects-entry');
  const stage = document.createElement('section');
  stage.className = 'insects-classroom-stage';
  stage.setAttribute('aria-label', '昆虫观察');
  stage.hidden = true;
  workspace.append(stage);
  const loading = document.createElement('div');
  loading.className = 'birds-stage-loading';
  loading.innerHTML = '<span></span><b>正在打开昆虫观察…</b><small>首次打开需要读取模型，再次观察优先使用缓存</small><a href="insect-observation/" target="_blank" rel="noopener">在新窗口打开</a>';
  let selected = false, frame;
  function sync() {
    const active = selected && document.body.dataset.domain === 'life';
    if (active && !frame) {
      loading.hidden = false;
      frame = document.createElement('iframe');
      frame.title = '昆虫观察：动态与静态观察';
      frame.src = 'insect-observation/?embedded=1&insect=ant';
      frame.allow = 'fullscreen';
      stage.replaceChildren(frame, loading);
    }
    if (!active && frame) { frame.remove(); frame = null; }
  }
  function select(value) {
    selected = value;
    document.body.classList.toggle('observing-insects', value);
    stage.hidden = !value;
    entry.classList.toggle('active', value);
    if (value) {
      window.ScienceBirdObservation?.select(false);
      document.querySelectorAll('[data-organ].active').forEach(item => item.classList.remove('active'));
      window.ScienceFishObservation?.select('insects');
      window.ScienceRespiratoryObservation?.select('insects');
      window.ScienceDigestiveObservation?.select('insects');
      if (window.__VISCERA_VIEWER__) window.__VISCERA_VIEWER__.isVisible = false;
      document.getElementById('loader').hidden = true;
      document.getElementById('library').classList.remove('open');
    }
    sync();
  }
  window.addEventListener('message', event => {
    if (event.source === frame?.contentWindow && event.origin === location.origin && event.data?.type === 'insect-observation-ready') loading.hidden = true;
  });
  entry.addEventListener('click', () => select(true));
  document.addEventListener('click', event => {
    if (selected && event.target.closest('[data-organ],#brand,#birds-entry')) select(false);
  }, true);
  new MutationObserver(sync).observe(document.body, {attributes: true, attributeFilter: ['data-domain']});
  window.ScienceInsectObservation = {select};
  window.addEventListener('DOMContentLoaded', () => {
    if (new URLSearchParams(location.search).get('observe') === 'insects') queueMicrotask(() => select(true));
  });
})();
