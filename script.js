/* Itinerario · ESP 26 — Figma redesign */
(function () {
  'use strict';

  /* ============================================================
     Utilities
     ============================================================ */
  var UNSPLASH = function (id, w) {
    return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 800) + '&q=80';
  };

  var GRADIENTS = [
    'linear-gradient(135deg, #c5d4de 0%, #6b8494 100%)',
    'linear-gradient(135deg, #dce4ea 0%, #8fa3b0 100%)',
    'linear-gradient(160deg, #a8bcc8 0%, #4a6270 100%)'
  ];

  function gradientFor(seed) {
    var h = 0;
    for (var i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return GRADIENTS[h % GRADIENTS.length];
  }

  function loadPhoto(container, photoIds, seed, width) {
    if (!container) return;
    var ids = Array.isArray(photoIds) ? photoIds : [photoIds];
    var imgEl = container.querySelector('[data-img]');
    var fbEl = container.querySelector('[data-fallback]');
    if (fbEl) fbEl.style.background = gradientFor(seed || 'x');
    var i = 0;
    function tryNext() {
      if (i >= ids.length) return;
      var probe = new Image();
      probe.onload = function () {
        if (imgEl) imgEl.style.backgroundImage = 'url("' + UNSPLASH(ids[i], width) + '")';
        container.classList.add('is-loaded');
      };
      probe.onerror = function () { i++; tryNext(); };
      probe.src = UNSPLASH(ids[i], width);
    }
    tryNext();
  }

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }

  function photoUrl(ids, w) {
    return UNSPLASH(Array.isArray(ids) ? ids[0] : ids, w || 200);
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  /* ============================================================
     SVG icons (inlined)
     ============================================================ */
  var ICONS = {
    sunrise: '<svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5v3M6.5 9.5 8.6 11.6M21.4 11.6l2.1-2.1M3 18h24M8 18a7 7 0 0 1 14 0"/></svg>',
    sun: '<svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="15" cy="15" r="5"/><path d="M15 3v3M15 24v3M3 15h3M24 15h3M5.6 5.6l2.1 2.1M22.3 22.3l2.1 2.1M5.6 24.4l2.1-2.1M22.3 7.7l2.1-2.1"/></svg>',
    moon: '<svg viewBox="0 0 23 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14.5A8 8 0 0 1 8 3.5a8.5 8.5 0 1 0 11 11Z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    pin: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14s5-4.5 5-8.5a5 5 0 0 0-10 0C3 9.5 8 14 8 14Z"/><circle cx="8" cy="5.5" r="2"/></svg>',
    arrow: '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2v10M7 12l4-4M7 12l-4-4"/></svg>',
    zoomIn: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="5"/><path d="m13 13-2.5-2.5M7 4.5v5M4.5 7h5"/></svg>',
    zoomOut: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="5"/><path d="m13 13-2.5-2.5M4.5 7h5"/></svg>'
  };

  /* ============================================================
     Itinerary data
     ============================================================ */
  var ITINERARY = [
    { day: 1, date: 'Fri · May 29', shortDate: 'May 29', location: 'New York City', region: 'departure', hint: 'A red-eye east.', caption: 'JFK → BCN',
      photos: ['1500916434205-0c77489c6cf7', '1538332576228-eb5b4c4de6f5'],
      activities: [{ time: 'evening', text: 'Red-eye flight departs NYC.', status: 'confirmed', notes: 'Hanna & Katie — sleep if you can.' }] },
    { day: 2, date: 'Sat · May 30', shortDate: 'May 30', location: 'Barcelona', region: 'barcelona', hint: 'Wheels down.', caption: 'Eixample',
      photos: ['1583422409516-2895a77efded', '1735424325493-7dec695219c4'],
      activities: [
        { time: '7:00am', text: 'Hanna & Katie land in Barcelona.', status: 'confirmed', notes: 'Taxi to city ~30 min.' },
        { time: 'noon', text: 'Check in to Aspasios Rambla Catalonia.', status: 'confirmed', notes: 'Rambla de Catalunya 21.' },
        { time: 'pm', text: 'Open afternoon and evening.', status: 'open', notes: 'Gràcia walk, vermut, tapas.' }
      ] },
    { day: 3, date: 'Sun · May 31', shortDate: 'May 31', location: 'Barcelona', region: 'barcelona', hint: 'Three become one.', caption: 'El Born',
      photos: ['1565599837634-134bc3aadce8', '1625938144755-652e08e359b7'],
      activities: [
        { time: 'am', text: 'Open morning and afternoon.', status: 'open', notes: 'Gothic Quarter, Boqueria.' },
        { time: 'pm', text: 'Sunny arrives.', status: 'confirmed', notes: 'Meet at apartment.' },
        { time: '7:00pm', text: 'Dinner at Bodega La Puntual.', status: 'confirmed', notes: 'Reservation Hanna.' }
      ] },
    { day: 4, date: 'Mon · Jun 1', shortDate: 'Jun 1', location: 'Barcelona', region: 'barcelona', hint: 'Gaudí & the old city.', caption: 'Barri Gòtic',
      photos: ['1555156801-0366d40d4402', '1644144974835-61c2c13c79c5'],
      activities: [
        { time: '10:00am', text: 'Gothic & Gaudí Walking Tour.', status: 'confirmed', notes: 'Plaça de Catalunya.' },
        { time: 'pm', text: 'Open afternoon and evening.', status: 'open', notes: 'Park Güell, Bunkers.' }
      ] },
    { day: 5, date: 'Tue · Jun 2', shortDate: 'Jun 2', location: 'Costa Brava', region: 'costa-brava', hint: 'North by car.', caption: 'Begur',
      photos: ['1612088099701-21ed5b5529f3', '1564818804911-58cfd9b18711'],
      activities: [
        { time: 'am', text: 'Car rental → Costa Brava.', status: 'confirmed', notes: 'AP-7 north ~1.5 hr.' },
        { time: '2:00pm', text: 'Check in to Mas Ses Vinyes.', status: 'confirmed', notes: 'Hotel above Begur.' },
        { time: '4:00pm', text: "Platja d'Aiguablava.", status: 'open', notes: 'Late afternoon cove.' },
        { time: 'sunset', text: 'Begur Castle at sunset.', status: 'open', notes: 'Short climb.' },
        { time: '8:30pm', text: 'Dinner at Begurio.', status: 'confirmed', notes: 'Reservation Katie.' }
      ] },
    { day: 6, date: 'Wed · Jun 3', shortDate: 'Jun 3', location: 'Costa Brava', region: 'costa-brava', hint: 'A day for the coves.', caption: 'Sa Tuna',
      photos: ['1597227303804-5fdea496a79a', '1709483076573-62bf0f80ea1a'],
      activities: [
        { time: 'all day', text: "Beach day — Sa Riera, Illa Roja, Sa Tuna.", status: 'open', notes: 'Water shoes.' },
        { time: '8:00pm', text: 'Dinner at Restaurant Ses Vinyes.', status: 'confirmed', notes: 'On-property.' }
      ] },
    { day: 7, date: 'Thu · Jun 4', shortDate: 'Jun 4', location: 'Costa Brava', region: 'costa-brava', hint: 'Sea caves.', caption: 'Tossa de Mar',
      photos: ['1578686157802-e2c2550cacc2', '1559128010-7c1ad6e1b6a5'],
      activities: [
        { time: '9:00am', text: 'Kayak & snorkel — Tossa de Mar.', status: 'confirmed', notes: '3-hour tour.' },
        { time: 'pm', text: 'Cala Pola & Marimurtra garden.', status: 'open', notes: 'Blanes afternoon.' }
      ] },
    { day: 8, date: 'Fri · Jun 5', shortDate: 'Jun 5', location: 'Costa Brava', region: 'costa-brava', hint: 'Last coast day.', caption: 'Girona',
      photos: ['1571939228382-b2f2b585ce15', '1681849615791-9e2c2166c4aa'],
      activities: [
        { time: 'am', text: 'Morning at Platja Fonda.', status: 'open', notes: 'Breakfast pastries.' },
        { time: 'pm', text: 'Day trip to Girona.', status: 'open', notes: 'Medieval walls.' }
      ] },
    { day: 9, date: 'Sat · Jun 6', shortDate: 'Jun 6', location: 'Barcelona', region: 'barcelona', hint: 'Home.', caption: 'BCN → JFK',
      photos: ['1741354125422-bdcdd4bb7070', '1660855562147-2f2eab48c0c7'],
      activities: [
        { time: 'am', text: 'Drive back to Barcelona.', status: 'confirmed', notes: 'Leave by 9am.' },
        { time: 'pm', text: 'Fly home to NYC.', status: 'confirmed', notes: 'Afternoon flight.' }
      ] }
  ];

  var BASE_ITINERARY = JSON.parse(JSON.stringify(ITINERARY));

  var DAY_STOPS = {
    2: [{ name: 'Aspasios Rambla Catalonia', lat: 41.3905, lng: 2.1660, time: '12:00 PM', category: 'Hotel', desc: 'Home base — Rambla de Catalunya.', photos: ['1583422409516-2895a77efded'] }],
    3: [{ name: 'Bodega La Puntual', lat: 41.3855, lng: 2.1820, time: '7:00 PM', category: 'Restaurant', desc: 'Welcome dinner — El Born.', photos: ['1565599837634-134bc3aadce8'] }],
    4: [{ name: 'Gothic Quarter Walking Tour', lat: 41.3833, lng: 2.1764, time: '10:00 AM', category: 'Tour', desc: 'Ramblas, Old Town, Gaudí.', photos: ['1555156801-0366d40d4402'] }],
    5: [
      { name: 'Mas Ses Vinyes', lat: 41.9526, lng: 3.1864, time: '2:00 PM', category: 'Hotel', desc: 'Country hotel above Begur.', photos: ['1612088099701-21ed5b5529f3'] },
      { name: "Platja d'Aiguablava", lat: 41.9395, lng: 3.2098, time: '4:00 PM', category: 'Beach', desc: 'Crescent cove — turquoise water.', photos: ['1502786129293-79981df4e689'] },
      { name: 'Begur Castle', lat: 41.9540, lng: 3.2070, time: 'Sunset', category: 'Viewpoint', desc: 'Ruined castle, valley views.', photos: ['1564818804911-58cfd9b18711'] },
      { name: 'Begurio', lat: 41.9544, lng: 3.2076, time: '8:30 PM', category: 'Restaurant', desc: 'Garden dinner under lemon trees.', photos: ['1612088099701-21ed5b5529f3'] }
    ],
    6: [
      { name: 'Platja de Sa Riera', lat: 41.9650, lng: 3.2103, time: '9:30 AM', category: 'Beach', desc: 'Wide sandy cove with chiringuito.', photos: ['1597227303804-5fdea496a79a'] },
      { name: "Platja de l'Illa Roja", lat: 41.9720, lng: 3.2148, time: '11:00 AM', category: 'Beach', desc: 'Wild red-rock cove.', photos: ['1719764460427-db6931ff269a'] },
      { name: 'Platja de Sa Tuna', lat: 41.9676, lng: 3.2284, time: '1:00 PM', category: 'Beach', desc: 'Fishing village cove.', photos: ['1709483076573-62bf0f80ea1a'] },
      { name: 'Restaurant Ses Vinyes', lat: 41.9526, lng: 3.1864, time: '8:00 PM', category: 'Restaurant', desc: 'Hotel tasting menu.', photos: ['1597227303804-5fdea496a79a'] }
    ],
    7: [
      { name: 'Tossa de Mar (Kayak)', lat: 41.7196, lng: 2.9320, time: '9:00 AM', category: 'Activity', desc: 'Sea caves kayak & snorkel.', photos: ['1578686157802-e2c2550cacc2'] },
      { name: 'Cala Pola', lat: 41.7305, lng: 2.9485, time: '2:00 PM', category: 'Beach', desc: 'Pebble cove under the pines.', photos: ['1651574087127-ba4ca3fbde24'] },
      { name: 'Jardí Botànic Marimurtra', lat: 41.6743, lng: 2.7997, time: '4:00 PM', category: 'Garden', desc: 'Cliff-top botanical garden.', photos: ['1571939228382-b2f2b585ce15'] }
    ],
    8: [
      { name: 'Platja Fonda', lat: 41.9300, lng: 3.2247, time: '9:00 AM', category: 'Beach', desc: 'Black-sand cove — quiet morning.', photos: ['1676544340892-4bcb79d0ef73'] },
      { name: 'Girona Old Town', lat: 41.9794, lng: 2.8214, time: '1:00 PM', category: 'Day trip', desc: 'Cathedral steps, Onyar river.', photos: ['1571939228382-b2f2b585ce15'] }
    ],
    9: [{ name: 'Barcelona El Prat (BCN)', lat: 41.2974, lng: 2.0833, time: 'PM', category: 'Airport', desc: 'Fly home to NYC.', photos: ['1741354125422-bdcdd4bb7070'] }]
  };

  var DAY_TITLES = {
    5: 'Begur & First Coves',
    6: 'Begur Calas + Sa Tuna'
  };

  var DIRECTORY = window.DIRECTORY_DATA || [];
  var CAT_LABELS = { restaurants: 'Eat & Drink', shops: 'Shops', sights: 'Sights' };
  var LIST_LABELS = { barcelona: 'Barcelona List', 'costa-brava': 'Costa Brava List' };
  var LEGACY_LINKS_KEY = 'itinerario-spot-links';
  var ADDED_KEY = 'itinerario-added-activities';
  var EDITS_KEY = 'itinerario-edits';

  /* ============================================================
     Supabase shared sync
     ============================================================ */
  var SUPABASE_URL = 'https://qcqdjjicwqblcxlujvue.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjcWRqamljd3FibGN4bHVqdnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NTA5NDAsImV4cCI6MjA5NTMyNjk0MH0.Tc8VAUH45I9jW1G4FVRvwjpJTaiz__6_p01Zcp6fbYM';
  var SUPABASE_ROW_ID = 'shared';

  var supabaseClient = null;
  var isApplyingCloudState = false;
  var pushDebounceTimer = null;

  function getSupabase() {
    if (supabaseClient) return supabaseClient;
    if (typeof window.supabase === 'undefined') return null;
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn('Supabase init failed', e);
      return null;
    }
    return supabaseClient;
  }

  function fetchSharedState() {
    var c = getSupabase();
    if (!c) return Promise.resolve(null);
    return c.from('itinerary_state').select('added, edits, updated_at').eq('id', SUPABASE_ROW_ID).maybeSingle().then(function (res) {
      if (res.error) {
        console.warn('Supabase fetch failed:', res.error.message);
        return null;
      }
      return res.data || null;
    }).catch(function (e) {
      console.warn('Supabase fetch threw:', e);
      return null;
    });
  }

  function pushSharedState() {
    var c = getSupabase();
    if (!c) return;
    if (isApplyingCloudState) return;
    if (pushDebounceTimer) clearTimeout(pushDebounceTimer);
    pushDebounceTimer = setTimeout(function () {
      var payload = {
        id: SUPABASE_ROW_ID,
        added: loadAddedActivities(),
        edits: loadEdits(),
        updated_at: new Date().toISOString()
      };
      c.from('itinerary_state').upsert(payload, { onConflict: 'id' }).then(function (res) {
        if (res.error) console.warn('Supabase push failed:', res.error.message);
      });
    }, 250);
  }

  function applySharedState(state) {
    if (!state) return false;
    var newAdded = JSON.stringify(state.added || []);
    var newEdits = JSON.stringify(state.edits || {});
    var curAdded = JSON.stringify(loadAddedActivities());
    var curEdits = JSON.stringify(loadEdits());
    if (newAdded === curAdded && newEdits === curEdits) return false;

    isApplyingCloudState = true;
    try {
      saveJson(ADDED_KEY, state.added || []);
      saveJson(EDITS_KEY, state.edits || {});
      rebuildItineraryState();
      renderItinerary();
    } finally {
      isApplyingCloudState = false;
    }
    return true;
  }

  function syncFromCloud() {
    return fetchSharedState().then(function (state) {
      if (!state) {
        // Empty cloud — push local state up if we have any
        var added = loadAddedActivities();
        var edits = loadEdits();
        if (added.length || Object.keys(edits).length) pushSharedState();
        return;
      }
      var hasCloud = (state.added && state.added.length) || (state.edits && Object.keys(state.edits).length);
      var localAdded = loadAddedActivities();
      var localEdits = loadEdits();
      var hasLocal = localAdded.length || Object.keys(localEdits).length;
      if (hasCloud) {
        applySharedState(state);
      } else if (hasLocal) {
        pushSharedState();
      }
    });
  }

  function subscribeToSharedState() {
    var c = getSupabase();
    if (!c) return;
    try {
      c.channel('itinerary_state_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'itinerary_state', filter: 'id=eq.' + SUPABASE_ROW_ID },
          function (payload) {
            if (payload && payload.new) {
              var changed = applySharedState(payload.new);
              if (changed) showSavedToast('Synced');
            }
          })
        .subscribe();
    } catch (e) {
      console.warn('Supabase subscribe failed', e);
    }
  }

  /* ============================================================
     Place resolution
     ============================================================ */
  var PLACES_INDEX = {};

  function normalizePlaceKey(str) {
    return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function buildPlacesIndex() {
    var idx = {};
    Object.keys(DAY_STOPS).forEach(function (day) {
      (DAY_STOPS[day] || []).forEach(function (stop) {
        idx[normalizePlaceKey(stop.name)] = {
          name: stop.name, address: stop.desc || stop.name, lat: stop.lat, lng: stop.lng
        };
      });
    });
    DIRECTORY.forEach(function (s) {
      if (!s.lat) return;
      idx[normalizePlaceKey(s.name)] = {
        name: s.name, address: s.desc || s.tags || s.name, lat: s.lat, lng: s.lng
      };
    });
    [
      { keys: ['aspasios', 'rambla catalonia'], name: 'Aspasios Rambla Catalonia', address: 'Rambla de Catalunya 21, Barcelona', lat: 41.3905, lng: 2.1660 },
      { keys: ['bodega la puntual', 'puntual'], name: 'Bodega La Puntual', address: 'El Born, Barcelona', lat: 41.3855, lng: 2.1820 },
      { keys: ['begurio'], name: 'Begurio', address: 'Begur, Costa Brava', lat: 41.9544, lng: 3.2076 },
      { keys: ['gothic', 'gaudí walking', 'gaudi walking'], name: 'Gothic & Gaudí Walking Tour', address: 'Plaça de Catalunya, Barcelona', lat: 41.3833, lng: 2.1764 },
      { keys: ['tossa de mar', 'kayak'], name: 'Tossa de Mar Kayak', address: 'Tossa de Mar, Costa Brava', lat: 41.7196, lng: 2.9320 }
    ].forEach(function (p) {
      p.keys.forEach(function (k) {
        idx[k] = { name: p.name, address: p.address, lat: p.lat, lng: p.lng };
      });
    });
    return idx;
  }

  function looksLikeAddress(notes) {
    if (!notes || notes.length < 8) return false;
    if (/\d/.test(notes)) return true;
    if (/\b(rambla|carrer|avinguda|plaza|plaça|hotel|street|st\.|c\/|passatge)\b/i.test(notes)) return true;
    return notes.indexOf(',') >= 0;
  }

  function resolvePlace(activity) {
    if (activity.place) return activity.place;
    var text = activity.text || '';
    var notes = (activity.notes || '').trim();
    var textKey = normalizePlaceKey(text);

    var best = null, bestLen = 0;
    Object.keys(PLACES_INDEX).forEach(function (key) {
      if (key.length < 4) return;
      if (textKey.indexOf(key) >= 0 && key.length > bestLen) {
        best = PLACES_INDEX[key];
        bestLen = key.length;
      }
    });
    if (best) {
      return {
        name: best.name,
        address: looksLikeAddress(notes) ? notes : best.address,
        lat: best.lat, lng: best.lng
      };
    }
    if (looksLikeAddress(notes)) {
      var label = text.replace(/\.\s*$/, '').replace(/^(check in to|dinner at|morning at|day trip to)\s+/i, '');
      return { name: label || text, address: notes, query: notes + ', Spain' };
    }
    return null;
  }

  function mapsUrlForPlace(place) {
    if (place.lat != null && place.lng != null) {
      return 'https://www.google.com/maps/search/?api=1&query=' + place.lat + ',' + place.lng;
    }
    var q = place.query || (place.name + ' ' + place.address);
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }

  /* ============================================================
     Place sheet
     ============================================================ */
  function openPlaceSheet(place) {
    var sheet = document.getElementById('place-sheet');
    if (!sheet || !place) return;
    document.getElementById('place-sheet-name').textContent = place.name;
    document.getElementById('place-sheet-address').textContent = place.address || '';
    document.getElementById('place-sheet-maps').href = mapsUrlForPlace(place);
    sheet.hidden = false;
    sheet.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { sheet.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
  }

  function closePlaceSheet() {
    var sheet = document.getElementById('place-sheet');
    if (!sheet) return;
    sheet.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!sheet.classList.contains('is-open')) {
        sheet.hidden = true;
        sheet.setAttribute('aria-hidden', 'true');
      }
    }, 320);
  }

  function initPlaceSheet() {
    var sheet = document.getElementById('place-sheet');
    if (!sheet) return;
    sheet.querySelectorAll('[data-sheet-close]').forEach(function (el) {
      el.addEventListener('click', closePlaceSheet);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) closePlaceSheet();
    });
  }

  function attachPlaceTrigger(el, place) {
    if (!el || !place) return;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openPlaceSheet(place);
    });
  }

  function syncHeaderOffset() {
    var header = document.querySelector('.site-header');
    if (header) {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }
  }

  function syncAppVh() {
    document.documentElement.style.setProperty('--app-vh', window.innerHeight + 'px');
  }

  /* ============================================================
     Map explorer
     ============================================================ */
  var routeMap = null, routeLayer = null, markersLayer = null;
  var mapMarkers = [];
  var activeMapDay = null;
  var activeStopIndex = 0;

  function getTravelDays() {
    return ITINERARY.filter(function (d) { return d.day; });
  }
  function getDayMeta(dayNum) {
    return ITINERARY.find(function (d) { return d.day === dayNum; });
  }
  function getOpenSlotsForDay(dayNum) {
    var day = getDayMeta(dayNum);
    if (!day) return [];
    return day.activities.map(function (a, i) { return { act: a, index: i }; })
      .filter(function (x) { return x.act.status === 'open'; });
  }

  function createPhotoMarkerIcon(stop, index) {
    var src = photoUrl(stop.photos, 120);
    return L.divIcon({
      className: 'photo-marker-wrap',
      html:
        '<div class="photo-marker" data-index="' + index + '">' +
          '<div class="photo-marker__img" style="background-image:url(\'' + src + '\')"></div>' +
          '<span class="photo-marker__badge">' + (index + 1) + '</span>' +
          '<span class="photo-marker__label">' + escapeHtml(stop.name) + '</span>' +
        '</div>',
      iconSize: [56, 56],
      iconAnchor: [28, 28]
    });
  }

  function focusStop(index) {
    activeStopIndex = index;
    var stops = DAY_STOPS[activeMapDay] || [];
    var stop = stops[index];
    if (!routeMap || !stop) return;
    routeMap.flyTo([stop.lat, stop.lng], 15, { duration: 0.7 });
    if (mapMarkers[index]) mapMarkers[index].openPopup();
    document.querySelectorAll('.map-stop').forEach(function (el, i) {
      el.classList.toggle('is-active', i === index);
    });
    document.querySelectorAll('.photo-marker').forEach(function (el, i) {
      el.classList.toggle('is-active', i === index);
    });
  }

  function renderMapPanel(dayNum) {
    var panel = document.getElementById('map-panel');
    var meta = getDayMeta(dayNum);
    var stops = DAY_STOPS[dayNum] || [];
    if (!panel || !meta) return;

    var title = DAY_TITLES[dayNum] || meta.location;

    var stopsHtml = stops.length
      ? stops.map(function (s, i) {
          return (
            '<button type="button" class="map-stop' + (i === activeStopIndex ? ' is-active' : '') + '" data-stop="' + i + '">' +
              '<span class="map-stop__thumb" style="background-image:url(\'' + photoUrl(s.photos, 160) + '\')"></span>' +
              '<span class="map-stop__body">' +
                '<span class="map-stop__time">' + escapeHtml(s.time) + '</span>' +
                '<span class="map-stop__name">' + escapeHtml(s.name) + '</span>' +
                '<span class="map-stop__meta">' + escapeHtml(s.category) + '</span>' +
              '</span>' +
            '</button>'
          );
        }).join('')
      : '<p class="map-panel__empty">No mapped stops this day — travel or flexible time.</p>';

    panel.innerHTML =
      '<div class="map-panel__inner">' +
        '<span class="kicker">Day ' + String(dayNum).padStart(2, '0') + '</span>' +
        '<h3 class="map-panel__title">' + escapeHtml(title) + '</h3>' +
        '<p class="map-panel__desc">' + escapeHtml(meta.hint) + '</p>' +
        '<div class="map-panel__actions">' +
          '<button type="button" class="btn btn--solid btn--rect" id="map-open-route">Open route</button>' +
          '<button type="button" class="btn btn--rect" id="map-scroll-day">View day card ' + ICONS.plus + '</button>' +
        '</div>' +
        '<div class="map-panel__stops">' + stopsHtml + '</div>' +
      '</div>';

    panel.querySelectorAll('.map-stop').forEach(function (btn) {
      btn.addEventListener('click', function () { focusStop(parseInt(btn.dataset.stop, 10)); });
    });

    var scrollBtn = document.getElementById('map-scroll-day');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', function () {
        var el = document.getElementById('day-' + dayNum);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    var routeBtn = document.getElementById('map-open-route');
    if (routeBtn && stops.length >= 2) {
      routeBtn.addEventListener('click', function () {
        var a = stops[0], b = stops[stops.length - 1];
        window.open(
          'https://www.google.com/maps/dir/?api=1&origin=' + a.lat + ',' + a.lng +
          '&destination=' + b.lat + ',' + b.lng + '&travelmode=driving', '_blank'
        );
      });
    } else if (routeBtn && stops.length === 1) {
      routeBtn.addEventListener('click', function () {
        window.open('https://www.google.com/maps/search/?api=1&query=' + stops[0].lat + ',' + stops[0].lng, '_blank');
      });
    } else if (routeBtn) {
      routeBtn.disabled = true;
    }
  }

  function setMapDay(dayNum) {
    activeMapDay = dayNum;
    activeStopIndex = 0;

    document.querySelectorAll('.map-day-tab').forEach(function (tab) {
      var on = parseInt(tab.dataset.day, 10) === dayNum;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.day-jump').forEach(function (btn) {
      btn.classList.toggle('is-active', parseInt(btn.dataset.day, 10) === dayNum);
    });

    if (!routeMap || typeof L === 'undefined') {
      renderMapPanel(dayNum);
      return;
    }

    if (markersLayer) markersLayer.clearLayers();
    if (routeLayer) routeLayer.clearLayers();
    mapMarkers = [];

    var stops = DAY_STOPS[dayNum] || [];
    var latlngs = [];

    stops.forEach(function (stop, i) {
      var ll = [stop.lat, stop.lng];
      latlngs.push(ll);
      var marker = L.marker(ll, { icon: createPhotoMarkerIcon(stop, i) });
      marker.bindPopup(
        '<strong>' + escapeHtml(stop.name) + '</strong><br>' +
        '<span style="font-size:11px;color:#6a7282">' + escapeHtml(stop.time) + ' · ' + escapeHtml(stop.category) + '</span>'
      );
      marker.on('click', function () { focusStop(i); });
      marker.addTo(markersLayer);
      mapMarkers.push(marker);
    });

    if (latlngs.length > 1) {
      L.polyline(latlngs, { color: '#2b7fff', weight: 4, opacity: 0.9, lineJoin: 'round' }).addTo(routeLayer);
      routeMap.fitBounds(latlngs, { padding: [60, 60], maxZoom: 14 });
    } else if (latlngs.length === 1) {
      routeMap.setView(latlngs[0], 14);
    } else if (!routeMap._initialViewSet) {
      routeMap.setView([41.39, 2.17], 12);
      routeMap._initialViewSet = true;
    }

    renderMapPanel(dayNum);
    if (stops.length) focusStop(0);
  }

  function initMapDayTabs() {
    var tabs = document.getElementById('map-day-tabs');
    if (!tabs || tabs._inited) return;
    tabs._inited = true;
    tabs.innerHTML = '';
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (d) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'map-day-tab';
      tab.dataset.day = d;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', 'false');
      tab.textContent = 'Day ' + d;
      tab.addEventListener('click', function () { setMapDay(d); });
      tabs.appendChild(tab);
    });
  }

  function renderMapPanelEmpty() {
    var panel = document.getElementById('map-panel');
    if (!panel) return;
    panel.innerHTML =
      '<div class="map-panel__inner">' +
        '<span class="kicker">The route</span>' +
        '<h3 class="map-panel__title">Tap a day to see the stops</h3>' +
        '<p class="map-panel__desc">Nine days along the Catalan coast — each pill above shows that day&rsquo;s stops on the map.</p>' +
      '</div>';
  }

  function initRouteMap() {
    initMapDayTabs();
    renderMapPanelEmpty();

    if (typeof L === 'undefined') return;
    var el = document.getElementById('route-map');
    if (!el || el._inited) return;
    el._inited = true;

    routeMap = L.map(el, { zoomControl: true, scrollWheelZoom: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(routeMap);

    markersLayer = L.layerGroup().addTo(routeMap);
    routeLayer = L.layerGroup().addTo(routeMap);

    routeMap.setView([41.85, 2.7], 8);
    routeMap._initialViewSet = true;

    setTimeout(function () { routeMap.invalidateSize(); }, 200);
  }

  /* ============================================================
     Map modal (full-screen day map via DOM relocation)
     ============================================================ */
  var mapModalState = { originalParent: null, originalNext: null };

  function openMapModal(dayNum) {
    var modal = document.getElementById('map-modal');
    var modalBody = document.getElementById('map-modal-body');
    var mapCard = document.querySelector('.map-card');
    if (!modal || !modalBody || !mapCard) return;

    if (mapCard.parentElement !== modalBody) {
      mapModalState.originalParent = mapCard.parentElement;
      mapModalState.originalNext = mapCard.nextSibling;
      modalBody.appendChild(mapCard);
    }

    var titleEl = document.getElementById('map-modal-title');
    if (titleEl) {
      var meta = dayNum != null ? getDayMeta(dayNum) : null;
      if (meta) {
        titleEl.textContent = 'Day ' + dayNum + ' · ' + (DAY_TITLES[dayNum] || meta.location);
      } else {
        titleEl.textContent = 'Trip route';
      }
    }

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (dayNum != null && DAY_STOPS[dayNum] && DAY_STOPS[dayNum].length) {
      setMapDay(dayNum);
    }

    setTimeout(function () {
      if (routeMap) routeMap.invalidateSize();
    }, 60);
  }

  function closeMapModal() {
    var modal = document.getElementById('map-modal');
    if (!modal || modal.hidden) return;

    var mapCard = document.querySelector('.map-card');
    if (mapCard && mapModalState.originalParent) {
      if (mapModalState.originalNext && mapModalState.originalNext.parentNode === mapModalState.originalParent) {
        mapModalState.originalParent.insertBefore(mapCard, mapModalState.originalNext);
      } else {
        mapModalState.originalParent.appendChild(mapCard);
      }
    }

    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    setTimeout(function () {
      if (routeMap) routeMap.invalidateSize();
    }, 60);
  }

  function initMapModal() {
    var modal = document.getElementById('map-modal');
    if (!modal) return;
    modal.querySelectorAll('[data-map-modal-close]').forEach(function (el) {
      el.addEventListener('click', closeMapModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeMapModal();
    });
  }

  /* ============================================================
     Day jumper
     ============================================================ */
  function setActiveDayJump(dayNum) {
    document.querySelectorAll('.day-jump').forEach(function (btn) {
      var on = dayNum != null && parseInt(btn.dataset.day, 10) === dayNum;
      btn.classList.toggle('is-active', on);
    });
    var wrap = document.getElementById('day-jumper-buttons');
    if (wrap && dayNum != null) {
      var activeBtn = wrap.querySelector('.day-jump.is-active');
      if (activeBtn) {
        var wrapRect = wrap.getBoundingClientRect();
        var btnRect = activeBtn.getBoundingClientRect();
        if (btnRect.left < wrapRect.left || btnRect.right > wrapRect.right) {
          var target = activeBtn.offsetLeft - (wrap.clientWidth - activeBtn.offsetWidth) / 2;
          wrap.scrollTo({ left: target, behavior: 'smooth' });
        }
      }
    }
  }

  function initDayJumper() {
    var wrap = document.getElementById('day-jumper-buttons');
    if (!wrap) return;
    wrap.innerHTML = '';
    getTravelDays().forEach(function (d) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'day-jump';
      btn.dataset.day = d.day;
      btn.innerHTML =
        '<span class="day-jump__num">Day ' + d.day + '</span>' +
        '<span class="day-jump__date">' + escapeHtml(d.shortDate) + '</span>';
      btn.addEventListener('click', function () {
        var dayNum = d.day;
        setMapDay(dayNum);
        var el = document.getElementById('day-' + dayNum);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      wrap.appendChild(btn);
    });
  }

  function initItineraryScrollSpy() {
    if (typeof IntersectionObserver === 'undefined') return;
    var cards = document.querySelectorAll('.day-card');
    if (!cards.length) return;

    function getTopOffset() {
      var header = document.querySelector('.site-header');
      var jumper = document.querySelector('.day-jumper');
      var hH = header ? header.offsetHeight : 60;
      var jH = jumper ? jumper.offsetHeight : 60;
      return hH + jH + 8;
    }

    var visible = new Set();

    function pickActive() {
      if (!visible.size) return null;
      return Array.from(visible).sort(function (a, b) { return a - b; })[0];
    }

    var io;
    function build() {
      if (io) io.disconnect();
      var top = getTopOffset();
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var dayNum = parseInt(entry.target.id.replace('day-', ''), 10);
          if (isNaN(dayNum)) return;
          if (entry.isIntersecting) visible.add(dayNum);
          else visible.delete(dayNum);
        });
        setActiveDayJump(pickActive());
      }, {
        rootMargin: '-' + top + 'px 0px -70% 0px',
        threshold: 0
      });
      document.querySelectorAll('.day-card').forEach(function (c) { io.observe(c); });
    }

    build();

    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(build, 150);
    });
  }

  /* ============================================================
     Itinerary persistence
     ============================================================ */
  function loadJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (e) { return fallback; }
  }
  function saveJson(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  }
  function loadAddedActivities() { return loadJson(ADDED_KEY, []); }
  function saveAddedActivities(list) {
    saveJson(ADDED_KEY, list);
    if (!isApplyingCloudState) pushSharedState();
  }
  function loadEdits() { return loadJson(EDITS_KEY, {}); }
  function saveEdits(edits) {
    saveJson(EDITS_KEY, edits);
    if (!isApplyingCloudState) pushSharedState();
  }
  function loadLegacyLinks() { return loadJson(LEGACY_LINKS_KEY, []); }

  var saveToastTimer = null;
  function showSavedToast(label) {
    var el = document.getElementById('save-toast');
    if (!el) return;
    var labelEl = el.querySelector('span');
    if (labelEl) labelEl.textContent = label || 'Saved';
    el.hidden = false;
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    if (saveToastTimer) clearTimeout(saveToastTimer);
    saveToastTimer = setTimeout(function () {
      el.classList.remove('is-visible');
      setTimeout(function () { if (!el.classList.contains('is-visible')) el.hidden = true; }, 280);
    }, 1400);
  }

  function assignActivityIds() {
    ITINERARY.forEach(function (d) {
      d.activities.forEach(function (a, i) {
        if (!a.id) a.id = 'd' + d.day + '-' + i;
      });
    });
  }

  function resetItineraryFromBase() {
    ITINERARY.length = 0;
    BASE_ITINERARY.forEach(function (d) {
      ITINERARY.push(JSON.parse(JSON.stringify(d)));
    });
    assignActivityIds();
  }

  // Returns minutes-from-midnight for any time-ish string.
  // Examples: "9:00am" -> 540, "2pm" -> 840, "noon" -> 720, "sunset" -> 1170,
  // "morning"/"am" -> 540, "afternoon"/"pm" -> 840, "evening" -> 1140.
  function timeSortScore(timeStr) {
    if (timeStr == null) return 14 * 60;
    var t = String(timeStr).trim().toLowerCase();
    if (!t) return 14 * 60;

    if (t === 'morning' || t === 'am') return 9 * 60;       // ~9am
    if (t === 'afternoon' || t === 'pm') return 14 * 60;    // 2pm
    if (t === 'evening') return 19 * 60;                    // 7pm
    if (t === 'noon') return 12 * 60;
    if (t === 'midnight') return 0;
    if (t === 'sunset') return 19 * 60 + 30;
    if (t === 'sunrise') return 6 * 60;
    if (t === 'late') return 22 * 60;
    if (t === 'all day' || t === 'allday') return 13 * 60;
    if (t === 'flex' || t === 'flexible') return 14 * 60;

    var m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
    if (m) {
      var hour = parseInt(m[1], 10);
      var min = parseInt(m[2] || '0', 10);
      var ampm = m[3];
      if (ampm === 'pm' && hour !== 12) hour += 12;
      if (ampm === 'am' && hour === 12) hour = 0;
      if (!ampm && hour < 6) hour += 12; // "3:00" → 3pm by default
      return hour * 60 + min;
    }
    return 14 * 60;
  }

  // Sort key with wrap-around: post-midnight times (0–4:59am) belong to the
  // previous day's "evening", so push them past 24h for chronological order.
  function sortKey(timeStr) {
    var s = timeSortScore(timeStr);
    if (s < 5 * 60) return s + 24 * 60;
    return s;
  }

  // Morning: 5:00am–11:59am  (300–719)
  // Afternoon: 12:00pm–4:59pm (720–1019)
  // Evening: 5:00pm–4:59am   (>=1020 OR <300)
  function getTimeBucket(timeStr) {
    var s = timeSortScore(timeStr);
    if (s >= 5 * 60 && s < 12 * 60) return 'morning';
    if (s >= 12 * 60 && s < 17 * 60) return 'afternoon';
    return 'evening';
  }

  function timeFromFrame(timeFrame, customTime, openAct) {
    if (timeFrame === 'custom' && customTime) return customTime;
    var map = {
      morning: '10:00am',
      afternoon: '2:00pm',
      evening: '7:00pm',
      flexible: (openAct && openAct.time) ? openAct.time : 'pm'
    };
    return map[timeFrame] || '2:00pm';
  }

  function findInsertIndex(day, newAct, openSlotIndex) {
    var newScore = sortKey(newAct.time);
    var insertAt = openSlotIndex;
    for (var i = openSlotIndex - 1; i >= 0; i--) {
      if (sortKey(day.activities[i].time) <= newScore) {
        insertAt = i + 1;
        break;
      }
      insertAt = i;
    }
    return insertAt;
  }

  function sortedInsertIndex(day, time) {
    var newScore = sortKey(time);
    for (var i = 0; i < day.activities.length; i++) {
      if (sortKey(day.activities[i].time) > newScore) return i;
    }
    return day.activities.length;
  }

  function applyEditsToItinerary() {
    var edits = loadEdits();

    // 1) Apply text/time/notes edits in place, and collect day-moves.
    var moves = [];
    ITINERARY.forEach(function (d) {
      d.activities.forEach(function (a, i) {
        var e = edits[a.id];
        if (!e) return;
        if (e.time != null) a.time = e.time;
        if (e.text != null) a.text = e.text;
        if (e.notes != null) a.notes = e.notes;
        if (e.day != null && e.day !== d.day) {
          moves.push({ from: d, idx: i, toDay: e.day, act: a });
        }
      });
    });

    // 2) Apply day moves. Splice from each source day in descending index
    //    order so earlier splices don't shift later ones.
    var bySource = {};
    moves.forEach(function (m) {
      var key = String(m.from.day);
      (bySource[key] = bySource[key] || []).push(m);
    });
    Object.keys(bySource).forEach(function (key) {
      bySource[key].sort(function (a, b) { return b.idx - a.idx; }).forEach(function (m) {
        m.from.activities.splice(m.idx, 1);
      });
    });
    moves.forEach(function (m) {
      var toDay = getDayMeta(m.toDay);
      if (!toDay) return;
      toDay.activities.splice(sortedInsertIndex(toDay, m.act.time), 0, m.act);
    });

    // 3) Apply removals (base activities the user explicitly removed).
    ITINERARY.forEach(function (d) {
      for (var i = d.activities.length - 1; i >= 0; i--) {
        var a = d.activities[i];
        var e = edits[a.id];
        if (e && e.removed) d.activities.splice(i, 1);
      }
    });
  }

  function applyAddedActivities() {
    var added = loadAddedActivities();
    added.sort(function (a, b) {
      if (a.day !== b.day) return a.day - b.day;
      return sortKey(a.activity.time) - sortKey(b.activity.time);
    });
    added.forEach(function (entry) {
      var day = getDayMeta(entry.day);
      if (!day) return;
      var act = JSON.parse(JSON.stringify(entry.activity));
      if (!act.id) act.id = entry.id;
      if (day.activities.some(function (a) { return a.id === act.id; })) return;

      if (entry.direct || (entry.openSlotIndex == null && !entry.openSlotId)) {
        day.activities.splice(sortedInsertIndex(day, act.time), 0, act);
        return;
      }

      var openIdx = -1;
      if (entry.openSlotId) {
        openIdx = day.activities.findIndex(function (a) { return a.id === entry.openSlotId; });
      }
      if (openIdx < 0) openIdx = entry.openSlotIndex;
      if (openIdx < 0 || !day.activities[openIdx] || day.activities[openIdx].status !== 'open') {
        // Slot no longer exists (e.g. user removed it or moved the item) —
        // fall back to a direct, time-sorted insert so the item still appears.
        day.activities.splice(sortedInsertIndex(day, act.time), 0, act);
        return;
      }
      var slotInsertAt = findInsertIndex(day, act, openIdx);
      day.activities.splice(slotInsertAt, 0, act);
    });
  }

  function migrateLegacyLinks() {
    var legacy = loadLegacyLinks();
    var added = loadAddedActivities();
    var newAdds = [];

    ITINERARY.forEach(function (d) {
      d.activities.forEach(function (act, idx) {
        if (act.linkedSpots && act.linkedSpots.length) {
          act.linkedSpots.forEach(function (s) {
            newAdds.push({
              id: 'legacy-' + d.day + '-' + idx + '-' + normalizePlaceKey(s.spotName),
              day: d.day,
              openSlotIndex: idx,
              openSlotId: act.id,
              activity: {
                id: 'legacy-' + d.day + '-' + idx + '-' + Date.now(),
                time: timeFromFrame(s.timeFrame, null, act),
                text: s.spotName,
                status: 'confirmed',
                notes: s.spotTags || '',
                addedFromSlot: idx,
                isAdded: true
              }
            });
          });
          delete act.linkedSpots;
        }
      });
    });

    legacy.forEach(function (l) {
      var dup = added.concat(newAdds).some(function (a) {
        return a.day === l.day && a.activity && a.activity.text === l.spotName;
      });
      if (dup) return;
      var day = getDayMeta(l.day);
      var openAct = day && day.activities[l.activityIndex];
      newAdds.push({
        id: 'legacy-' + l.day + '-' + l.activityIndex + '-' + normalizePlaceKey(l.spotName),
        day: l.day,
        openSlotIndex: l.activityIndex,
        openSlotId: openAct ? openAct.id : null,
        activity: {
          id: 'legacy-' + l.day + '-' + l.activityIndex + '-' + Date.now(),
          time: timeFromFrame(l.timeFrame, null, openAct),
          text: l.spotName,
          status: 'confirmed',
          notes: l.spotTags || '',
          addedFromSlot: l.activityIndex,
          isAdded: true
        }
      });
    });

    if (newAdds.length) {
      saveAddedActivities(added.concat(newAdds));
      saveJson(LEGACY_LINKS_KEY, []);
    }
  }

  function rebuildItineraryState() {
    resetItineraryFromBase();
    migrateLegacyLinks();
    applyAddedActivities();
    applyEditsToItinerary();
  }

  function applySpotLink(dayNum, activityIndex, spot, timeFrame, customTime) {
    var day = getDayMeta(dayNum);
    var openAct = day && day.activities[activityIndex];
    if (!openAct || openAct.status !== 'open') return;

    var newAct = {
      id: 'add-' + dayNum + '-' + Date.now(),
      time: timeFromFrame(timeFrame, customTime, openAct),
      text: spot.name,
      status: 'confirmed',
      notes: spot.desc || spot.tags || '',
      addedFromSlot: activityIndex,
      isAdded: true
    };
    if (spot.lat != null && spot.lng != null) {
      newAct.place = {
        name: spot.name, address: spot.desc || spot.tags || spot.name,
        lat: spot.lat, lng: spot.lng
      };
    }

    var added = loadAddedActivities();
    added.push({
      id: newAct.id, day: dayNum, openSlotIndex: activityIndex,
      openSlotId: openAct.id, activity: JSON.parse(JSON.stringify(newAct))
    });
    saveAddedActivities(added);

    var insertAt = findInsertIndex(day, newAct, activityIndex);
    day.activities.splice(insertAt, 0, newAct);
    refreshDayCard(dayNum);
    showSavedToast('Added to Day ' + dayNum);
  }

  function applyDirectAdd(dayNum, spot, timeFrame, customTime) {
    var day = getDayMeta(dayNum);
    if (!day) return;

    var newAct = {
      id: 'add-' + dayNum + '-' + Date.now(),
      time: timeFromFrame(timeFrame, customTime, null),
      text: spot.name,
      status: 'confirmed',
      notes: spot.desc || spot.tags || '',
      isAdded: true
    };
    if (spot.lat != null && spot.lng != null) {
      newAct.place = {
        name: spot.name, address: spot.desc || spot.tags || spot.name,
        lat: spot.lat, lng: spot.lng
      };
    }

    var added = loadAddedActivities();
    added.push({
      id: newAct.id, day: dayNum,
      openSlotIndex: null, openSlotId: null, direct: true,
      activity: JSON.parse(JSON.stringify(newAct))
    });
    saveAddedActivities(added);

    day.activities.splice(sortedInsertIndex(day, newAct.time), 0, newAct);
    refreshDayCard(dayNum);
    showSavedToast('Added to Day ' + dayNum);
  }

  function applyCustomAdd(dayNum, title, notes, timeFrame, customTime) {
    var day = getDayMeta(dayNum);
    if (!day) return;
    var cleanTitle = (title || '').trim();
    if (!cleanTitle) return;

    var newAct = {
      id: 'add-' + dayNum + '-' + Date.now(),
      time: timeFromFrame(timeFrame, customTime, null),
      text: cleanTitle,
      status: 'confirmed',
      notes: (notes || '').trim(),
      isAdded: true
    };

    var added = loadAddedActivities();
    added.push({
      id: newAct.id, day: dayNum,
      openSlotIndex: null, openSlotId: null, direct: true,
      activity: JSON.parse(JSON.stringify(newAct))
    });
    saveAddedActivities(added);

    day.activities.splice(sortedInsertIndex(day, newAct.time), 0, newAct);
    refreshDayCard(dayNum);
    showSavedToast('Added to Day ' + dayNum);
  }

  function removeAddedActivity(activityId) {
    var added = loadAddedActivities().filter(function (a) {
      return a.id !== activityId && a.activity.id !== activityId;
    });
    saveAddedActivities(added);
    rebuildItineraryState();
  }

  /* ============================================================
     Edit sheet
     ============================================================ */
  var editState = { day: null, index: null, activityId: null };

  function openEditSheet(dayNum, activityIndex) {
    var day = getDayMeta(dayNum);
    var act = day && day.activities[activityIndex];
    if (!act) return;

    editState = { day: dayNum, index: activityIndex, activityId: act.id };
    document.getElementById('edit-sheet-title').textContent = 'Edit plan';
    document.getElementById('edit-time').value = act.time || '';
    document.getElementById('edit-text').value = act.text || '';
    document.getElementById('edit-notes').value = act.notes || '';

    // Populate the Day selector with all travel days. Default to the
    // activity's current day.
    var daySelect = document.getElementById('edit-day');
    if (daySelect) {
      daySelect.innerHTML = '';
      getTravelDays().forEach(function (d2) {
        var opt = document.createElement('option');
        opt.value = String(d2.day);
        opt.textContent = 'Day ' + d2.day + ' — ' + getDayDateLabel(d2) + ' · ' + d2.location;
        if (d2.day === dayNum) opt.selected = true;
        daySelect.appendChild(opt);
      });
    }

    var place = act.status === 'confirmed' ? resolvePlace(act) : null;
    var viewPlace = document.getElementById('edit-view-place');
    if (viewPlace) {
      viewPlace.hidden = !place;
      viewPlace._place = place || null;
    }

    var sheet = document.getElementById('edit-sheet');
    sheet.hidden = false;
    sheet.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { sheet.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
  }

  function closeEditSheet() {
    var sheet = document.getElementById('edit-sheet');
    if (!sheet) return;
    sheet.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!sheet.classList.contains('is-open')) {
        sheet.hidden = true;
        sheet.setAttribute('aria-hidden', 'true');
      }
    }, 320);
  }

  function saveEditSheet() {
    if (!editState.activityId) return;
    var time = document.getElementById('edit-time').value.trim();
    var text = document.getElementById('edit-text').value.trim();
    var notes = document.getElementById('edit-notes').value.trim();
    var daySelect = document.getElementById('edit-day');
    var newDay = daySelect ? parseInt(daySelect.value, 10) : NaN;
    if (isNaN(newDay)) newDay = editState.day;

    var added = loadAddedActivities();
    var addEntry = added.find(function (a) {
      return a.id === editState.activityId || (a.activity && a.activity.id === editState.activityId);
    });

    if (addEntry) {
      // Added activity: update the stored entry, and switch day if changed.
      addEntry.activity.time = time;
      addEntry.activity.text = text;
      addEntry.activity.notes = notes;
      if (newDay !== addEntry.day) {
        addEntry.day = newDay;
        // The slot binding from the original day no longer applies.
        addEntry.direct = true;
        addEntry.openSlotIndex = null;
        addEntry.openSlotId = null;
      }
      saveAddedActivities(added);
    } else {
      // Base activity: persist as an edit. Use `day` to move between days.
      var edits = loadEdits();
      var prev = edits[editState.activityId] || {};
      var patch = { time: time, text: text, notes: notes };
      if (newDay !== editState.day) patch.day = newDay;
      else if (prev.day != null) patch.day = prev.day;
      if (prev.removed) patch.removed = true;
      edits[editState.activityId] = patch;
      saveEdits(edits);
    }

    rebuildItineraryState();
    renderItinerary();
    closeEditSheet();
    showSavedToast('Saved');
  }

  function deleteEditSheet() {
    if (!editState.activityId) return;
    var added = loadAddedActivities();
    var isAdded = added.some(function (a) {
      return a.id === editState.activityId || (a.activity && a.activity.id === editState.activityId);
    });

    if (isAdded) {
      removeAddedActivity(editState.activityId);
      var edits = loadEdits();
      delete edits[editState.activityId];
      saveEdits(edits);
    } else {
      // Base activity: mark as removed so future rebuilds filter it out.
      var edits2 = loadEdits();
      var prev = edits2[editState.activityId] || {};
      prev.removed = true;
      edits2[editState.activityId] = prev;
      saveEdits(edits2);
      rebuildItineraryState();
    }
    closeEditSheet();
    renderItinerary();
    showSavedToast('Removed');
  }

  function initEditSheet() {
    var sheet = document.getElementById('edit-sheet');
    if (!sheet) return;
    sheet.querySelectorAll('[data-edit-close]').forEach(function (el) {
      el.addEventListener('click', closeEditSheet);
    });
    document.getElementById('edit-save').addEventListener('click', saveEditSheet);
    document.getElementById('edit-delete').addEventListener('click', deleteEditSheet);
    var viewPlace = document.getElementById('edit-view-place');
    if (viewPlace) {
      viewPlace.addEventListener('click', function () {
        var p = viewPlace._place;
        if (!p) return;
        closeEditSheet();
        setTimeout(function () { openPlaceSheet(p); }, 320);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) closeEditSheet();
    });
  }

  /* ============================================================
     Picker modal
     ============================================================ */
  var pickerState = {
    day: null, slotIndex: null, spot: null,
    timeFrame: 'morning', customTime: '',
    filter: 'all', query: '',
    dayLocked: false,
    customTitle: '', customNotes: ''
  };

  function openPickerModal(opts) {
    opts = opts || {};
    pickerState.day = opts.day != null ? opts.day : null;
    pickerState.slotIndex = opts.slotIndex != null ? opts.slotIndex : null;
    pickerState.spot = opts.spot || null;
    pickerState.timeFrame = opts.timeFrame || 'morning';
    pickerState.customTime = '';
    pickerState.filter = 'all';
    pickerState.query = '';
    pickerState.dayLocked = !!opts.dayLocked;
    pickerState.customTitle = '';
    pickerState.customNotes = '';

    var modal = document.getElementById('picker-modal');
    if (!modal) return;

    var day = pickerState.day != null ? getDayMeta(pickerState.day) : null;
    var slot = day && pickerState.slotIndex != null ? day.activities[pickerState.slotIndex] : null;

    var kicker, title;
    if (slot) {
      kicker = 'Day ' + String(pickerState.day).padStart(2, '0') + ' · Open window';
      title = slot.text;
    } else if (pickerState.dayLocked && day) {
      kicker = 'Day ' + String(pickerState.day).padStart(2, '0') + ' · ' + day.location;
      title = 'Add to ' + day.location;
    } else if (pickerState.spot) {
      kicker = 'Add to itinerary';
      title = pickerState.spot.name;
    } else {
      kicker = 'Fill an open window';
      title = 'Add a spot';
    }
    document.getElementById('picker-kicker').textContent = kicker;
    document.getElementById('picker-title').textContent = title;

    var ctx = '';
    if (day && slot) {
      ctx = day.date + ' · ' + day.location + (slot.notes ? ' — ' + slot.notes : '');
    } else if (pickerState.dayLocked && day) {
      ctx = day.date + ' · ' + day.location;
    } else if (pickerState.spot) {
      ctx = (pickerState.spot.tags || '') + (pickerState.spot.desc ? ' — ' + pickerState.spot.desc : '');
    }
    document.getElementById('picker-context').textContent = ctx;

    var confirmBtn = document.getElementById('picker-confirm');
    if (confirmBtn) {
      confirmBtn.textContent = (pickerState.dayLocked && day) ? 'Add to Day ' + pickerState.day : 'Add to itinerary';
    }

    document.querySelectorAll('.time-frame').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.time === pickerState.timeFrame);
    });
    document.getElementById('custom-time-wrap').hidden = pickerState.timeFrame !== 'custom';
    document.getElementById('picker-search').value = '';
    document.getElementById('picker-search-results').hidden = true;

    var customSection = document.getElementById('picker-custom-section');
    var orDivider = document.getElementById('picker-or');
    var placeLabel = document.getElementById('picker-place-label');
    var showCustom = pickerState.dayLocked;
    if (customSection) customSection.hidden = !showCustom;
    if (orDivider) orDivider.hidden = !showCustom;
    if (placeLabel) placeLabel.textContent = showCustom ? 'Or choose a place' : 'Choose a place';
    var titleInput = document.getElementById('picker-custom-title');
    var notesInput = document.getElementById('picker-custom-notes');
    if (titleInput) titleInput.value = '';
    if (notesInput) notesInput.value = '';

    renderPickerDaySlot();
    renderPickerFilters();
    renderPickerGrid();
    updatePickerConfirm();

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePickerModal() {
    var modal = document.getElementById('picker-modal');
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.getElementById('picker-search-results').hidden = true;
    document.getElementById('place-search-results').hidden = true;
  }

  function updatePickerConfirm() {
    var btn = document.getElementById('picker-confirm');
    if (!btn) return;
    var hasPlace = !!pickerState.spot && pickerState.day != null;
    var hasCustom = pickerState.dayLocked
      && pickerState.day != null
      && !!(pickerState.customTitle || '').trim();
    if (pickerState.dayLocked) {
      btn.disabled = !(hasPlace || hasCustom);
    } else {
      btn.disabled = !(hasPlace && pickerState.slotIndex != null);
    }
  }

  function renderPickerDaySlot() {
    var daySection = document.getElementById('picker-day-section');
    var slotSection = document.getElementById('picker-slot-section');
    var slotLabel = document.getElementById('picker-slot-label');
    var daysEl = document.getElementById('picker-days');
    var slotsEl = document.getElementById('picker-slots');

    var openSlots = pickerState.day != null ? getOpenSlotsForDay(pickerState.day) : [];

    if (pickerState.dayLocked) {
      if (daySection) daySection.hidden = true;
      if (slotSection) slotSection.hidden = openSlots.length === 0;
      if (slotLabel) slotLabel.textContent = 'Open window (optional)';
    } else {
      var needsDay = pickerState.slotIndex == null;
      if (daySection) daySection.hidden = !needsDay;
      if (slotSection) slotSection.hidden = !needsDay || pickerState.day == null;
      if (slotLabel) slotLabel.textContent = 'Open window';
    }

    if (daysEl && !pickerState.dayLocked && pickerState.slotIndex == null) {
      daysEl.innerHTML = '';
      getTravelDays().forEach(function (d) {
        var openCount = getOpenSlotsForDay(d.day).length;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'picker-day' + (pickerState.day === d.day ? ' is-selected' : '');
        btn.disabled = openCount === 0;
        btn.innerHTML =
          '<span class="picker-day__num">Day ' + d.day + '</span>' +
          '<span class="picker-day__meta">' + escapeHtml(d.date) + ' · ' + escapeHtml(d.location) + '</span>';
        btn.addEventListener('click', function () {
          if (btn.disabled) return;
          pickerState.day = d.day;
          pickerState.slotIndex = null;
          renderPickerDaySlot();
          updatePickerConfirm();
        });
        daysEl.appendChild(btn);
      });
    }

    if (!slotsEl || pickerState.day == null) {
      if (slotsEl) slotsEl.innerHTML = '';
      return;
    }
    slotsEl.innerHTML = '';
    openSlots.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'picker-slot' + (pickerState.slotIndex === item.index ? ' is-selected' : '');
      btn.innerHTML =
        '<span class="picker-slot__time">' + escapeHtml(item.act.time || 'flex') + '</span>' +
        '<span class="picker-slot__text">' + escapeHtml(item.act.text) + '</span>';
      btn.addEventListener('click', function () {
        pickerState.slotIndex = (pickerState.slotIndex === item.index) ? null : item.index;
        renderPickerDaySlot();
        updatePickerConfirm();
      });
      slotsEl.appendChild(btn);
    });
  }

  function renderPickerFilters() {
    var wrap = document.getElementById('picker-filters');
    if (!wrap) return;
    var filters = [
      { id: 'all', label: 'All' },
      { id: 'barcelona-list', label: 'Barcelona' },
      { id: 'costa-brava-list', label: 'Costa Brava' },
      { id: 'restaurants', label: 'Eat' },
      { id: 'shops', label: 'Shops' },
      { id: 'sights', label: 'Sights' }
    ];
    wrap.innerHTML = '';
    filters.forEach(function (f) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip' + (pickerState.filter === f.id ? ' is-active' : '');
      chip.textContent = f.label;
      chip.dataset.filter = f.id;
      chip.addEventListener('click', function () {
        pickerState.filter = f.id;
        renderPickerFilters();
        renderPickerGrid();
      });
      wrap.appendChild(chip);
    });
  }

  function filterDirectoryItems(filter, query) {
    filter = filter || 'all';
    query = (query || '').trim().toLowerCase();
    return DIRECTORY.filter(function (s) {
      if (filter === 'barcelona-list' && s.list !== 'barcelona') return false;
      if (filter === 'costa-brava-list' && s.list !== 'costa-brava') return false;
      if (filter === 'restaurants' && s.cat !== 'restaurants') return false;
      if (filter === 'shops' && s.cat !== 'shops') return false;
      if (filter === 'sights' && s.cat !== 'sights') return false;
      if (!query) return true;
      var hay = (s.name + ' ' + s.tags + ' ' + s.desc).toLowerCase();
      return hay.indexOf(query) >= 0;
    });
  }

  function renderPickerGrid() {
    var grid = document.getElementById('picker-grid');
    if (!grid) return;
    grid.innerHTML = '';
    grid.hidden = true;
  }

  function initPickerModal() {
    var modal = document.getElementById('picker-modal');
    if (!modal) return;

    modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
      el.addEventListener('click', closePickerModal);
    });

    document.querySelectorAll('.time-frame').forEach(function (btn) {
      btn.addEventListener('click', function () {
        pickerState.timeFrame = btn.dataset.time;
        document.querySelectorAll('.time-frame').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        var customWrap = document.getElementById('custom-time-wrap');
        if (customWrap) customWrap.hidden = pickerState.timeFrame !== 'custom';
      });
    });

    var customTime = document.getElementById('custom-time');
    if (customTime) {
      customTime.addEventListener('change', function () {
        pickerState.customTime = customTime.value;
      });
    }

    var customTitleInput = document.getElementById('picker-custom-title');
    if (customTitleInput) {
      customTitleInput.addEventListener('input', function () {
        pickerState.customTitle = customTitleInput.value;
        updatePickerConfirm();
      });
    }
    var customNotesInput = document.getElementById('picker-custom-notes');
    if (customNotesInput) {
      customNotesInput.addEventListener('input', function () {
        pickerState.customNotes = customNotesInput.value;
      });
    }

    document.getElementById('picker-confirm').addEventListener('click', function () {
      if (pickerState.day == null) return;
      var tf = pickerState.timeFrame;
      if (tf === 'custom') {
        pickerState.customTime = document.getElementById('custom-time').value || '';
      }
      var hasCustomTitle = pickerState.dayLocked && !!(pickerState.customTitle || '').trim();
      if (hasCustomTitle) {
        applyCustomAdd(pickerState.day, pickerState.customTitle, pickerState.customNotes, tf, pickerState.customTime);
      } else {
        if (!pickerState.spot) return;
        if (!pickerState.dayLocked && pickerState.slotIndex == null) return;
        if (pickerState.slotIndex != null) {
          applySpotLink(pickerState.day, pickerState.slotIndex, pickerState.spot, tf, pickerState.customTime);
        } else {
          applyDirectAdd(pickerState.day, pickerState.spot, tf, pickerState.customTime);
        }
      }
      var targetDay = pickerState.day;
      closePickerModal();
      var el = document.getElementById('day-' + targetDay);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    var pickerSearch = document.getElementById('picker-search');
    if (pickerSearch) {
      pickerSearch.addEventListener('input', debounce(function () {
        pickerState.query = pickerSearch.value;
        renderPickerGrid();
        if (pickerSearch.value.trim().length >= 3) {
          searchPlaces(pickerSearch.value, document.getElementById('picker-search-results'), function (spot) {
            pickerState.spot = spot;
            updatePickerConfirm();
            renderPickerGrid();
          });
        } else {
          document.getElementById('picker-search-results').hidden = true;
        }
      }, 350));
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closePickerModal();
    });
  }

  function openPickerForSlot(dayNum, slotIndex) {
    openPickerModal({ day: dayNum, slotIndex: slotIndex });
  }
  function openPickerForSpot(spot) {
    openPickerModal({ day: null, slotIndex: null, spot: spot });
  }
  function openPickerForDay(dayNum, timeFrame) {
    var allowed = { morning: 1, afternoon: 1, evening: 1, flexible: 1, custom: 1 };
    var tf = allowed[timeFrame] ? timeFrame : 'morning';
    openPickerModal({ day: dayNum, slotIndex: null, dayLocked: true, timeFrame: tf });
  }

  /* ============================================================
     Nominatim place search
     ============================================================ */
  var nominatimAbort = null;

  function searchPlaces(query, resultsEl, onSelect) {
    if (!resultsEl || query.trim().length < 3) {
      if (resultsEl) resultsEl.hidden = true;
      return;
    }
    if (nominatimAbort) nominatimAbort.abort();
    nominatimAbort = new AbortController();

    var region = getDayMeta(pickerState.day);
    var viewbox = '';
    if (region && region.region === 'costa-brava') viewbox = '2.5,41.5,3.5,42.2';
    else if (region && region.region === 'barcelona') viewbox = '2.0,41.3,2.3,41.5';
    else viewbox = '2.0,41.2,3.5,42.3';

    var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=6&q=' +
      encodeURIComponent(query) + '&viewbox=' + viewbox + '&bounded=0&addressdetails=1';

    resultsEl.innerHTML = '<p class="place-search-loading">Searching…</p>';
    resultsEl.hidden = false;

    fetch(url, {
      signal: nominatimAbort.signal,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        resultsEl.innerHTML = '';
        if (!data.length) {
          resultsEl.innerHTML = '<p class="place-search-empty">No places found</p>';
          return;
        }
        data.forEach(function (place) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'place-search-item';
          var type = (place.type || place.class || 'place').replace(/_/g, ' ');
          btn.innerHTML =
            '<span class="place-search-item__name">' + escapeHtml(place.display_name.split(',')[0]) + '</span>' +
            '<span class="place-search-item__addr">' + escapeHtml(place.display_name) + '</span>' +
            '<span class="place-search-item__type">' + escapeHtml(type) + '</span>';
          btn.addEventListener('click', function () {
            var spot = nominatimToSpot(place);
            resultsEl.hidden = true;
            var pickerOpen = document.getElementById('picker-modal') && !document.getElementById('picker-modal').hidden;
            if (pickerOpen) {
              pickerState.spot = spot;
              renderPickerGrid();
              renderPickerDaySlot();
              updatePickerConfirm();
            } else if (onSelect) {
              onSelect(spot);
            }
          });
          resultsEl.appendChild(btn);
        });
      })
      .catch(function (err) {
        if (err.name === 'AbortError') return;
        resultsEl.innerHTML = '<p class="place-search-empty">Search unavailable</p>';
      });
  }

  function nominatimToSpot(place) {
    var cat = 'sights';
    var t = (place.type || '').toLowerCase();
    if (t.indexOf('restaurant') >= 0 || t.indexOf('cafe') >= 0 || t.indexOf('bar') >= 0) cat = 'restaurants';
    if (t.indexOf('shop') >= 0 || t.indexOf('store') >= 0) cat = 'shops';
    return {
      name: place.display_name.split(',')[0],
      tags: (place.type || 'place').replace(/_/g, ' '),
      desc: place.display_name,
      cat: cat,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      photos: ['1559339352-11d035aa65de'],
      external: true,
      osmId: place.osm_id
    };
  }

  function initPlaceSearch() {
    var input = document.getElementById('directory-search');
    var results = document.getElementById('place-search-results');
    if (!input || !results) return;

    input.addEventListener('input', debounce(function () {
      var q = input.value.trim();
      var active = document.querySelector('#directory-filters .chip.is-active');
      renderDirectory(active ? active.dataset.filter : 'all', q);

      if (q.length >= 3) {
        searchPlaces(q, results, function (spot) {
          openPickerForSpot(spot);
          input.value = '';
          results.hidden = true;
          renderDirectory(active ? active.dataset.filter : 'all', '');
        });
      } else {
        results.hidden = true;
      }
    }, 400));
  }

  /* ============================================================
     Itinerary rendering — grouped by bucket (morning/afternoon/evening)
     ============================================================ */
  function formatTimeLabel(time) {
    if (!time) return '';
    var t = String(time).trim();
    var upper = t.replace(/\b(am|pm)\b/gi, function (m) { return m.toUpperCase(); });
    var bucket = ['morning', 'afternoon', 'evening', 'late', 'sunset', 'noon', 'all day', 'flex', 'flexible'];
    if (bucket.indexOf(t.toLowerCase()) >= 0) return upper.toUpperCase();
    if (/^(am|pm)$/i.test(t)) return t.toUpperCase();
    return upper.toUpperCase();
  }

  function getDayDateLabel(d) {
    // "Sat · May 30" → "Sat, May 30"
    return d.date.replace(' · ', ', ');
  }

  function bucketSummary(bucket) {
    return {
      morning:   { title: 'Morning',   sub: 'Sun-warmed first hours.',     icon: ICONS.sunrise },
      afternoon: { title: 'Afternoon', sub: 'Coves, plazas, mid-day light.', icon: ICONS.sun },
      evening:   { title: 'Evening',   sub: 'Sunset, dinner, slow walks.',  icon: ICONS.moon }
    }[bucket];
  }

  function hasReservation(a) {
    if (!a) return false;
    if (a.reservation === true) return true;
    var n = (a.notes || '') + ' ' + (a.text || '');
    return /reservation/i.test(n);
  }

  function buildScheduleItem(a, dayNum, idx) {
    var place = a.status === 'confirmed' ? resolvePlace(a) : null;
    var isOpen = a.status === 'open';
    var reserved = hasReservation(a);
    var itemClass = 'schedule-item' +
      (reserved ? ' schedule-item--reserved' : '') +
      (isOpen ? ' schedule-item--open' : '');

    var html =
      '<div class="' + itemClass + '" data-day="' + dayNum + '" data-idx="' + idx + '"' +
        (place ? ' data-has-place="true"' : '') + '>' +
        '<span class="schedule-item__time">' + escapeHtml(formatTimeLabel(a.time)) + '</span>' +
        '<div class="schedule-item__main">' +
          '<button type="button" class="schedule-item__title">' +
            escapeHtml(a.text) +
          '</button>' +
          (a.notes ? '<span class="schedule-item__note">' + escapeHtml(a.notes) + '</span>' : '') +
        '</div>' +
      '</div>';
    return { html: html, place: place };
  }

  function renderScheduleSection(bucket, day, items) {
    var meta = bucketSummary(bucket);

    var rows = items.map(function (it) {
      return buildScheduleItem(it.act, day.day, it.index);
    });

    var addBtnHtml =
      '<button type="button" class="schedule__add" data-open-day="' + day.day + '" data-open-bucket="' + bucket + '">' +
        ICONS.plus +
        '<span class="schedule__add-label">Add activity</span>' +
      '</button>';

    var html =
      '<div class="schedule__section schedule__section--' + bucket + (rows.length ? '' : ' schedule__section--empty') + '" data-bucket="' + bucket + '">' +
        '<div class="schedule__icon">' + meta.icon + '</div>' +
        '<div class="schedule__col">' +
          '<div class="schedule__header">' +
            '<h4 class="schedule__title">' + escapeHtml(meta.title) + '</h4>' +
          '</div>' +
          rows.map(function (r) { return r.html; }).join('') +
          addBtnHtml +
        '</div>' +
      '</div>';

    return { html: html, places: rows.map(function (r) { return r.place; }) };
  }

  function refreshDayCard(dayNum) {
    var d = getDayMeta(dayNum);
    var art = document.getElementById('day-' + dayNum);
    if (!art || !d) return;
    art.outerHTML = renderDayHtml(d);
    bindDayCard(document.getElementById('day-' + dayNum), d);
  }

  function renderDayHtml(d) {
    var buckets = { morning: [], afternoon: [], evening: [] };
    d.activities.forEach(function (a, i) {
      buckets[getTimeBucket(a.time)].push({ act: a, index: i });
    });
    Object.keys(buckets).forEach(function (key) {
      buckets[key].sort(function (a, b) {
        return sortKey(a.act.time) - sortKey(b.act.time);
      });
    });

    var sections = '';
    ['morning', 'afternoon', 'evening'].forEach(function (key) {
      sections += renderScheduleSection(key, d, buckets[key]).html;
    });

    var hasMap = DAY_STOPS[d.day] && DAY_STOPS[d.day].length;
    var foot =
      '<div class="day-card__foot">' +
        (hasMap ? '<button type="button" class="btn btn--icon-sm" data-goto-map="' + d.day + '">' + ICONS.pin + ' View on map</button>' : '<span></span>') +
        '<button type="button" class="btn" data-add-day="' + d.day + '">' + ICONS.plus + ' Add</button>' +
      '</div>';

    return (
      '<article class="day-card" id="day-' + d.day + '">' +
        '<div class="day-card__visual">' +
          '<div class="day-card__fallback" data-fallback></div>' +
          '<div class="day-card__img" data-img></div>' +
          '<span class="day-card__tag">' + escapeHtml(d.region.replace('-', ' ')) + '</span>' +
        '</div>' +
        '<div class="day-card__body">' +
          '<header class="day-card__head">' +
            '<span class="day-card__date">' + escapeHtml(getDayDateLabel(d)) + '</span>' +
            '<h3 class="day-card__loc">' + escapeHtml(d.location) + '</h3>' +
          '</header>' +
          '<div class="schedule">' + sections + '</div>' +
          foot +
        '</div>' +
      '</article>'
    );
  }

  function bindDayCard(art, d) {
    if (!art) return;

    loadPhoto(art.querySelector('.day-card__visual'), d.photos, 'day-' + d.day, 1200);

    art.querySelectorAll('.schedule-item__title').forEach(function (el) {
      var item = el.closest('.schedule-item');
      if (!item) return;
      var idx = parseInt(item.dataset.idx, 10);
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var act = d.activities[idx];
        if (act && act.status === 'open') {
          openPickerForSlot(d.day, idx);
        } else {
          openEditSheet(d.day, idx);
        }
      });
    });

    art.querySelectorAll('.schedule__add').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dayN = parseInt(btn.dataset.openDay, 10);
        var bucket = btn.dataset.openBucket;
        openPickerForDay(dayN, bucket);
      });
    });

    var mapBtn = art.querySelector('[data-goto-map]');
    if (mapBtn) {
      mapBtn.addEventListener('click', function () {
        var dn = parseInt(mapBtn.dataset.gotoMap, 10);
        if (DAY_STOPS[dn] && DAY_STOPS[dn].length) {
          openMapModal(dn);
        }
      });
    }
    var addBtn = art.querySelector('[data-add-day]');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var dn = parseInt(addBtn.dataset.addDay, 10);
        openPickerForDay(dn);
      });
    }
  }

  function renderItinerary() {
    var list = document.getElementById('itinerary-list');
    if (!list) return;
    list.innerHTML = ITINERARY.map(function (d) { return renderDayHtml(d); }).join('');
    ITINERARY.forEach(function (d) {
      bindDayCard(document.getElementById('day-' + d.day), d);
    });
  }

  /* ============================================================
     Directory rendering
     ============================================================ */
  function renderDirectory(filter, query) {
    filter = filter || 'all';
    query = (query || '').trim().toLowerCase();
    var grid = document.getElementById('directory-grid');
    var empty = document.getElementById('directory-empty');
    if (!grid) return;

    var items = filterDirectoryItems(filter, query);
    grid.innerHTML = '';
    if (empty) empty.hidden = items.length > 0;

    items.forEach(function (s) {
      var card = document.createElement('article');
      card.className = 'dir-card';
      var listTag = s.list ? '<span class="dir-card__list">' + escapeHtml(LIST_LABELS[s.list] || s.list) + '</span>' : '';
      card.innerHTML =
        '<div class="dir-card__img-wrap">' +
          '<div class="dir-card__fallback" data-fallback></div>' +
          '<div class="dir-card__img" data-img></div>' +
        '</div>' +
        '<div class="dir-card__body">' +
          listTag +
          '<h3 class="dir-card__name">' + escapeHtml(s.name) + '</h3>' +
          '<p class="dir-card__tags">' + escapeHtml(s.tags) + '</p>' +
          '<p class="dir-card__desc">' + escapeHtml(s.desc) + '</p>' +
          '<div class="dir-card__actions">' +
            '<button type="button" class="btn spot-add">Add to day</button>' +
            (s.lat ? '<button type="button" class="btn spot-map">On map</button>' : '') +
          '</div>' +
        '</div>';
      loadPhoto(card.querySelector('.dir-card__img-wrap'), s.photos, 'spot-' + s.name, 600);
      card.querySelector('.spot-add').addEventListener('click', function () { openPickerForSpot(s); });
      var mapBtn = card.querySelector('.spot-map');
      if (mapBtn && s.lat) {
        mapBtn.addEventListener('click', function () {
          var bestDay = s.list === 'costa-brava' ? 6 : 4;
          if (!DAY_STOPS[bestDay]) bestDay = 5;
          setMapDay(bestDay);
          document.getElementById('map-explorer').scrollIntoView({ behavior: 'smooth' });
          setTimeout(function () {
            if (routeMap) routeMap.flyTo([s.lat, s.lng], 16, { duration: 0.8 });
          }, 400);
        });
      }
      grid.appendChild(card);
    });
  }

  /* ============================================================
     Mobile nav toggle
     ============================================================ */
  function initMobileNav() {
    var toggle = document.getElementById('site-nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function closeNav() {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
    });
  }

  /* ============================================================
     Init
     ============================================================ */
  function init() {
    PLACES_INDEX = buildPlacesIndex();
    syncHeaderOffset();
    syncAppVh();
    window.addEventListener('resize', function () {
      syncHeaderOffset();
      syncAppVh();
    });
    window.addEventListener('orientationchange', syncAppVh);
    initMobileNav();
    initPlaceSheet();
    initDayJumper();
    initRouteMap();
    initMapModal();
    rebuildItineraryState();
    initEditSheet();
    renderItinerary();
    initItineraryScrollSpy();
    initPickerModal();
    initPlaceSearch();
    renderDirectory('all', '');

    syncFromCloud();
    subscribeToSharedState();

    document.querySelectorAll('#directory-filters .chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#directory-filters .chip').forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        var search = document.getElementById('directory-search');
        renderDirectory(btn.dataset.filter, search ? search.value : '');
      });
    });

    window.addEventListener('resize', function () {
      if (routeMap) routeMap.invalidateSize();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
