import { useEffect } from 'react';
import { UI } from './content.js';
import { initializeGallery } from './gallery.js';

export default function App() {
  useEffect(initializeGallery, []);
  return (<>
<main className="stage" id="stage" aria-label={UI.gallery}></main>

  <aside className="work-list" id="work-list" aria-label={UI.directory}></aside>

  <div className="lightbox" id="lightbox" aria-hidden="true">
    <div className="lightbox-inner" id="lightbox-inner">
      <figure className="lightbox-figure" id="lightbox-figure">
        <img id="lightbox-img" alt="" />
      </figure>
      <div className="lightbox-gap"></div>
      <div className="lightbox-meta">
        <span className="lb-series" id="lb-series"></span>
        <h2 className="lb-title" id="lb-title"></h2>
        <span className="lb-en" id="lb-en"></span>
        <p className="lb-desc" id="lb-desc"></p>
        <span className="lb-index" id="lb-index"></span>
      </div>
    </div>
    <button className="lightbox-close" id="lightbox-close" aria-label={UI.close}>&times;</button>
    <button className="lb-side lb-side-prev" id="lb-prev" aria-label={UI.previous}>&#8249;</button>
    <button className="lb-side lb-side-next" id="lb-next" aria-label={UI.next}>&#8250;</button>
  </div>

  <footer className="site-footer">
    <span className="footer-line"></span>
    <span className="footer-text">{UI.contact}</span>
    <span className="footer-line"></span>
  </footer>
  </>);
}
