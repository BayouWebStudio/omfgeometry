/* OMF Monolith | shared partials & helpers
   Renders the masthead and footer into [data-masthead] / [data-colophon].
   Loads artist data and exposes window.OMF.{artists, byCountry, byCity, helpers}.
*/
(function(){
  const IMG_BASE = '';
  const ROOT = '/';

  function el(html){ const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }

  function renderMasthead(active){
    const issueNo = String(Math.max(1, Math.floor((Date.now() - new Date('2025-01-01').getTime())/(1000*60*60*24*30)) + 1)).padStart(2,'0');
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' }).toUpperCase();
    const html = `
      <header class="masthead">
        <div class="masthead__top">
          <div class="masthead__meta">
            <span>Issue № ${issueNo}</span>
            <span>${today}</span>
            <span class="u-hide-mobile">62 Artists · 24 Countries</span>
          </div>
          <a href="${ROOT}index.html" class="masthead__brand">
            <div class="masthead__title"><b>OMF</b> <i>Geometry</i></div>
            <div class="masthead__sub">A Journal of Geometric Tattoo</div>
          </a>
          <div class="masthead__meta masthead__meta--right">
            <a href="https://instagram.com/omfgeometry" target="_blank">Instagram</a>
            <a href="https://instagram.com/omfgeometry" target="_blank">Tag Us</a>
          </div>
        </div>
        <nav class="masthead__nav">
          <a href="${ROOT}index.html" data-nav="home">Front Page</a>
          <a href="${ROOT}directory.html" data-nav="directory">Directory</a>
          <a href="${ROOT}map.html" data-nav="map">Atlas</a>
          <a href="${ROOT}blog/index.html" data-nav="blog">Journal</a>
          <a href="${ROOT}about.html" data-nav="about">About</a>
        </nav>
      </header>`;
    const node = el(html);
    if(active) node.querySelector(`[data-nav="${active}"]`)?.classList.add('active');
    return node;
  }

  function renderColophon(){
    return el(`
      <footer class="colophon">
        <div class="colophon__inner">
          <div>
            <div class="colophon__brand">OMF <em>Geometry</em></div>
            <p class="colophon__tag">An ongoing record of geometric tattoo work | sacred geometry, dotwork, mandala, blackwork | curated by hand from the world's studios.</p>
          </div>
          <div>
            <h4>Sections</h4>
            <ul>
              <li><a href="index.html">Front Page</a></li>
              <li><a href="directory.html">Directory</a></li>
              <li><a href="map.html">Atlas</a></li>
              <li><a href="blog/index.html">Journal</a></li>
            </ul>
          </div>
          <div>
            <h4>Take Part</h4>
            <ul>
              <li><a href="https://instagram.com/omfgeometry" target="_blank">Tag Us on Instagram</a></li>
              <li><a href="about.html">About OMF</a></li>
              <li><a href="https://instagram.com/omfgeometry" target="_blank">Instagram</a></li>
            </ul>
          </div>
          <div>
            <h4>Issue</h4>
            <ul>
              <li><span style="color:var(--gilt)">№ 01 | Berdah</span></li>
              <li><span style="color:var(--text-mute)">№ 02 | Forthcoming</span></li>
            </ul>
          </div>
        </div>
        <div class="colophon__legal">
          <span>© ${new Date().getFullYear()} OMF Geometry</span>
          <span>Set in Cormorant · Inter Tight · Space Mono</span>
        </div>
      </footer>`);
  }

  // Clean weird emoji from artist names
  function cleanName(n){ return (n||'').replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu,'').replace(/[•●▪]/g,'').trim() || 'Untitled'; }
  function imgURL(p){ if(!p) return ''; if(p.startsWith('http')) return p; const sub = location.pathname.split('/').filter(Boolean).length > 1 || /\/(artists|blog)\//.test(location.pathname); return (sub?'../':'') + p.replace(/^\//,''); }

  // City extraction
  function city(loc){
    if(!loc) return '';
    return loc.split(',')[0].trim();
  }

  async function loadArtists(){
    const inSub = location.pathname.split('/').filter(Boolean).length > 1 || /\/(artists|blog)\//.test(location.pathname);
    const url = inSub ? '../data/artists_v2.json' : 'data/artists_v2.json';
    const r = await fetch(url).catch(()=>null);
    if(!r || !r.ok) return [];
    const data = await r.json();
    // normalize country (some data has odd values)
    const COUNTRY_FIX = {
      'Brasil':'Brazil','Pennsylvania':'United States','Alberta':'Canada',
      'Algorithm Tattoo & Fine Arts':'United States','Domfront 61700':'France',
      'Israël':'Israel'
    };
    return data.map(a => ({
      ...a,
      name: cleanName(a.name),
      country: COUNTRY_FIX[a.country] || a.country || 'Unknown',
      image: imgURL(a.image),
      gallery: (a.gallery||[]).map(imgURL),
      city: city(a.location),
    }));
  }

  function init(active){
    const m = document.querySelector('[data-masthead]');
    if(m) m.replaceWith(renderMasthead(active));
    const c = document.querySelector('[data-colophon]');
    if(c) c.replaceWith(renderColophon());
  }

  window.OMF = { init, loadArtists, cleanName, imgURL, city };
})();
