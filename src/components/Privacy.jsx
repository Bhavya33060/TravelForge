import React from "react";
import { motion } from "framer-motion";
import { Shield, Info, Cookie, UserCheck, Plane, Globe2, Cloud } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      icon: <Info color="#38bdf8" size={30} />,
      title: "What We Collect ✈️",
      text: "We only collect what makes your journey smoother — like the destinations you search, preferences, and feedback — so every trip feels truly yours.",
    },
    {
      icon: <Shield color="#34d399" size={30} />,
      title: "How We Use It 🌍",
      text: "Your data helps us personalize experiences, suggest dream destinations, and enhance your travel adventures across the globe.",
    },
    {
      icon: <Cookie color="#facc15" size={30} />,
      title: "Cookies & Comfort 🍪",
      text: "Cookies help remember your favorite getaways, keep pages snappy, and show personalized recommendations.",
    },
    {
      icon: <UserCheck color="#f472b6" size={30} />,
      title: "Your Privacy Rights 💙",
      text: "You can request data deletion or disable cookies anytime. Your peace of mind is part of our journey together.",
    },
  ];

  const pageStyle = {
    minHeight: "100vh",
    background:
      "linear-gradient(120deg, #dff6ff, #ffffff, #e8fce8, #fff5e0, #e0f7fa)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 12s ease infinite",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "100px 20px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
  };

  const gradientKeyframes = `
    @keyframes gradientMove {
      0% {background-position: 0% 50%;}
      50% {background-position: 100% 50%;}
      100% {background-position: 0% 50%;}
    }
  `;

  const headerStyle = {
    fontSize: "52px",
    fontWeight: "800",
    color: "#0369a1",
    marginBottom: "10px",
    textAlign: "center",
    textShadow: "0 3px 6px rgba(0,0,0,0.1)",
  };

  const textStyle = {
    color: "#374151",
    fontSize: "17px",
    textAlign: "center",
    maxWidth: "680px",
    marginBottom: "60px",
    lineHeight: "1.7",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "35px",
    maxWidth: "1100px",
    width: "100%",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    border: "1px solid #bae6fd",
    transition: "all 0.4s ease",
    backdropFilter: "blur(10px)",
  };

  const cardHover = {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 30px rgba(59,130,246,0.3)",
  };

  const footerBox = {
    marginTop: "90px",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    border: "1px solid #bae6fd",
    borderRadius: "22px",
    padding: "28px 35px",
    maxWidth: "700px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  };

  return (
    <div style={pageStyle}>
      <style>{gradientKeyframes}</style>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{
          position: "absolute",
          top: "80px",
          left: "60px",
          color: "#7dd3fc",
        }}
      >
        <Plane size={46} style={{ transform: "rotate(12deg)" }} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{
          position: "absolute",
          bottom: "100px",
          right: "70px",
          color: "#86efac",
        }}
      >
        <Globe2 size={50} />
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        style={{
          position: "absolute",
          top: "200px",
          right: "150px",
          color: "#e0f2fe",
        }}
      >
        <Cloud size={60} />
      </motion.div>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={headerStyle}
      >
        Our Privacy Promise 🌿
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={textStyle}
      >
        At <span style={{ color: "#0284c7", fontWeight: "600" }}>TravelForge</span>, we protect your
        data like a travel companion guards memories — with care, warmth, and respect.
      </motion.p>

      {/* Info Cards */}
      <div style={gridStyle}>
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            style={cardStyle}
            whileHover={cardHover}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: "#eff6ff",
                  borderRadius: "50%",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {section.icon}
              </div>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
                {section.title}
              </h2>
            </div>
            <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.6" }}>
              {section.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={footerBox}
      >
        <p style={{ color: "#374151", fontSize: "15px", lineHeight: "1.7" }}>
          🌸 <span style={{ color: "#0284c7", fontWeight: "600" }}>TravelForge</span> respects your
          digital footprint. We never sell or misuse your data — it’s used only to create the most
          beautiful travel experiences for you.
        </p>
        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
          (This privacy policy is a demonstration page. No real data is collected.)
        </p>
      </motion.div>
    </div>
  );
}
