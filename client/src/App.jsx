import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BookOpen, BookMarked, ChevronLeft, ChevronRight,
  CircleAlert, Compass, Search, SlidersHorizontal, Sparkles,
  X,
} from 'lucide-react';
import { getApiError, getBook, getBooks, getGenres } from './services/api.js';

const LIMIT = 12;
const palettes = [
  ['#d8d0bd', '#514b3e'], ['#c9d6ce', '#3d594e'], ['#e7c9b6', '#714c3c'],
  ['#c9cedb', '#414b68'], ['#e2d8a9', '#655b2e'], ['#d7c8d9', '#604c65'],
];
function coverStyle(book) {
  const index = [...(book.title || '')].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palettes.length;
  const [background, foreground] = palettes[index];
  return { '--cover-bg': background, '--cover-ink': foreground };
}
function Header() {
  return <header className="site-header">
    <Link to="/" className="brand" aria-label="Open Shelf home"><span className="brand-mark"><BookOpen size={21} /></span><span>open<span className="brand-light">shelf</span></span></Link>
    <nav className="header-nav" aria-label="Main navigation"><Link to="/#catalog">Discover</Link><Link to="/#about">About</Link></nav>
    <Link className="header-action" to="/#catalog">Explore collection <ArrowRight size={15} /></Link>
  </header>;
}
function Footer() {
  return <footer className="footer" id="about"><div className="footer-brand"><BookOpen size={18} /> open<span>shelf</span></div><p>A little more room for a good story.</p><span>Library catalog</span></footer>;
}
function SearchBox({ value, onChange, inputRef }) {
  return <div className="search-box"><Search size={19} /><input ref={inputRef} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search by title or author..." aria-label="Search books by title or author" maxLength={100} /><kbd aria-hidden="true">⌘ K</kbd>{value && <button type="button" onClick={() => onChange('')} aria-label="Clear search"><X size={16} /></button>}</div>;
}
function BookCard({ book, index }) {
  return <Link className="book-card" to={'/books/' + book.id} style={{ '--card-index': index }}>
    <div className="book-art" style={coverStyle(book)} aria-hidden="true">
      <div className="art-top"><span>OPEN SHELF</span><span>№ {String(index + 1).padStart(2, '0')}</span></div>
      <div className="art-title">{book.title}</div>
      <div className="art-author">{book.author}</div>
      <div className="art-bottom"><span>{book.genre?.name || 'COLLECTION'}</span><BookOpen size={17} /></div>
    </div>
    <div className="book-info"><div><span className="book-genre">{book.genre?.name || 'Uncategorized'}</span><h3>{book.title}</h3><p>{book.author}</p></div><span className="card-arrow"><ArrowUpRightIcon /></span></div>
    <div className="availability"><span className={book.availableCopies > 0 ? 'status-dot' : 'status-dot unavailable'} />{book.availableCopies > 0 ? book.availableCopies + ' available' : 'Currently unavailable'}</div>
  </Link>;
}
function ArrowUpRightIcon() { return <ArrowRight size={16} />; }
function SkeletonGrid() {
  return <div className="book-grid" aria-label="Loading books">{Array.from({ length: 8 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-cover" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}</div>;
}
function Notice({ type = 'error', title, message, action }) {
  return <div className={'notice ' + type} role={type === 'error' ? 'alert' : 'status'}><CircleAlert size={22} /><div><strong>{title}</strong><p>{message}</p>{action}</div></div>;
}
function HomePage() {
  const [params, setParams] = useSearchParams();
  const searchFromUrl = params.get('search') || '';
  const genreFromUrl = params.get('genreId') || '';
  const requestedPage = Number(params.get('page'));
  const pageFromUrl = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const [searchInput, setSearchInput] = useState(searchFromUrl);
  const searchInputRef = useRef(null);
  const [genres, setGenres] = useState([]);
  const [genreError, setGenreError] = useState('');
  const [books, setBooks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: pageFromUrl, limit: LIMIT, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => { setSearchInput(searchFromUrl); }, [searchFromUrl]);
  useEffect(() => {
    function focusSearch(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    getGenres(controller.signal).then((data) => setGenres(Array.isArray(data) ? data : []))
      .catch((err) => { if (err.name !== 'CanceledError') setGenreError(getApiError(err)); });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(window.location.search);
      if (searchInput.trim()) next.set('search', searchInput.trim()); else next.delete('search');
      if (next.get('search') !== params.get('search')) next.delete('page');
      setParams(next, { replace: true });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]); // URL is the committed search state.

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    getBooks({ search: searchFromUrl, genreId: genreFromUrl, page: pageFromUrl, limit: LIMIT, signal: controller.signal })
      .then((result) => {
        setBooks(Array.isArray(result?.data) ? result.data : []);
        setMeta(result?.meta || { total: 0, page: pageFromUrl, limit: LIMIT, totalPages: 0 });
      })
      .catch((err) => { if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') setError(getApiError(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [searchFromUrl, genreFromUrl, pageFromUrl, reloadKey]);

  function selectGenre(id) {
    const next = new URLSearchParams(params);
    if (id) next.set('genreId', id); else next.delete('genreId');
    next.delete('page'); setParams(next);
  }
  function changePage(page) {
    const next = new URLSearchParams(params);
    if (page > 1) next.set('page', String(page)); else next.delete('page');
    setParams(next); document.getElementById('catalog')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  const selectedGenre = genres.find((genre) => genre.id === genreFromUrl);
  const pageNumbers = useMemo(() => {
    const total = meta.totalPages || 0;
    const start = Math.max(1, Math.min(pageFromUrl - 2, total - 4));
    return Array.from({ length: Math.min(5, total) }, (_, index) => start + index);
  }, [meta.totalPages, pageFromUrl]);

  return <><Header /><main>
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> THE JOY OF GETTING LOST IN A BOOK</div><h1>Find your next<br /><em>great read.</em></h1><p className="hero-description">A world of stories, ideas, and discoveries — all waiting on the shelf. Find the one that speaks to you.</p><a className="hero-link" href="#catalog">Browse the collection <ArrowRight size={16} /></a></div>
      <div className="hero-visual" aria-hidden="true"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-book book-back"><span>THE ART OF<br />SLOW LIVING</span><small>VOL. 02</small></div><div className="hero-book book-mid"><span>WILD<br />PLACES</span><small>FIELD NOTES</small></div><div className="hero-book book-front"><span>THE<br /><i>QUIET</i><br />HOURS</span><small>A COLLECTION OF STORIES</small></div><div className="hero-stamp"><Sparkles size={17} /><span>TURN THE<br />PAGE</span></div><span className="visual-caption">A good book changes everything.</span></div>
      <div className="hero-index"><span>01 / 03</span><span>DISCOVER SOMETHING NEW</span></div>
    </section>
    <section className="catalog-section" id="catalog">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> THE COLLECTION</div><h2>Stories worth <em>sharing.</em></h2></div><p>Thoughtfully gathered. Ready to be discovered.</p></div>
      <div className="catalog-toolbar"><SearchBox value={searchInput} onChange={setSearchInput} inputRef={searchInputRef} /><div className="filter-label"><SlidersHorizontal size={16} /><span>Explore by genre</span></div></div>
      <div className="genre-list" aria-label="Filter books by genre"><button className={!genreFromUrl ? 'genre-chip active' : 'genre-chip'} onClick={() => selectGenre('')}>All books</button>{genres.map((genre) => <button key={genre.id} className={genreFromUrl === genre.id ? 'genre-chip active' : 'genre-chip'} onClick={() => selectGenre(genre.id)}>{genre.name}<span>{genre._count?.books ?? ''}</span></button>)}</div>
      {genreError && <p className="inline-warning">{genreError} Genre filters may be unavailable.</p>}
      <div className="results-heading"><div><span className="results-kicker">{selectedGenre?.name || (searchFromUrl ? 'SEARCH RESULTS' : 'CURATED FOR THE CURIOUS')}</span><h3>{searchFromUrl ? <>Results for <em>“{searchFromUrl}”</em></> : selectedGenre ? <>{selectedGenre.name} <em>collection.</em></> : <>The library <em>shelf.</em></>}</h3></div><span className="result-count">{loading ? 'Finding books…' : meta.total + ' BOOKS'}</span></div>
      {loading ? <SkeletonGrid /> : error ? <Notice title="The shelves are out of reach" message={error} action={<button className="text-button" onClick={() => setReloadKey((value) => value + 1)}>Try again <ArrowRight size={14} /></button>} /> : books.length === 0 ? <div className="empty-state"><div className="empty-icon"><BookMarked size={25} /></div><h3>No books found <em>this time.</em></h3><p>Try another title, author, or genre. Your next read is out there.</p><button className="outline-button" onClick={() => { setSearchInput(''); setParams(new URLSearchParams()); }}>Clear filters <X size={15} /></button></div> : <><div className="book-grid">{books.map((book, index) => <BookCard key={book.id} book={book} index={index} />)}</div>{meta.totalPages > 1 && <nav className="pagination" aria-label="Book catalog pages"><button onClick={() => changePage(pageFromUrl - 1)} disabled={pageFromUrl <= 1} aria-label="Previous page"><ChevronLeft size={17} /></button>{pageNumbers.map((page) => <button key={page} onClick={() => changePage(page)} className={page === pageFromUrl ? 'current' : ''} aria-current={page === pageFromUrl ? 'page' : undefined}>{page}</button>)}<button onClick={() => changePage(pageFromUrl + 1)} disabled={pageFromUrl >= meta.totalPages} aria-label="Next page"><ChevronRight size={17} /></button><span>PAGE {pageFromUrl} OF {meta.totalPages}</span></nav>}</>}
    </section>
    <section className="quote-band"><div className="quote-mark">“</div><p>A book is a device to ignite the imagination.</p><span>— ALAN BENNETT</span><BookOpen className="quote-icon" size={42} /></section>
  </main><Footer /></>;
}
function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    getBook(id, controller.signal).then(setBook).catch((err) => {
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') setError(getApiError(err));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);
  return <><Header /><main className="detail-page"><Link className="back-link" to="/"><ArrowLeft size={16} /> Back to collection</Link>
    {loading ? <div className="detail-loading"><div className="skeleton-cover" /><div><div className="skeleton-line" /><div className="skeleton-line short" /></div></div> : error ? <Notice title="We couldn't open this book" message={error} action={<Link className="text-button" to="/">Return to the catalog <ArrowRight size={14} /></Link>} /> : book ? <div className="detail-layout"><div className="detail-art-wrap"><div className="detail-art" style={coverStyle(book)}><span className="detail-art-brand">OPEN SHELF · LIBRARY EDITION</span><div className="detail-art-title">{book.title}</div><span className="detail-art-author">{book.author}</span><div className="detail-art-footer"><BookOpen size={22} /><span>READ · DISCOVER · REPEAT</span></div></div><span className="art-note">A story waiting to be opened.</span></div><article className="detail-content"><div className="eyebrow"><span className="eyebrow-line" /> BOOK DETAILS</div><span className="detail-genre">{book.genre?.name || 'Library collection'}</span><h1>{book.title}</h1><p className="detail-author">by {book.author}</p><div className="detail-divider" /><p className="detail-intro">Every book holds a world of its own. Discover this title in our library collection and find a little time for a new perspective.</p><dl className="book-facts"><div><dt>ISBN</dt><dd>{book.isbn}</dd></div><div><dt>GENRE</dt><dd>{book.genre?.name || '—'}</dd></div><div><dt>TOTAL COPIES</dt><dd>{book.totalCopies}</dd></div><div><dt>AVAILABLE</dt><dd>{book.availableCopies} of {book.totalCopies}</dd></div></dl><div className="availability-panel"><span className={book.availableCopies > 0 ? 'status-dot' : 'status-dot unavailable'} /><div><strong>{book.availableCopies > 0 ? 'Available in the library' : 'Not currently available'}</strong><p>{book.availableCopies > 0 ? 'This title is currently on the shelf.' : 'Check back soon for availability.'}</p></div></div><Link to="/" className="primary-button">Explore more books <ArrowRight size={16} /></Link></article></div> : null}
  </main><Footer /></>;
}
function HashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return <><HashScroll /><Routes><Route path="/" element={<HomePage />} /><Route path="/books/:id" element={<BookDetailPage />} /><Route path="*" element={<><Header /><main className="not-found"><Compass size={35} /><h1>That page is <em>off the map.</em></h1><Link className="primary-button" to="/">Back to the library <ArrowRight size={16} /></Link></main><Footer /></>} /></Routes></>;
}