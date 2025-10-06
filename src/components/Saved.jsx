// src/components/Saved.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SAVES_KEY = "travel_saved_items_v1";

function readSaved() {
  try {
    const raw = localStorage.getItem(SAVES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("failed to read saved", e);
    return [];
  }
}
function writeSaved(items) {
  try {
    localStorage.setItem(SAVES_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("failed to write saved", e);
  }
}

export default function Saved() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(readSaved());
  }, []);

  const removeItem = (id) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    writeSaved(updated);
  };

  const clearAll = () => {
    writeSaved([]);
    setItems([]);
  };

  const goExplore = (item) => navigate(`/explore/${item.id}`, { state: { item } });
  const goBook = (item) => navigate(`/book/${item.id}`, { state: { item } });

  return (
    <div className="results-wrap" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Saved items ({items.length})</h2>
        <div>
          <button className="btn-ghost" onClick={() => navigate("/")}>Back</button>
          <button className="btn-ghost" style={{ marginLeft: 8 }} onClick={clearAll}>Clear all</button>
        </div>
      </div>

      {!items.length ? (
        <div style={{ marginTop: 20 }}>
          <p>You haven't saved anything yet. Tap ♥ on deals or stories to save them here.</p>
          <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => navigate("/")}>Explore deals</button>
        </div>
      ) : (
        <div className="top-deals-grid" style={{ marginTop: 18 }}>
          {items.map((r) => (
            <motion.article
              key={r.id}
              className="card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, scale: 1.01 }}
            >
              <img src={r.img} alt={r.city} className="card-media" />
              <div className="card-body">
                <h4 className="city-gradient">{r.city}</h4>
                <p className="price">Starting from <strong>{r.price ?? "—"}</strong></p>
                <div className="card-actions">
                  <button className="btn-primary" onClick={() => goExplore(r)}>Explore</button>
                  <button className="btn-ghost" onClick={() => goBook(r)}>Book</button>
                  <button className="btn-ghost" onClick={() => removeItem(r.id)}>Remove</button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
