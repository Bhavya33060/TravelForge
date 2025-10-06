// src/components/Explore.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Explore.css";

import beach1 from "../images/beach1.png";
import beach2 from "../images/beach2.png";
import beach3 from "../images/beach3.png";
import beach4 from "../images/beach4.png";

import nightlife1 from "../images/nightlife1.png";
import nightlife2 from "../images/nightlife2.png";
import nightlife3 from "../images/nightlife3.png";
import nightlife4 from "../images/nightlife4.png";

import lisbon1 from "../images/lisbon1.png";
import lisbon2 from "../images/lisbon2.png";
import lisbon3 from "../images/lisbon3.png";
import lisbon4 from "../images/lisbon4.png";

import resort1 from "../images/resort1.png";
import resort2 from "../images/resort2.png";
import resort3 from "../images/resort3.png";
import resort4 from "../images/resort4.png"; // fixed import

import kyoto1 from "../images/kyoto1.png";
import kyoto2 from "../images/kyoto2.png";
import kyoto3 from "../images/kyoto3.png";
import kyoto4 from "../images/kyoto4.png";

import santorini1 from "../images/santorini1.png";
import santorini2 from "../images/santorini2.png";
import santorini3 from "../images/santorini3.png";
import santorini4 from "../images/santorini4.png";

// background / hero videos
const beachVideo = new URL("../images/video.mp4", import.meta.url).href;
const nightlifeVideo = new URL("../images/video1.mp4", import.meta.url).href;
const lisbonVideo = new URL("../images/video2.mp4", import.meta.url).href;
const resortVideo = new URL("../images/video3.mp4", import.meta.url).href;
const kyotoVideo = new URL("../images/video4.mp4", import.meta.url).href;
const santoriniVideo = new URL("../images/video5.mp4", import.meta.url).href;

/* ---------- sampleDeals: unique content ---------- */
const sampleDeals = [
  {
    id: "p-beaches",
    city: "Beaches",
    price: "$199",
    nights: 4,
    img: beach1,
    lat: 15.66,
    lng: 73.82,
    description:
      "Soft sand beaches, turquoise water, and palm-fringed sunsets — perfect for relaxation, swimming and seaside dining.",
    gallery: [beach1, beach2, beach3, beach4],
    amenities: [
      { icon: "🌊", label: "Beach access" },
      { icon: "🏄", label: "Water sports" },
      { icon: "🍹", label: "Beach bars" },
      { icon: "🛶", label: "Boat rides" },
    ],
    reviews: [
      { name: "Asha", rating: 5, body: "The waves and sunsets were breathtaking!" },
      { name: "Raj", rating: 4, body: "Perfect beach vibes — great for families." },
    ],
  },

  {
    id: "p-nightlife",
    city: "Nightlife",
    price: "$349",
    nights: 2,
    img: nightlife1,
    lat: 18.96,
    lng: 72.82,
    description:
      "Neon lights, rooftop bars, live DJs and late-night beats — discover the city's best after-dark hotspots and cocktail scenes.",
    gallery: [nightlife1, nightlife2, nightlife3, nightlife4],
    amenities: [
      { icon: "🍸", label: "Cocktail bars" },
      { icon: "🎶", label: "Live music" },
      { icon: "🕺", label: "Dance clubs" },
      { icon: "🌃", label: "City views" },
    ],
    reviews: [
      { name: "Priya", rating: 5, body: "Best nightlife experience I've had in years!" },
      { name: "Mark", rating: 4.5, body: "Great music and vibes, a little crowded." },
    ],
  },

  {
    id: "p-resorts",
    city: "Resorts",
    price: "$299",
    nights: 3,
    img: resort1,
    lat: 19.07,
    lng: 72.87,
    description:
      "Luxury all-in-one resorts with pools, spa treatments, and gourmet dining — escape with pampered downtime and activities.",
    gallery: [resort1, resort2, resort3, resort4],
    amenities: [
      { icon: "🏊", label: "Infinity pool" },
      { icon: "💆", label: "Spa services" },
      { icon: "🍽️", label: "Fine dining" },
      { icon: "🏌️", label: "Golf course" },
    ],
    reviews: [
      { name: "Neha", rating: 4.5, body: "Resort was beautiful and service was excellent." },
      { name: "John", rating: 4, body: "Luxury stay but food options could improve." },
    ],
  },

  {
    id: "p-lisbon",
    city: "Lisbon",
    price: "$249",
    nights: 3,
    img: lisbon1,
    lat: 38.72,
    lng: -9.14,
    description:
      "Charm, trams, pastel houses and scenic viewpoints — explore historic neighborhoods, fado nights and seaside pastry cafés.",
    gallery: [lisbon1, lisbon2, lisbon3, lisbon4],
    amenities: [
      { icon: "🚋", label: "Historic tram rides" },
      { icon: "🍷", label: "Wine tours" },
      { icon: "🎶", label: "Fado nights" },
      { icon: "🏛️", label: "Historic landmarks" },
    ],
    reviews: [
      { name: "Sara", rating: 5, body: "Lisbon was enchanting, loved every corner!" },
      { name: "Miguel", rating: 4, body: "Great vibes, but hilly walks can be tiring." },
    ],
  },

  {
    id: "p-kyoto",
    city: "Kyoto",
    price: "$319",
    nights: 4,
    img: kyoto1,
    lat: 35.01,
    lng: 135.76,
    description:
      "Zen gardens, centuries-old temples and tranquil teahouses — a cultural retreat full of seasonal beauty and calm.",
    gallery: [kyoto1, kyoto2, kyoto3, kyoto4],
    amenities: [
      { icon: "🏯", label: "Historic temples" },
      { icon: "🎋", label: "Bamboo groves" },
      { icon: "🍵", label: "Tea ceremonies" },
      { icon: "🧘", label: "Zen gardens" },
    ],
    reviews: [
      { name: "Akira", rating: 5, body: "Peaceful and historic — an unforgettable cultural trip." },
      { name: "Emily", rating: 4.5, body: "Cherry blossoms made it magical." },
      { name: "Nobu", rating: 5, body: "Incredible tea ceremony experience — highly recommended." },
    ],
  },

  {
    id: "p-santorini",
    city: "Santorini",
    price: "$399",
    nights: 5,
    img: santorini1,
    lat: 36.39,
    lng: 25.46,
    description:
      "Whitewashed cliffs, blue-domed churches and dramatic sunsets — the ultimate romantic island escape with sea views.",
    gallery: [santorini1, santorini2, santorini3, santorini4],
    amenities: [
      { icon: "🏖️", label: "Cliffside views" },
      { icon: "🍷", label: "Vineyard tours" },
      { icon: "🛥️", label: "Sunset cruises" },
      { icon: "🍽️", label: "Greek cuisine" },
    ],
    reviews: [
      { name: "Sophia", rating: 5, body: "Most romantic place I’ve ever been to." },
      { name: "Liam", rating: 4.5, body: "Beautiful, but quite touristy." },
    ],
  },
];

/* ---------- fallback content when deal lacks data ---------- */
const defaultAmenities = [
  { icon: "✨", label: "Local experiences" },
  { icon: "🍜", label: "Food & dining" },
  { icon: "🏞️", label: "Scenic views" },
];

const defaultReviews = [
  { name: "Guest", rating: 5, body: "Loved the stay — this place is magical!" },
  { name: "Traveler", rating: 4.5, body: "Really enjoyed the atmosphere and local spots." },
];

function formatPrice(p) {
  const n = Number(String(p || "").replace(/[^\d.]/g, ""));
  return isNaN(n) ? "$0" : `$${n.toFixed(0)}`;
}

export default function Explore() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const stateItem = location?.state?.item ?? null;

  // ----------------------------
  // Robust deal resolution:
  // prefer router state -> localStorage -> sampleDeals
  // ensure gallery is always an array with >=1 item
  // ----------------------------
  const deal = useMemo(() => {
    let found = stateItem ?? null;

    if (!found) {
      try {
        const raw = localStorage.getItem("tm_search_results_cache");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            found =
              parsed.find((p) => String(p.id) === String(id)) ||
              parsed.find((p) => String(p.city).toLowerCase() === String(id).toLowerCase()) ||
              null;
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    found = found || sampleDeals.find((d) => String(d.id) === String(id)) || sampleDeals[0];

    // copy to avoid mutating original objects
    const result = { ...found };

    // normalized keys for checks
    const lid = String(result?.id || "").toLowerCase();
    const city = String(result?.city || "").toLowerCase();

    // force known galleries for important pages so we never rely on stale cache
    if (lid.includes("lisbon") || city === "lisbon") {
      result.gallery = [lisbon1, lisbon2, lisbon3, lisbon4];
    } else if (lid.includes("resort") || city === "resorts") {
      result.gallery = [resort1, resort2, resort3, resort4];
    } else if (lid.includes("kyoto") || city === "kyoto") {
      result.gallery = [kyoto1, kyoto2, kyoto3, kyoto4];
    } else if (lid.includes("santorini") || city === "santorini") {
      result.gallery = [santorini1, santorini2, santorini3, santorini4];
    } else if (lid.includes("night") || city === "nightlife") {
      result.gallery = [nightlife1, nightlife2, nightlife3, nightlife4];
    } else if (lid.includes("beach") || city === "beaches") {
      result.gallery = [beach1, beach2, beach3, beach4];
    }

    // ensure fallback
    if (!Array.isArray(result.gallery) || result.gallery.length === 0) {
      const base = result.img || beach1;
      result.gallery = [base, base, base, base];
    }

    return result;
  }, [id, stateItem]);

  // ----------------------------
  // gallery memo: prefer deal.gallery, then explicit fallbacks
  // ----------------------------
  const gallery = useMemo(() => {
    if (Array.isArray(deal.gallery) && deal.gallery.length > 0) return deal.gallery;

    const lid = String(deal?.id || "").toLowerCase();
    const city = String(deal?.city || "").toLowerCase();

    if (lid.includes("night") || city === "nightlife") return [nightlife1, nightlife2, nightlife3, nightlife4];
    if (lid.includes("lisbon") || city === "lisbon") return [lisbon1, lisbon2, lisbon3, lisbon4];
    if (lid.includes("resort") || city === "resorts") return [resort1, resort2, resort3, resort4];
    if (lid.includes("kyoto") || city === "kyoto") return [kyoto1, kyoto2, kyoto3, kyoto4];
    if (lid.includes("santorini") || city === "santorini") return [santorini1, santorini2, santorini3, santorini4];
    if (lid.includes("beach") || city === "beaches") return [beach1, beach2, beach3, beach4];

    const base = deal?.img || beach1;
    return [base, base, base, base];
  }, [deal]);

  // debug logs so you can inspect in browser console
  useEffect(() => {
    console.log("DEAL RESOLVED (Explore):", deal);
    console.log("GALLERY USED (Explore):", gallery);
  }, [deal, gallery]);

  // hero video selection
  const heroVideoSrc = (() => {
    const lid = String(deal?.id || "").toLowerCase();
    const city = String(deal?.city || "").toLowerCase();

    if (lid.includes("night") || city === "nightlife") return nightlifeVideo;
    if (lid.includes("lisbon") || city === "lisbon") return lisbonVideo;
    if (lid.includes("resort") || city === "resorts") return resortVideo;
    if (lid.includes("kyoto") || city === "kyoto") return kyotoVideo;
    if (lid.includes("santorini") || city === "santorini") return santoriniVideo;
    return beachVideo; // default (beaches and fallback)
  })();

  // carousel index + autoplay
  const [carouselIdx, setCarouselIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCarouselIdx((p) => (p + 1) % gallery.length), 4800);
    return () => clearInterval(t);
  }, [gallery.length]);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // favorite
  const [fav, setFav] = useState(false);

  // counters
  const [countNights, setCountNights] = useState(0);
  const [countGuests, setCountGuests] = useState(0);
  const [countRating, setCountRating] = useState(0);

  useEffect(() => {
    let raf;
    const start = Date.now();
    const dur = 900;
    const nightsTarget = deal.nights || 1;
    const guestsTarget = 2;
    const ratingTarget = 4.8;

    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / dur);
      const ease = 1 - Math.pow(1 - t, 3);
      setCountNights(Math.round(nightsTarget * ease));
      setCountGuests(Math.round(guestsTarget * ease));
      setCountRating(Math.round(ratingTarget * 10 * ease) / 10);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [deal]);

  // confetti + price pulse
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatePrice, setAnimatePrice] = useState(false);
  useEffect(() => {
    setAnimatePrice(true);
    const t = setTimeout(() => setAnimatePrice(false), 900);
    return () => clearTimeout(t);
  }, [deal.id]);

  const openModal = (i) => {
    setModalIndex(i);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const nextModal = () => setModalIndex((p) => (p + 1) % gallery.length);
  const prevModal = () => setModalIndex((p) => (p - 1 + gallery.length) % gallery.length);

  useEffect(() => {
    function onKey(e) {
      if (!modalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextModal();
      if (e.key === "ArrowLeft") prevModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, gallery.length]);

  // booking panel
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().slice(0, 10));
  const [nights, setNights] = useState(deal.nights || 1);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    setNights(deal.nights || 1);
  }, [deal]);

  const submitBooking = (e) => {
    e.preventDefault();
    const nightly = Number(String(deal.price).replace(/[^\d.]/g, "")) || 0;
    const total = nightly * (nights || 1);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 900);

    navigate(`/book/${deal.id ?? deal.city}`, {
      state: {
        item: deal,
        booking: { checkIn, nights, guests, total },
      },
    });
    setBookingOpen(false);
  };

  const goToBooking = () => setBookingOpen(true);
  const nightly = Number(String(deal.price).replace(/[^\d.]/g, "")) || 0;
  const estTotal = nightly * nights;

  // parallax hero
  const heroRef = useRef(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    function onMove(e) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      el.style.setProperty("--mx", `${dx * 10}px`);
      el.style.setProperty("--my", `${dy * 8}px`);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // use fallback arrays if missing on deal
  const amenitiesToShow = Array.isArray(deal.amenities) && deal.amenities.length > 0 ? deal.amenities : defaultAmenities;
  const reviewsToShow = Array.isArray(deal.reviews) && deal.reviews.length > 0 ? deal.reviews : defaultReviews;

  return (
    <main className="explore-root cute">
      {/* HERO */}
      <header className="explore-hero" ref={heroRef}>
        <video className="hero-video" autoPlay loop muted playsInline poster={gallery[carouselIdx]}>
          <source src={heroVideoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-overlay gradient" />
        <div className="hero-inner">
          <motion.div className="hero-left" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hero-badge">✦ Tiny Travel</div>
            <h1 className="hero-title">{deal.city} <span className="sparkle">✨</span></h1>
            <p className="hero-sub">{deal.description}</p>

            <div className="hero-meta cute-meta">
              <div className="meta-item">
                <div className="meta-count bounce">{countNights}</div>
                <div className="meta-label">Nights</div>
              </div>
              <div className="meta-item">
                <div className="meta-count bounce">{countGuests}</div>
                <div className="meta-label">Guests</div>
              </div>
              <div className="meta-item">
                <div className="meta-count rating">{countRating} ⭐</div>
                <div className="meta-label">Avg</div>
              </div>
            </div>

            <div className="hero-ctas">
              <button className="btn-primary hero-book" onClick={goToBooking} aria-label="Open booking panel">
                <span className="emoji">🧳</span> Book now
              </button>

              <button className="btn-ghost hero-explore" onClick={() => document.getElementById("details-section")?.scrollIntoView({ behavior: "smooth" })}>
                See details
              </button>

              <button className={`fav-btn ${fav ? "liked" : ""}`} onClick={() => setFav((s) => !s)} aria-label="Save favorite">
                {fav ? "💖 Saved" : "🤍 Save"}
              </button>

              {/* BACK button: always navigates to the home page "/" */}
              <button className="btn-ghost hero-back" onClick={() => navigate("/")} aria-label="Back to home">
                ← Back
              </button>
            </div>
          </motion.div>

          <motion.div className="hero-right" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
            <div className={`price-pill ${animatePrice ? "pulse" : ""}`}>
              <div className="price-amount">{formatPrice(deal.price)}</div>
              <div className="price-label">/ night</div>
            </div>

            <div className="mini-gallery">
              {gallery.slice(0, 3).map((s, i) => (
                <img key={i} src={s} alt={`thumb-${i}`} onClick={() => openModal(i)} />
              ))}
            </div>
          </motion.div>
        </div>

        <svg viewBox="0 0 1440 80" className="hero-wave" preserveAspectRatio="none"><path d="M0,20 C200,80 400,0 720,20 C1040,40 1240,0 1440,20 L1440,80 L0,80 Z"/></svg>
      </header>

      <div className="explore-content">
        <section className="main-col">
          <motion.div id="gallery" className="gallery-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ staggerChildren: 0.06 }}>
            {gallery.map((src, i) => (
              <motion.button key={i} className="gallery-item cute-item" onClick={() => openModal(i)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} aria-label={`Open image ${i + 1}`}>
                <img src={src} alt={`${deal.city} ${i + 1}`} loading="lazy" />
                <div className="gallery-overlay">View</div>
                <div className="gallery-heart">❤️</div>
              </motion.button>
            ))}
          </motion.div>

          {/* DETAILS (dynamic per-deal) */}
          <article id="details-section" className="details panel cute-panel">
            <h2>About {deal.city} <span className="pin">📍</span></h2>

            {String(deal.city).toLowerCase() === "beaches" ? (
              <>
                <p className="lead">A wonderful destination with plenty to do and see.</p>
                <p className="muted">Beaches often offer sun, sand, and local seafood. Explore coastal walks, water sports, and seaside dining.</p>
              </>
            ) : (
              <p className="lead">{deal.description ?? "A wonderful destination with plenty to do and see."}</p>
            )}

            <h3>What you'll get</h3>
            <div className="amenities-grid">
              {amenitiesToShow.map((a) => (
                <div key={a.label} className="amenity cute-amenity glassy">
                  <div className="amenity-ico">{a.icon}</div>
                  <div className="amenity-label">{a.label}</div>
                </div>
              ))}
            </div>

            <h3>Details & fine print</h3>
            <p className="muted small">Check-in after 3pm • Check-out before 11am • Free cancellation up to 48 hours prior to arrival. This is a demo UI — no real bookings are processed.</p>

            <h3 className="reviews-title">Guest reviews</h3>
            <div className="reviews">
              {reviewsToShow.map((r, idx) => (
                <motion.div key={idx} className="review card glassy" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="review-head">
                    <div className="review-avatar cute-avatar">{r.name[0]}</div>
                    <div>
                      <div className="review-name">{r.name}</div>
                      <div className="review-rating">{Array.from({ length: 5 }).map((_, i) => (i < Math.round(r.rating) ? "⭐" : "☆")).join("")} <span className="muted small">• {r.rating}</span></div>
                    </div>
                  </div>
                  <p className="review-body">{r.body}</p>
                </motion.div>
              ))}
            </div>

            <div className="detail-actions">
              <button className="btn-primary" onClick={() => setBookingOpen(true)}>Book this stay</button>
              <button className="btn-ghost" onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => alert("Share link copied (demo)"))}>Share</button>
            </div>
          </article>
        </section>

        <aside className="side-col">
          <div className="sticky-card cute-sticky">
            <div className="sticky-header">
              <div className="sticky-title">Your stay</div>
              <div className="sticky-sub muted">{deal.city}</div>
            </div>

            <div className="sticky-body">
              <div className="price-row">
                <div>Nightly</div>
                <div className="price">{formatPrice(deal.price)}</div>
              </div>
              <div className="price-row muted">
                <div>Estimated total</div>
                <div>{formatPrice(estTotal)}</div>
              </div>

              <div className="sticky-actions">
                <button className="btn-primary wide" onClick={() => setBookingOpen(true)}>Book now</button>
                <button className="btn-ghost wide" onClick={() => window.print()}>Print details</button>
              </div>
            </div>

            <div className="mini-map small cute-map">📍 Approx location</div>
          </div>
        </aside>
      </div>

      {/* Booking Panel */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div className="booking-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
            <form onSubmit={submitBooking} className="booking-form">
              <div className="booking-head">
                <div>
                  <div className="booking-title">Reserve {deal.city}</div>
                  <div className="muted small">Safe. playful. demo.</div>
                </div>
                <button type="button" className="btn-ghost small" onClick={() => setBookingOpen(false)}>Close</button>
              </div>

              <label>
                Check-in
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              </label>

              <label>
                Nights
                <input type="number" min={1} value={nights} onChange={(e) => setNights(Number(e.target.value))} />
              </label>

              <label>
                Guests
                <input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
              </label>

              <div className="booking-summary">
                <div>
                  <div className="muted small">Nightly</div>
                  <div className="price">{formatPrice(deal.price)}</div>
                </div>
                <div>
                  <div className="muted small">Total</div>
                  <div className="total">{formatPrice(estTotal)}</div>
                </div>
              </div>

              <div className="booking-actions">
                <button className="btn-primary wide" type="submit">Confirm</button>
                <button className="btn-ghost wide" type="button" onClick={() => { setBookingOpen(false); }}>Cancel</button>
              </div>

              {showConfetti && <div className="confetti">🎉🎉🎉</div>}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div className="modal-portal" role="dialog" aria-modal onClick={closeModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-inner" initial={{ scale: 0.98, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 12 }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>
              <button className="modal-prev" onClick={prevModal} aria-label="Previous">◀</button>
              <img src={gallery[modalIndex]} alt={`Large ${modalIndex + 1}`} />
              <button className="modal-next" onClick={nextModal} aria-label="Next">▶</button>
              <div className="modal-caption">Image {modalIndex + 1} / {gallery.length}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
