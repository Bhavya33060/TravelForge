// src/pages/Checklist.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checklist.css";

export default function Checklist() {
  const location = useLocation();
  const navigate = useNavigate();

  // read state or query param
  const from = location?.state?.from || new URLSearchParams(location.search).get("from") || "";

  // default (generic) checklist
  const DEFAULT_ITEMS = [
    "Light cotton clothes 👕",
    "Sunglasses 🕶️",
    "Power bank 🔋",
    "Reusable water bottle 💧",
    "Travel journal 📓",
    "Snacks 🍫",
    "Camera 📷",
  ];

  // Harshi / City & Sea specific checklist
  const HARSHI_ITEMS = [
    "Light scarf or shawl (evenings are breezy) 🧣",
    "Small cash in local currency 💵",
    "Comfortable walking shoes 👟",
    "Portable umbrella or rain shell ☂️",
    "Reusable coffee cup (support local cafes!) ☕️",
    "Compact camera or phone gimbal 📷",
    "Notebook & favorite pen for cafe notes ✍️",
  ];

  const initialItems = useMemo(() => {
    if (from === "city-and-sea") return HARSHI_ITEMS;
    if (from === "sunset-escapes")
      return [
        "Light jacket (sunset chills) 🧥",
        "Sunglasses & sunscreen 🕶️☀️",
        "Portable tripod for long exposures 📷",
        "Small towel / blanket for beach sit-down 🧴",
        "Headlamp or torch for late walks 🔦",
      ];
    // default
    return DEFAULT_ITEMS;
  }, [from]);

  return (
    <div className="checklist-root" style={{ position: "relative", paddingTop: 18 }}>
      {/* Back button (uses history) */}
      <button
        aria-label="Go back"
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          left: 8,
          top: 8,
          background: "rgba(0,0,0,0.35)",
          color: "#e6fff7",
          border: "1px solid rgba(255,255,255,0.04)",
          padding: "8px 10px",
          borderRadius: 10,
          cursor: "pointer",
          fontWeight: 700,
          zIndex: 40,
        }}
      >
        ← Back
      </button>

      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        📝 Travel Checklist
      </motion.h1>
      <p className="checklist-sub">Pack smart, travel light ✨</p>

      <ul className="checklist-list">
        {initialItems.map((item, i) => (
          <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
            <input type="checkbox" id={`item-${i}`} />
            <label htmlFor={`item-${i}`}>{item}</label>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
