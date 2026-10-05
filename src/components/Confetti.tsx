"use client";

import { useEffect, useState } from "react";

const COLORS = ["#E8721C", "#F4A261", "#22c55e", "#E8721C", "#F4A261"];

function randomPieces(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${5 + Math.random() * 90}%`,
    size: `${6 + Math.random() * 6}px`,
    color: COLORS[i % COLORS.length],
    delay: `${Math.random() * 0.4}s`,
    dur: `${1.2 + Math.random() * 0.6}s`,
    rot: `${600 + Math.random() * 400}deg`,
  }));
}

export function Confetti() {
  const [pieces, setPieces] = useState<ReturnType<typeof randomPieces>>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    setPieces(randomPieces(25));
    const timer = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            "--confetti-x": p.x,
            "--confetti-size": p.size,
            "--confetti-color": p.color,
            "--confetti-delay": p.delay,
            "--confetti-dur": p.dur,
            "--confetti-rot": p.rot,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
