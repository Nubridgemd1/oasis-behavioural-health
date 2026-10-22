/* Oasis Behavioral Health — Supabase shared-content sync
   Makes admin edits permanent and visible on every device.
   The publishable key is safe for the browser; writes are governed
   by Row Level Security policies on the Supabase side. */
(function(){
  var SB_URL = 'https://wdyiiaxyscqvzzomhwuw.supabase.co';
  var SB_KEY = 'sb_publishable_s4iqMjkPg82Kupy4jLPu4w_b8NqoUHT';
  var T = SB_URL + '/rest/v1/site_content';
  var H = { apikey: SB_KEY, 'Authorization': 'Bearer ' + SB_KEY };

  function get(key){
    return fetch(T + '?key=eq.' + encodeURIComponent(key) + '&select=value', { headers: H })
      .then(function(r){ return r.ok ? r.json() : []; })
      .then(function(a){ return (a && a[0]) ? a[0].value : null; })
      .catch(function(){ return null; });
  }
  function set(key, value){
    return fetch(T + '?on_conflict=key', {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal' }, H),
      body: JSON.stringify({ key: key, value: value, updated_at: new Date().toISOString() })
    }).then(function(r){ return r.ok; }).catch(function(){ return false; });
  }

  /* Update any contact elements present on a page from a config object. */
  function applyContactIds(c){
    if(!c) return;
    var fe = document.getElementById('footEmail');
    if(fe && c.email){ fe.textContent = '✉ ' + c.email; fe.setAttribute('href','mailto:' + c.email); }
    var fp = document.getElementById('footPhone');
    if(fp && c.phone){ fp.textContent = '📞 ' + c.phone; fp.setAttribute('href','tel:' + c.phone.replace(/[^0-9+]/g,'')); }
    var cb = document.getElementById('callBtn');
    if(cb && c.phone){ cb.textContent = 'Call ' + c.phone; if(cb.getAttribute('href') && cb.getAttribute('href').indexOf('tel:')===0) cb.setAttribute('href','tel:' + c.phone.replace(/[^0-9+]/g,'')); }
  }

  window.OasisSync = {
    url: SB_URL,
    get: get,
    set: set,
    getConfig: function(){ return get('config'); },
    setConfig: function(v){ return set('config', v); },
    applyContactIds: applyContactIds
  };
})();
