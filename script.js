/* Itinerario · ESP 25 */
(function () {
  'use strict';

  var UNSPLASH = function (id, w) {
    return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 800) + '&q=80';
  };

  var GRADIENTS = [
    'linear-gradient(135deg, #c5d4de 0%, #6b8494 100%)',
    'linear-gradient(135deg, #dce4ea 0%, #8fa3b0 100%)',
    'linear-gradient(160deg, #a8bcc8 0%, #4a6270 100%)',
  ];

  var TIME_LABELS = {
    morning: 'Morning · 9–12',
    afternoon: 'Afternoon · 12–5',
    evening: 'Evening · 5–10',
    flexible: 'Flexible',
    custom: 'Custom time'
  };

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
      var args = arguments;
      var ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  /* ——— Itinerary data ——— */
  var ITINERARY = [
    { day: 1, date: 'Thu · May 29', location: 'New York City', region: 'departure', hint: 'A red-eye east.', caption: 'JFK → BCN',
      photos: ['1500916434205-0c77489c6cf7', '1538332576228-eb5b4c4de6f5'],
      activities: [{ time: 'evening', text: 'Red-eye flight departs NYC.', status: 'confirmed', notes: 'Hanna & Katie — sleep if you can.' }] },
    { day: 2, date: 'Fri · May 30', location: 'Barcelona', region: 'barcelona', hint: 'Wheels down.', caption: 'Eixample',
      photos: ['1583422409516-2895a77efded', '1735424325493-7dec695219c4'],
      activities: [
        { time: '7:00am', text: 'Hanna & Katie land in Barcelona.', status: 'confirmed', notes: 'Taxi to city ~30 min.' },
        { time: 'noon', text: 'Check in to Aspasios Rambla Catalonia.', status: 'confirmed', notes: 'Rambla de Catalunya 21.' },
        { time: 'pm', text: 'Open afternoon and evening.', status: 'open', notes: 'Gràcia walk, vermut, tapas.' }
      ] },
    { day: 3, date: 'Sat · May 31', location: 'Barcelona', region: 'barcelona', hint: 'Three become one.', caption: 'El Born',
      photos: ['1565599837634-134bc3aadce8', '1625938144755-652e08e359b7'],
      activities: [
        { time: 'am', text: 'Open morning and afternoon.', status: 'open', notes: 'Gothic Quarter, Boqueria.' },
        { time: 'pm', text: 'Sunny arrives.', status: 'confirmed', notes: 'Meet at apartment.' },
        { time: '7:00pm', text: 'Dinner at Bodega La Puntual.', status: 'confirmed', notes: 'Reservation Hanna.' }
      ] },
    { day: 4, date: 'Sun · Jun 1', location: 'Barcelona', region: 'barcelona', hint: 'Gaudí & the old city.', caption: 'Barri Gòtic',
      photos: ['1555156801-0366d40d4402', '1644144974835-61c2c13c79c5'],
      activities: [
        { time: '10:00am', text: 'Gothic & Gaudí Walking Tour.', status: 'confirmed', notes: 'Plaça de Catalunya.' },
        { time: 'pm', text: 'Open afternoon and evening.', status: 'open', notes: 'Park Güell, Bunkers.' }
      ] },
    { day: 5, date: 'Mon · Jun 2', location: 'Costa Brava', region: 'costa-brava', hint: 'North by car.', caption: 'Begur',
      photos: ['1612088099701-21ed5b5529f3', '1564818804911-58cfd9b18711'],
      activities: [
        { time: 'am', text: 'Car rental → Costa Brava.', status: 'confirmed', notes: 'AP-7 north ~1.5 hr.' },
        { time: 'pm', text: 'Check in to Mas Ses Vinyes.', status: 'confirmed', notes: 'Hotel above Begur.' },
        { time: 'pm', text: "Platja d'Aiguablava.", status: 'open', notes: 'Late afternoon cove.' },
        { time: 'sunset', text: 'Begur Castle at sunset.', status: 'open', notes: 'Short climb.' },
        { time: 'late', text: 'Dinner at Begurio.', status: 'confirmed', notes: 'Reservation Katie.' }
      ] },
    { day: 6, date: 'Tue · Jun 3', location: 'Costa Brava', region: 'costa-brava', hint: 'A day for the coves.', caption: 'Sa Tuna',
      photos: ['1597227303804-5fdea496a79a', '1709483076573-62bf0f80ea1a'],
      activities: [
        { time: 'all day', text: "Beach day — Sa Riera, Illa Roja, Sa Tuna.", status: 'open', notes: 'Water shoes.' },
        { time: '8:00pm', text: 'Dinner at Restaurant Ses Vinyes.', status: 'confirmed', notes: 'On-property.' }
      ] },
    { day: 7, date: 'Wed · Jun 4', location: 'Costa Brava', region: 'costa-brava', hint: 'Sea caves.', caption: 'Tossa de Mar',
      photos: ['1578686157802-e2c2550cacc2', '1559128010-7c1ad6e1b6a5'],
      activities: [
        { time: '9:00am', text: 'Kayak & snorkel — Tossa de Mar.', status: 'confirmed', notes: '3-hour tour.' },
        { time: 'pm', text: 'Cala Pola & Marimurtra garden.', status: 'open', notes: 'Blanes afternoon.' }
      ] },
    { day: 8, date: 'Thu · Jun 5', location: 'Costa Brava', region: 'costa-brava', hint: 'Last coast day.', caption: 'Girona',
      photos: ['1571939228382-b2f2b585ce15', '1681849615791-9e2c2166c4aa'],
      activities: [
        { time: 'am', text: 'Morning at Platja Fonda.', status: 'open', notes: 'Breakfast pastries.' },
        { time: 'pm', text: 'Day trip to Girona.', status: 'open', notes: 'Medieval walls.' }
      ] },
    { day: 9, date: 'Fri · Jun 6', location: 'Barcelona', region: 'barcelona', hint: 'Home.', caption: 'BCN → JFK',
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

  var DIRECTORY = window.DIRECTORY_DATA || [];
  var CAT_LABELS = { restaurants: 'Eat & drink', shops: 'Shops', sights: 'Sights' };
  var LIST_LABELS = { barcelona: 'Barcelona list', 'costa-brava': 'Costa Brava list' };
  var LEGACY_LINKS_KEY = 'itinerario-spot-links';
  var ADDED_KEY = 'itinerario-added-activities';
  var EDITS_KEY = 'itinerario-edits';

  /* Known venues — map stops, directory, and address-like notes */
  var PLACES_INDEX = {};

  function buildPlacesIndex() {
    var idx = {};
    Object.keys(DAY_STOPS).forEach(function (day) {
      (DAY_STOPS[day] || []).forEach(function (stop) {
        idx[normalizePlaceKey(stop.name)] = {
          name: stop.name,
          address: stop.desc || stop.name,
          lat: stop.lat,
          lng: stop.lng
        };
      });
    });
    DIRECTORY.forEach(function (s) {
      if (!s.lat) return;
      idx[normalizePlaceKey(s.name)] = {
        name: s.name,
        address: s.desc || s.tags || s.name,
        lat: s.lat,
        lng: s.lng
      };
    });
    [
      { keys: ['aspasios', 'rambla catalonia'], name: 'Aspasios Rambla Catalonia', address: 'Rambla de Catalunya 21, Barcelona', lat: 41.3905, lng: 2.1660 },
      { keys: ['bodega la puntual', 'puntual'], name: 'Bodega La Puntual', address: 'El Born, Barcelona', lat: 41.3855, lng: 2.1820 },
      { keys: ['begurio'], name: 'Begurio', address: 'Begur, Costa Brava', lat: 41.9544, lng: 3.2076 },
      { keys: ['gothic', 'gaudí walking', 'gaudi walking'], name: 'Gothic & Gaudí Walking Tour', address: 'Plaça de Catalunya, Barcelona', lat: 41.3833, lng: 2.1764 },
      { keys: ['tossa de mar', 'kayak'], name: 'Tossa de Mar Kayak', address: 'Tossa de Mar, Costa Brava', lat: 41.7196, lng: 2.9320 },
      { keys: ['el prat', 'bcn'], name: 'Barcelona El Prat', address: 'Barcelona–El Prat Airport (BCN)', lat: 41.2974, lng: 2.0833 }
    ].forEach(function (p) {
      p.keys.forEach(function (k) {
        idx[k] = { name: p.name, address: p.address, lat: p.lat, lng: p.lng };
      });
    });
    return idx;
  }

  function normalizePlaceKey(str) {
    return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
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

    var best = null;
    var bestLen = 0;
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
        lat: best.lat,
        lng: best.lng
      };
    }

    if (looksLikeAddress(notes)) {
      var label = text.replace(/\.\s*$/, '').replace(/^(check in to|dinner at|morning at|day trip to)\s+/i, '');
      return {
        name: label || text,
        address: notes,
        query: notes + ', Spain'
      };
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

  function openPlaceSheet(place) {
    var sheet = document.getElementById('place-sheet');
    if (!sheet || !place) return;
    document.getElementById('place-sheet-name').textContent = place.name;
    document.getElementById('place-sheet-address').textContent = place.address || '';
    var mapsLink = document.getElementById('place-sheet-maps');
    mapsLink.href = mapsUrlForPlace(place);
    sheet.hidden = false;
    sheet.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      sheet.classList.add('is-open');
    });
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
    }, 350);
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

  function syncHeaderOffset() {
    var header = document.querySelector('.site-header');
    if (header) {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }
  }

  function attachPlaceTrigger(el, place) {
    if (!el || !place) return;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openPlaceSheet(place);
    });
  }

  /* ——— Map explorer ——— */
  var routeMap = null;
  var routeLayer = null;
  var markersLayer = null;
  var mapMarkers = [];
  var activeMapDay = 5;
  var activeStopIndex = 0;

  function getTravelDays() {
    return ITINERARY.filter(function (d) { return d.day; });
  }

  function getDayMeta(dayNum) {
    return ITINERARY.find(function (d) { return d.day === dayNum; });
  }

  function getOpenSlotsForDay(dayNum) {
    var day = getDayMeta(dayNum);
    if (!day || !day.activities) return [];
    return day.activities.map(function (act, index) {
      return { act: act, index: index };
    }).filter(function (x) { return x.act.status === 'open'; });
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
      iconSize: [88, 96],
      iconAnchor: [44, 48]
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

    var title = meta.location;
    if (dayNum === 6) title = 'Begur Calas + Sa Tuna';
    if (dayNum === 5) title = 'Begur & First Coves';

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
          '<button type="button" class="btn btn--solid btn--sm" id="map-open-route">Open route</button>' +
          '<button type="button" class="btn btn--outline btn--sm" id="map-scroll-day">View day card ↓</button>' +
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
        var a = stops[0];
        var b = stops[stops.length - 1];
        window.open(
          'https://www.google.com/maps/dir/?api=1&origin=' + a.lat + ',' + a.lng +
          '&destination=' + b.lat + ',' + b.lng + '&travelmode=driving', '_blank'
        );
      });
    } else if (routeBtn && stops.length === 1) {
      routeBtn.addEventListener('click', function () {
        window.open('https://www.google.com/maps/search/?api=1&query=' + stops[0].lat + ',' + stops[0].lng, '_blank');
      });
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
        '<span style="font-size:11px;color:#5c4a3a">' + escapeHtml(stop.time) + ' · ' + escapeHtml(stop.category) + '</span>'
      );
      marker.on('click', function () { focusStop(i); });
      marker.addTo(markersLayer);
      mapMarkers.push(marker);
    });

    if (latlngs.length > 1) {
      L.polyline(latlngs, { color: '#2563eb', weight: 4, opacity: 0.85, lineJoin: 'round' }).addTo(routeLayer);
      routeMap.fitBounds(latlngs, { padding: [60, 60], maxZoom: 14 });
    } else if (latlngs.length === 1) {
      routeMap.setView(latlngs[0], 14);
    } else {
      routeMap.setView([41.39, 2.17], 12);
    }

    renderMapPanel(dayNum);
    if (stops.length) focusStop(0);
  }

  function initRouteMap() {
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

    var tabs = document.getElementById('map-day-tabs');
    if (tabs) {
      [2, 3, 4, 5, 6, 7, 8, 9].forEach(function (d) {
        var tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'map-day-tab' + (d === 5 ? ' is-active' : '');
        tab.dataset.day = d;
        tab.setAttribute('role', 'tab');
        tab.textContent = 'Day ' + d;
        tab.addEventListener('click', function () { setMapDay(d); });
        tabs.appendChild(tab);
      });
    }

    setMapDay(5);
    setTimeout(function () { routeMap.invalidateSize(); }, 200);
  }

  function initDayJumper() {
    var wrap = document.getElementById('day-jumper-buttons');
    if (!wrap) return;
    getTravelDays().forEach(function (d) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'day-jump';
      btn.dataset.day = d.day;
      btn.innerHTML = '<span class="day-jump__num">' + String(d.day).padStart(2, '0') + '</span>' +
        '<span class="day-jump__loc">' + escapeHtml(d.location.split(' ')[0]) + '</span>';
      btn.addEventListener('click', function () {
        var dayNum = d.day;
        if (DAY_STOPS[dayNum] && DAY_STOPS[dayNum].length) {
          setMapDay(dayNum);
          document.getElementById('map-explorer').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        var el = document.getElementById('day-' + dayNum);
        if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
      });
      wrap.appendChild(btn);
    });
  }

  /* ——— Itinerary persistence (adds, edits, legacy migrate) ——— */
  function loadJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (e) { return fallback; }
  }

  function saveJson(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  }

  function loadAddedActivities() {
    return loadJson(ADDED_KEY, []);
  }

  function saveAddedActivities(list) {
    saveJson(ADDED_KEY, list);
  }

  function loadEdits() {
    return loadJson(EDITS_KEY, {});
  }

  function saveEdits(edits) {
    saveJson(EDITS_KEY, edits);
  }

  function loadLegacyLinks() {
    return loadJson(LEGACY_LINKS_KEY, []);
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

  function timeSortScore(timeStr) {
    var t = String(timeStr || '').toLowerCase();
    if (t.indexOf('7') === 0 && t.indexOf('am') >= 0) return 70;
    if (t === 'am' || t.indexOf('morning') >= 0) return 85;
    if (t.indexOf('10') >= 0 && t.indexOf('am') >= 0) return 100;
    if (t === 'noon') return 120;
    if (t.indexOf('2') >= 0 && t.indexOf('pm') >= 0) return 140;
    if (t === 'pm' || t.indexOf('afternoon') >= 0) return 150;
    if (t.indexOf('all day') >= 0) return 130;
    if (t.indexOf('7') >= 0 && t.indexOf('pm') >= 0) return 190;
    if (t === 'sunset') return 200;
    if (t === 'late') return 210;
    if (t.indexOf('evening') >= 0) return 185;
    if (t.indexOf('8') >= 0 && t.indexOf('pm') >= 0) return 205;
    return 160;
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
    var newScore = timeSortScore(newAct.time);
    var insertAt = openSlotIndex;
    for (var i = openSlotIndex - 1; i >= 0; i--) {
      if (timeSortScore(day.activities[i].time) <= newScore) {
        insertAt = i + 1;
        break;
      }
      insertAt = i;
    }
    return insertAt;
  }

  function applyEditsToItinerary() {
    var edits = loadEdits();
    ITINERARY.forEach(function (d) {
      d.activities.forEach(function (a) {
        var e = edits[a.id];
        if (!e) return;
        if (e.time != null) a.time = e.time;
        if (e.text != null) a.text = e.text;
        if (e.notes != null) a.notes = e.notes;
      });
    });
  }

  function applyAddedActivities() {
    var added = loadAddedActivities();
    added.sort(function (a, b) {
      if (a.day !== b.day) return a.day - b.day;
      return timeSortScore(a.activity.time) - timeSortScore(b.activity.time);
    });
    added.forEach(function (entry) {
      var day = getDayMeta(entry.day);
      if (!day) return;
      var openIdx = -1;
      if (entry.openSlotId) {
        openIdx = day.activities.findIndex(function (a) { return a.id === entry.openSlotId; });
      }
      if (openIdx < 0) openIdx = entry.openSlotIndex;
      if (openIdx < 0 || !day.activities[openIdx] || day.activities[openIdx].status !== 'open') return;
      var act = JSON.parse(JSON.stringify(entry.activity));
      if (!act.id) act.id = entry.id;
      if (day.activities.some(function (a) { return a.id === act.id; })) return;
      var insertAt = findInsertIndex(day, act, openIdx);
      day.activities.splice(insertAt, 0, act);
    });
  }

  function migrateLegacyLinks() {
    var legacy = loadLegacyLinks();
    var added = loadAddedActivities();
    var newAdds = [];
    var changed = false;

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
          changed = true;
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
      changed = true;
    });

    if (newAdds.length) {
      saveAddedActivities(added.concat(newAdds));
      saveJson(LEGACY_LINKS_KEY, []);
      changed = true;
    }
    return changed;
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
        name: spot.name,
        address: spot.desc || spot.tags || spot.name,
        lat: spot.lat,
        lng: spot.lng
      };
    }

    var added = loadAddedActivities();
    added.push({
      id: newAct.id,
      day: dayNum,
      openSlotIndex: activityIndex,
      openSlotId: openAct.id,
      activity: JSON.parse(JSON.stringify(newAct))
    });
    saveAddedActivities(added);

    var insertAt = findInsertIndex(day, newAct, activityIndex);
    day.activities.splice(insertAt, 0, newAct);
    refreshDayCard(dayNum);
  }

  function removeAddedActivity(activityId) {
    var added = loadAddedActivities().filter(function (a) {
      return a.id !== activityId && a.activity.id !== activityId;
    });
    saveAddedActivities(added);
    rebuildItineraryState();
  }

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
    document.getElementById('edit-delete').hidden = !act.isAdded;

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
    }, 350);
  }

  function saveEditSheet() {
    if (!editState.activityId) return;
    var patch = {
      time: document.getElementById('edit-time').value.trim(),
      text: document.getElementById('edit-text').value.trim(),
      notes: document.getElementById('edit-notes').value.trim()
    };
    var edits = loadEdits();
    edits[editState.activityId] = patch;
    saveEdits(edits);

    var added = loadAddedActivities();
    var addEntry = added.find(function (a) {
      return a.id === editState.activityId || (a.activity && a.activity.id === editState.activityId);
    });
    if (addEntry) {
      addEntry.activity.time = patch.time;
      addEntry.activity.text = patch.text;
      addEntry.activity.notes = patch.notes;
      saveAddedActivities(added);
      rebuildItineraryState();
      renderItinerary();
    } else {
      var day = getDayMeta(editState.day);
      var act = day && day.activities[editState.index];
      if (act) {
        act.time = patch.time;
        act.text = patch.text;
        act.notes = patch.notes;
      }
      refreshDayCard(editState.day);
    }
    closeEditSheet();
  }

  function deleteEditSheet() {
    if (!editState.activityId) return;
    removeAddedActivity(editState.activityId);
    var edits = loadEdits();
    delete edits[editState.activityId];
    saveEdits(edits);
    closeEditSheet();
    renderItinerary();
  }

  function initEditSheet() {
    var sheet = document.getElementById('edit-sheet');
    if (!sheet) return;
    sheet.querySelectorAll('[data-edit-close]').forEach(function (el) {
      el.addEventListener('click', closeEditSheet);
    });
    document.getElementById('edit-save').addEventListener('click', saveEditSheet);
    document.getElementById('edit-delete').addEventListener('click', deleteEditSheet);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) closeEditSheet();
    });
  }

  function attachEditButton(parent, dayNum, idx) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'schedule-item__edit';
    btn.textContent = 'Edit';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openEditSheet(dayNum, idx);
    });
    parent.appendChild(btn);
    return btn;
  }

  /* ——— Picker modal ——— */
  var pickerState = {
    day: null,
    slotIndex: null,
    spot: null,
    timeFrame: 'morning',
    customTime: '',
    filter: 'all',
    query: ''
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

    var modal = document.getElementById('picker-modal');
    if (!modal) return;

    var day = pickerState.day != null ? getDayMeta(pickerState.day) : null;
    var slot = day && pickerState.slotIndex != null ? day.activities[pickerState.slotIndex] : null;

    document.getElementById('picker-kicker').textContent = slot
      ? 'Day ' + String(pickerState.day).padStart(2, '0') + ' · Open window'
      : pickerState.spot ? 'Add to itinerary' : 'Fill an open window';
    document.getElementById('picker-title').textContent =
      slot ? slot.text : (pickerState.spot ? pickerState.spot.name : 'Add a spot');

    var ctx = '';
    if (day && slot) {
      ctx = day.date + ' · ' + day.location + (slot.notes ? ' — ' + slot.notes : '');
    } else if (pickerState.spot) {
      ctx = (pickerState.spot.tags || '') + (pickerState.spot.desc ? ' — ' + pickerState.spot.desc : '');
    }
    document.getElementById('picker-context').textContent = ctx;

    document.querySelectorAll('.time-frame').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.time === pickerState.timeFrame);
    });
    document.getElementById('custom-time-wrap').hidden = pickerState.timeFrame !== 'custom';
    document.getElementById('picker-search').value = '';
    document.getElementById('picker-search-results').hidden = true;

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
    btn.disabled = !(pickerState.spot && pickerState.day != null && pickerState.slotIndex != null);
  }

  function renderPickerDaySlot() {
    var daySection = document.getElementById('picker-day-section');
    var slotSection = document.getElementById('picker-slot-section');
    var daysEl = document.getElementById('picker-days');
    var slotsEl = document.getElementById('picker-slots');
    var needsDay = pickerState.slotIndex == null;

    if (daySection) daySection.hidden = !needsDay;
    if (slotSection) slotSection.hidden = !needsDay || pickerState.day == null;

    if (!needsDay || !daysEl) return;

    daysEl.innerHTML = '';
    getTravelDays().forEach(function (d) {
      var openCount = getOpenSlotsForDay(d.day).length;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'picker-day' + (pickerState.day === d.day ? ' is-selected' : '');
      btn.disabled = openCount === 0;
      btn.innerHTML =
        '<span class="picker-day__num">' + String(d.day).padStart(2, '0') + '</span>' +
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

    if (!slotsEl || pickerState.day == null) {
      if (slotsEl) slotsEl.innerHTML = '';
      return;
    }

    slotsEl.innerHTML = '';
    getOpenSlotsForDay(pickerState.day).forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'picker-slot' + (pickerState.slotIndex === item.index ? ' is-selected' : '');
      btn.innerHTML =
        '<span class="picker-slot__time">' + escapeHtml(item.act.time || 'flex') + '</span>' +
        '<span class="picker-slot__text">' + escapeHtml(item.act.text) + '</span>';
      btn.addEventListener('click', function () {
        pickerState.slotIndex = item.index;
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
    var items = filterDirectoryItems(pickerState.filter, pickerState.query);
    grid.innerHTML = '';

    if (!items.length) {
      grid.innerHTML = '<p class="picker-empty">No saved places match. Search above for any location.</p>';
      return;
    }

    items.forEach(function (s) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'picker-spot' + (pickerState.spot && pickerState.spot.name === s.name ? ' is-selected' : '');
      btn.innerHTML =
        '<span class="picker-spot__name">' + escapeHtml(s.name) + '</span>' +
        '<span class="picker-spot__meta">' + escapeHtml(s.tags || '') + '</span>';
      btn.addEventListener('click', function () {
        pickerState.spot = s;
        renderPickerGrid();
        renderPickerDaySlot();
        updatePickerConfirm();
      });
      grid.appendChild(btn);
    });
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

    document.getElementById('picker-confirm').addEventListener('click', function () {
      if (!pickerState.spot || pickerState.day == null || pickerState.slotIndex == null) return;
      var tf = pickerState.timeFrame;
      if (tf === 'custom') {
        pickerState.customTime = document.getElementById('custom-time').value || '';
        tf = 'custom';
      }
      applySpotLink(pickerState.day, pickerState.slotIndex, pickerState.spot, tf, pickerState.customTime);
      closePickerModal();
      var el = document.getElementById('day-' + pickerState.day);
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

  /* ——— Nominatim place search ——— */
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
    if (region && region.region === 'costa-brava') {
      viewbox = '2.5,41.5,3.5,42.2';
    } else if (region && region.region === 'barcelona') {
      viewbox = '2.0,41.3,2.3,41.5';
    } else {
      viewbox = '2.0,41.2,3.5,42.3';
    }

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

  /* ——— Itinerary rendering ——— */
  function scheduleTimeLabel(time) {
    if (!time) return '';
    return String(time).replace(/\b(am|pm|noon|sunset|late)\b/gi, function (m) { return m.toLowerCase(); });
  }

  function renderActivity(a, dayNum, idx) {
    var li = document.createElement('li');
    li.className = 'schedule-item schedule-item--' + a.status;
    li.dataset.day = dayNum;
    li.dataset.activityIndex = idx;

    var timeHtml = a.time
      ? '<span class="schedule-item__time">' + escapeHtml(scheduleTimeLabel(a.time)) + '</span>'
      : '<span class="schedule-item__time"></span>';

    if (a.status === 'open') {
      var openRow = document.createElement('div');
      openRow.className = 'schedule-item__open-row';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'schedule-item__fill';
      btn.innerHTML =
        timeHtml +
        '<span class="schedule-item__main">' +
          '<span class="schedule-item__title">' + escapeHtml(a.text) + '</span>' +
          (a.notes ? '<span class="schedule-item__suggest">' + escapeHtml(a.notes) + '</span>' : '') +
        '</span>';
      btn.addEventListener('click', function () {
        openPickerForSlot(dayNum, idx);
      });
      openRow.appendChild(btn);
      attachEditButton(openRow, dayNum, idx);
      li.appendChild(openRow);
      return li;
    }

    var place = resolvePlace(a);
    var titleHtml = place
      ? '<button type="button" class="schedule-item__title schedule-item__title--place">' + escapeHtml(a.text) + '</button>'
      : '<span class="schedule-item__title">' + escapeHtml(a.text) + '</span>';
    var row = document.createElement('div');
    row.className = 'schedule-item__row';
    row.innerHTML =
      '<span class="schedule-item__time">' + (a.time ? escapeHtml(scheduleTimeLabel(a.time)) : '') + '</span>' +
      '<div class="schedule-item__main">' + titleHtml +
        (a.notes ? '<span class="schedule-item__note">' + escapeHtml(a.notes) + '</span>' : '') +
      '</div>';
    attachEditButton(row, dayNum, idx);
    if (place) attachPlaceTrigger(row.querySelector('.schedule-item__title--place'), place);
    li.appendChild(row);
    return li;
  }

  function findOpenSlotIndex(dayNum, openSlotId) {
    var day = getDayMeta(dayNum);
    if (!day) return 0;
    var idx = day.activities.findIndex(function (a) { return a.id === openSlotId; });
    return idx >= 0 ? idx : 0;
  }

  function refreshDayCard(dayNum) {
    var art = document.getElementById('day-' + dayNum);
    if (!art) return;
    var d = getDayMeta(dayNum);
    if (!d) return;

    var ul = art.querySelector('.schedule');
    if (ul) {
      ul.innerHTML = '';
      d.activities.forEach(function (a, i) { ul.appendChild(renderActivity(a, d.day, i)); });
    }
  }

  function renderDay(d) {
    var art = document.createElement('article');
    art.className = 'day-card';
    art.id = 'day-' + d.day;
    art.innerHTML =
      '<div class="day-card__visual">' +
        '<div class="day-card__fallback" data-fallback></div>' +
        '<div class="day-card__img" data-img></div>' +
        '<span class="day-card__tag">' + escapeHtml(d.region.replace('-', ' ')) + '</span>' +
      '</div>' +
      '<div class="day-card__body">' +
        '<header class="day-card__head">' +
          '<span class="day-card__num">Day ' + String(d.day).padStart(2, '0') + '</span>' +
          '<span class="day-card__date">' + escapeHtml(d.date) + '</span>' +
          '<h3 class="day-card__loc">' + escapeHtml(d.location) + '</h3>' +
          '<p class="day-card__hint">' + escapeHtml(d.hint) + '</p>' +
        '</header>' +
        '<ol class="schedule"></ol>' +
        '<button type="button" class="btn btn--outline btn--sm day-card__map-btn" data-goto-map="' + d.day + '">View on map</button>' +
      '</div>';

    var ul = art.querySelector('.schedule');
    d.activities.forEach(function (a, i) { ul.appendChild(renderActivity(a, d.day, i)); });

    loadPhoto(art.querySelector('.day-card__visual'), d.photos, 'day-' + d.day);
    art.querySelector('.day-card__map-btn').addEventListener('click', function () {
      var dn = parseInt(this.dataset.gotoMap, 10);
      if (DAY_STOPS[dn] && DAY_STOPS[dn].length) {
        setMapDay(dn);
        document.getElementById('map-explorer').scrollIntoView({ behavior: 'smooth' });
      }
    });
    return art;
  }

  function renderItinerary() {
    var list = document.getElementById('itinerary-list');
    if (!list) return;
    list.innerHTML = '';
    ITINERARY.forEach(function (d) { list.appendChild(renderDay(d)); });
  }

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
          '<span class="dir-card__cat">' + escapeHtml(CAT_LABELS[s.cat] || s.cat) + '</span>' +
        '</div>' +
        '<div class="dir-card__body">' +
          listTag +
          '<h3 class="dir-card__name">' + escapeHtml(s.name) + '</h3>' +
          '<p class="dir-card__tags">' + escapeHtml(s.tags) + '</p>' +
          '<p class="dir-card__desc">' + escapeHtml(s.desc) + '</p>' +
          '<div class="dir-card__actions">' +
            '<button type="button" class="btn btn--solid btn--sm spot-add">Add to day</button>' +
            (s.lat ? '<button type="button" class="btn btn--outline btn--sm spot-map">On map</button>' : '') +
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

  function init() {
    PLACES_INDEX = buildPlacesIndex();
    syncHeaderOffset();
    window.addEventListener('resize', syncHeaderOffset);
    initPlaceSheet();
    initDayJumper();
    initRouteMap();
    rebuildItineraryState();
    initEditSheet();
    renderItinerary();
    initPickerModal();
    initPlaceSearch();
    renderDirectory('all', '');

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
