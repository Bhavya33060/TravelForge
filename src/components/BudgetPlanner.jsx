// src/components/BudgetPlanner.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell } from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./BudgetPlanner.css";

/*
  Advanced Budget Planner — cleaned file:
  - Single chart+legend/totals/export area (no duplicates)
  - Back button included
  - Same features preserved
*/

const CATEGORY_COLORS = {
  Transport: "#3ee3c6",
  Food: "#ffd166",
  Accommodation: "#9b5cff",
  Activities: "#ff7b7b",
  Shopping: "#7bd389",
  Other: "#7aa2ff",
};

const STORAGE_KEY = "bg_budget_v1";
const TEMPLATES_KEY = "bg_budget_templates_v1";
const LIMITS_KEY = "bg_budget_limits_v1";

function fmtCurrency(amount, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toLocaleString()}`;
  }
}

/* ---------------- CustomSelect (color swatches) ---------------- */
function CustomSelect({ options = [], value, onChange, ariaLabel = "Select", placeholder = "", className = "" }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => { if (!open) setHighlight(null); }, [open]);

  function handleKey(e) {
    if (!open && (e.key === "ArrowDown" || e.key === " " || e.key === "Enter")) { e.preventDefault(); setOpen(true); return; }
    if (open) {
      if (e.key === "Escape") { setOpen(false); ref.current?.querySelector(".trigger")?.focus(); }
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlight(h => (h === null ? 0 : Math.min(h + 1, options.length - 1))); }
      if (e.key === "ArrowUp") { e.preventDefault(); setHighlight(h => (h === null ? options.length - 1 : Math.max(h - 1, 0))); }
      if (e.key === "Enter" && highlight !== null) { e.preventDefault(); const opt = options[highlight]; onChange(opt.value ?? opt); setOpen(false); }
    }
  }

  const selected = options.find(o => (typeof o === "object" ? o.value === value : o === value));

  return (
    <div ref={ref} className={`custom-select ${className}`} onKeyDown={handleKey}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="trigger"
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {selected && selected.color && <div className="color-swatch" style={{ background: selected.color }} />}
          <div className="label">{selected ? (selected.label ?? selected.value ?? selected) : placeholder}</div>
        </div>
        <div className="chev">▾</div>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.12 }}
          className="custom-select-panel"
          role="listbox"
          tabIndex={-1}
        >
          {options.map((opt, i) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const label = typeof opt === "object" ? (opt.label ?? opt.value) : opt;
            const color = typeof opt === "object" ? opt.color : null;
            const selectedFlag = val === value;
            return (
              <div
                key={`${val}-${i}`}
                role="option"
                aria-selected={selectedFlag}
                className="custom-select-option"
                onMouseEnter={() => setHighlight(i)}
                onMouseLeave={() => setHighlight(null)}
                onClick={() => { onChange(val); setOpen(false); }}
              >
                {color ? <div className="color-swatch" style={{ background: color }} /> : <div style={{ width: 14 }} />}
                <div style={{ flex: 1 }}>{label}</div>
                <div className="muted">{selectedFlag ? "Selected" : ""}</div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/* ---------------- Expense Editor ---------------- */
function ExpenseEditor({ item, onSave, onCancel }) {
  const [eName, setEName] = useState(item.name);
  const [eAmount, setEAmount] = useState(item.amount);
  const [eCategory, setECategory] = useState(item.category);
  const [eDate, setEDate] = useState(item.date);
  const [eRecurring, setERecurring] = useState(item.recurring);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input className="cute-input" value={eName} onChange={(e) => setEName(e.target.value)} />
      <input className="cute-input" style={{ width: 110 }} value={eAmount} onChange={(e) => setEAmount(e.target.value)} type="number" />
      <select className="cute-input" value={eCategory} onChange={(e) => setECategory(e.target.value)} style={{ width: 140 }}>
        {Object.keys(CATEGORY_COLORS).map((c) => (<option key={c}>{c}</option>))}
      </select>
      <input className="cute-input" type="date" value={eDate} onChange={(e) => setEDate(e.target.value)} style={{ width: 150 }} />
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" checked={eRecurring} onChange={() => setERecurring(r => !r)} /> Recurring
      </label>
      <button className="btn-cute" onClick={() => onSave({ name: eName, amount: Number(eAmount), category: eCategory, date: eDate, recurring: eRecurring })}>Save</button>
      <button className="btn-ghost" onClick={onCancel}>Cancel</button>
    </div>
  );
}

/* ---------------- Main Component ---------------- */
export default function BudgetPlanner() {
  const nameRef = useRef(null);

  // states
  const [currency, setCurrency] = useState("USD");
  const [mode, setMode] = useState("Trip");
  const [goal, setGoal] = useState(1200);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Transport");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [recurring, setRecurring] = useState(false);

  const [expenses, setExpenses] = useState([
    { id: 1, name: "Flight (est)", amount: 420, category: "Transport", date: "2025-10-11", recurring: false },
    { id: 2, name: "Hotel (4 nights)", amount: 360, category: "Accommodation", date: "2025-10-12", recurring: false },
    { id: 3, name: "Food & Snacks", amount: 150, category: "Food", date: "2025-10-13", recurring: false },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [bufferPercent, setBufferPercent] = useState(15);
  const [templates, setTemplates] = useState([]);
  const [categoryLimits, setCategoryLimits] = useState({});
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // load persisted data
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.goal) setGoal(parsed.goal);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.mode) setMode(parsed.mode);
      }
      const tplRaw = localStorage.getItem(TEMPLATES_KEY);
      if (tplRaw) setTemplates(JSON.parse(tplRaw));
      const limitsRaw = localStorage.getItem(LIMITS_KEY);
      if (limitsRaw) setCategoryLimits(JSON.parse(limitsRaw));
    } catch (e) {
      console.warn("load error", e);
    }
  }, []);

  // autosave minimal
  useEffect(() => {
    const payload = { expenses, goal, currency, mode, updatedAt: new Date().toISOString() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch (e) {}
  }, [expenses, goal, currency, mode]);

  // keyboard shortcut to focus name (n)
  useEffect(() => {
    const h = (e) => {
      if (e.key === "n" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); nameRef.current?.focus(); }
      if (e.key === "Escape") setEditingId(null);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // derived values
  const total = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount || 0), 0), [expenses]);
  const breakdown = useMemo(() => {
    const map = {};
    Object.keys(CATEGORY_COLORS).forEach(c => (map[c] = 0));
    expenses.forEach(e => (map[e.category] = (map[e.category] || 0) + Number(e.amount || 0)));
    return Object.entries(map).filter(([_, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [expenses]);
  const recurringCount = useMemo(() => expenses.filter(x => x.recurring).length, [expenses]);
  const projected = useMemo(() => Math.round(total * (1 + bufferPercent / 100)), [total, bufferPercent]);
  const progress = Math.min(100, Math.round((total / (goal || 1)) * 100));

  // search + sort applied list
  const filteredSortedExpenses = useMemo(() => {
    const ft = filterText.trim().toLowerCase();
    let arr = expenses.filter(e =>
      (!ft || e.name.toLowerCase().includes(ft) || e.category.toLowerCase().includes(ft) || e.date.includes(ft))
    );
    if (sortBy === "newest") arr = arr.sort((a, b) => b.id - a.id);
    if (sortBy === "oldest") arr = arr.sort((a, b) => a.id - b.id);
    if (sortBy === "amt-high") arr = arr.sort((a, b) => b.amount - a.amount);
    if (sortBy === "amt-low") arr = arr.sort((a, b) => a.amount - b.amount);
    return arr;
  }, [expenses, filterText, sortBy]);

  // category totals and limit checking
  const categoryTotals = useMemo(() => {
    const t = {};
    Object.keys(CATEGORY_COLORS).forEach(c => (t[c] = 0));
    expenses.forEach(e => t[e.category] = (t[e.category] || 0) + Number(e.amount || 0));
    return t;
  }, [expenses]);

  const overBudgetCategories = useMemo(() => {
    return Object.entries(categoryLimits)
      .filter(([cat, limit]) => limit && (categoryTotals[cat] || 0) > Number(limit))
      .map(([cat]) => cat);
  }, [categoryLimits, categoryTotals]);

  // actions
  function addExpense() {
    if (!name || !amount || Number(amount) <= 0) { alert("Please provide a name and a positive amount."); return; }
    const newItem = { id: Date.now(), name: name.trim(), amount: Number(amount), category, date, recurring };
    setExpenses(s => [newItem, ...s]);
    setName(""); setAmount(""); setRecurring(false);
  }

  function startEdit(id) { setEditingId(id); }
  function saveEdit(id, edited) { setExpenses(s => s.map(it => (it.id === id ? { ...it, ...edited } : it))); setEditingId(null); }
  function removeExpense(id) { setExpenses(s => s.filter(i => i.id !== id)); }

  function exportCSV() {
    const header = ["Name", "Amount", "Category", "Date", "Recurring"];
    const rows = expenses.map(e => [e.name, e.amount, e.category, e.date, e.recurring]);
    const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `budget-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  function exportJSON() {
    const payload = { expenses, goal, currency, mode, updatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `budget-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
  }

  function exportPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Budget Planner Report", 40, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Currency: ${currency}    Mode: ${mode}`, 40, 72);
    doc.text(`Goal: ${fmtCurrency(goal, currency)}    Total Spent: ${fmtCurrency(total, currency)}    Progress: ${progress}%`, 40, 88);

    const rows = expenses.map(e => [e.name, fmtCurrency(e.amount, currency), e.category, e.date, e.recurring ? "Yes" : "No"]);
    doc.autoTable({
      startY: 110,
      head: [["Name", "Amount", "Category", "Date", "Recurring"]],
      body: rows,
      theme: "grid",
      headStyles: { fillColor: [30, 40, 40] },
    });
    doc.save(`budget-report-${new Date().toISOString().slice(0,10)}.pdf`);
  }

  function smartSuggest() {
    const defaultSuggest = mode === "Trip" ? Math.max(500, Math.round(total * 1.25)) : Math.max(800, Math.round(total * 1.2));
    setGoal(defaultSuggest);
  }

  function resetAll() {
    if (!confirm("Reset all expenses and settings?")) return;
    setExpenses([]); setGoal(0); setCurrency("USD"); setMode("Trip"); localStorage.removeItem(STORAGE_KEY);
  }

  // Templates
  function saveTemplate(nameForTemplate) {
    if (!nameForTemplate) return alert("Give your template a name.");
    const tpl = { id: Date.now(), name: nameForTemplate, createdAt: new Date().toISOString(), expenses, goal, currency, mode };
    const newTpls = [tpl, ...templates].slice(0, 10);
    setTemplates(newTpls);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(newTpls));
    alert("Template saved!");
  }

  function loadTemplate(id) {
    const tpl = templates.find(t => t.id === id);
    if (!tpl) return;
    setExpenses(tpl.expenses || []); setGoal(tpl.goal || 0); setCurrency(tpl.currency || "USD"); setMode(tpl.mode || "Trip");
    alert(`Loaded template: ${tpl.name}`);
  }

  function deleteTemplate(id) {
    const newTpls = templates.filter(t => t.id !== id);
    setTemplates(newTpls);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(newTpls));
  }

  // Category limits
  function setCategoryLimit(cat, value) {
    const next = { ...categoryLimits, [cat]: value ? Number(value) : 0 };
    setCategoryLimits(next);
    try { localStorage.setItem(LIMITS_KEY, JSON.stringify(next)); } catch {}
  }

  const categoryOptions = Object.keys(CATEGORY_COLORS).map(k => ({ value: k, label: k, color: CATEGORY_COLORS[k] }));

  return (
    <div className="budget-planner">
      <div className="container">

        {/* Back button (top-left in container) */}
        <div style={{ marginBottom: 16 }}>
          <button
            className="btn-ghost"
            onClick={() => window.history.back()}
            style={{ fontWeight: 700 }}
            aria-label="Go back"
          >
            ← Back
          </button>
        </div>

        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div>
            <h1 className="cute-heading">✨ Budget Planner ^ _ ^</h1>
            <p className="muted">Smart tools, templates, filters, and printable reports — everything to impress.</p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CustomSelect options={["USD","EUR","INR","JPY"].map(c=>({value:c,label:c}))} value={currency} onChange={setCurrency} className="select-small"/>
            <button className="btn-cute" onClick={exportCSV}>Export CSV</button>
            <button className="btn-ghost" onClick={exportJSON}>Export JSON</button>
            <button className="btn-cute" onClick={exportPDF}>Export PDF</button>
            <button className="btn-ghost" onClick={resetAll}>Reset</button>
          </div>
        </div>

        {/* search + sort */}
        <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center" }}>
          <input className="cute-input" style={{ flex: 1 }} placeholder="Search expenses, category, or date..." value={filterText} onChange={(e)=>setFilterText(e.target.value)} />
          <CustomSelect
            options={[
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "amt-high", label: "Amount: high → low" },
              { value: "amt-low", label: "Amount: low → high" },
            ]}
            value={sortBy}
            onChange={setSortBy}
            className="select-small"
          />
          <button className="btn-ghost" onClick={() => { setFilterText(""); setSortBy("newest"); }}>Clear</button>
        </div>

        <div style={{ height: 18 }} />

        <div className="grid-3">
          {/* left panel (form + controls) */}
          <motion.div initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="cute-heading" style={{ fontSize: 16 }}>Add Expense</h2>
              <div>
                <button className="btn-ghost" onClick={() => setMode(m => m === "Trip" ? "Monthly" : "Trip")}>Mode: {mode}</button>
              </div>
            </div>

           <p style={{ color: "#000" }}>Smart tools, templates, filters, and printable reports — everything to impress.</p>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="Expense name (eg. local train)" className="cute-input" aria-label="Expense name" />
              <div style={{ display: "flex", gap: 10 }}>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="cute-input" placeholder={`Amount (${currency})`} aria-label="Amount" />
                <CustomSelect options={categoryOptions} value={category} onChange={(v)=>setCategory(v)} className="select-medium" />
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="cute-input" style={{ width: 170 }} />
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={recurring} onChange={() => setRecurring(r => !r)} /> Recurring
                </label>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-cute" onClick={addExpense}>Add</button>
                <button className="btn-ghost" onClick={() => { setName(""); setAmount(""); setRecurring(false); }}>Clear</button>
                <button className="btn-ghost" onClick={smartSuggest}>Smart Suggest</button>
              </div>

              {/* goal + buffer */}
              <div style={{ marginTop: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div className="muted">Goal</div>
                    <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="cute-input" style={{ width: 150, marginTop: 6 }} />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="muted">Used</div>
                    <div style={{ fontWeight: 800 }}>{fmtCurrency(total, currency)}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                    <div className="muted" style={{ marginTop: 6 }}>Progress: {progress}%</div>
                    {total > goal && <div style={{ color: "#ff9b9b", marginTop: 6, fontWeight: 800 }}>Alert: You're over your goal!</div>}
                  </div>
                  <div style={{ width: 140 }}>
                    <div className="muted">Buffer</div>
                    <input type="range" min={0} max={50} value={bufferPercent} onChange={(e) => setBufferPercent(Number(e.target.value))} style={{ width: "100%" }} />
                    <div style={{ fontSize: 12, marginTop: 4 }}>{bufferPercent}% — projected {fmtCurrency(projected, currency)}</div>
                  </div>
                </div>
              </div>

              {/* templates */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                <button className="btn-ghost" onClick={() => {
                  const nameTpl = prompt("Template name?");
                  if (nameTpl) saveTemplate(nameTpl);
                }}>Save Template</button>
                <div style={{ display: "flex", gap: 6, alignItems: "center", overflowX: "auto" }}>
                  {templates.slice(0, 6).map(t => (
                    <div key={t.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button className="btn-ghost" onClick={() => loadTemplate(t.id)}>{t.name}</button>
                      <button className="btn-ghost" onClick={() => { if (confirm("Delete template?")) deleteTemplate(t.id); }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* category limits */}
              <div style={{ marginTop: 8 }}>
                <div className="muted">Category limits (set to get alerted when a category exceeds its limit)</div>
                <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                  {Object.keys(CATEGORY_COLORS).map(cat => (
                    <div key={cat} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 12, height: 12, borderRadius: 999, background: CATEGORY_COLORS[cat] }} />
                      <div style={{ flex: 1, fontWeight: 700 }}>{cat}</div>
                      <input className="cute-input" style={{ width: 110 }} placeholder="limit" value={categoryLimits[cat] || ""} onChange={(e) => setCategoryLimit(cat, e.target.value)} />
                      <div style={{ width: 120, textAlign: "right", fontWeight: 800 }}>{fmtCurrency(categoryTotals[cat] || 0, currency)}</div>
                      {categoryLimits[cat] && (categoryTotals[cat] || 0) > Number(categoryLimits[cat]) && <div style={{ color: "#ff9b9b", fontWeight: 800, marginLeft: 6 }}>Over</div>}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>

          {/* right panel (breakdown + details) */}
          <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06 }} className="card" style={{ minHeight: 520 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 260 }}>
                <h3 className="cute-heading">Expense Breakdown</h3>
                <p className="muted">Hover slices to view amounts. Categories over their limit are marked.</p>

                {/* ===== Chart wrapper (pie + legend + totals + exports) ===== */}
                <div className="chart-wrapper-card" style={{ marginTop: 12 }}>
                  <div className="chart-box" aria-hidden>
                    {Array.isArray(breakdown) && breakdown.length > 0 && total > 0 ? (
                      <PieChart width={240} height={240}>
                        <Pie
                          data={breakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={56}
                          outerRadius={98}
                          paddingAngle={6}
                        >
                          {breakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || "#8884d8"} />
                          ))}
                        </Pie>
                      </PieChart>
                    ) : (
                      <div className="chart-empty">No data</div>
                    )}
                  </div>

                  <div className="chart-legend" role="list" aria-label="Expense categories legend">
                    {/* totals block at top */}
                    <div className="legend-overview">
                      <div className="legend-overview-left">
                        <div className="muted">Total</div>
                        <div className="legend-total">{fmtCurrency(total, currency)}</div>
                      </div>
                      <div className="legend-overview-right">
                        <div className="muted">Goal</div>
                        <div className="legend-goal">{fmtCurrency(goal, currency)}</div>
                      </div>
                    </div>

                    {/* each legend row */}
                    <div className="legend-list">
                      {breakdown.map((b) => {
                        const pct = Math.round((b.value / (total || 1)) * 100);
                        return (
                          <div key={b.name} className="legend-item" role="listitem">
                            <div className="legend-dot" style={{ background: CATEGORY_COLORS[b.name] }} aria-hidden />
                            <div className="legend-label">{b.name}</div>
                            <div className="legend-value">{fmtCurrency(b.value, currency)}</div>
                            <div className="legend-percent">{pct}%</div>
                          </div>
                        );
                      })}
                      {breakdown.length === 0 && <div className="muted">No expenses — add one to get started.</div>}
                    </div>

                    {/* action buttons (only here) */}
                    <div className="legend-actions">
                      <button className="btn-cute" onClick={exportCSV}>Quick Export CSV</button>
                      <button className="btn-cute" onClick={exportJSON}>Quick Export JSON</button>
                      <button className="btn-cute" onClick={exportPDF}>Download PDF</button>
                    </div>
                  </div>
                </div>
                {/* ===== end chart wrapper ===== */}

                {/* NOTE: removed duplicate totals/export buttons that were causing overlap */}
              </div>

              <div style={{ flex: 1 }}>
                <h3 className="cute-heading" style={{ fontSize: 15 }}>Details & Advanced Options</h3>
                <p className="muted">Organize, forecast, and set automation rules.</p>

                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div className="muted">Auto-adjust budget</div>
                      <div style={{ fontWeight: 800 }}>Smart buffer: {bufferPercent}%</div>
                    </div>
                    <div className="muted">Recommended</div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div className="muted">Recurring expenses</div>
                      <div style={{ fontWeight: 800 }}>{recurringCount} active</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="muted">Forecast</div>
                      <div style={{ fontWeight: 800 }}>{fmtCurrency(projected, currency)}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className="muted">Pro-tip</div>
                      <div style={{ fontWeight: 800 }}>Save on transport: group passes</div>
                    </div>
                    <div><button className="btn-ghost" onClick={() => { navigator.clipboard?.writeText("Save on transport: group passes"); alert("Tip copied!"); }}>Copy Tip</button></div>
                  </div>

                  <div>
                    <div className="muted">Templates</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                      {templates.length === 0 && <div className="muted">No templates saved</div>}
                      {templates.map(t => (
                        <div key={t.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <button className="btn-ghost" onClick={() => loadTemplate(t.id)}>{t.name}</button>
                          <button className="btn-ghost" onClick={() => deleteTemplate(t.id)}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Note: export buttons intentionally kept in chart legend area to avoid duplication/overlap */}
                </div>
              </div>
            </div>

            {/* expense list (with search/sort applied) */}
            <div style={{ marginTop: 18 }}>
              <h4 style={{ marginBottom: 8 }}>Expenses ({filteredSortedExpenses.length})</h4>
              <div className="expenses-grid">
                {filteredSortedExpenses.length === 0 && <div className="muted">No expenses match your search.</div>}
                {filteredSortedExpenses.map((e) => (
                  <div key={e.id} className="expense-item" role="group" aria-label={`${e.name} ${fmtCurrency(e.amount, currency)}`}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: CATEGORY_COLORS[e.category], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#04110f" }}>
                        {e.category[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{e.name}</div>
                        <div className="muted" style={{ fontSize: 13 }}>{e.date} • {e.category} {e.recurring ? "• Recurring" : ""}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ fontWeight: 800 }}>{fmtCurrency(e.amount, currency)}</div>
                      {editingId === e.id ? (
                        <ExpenseEditor item={e} onSave={(edited) => saveEdit(e.id, edited)} onCancel={() => setEditingId(null)} />
                      ) : (
                        <>
                          <button className="btn-ghost" onClick={() => startEdit(e.id)} aria-label="Edit">Edit</button>
                          <button className="btn-ghost" onClick={() => removeExpense(e.id)} aria-label="Remove">Remove</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>

        {/* footer CTA */}
        <div style={{ marginTop: 26, textAlign: "center" }}>
          <div style={{ display: "inline-flex", gap: 12, padding: 12, borderRadius: 12, background: "linear-gradient(90deg, rgba(126,232,199,0.06), rgba(255,211,107,0.04))" }}>
            <div style={{ fontWeight: 800 }}>You're ready to impress ✨</div>
            <div className="muted">Use Export PDF to create a printable report — or export JSON to backup your data.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
