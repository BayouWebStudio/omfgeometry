// ============================================
// OMF GEOMETRY — Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
  }

  // Directory Filtering
  const countryFilter = document.getElementById('filter-country');
  const styleFilter = document.getElementById('filter-style');
  const artistsContainer = document.getElementById('artists-container');

  if (countryFilter && styleFilter && artistsContainer) {
    let allArtists = [];

    fetch('/data/artists.json')
      .then(r => r.json())
      .then(data => {
        allArtists = data;
        populateFilters(data);
        renderArtists(data);
      })
      .catch(() => {
        // Fallback: try relative path
        fetch('../data/artists.json')
          .then(r => r.json())
          .then(data => {
            allArtists = data;
            populateFilters(data);
            renderArtists(data);
          })
          .catch(() => {
            fetch('./data/artists.json')
              .then(r => r.json())
              .then(data => {
                allArtists = data;
                populateFilters(data);
                renderArtists(data);
              });
          });
      });

    function populateFilters(artists) {
      const countries = [...new Set(artists.map(a => a.country))].sort();
      const styles = [...new Set(artists.flatMap(a => a.styles))].sort();

      countries.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        countryFilter.appendChild(opt);
      });

      styles.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
        styleFilter.appendChild(opt);
      });
    }

    function renderArtists(artists) {
      artistsContainer.innerHTML = artists.map(a => `
        <a href="artists/${a.slug}.html" class="artist-card">
          <img src="${a.image}" alt="${a.name}" class="artist-card-image" loading="lazy">
          <div class="artist-card-body">
            <div class="artist-card-name">${a.name}</div>
            <div class="artist-card-handle">@${a.instagram}</div>
            <div class="artist-card-location">📍 ${a.location}</div>
            <div class="artist-card-tags">
              ${a.styles.map(s => `<span class="tag">${s}</span>`).join('')}
            </div>
          </div>
        </a>
      `).join('');
    }

    function applyFilters() {
      const country = countryFilter.value;
      const style = styleFilter.value;
      let filtered = allArtists;
      if (country) filtered = filtered.filter(a => a.country === country);
      if (style) filtered = filtered.filter(a => a.styles.includes(style));
      renderArtists(filtered);
    }

    countryFilter.addEventListener('change', applyFilters);
    styleFilter.addEventListener('change', applyFilters);
  }

  // Scroll animations
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.artist-card, .blog-card, .newsletter').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});
