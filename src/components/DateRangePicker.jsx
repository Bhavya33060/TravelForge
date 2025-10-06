// DateRangePicker.jsx — updated (only open-control additions)
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./DateRangePicker.css";

/* Helpers unchanged... */
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const monthName = (y, m) =>
  new Date(y, m, 1).toLocaleString("default", { month: "long", year: "numeric" });
const isoFor = (y, m, d) => (d ? new Date(y, m, d).toISOString().slice(0, 10) : null);
function buildMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const days = daysInMonth(year, month);
  const matrix = [];
  let row = new Array(7).fill(null);
  let day = 1;
  for (let i = firstDay; i < 7; i++) row[i] = day++;
  matrix.push(row);
  while (day <= days) {
    row = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= days; i++) row[i] = day++;
    matrix.push(row);
  }
  while (matrix.length < 6) matrix.push(new Array(7).fill(null));
  return matrix;
}

/*
 Props added:
  - isOpen (optional) : boolean to control popup from parent
  - onOpenChange (optional) : function(newOpen) called when picker wants to change open state
Other behavior unchanged.
*/
export default function DateRangePicker({
  startDate = "",
  endDate = "",
  onChange,
  placeholderStart = "Start date",
  placeholderEnd = "End date",
  autoClose = true,
  isOpen: controlledOpen = undefined,
  onOpenChange = undefined
}) {
  const internallyControlled = typeof controlledOpen === "undefined";
  const [openInternal, setOpenInternal] = useState(false);
  const open = internallyControlled ? openInternal : controlledOpen;
  // when we change internal open state notify parent if they provided onOpenChange
  const setOpen = (v) => {
    if (internallyControlled) setOpenInternal(v);
    if (typeof onOpenChange === "function") onOpenChange(v);
  };

  const [displayYear, setDisplayYear] = useState(() => new Date().getFullYear());
  const [displayMonth, setDisplayMonth] = useState(() => new Date().getMonth());
  const [selStart, setSelStart] = useState(startDate || "");
  const [selEnd, setSelEnd] = useState(endDate || "");
  const [cursor, setCursor] = useState("start");
  const rootRef = useRef();
  const popupRef = useRef();

  useEffect(() => { setSelStart(startDate || ""); setSelEnd(endDate || ""); }, [startDate, endDate]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target) && !popupRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const prevMonth = () => {
    let m = displayMonth - 1, y = displayYear;
    if (m < 0) { m = 11; y -= 1; }
    setDisplayMonth(m); setDisplayYear(y);
  };
  const nextMonth = () => {
    let m = displayMonth + 1, y = displayYear;
    if (m > 11) { m = 0; y += 1; }
    setDisplayMonth(m); setDisplayYear(y);
  };

  const setRange = (s, e) => {
    setSelStart(s || "");
    setSelEnd(e || "");
    onChange && onChange({ startDate: s || "", endDate: e || "" });
  };

  const handleDayClick = (y, m, d) => {
    if (!d) return;
    const ds = isoFor(y, m, d);
    if (cursor === "start") {
      if (selEnd && new Date(ds) > new Date(selEnd)) {
        setRange(ds, "");
      } else {
        setRange(ds, selEnd);
      }
      setCursor("end");
    } else {
      if (!selStart) {
        setRange(ds, "");
        setCursor("end");
        return;
      }
      const startObj = new Date(selStart);
      const endObj = new Date(ds);
      if (endObj < startObj) {
        setRange(ds, selStart);
      } else {
        setRange(selStart, ds);
      }
      if (autoClose) setOpen(false);
    }
  };

  const clear = () => setRange("", "");
  const today = () => {
    const t = new Date();
    setDisplayYear(t.getFullYear()); setDisplayMonth(t.getMonth());
  };

  const popup = (
    <div className={`drp-popup-outer ${open ? "open" : ""}`} ref={popupRef} role="dialog" aria-modal="false">
      <div className="drp-popup">
        <div className="drp-header">
          <div className="drp-nav">
            <button onClick={prevMonth} aria-label="Previous month" className="drp-arrow">‹</button>
            <div className="drp-month-title" aria-hidden>{monthName(displayYear, displayMonth)}</div>
            <button onClick={nextMonth} aria-label="Next month" className="drp-arrow">›</button>
          </div>

          <div className="drp-actions">
            <button className="drp-clear" onClick={clear}>Clear</button>
            <button className="drp-today" onClick={today}>Today</button>
          </div>
        </div>

        <div className="drp-cal-wrap">
          {[0,1].map((offset) => {
            const mIdx = displayMonth + offset;
            const y = displayYear + Math.floor(mIdx / 12);
            const m = ((mIdx % 12) + 12) % 12;
            const matrix = buildMonthMatrix(y, m);
            return (
              <div key={offset} className="drp-month-panel">
                <div className="drp-month-name">{monthName(y, m)}</div>
                <div className="drp-weekdays">{["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <span key={d}>{d}</span>)}</div>

                <div className="drp-grid">
                  {matrix.map((week, widx) => (
                    <div className="drp-week" key={widx}>
                      {week.map((day, i) => {
                        const iso = day ? isoFor(y, m, day) : null;
                        const isStart = selStart && iso === selStart;
                        const isEnd = selEnd && iso === selEnd;
                        const inRange = selStart && selEnd && iso && (new Date(iso) >= new Date(selStart) && new Date(iso) <= new Date(selEnd));
                        return (
                          <button
                            key={i}
                            className={[
                              "drp-day",
                              !day ? "empty" : "",
                              isStart ? "start" : "",
                              isEnd ? "end" : "",
                              inRange ? "inrange" : ""
                            ].join(" ")}
                            disabled={!day}
                            onClick={() => handleDayClick(y, m, day)}
                          >
                            {day || ""}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="drp-legend">
          <div><span className="chip cheap" /> Cheaper</div>
          <div><span className="chip avg" /> Average</div>
          <div><span className="chip high" /> Higher</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="drp-root" ref={rootRef}>
      <div className="drp-controls">
        <button
          type="button"
          className="drp-input"
          onClick={() => { setCursor("start"); setOpen(true); }}
        >
          <small>From</small>
          <span>{selStart || placeholderStart}</span>
        </button>

        <div className="drp-sep">—</div>

        <button
          type="button"
          className="drp-input"
          onClick={() => { setCursor("end"); setOpen(true); }}
        >
          <small>To</small>
          <span>{selEnd || placeholderEnd}</span>
        </button>

        <button type="button" className="drp-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
          ▾
        </button>
      </div>

      {open && ReactDOM.createPortal(popup, document.body)}
    </div>
  );
}
