"use client";
import { useEffect, useRef } from "react";

const GlowCard = ({ children, identifier }) => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;

    const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 12,
      gap: 32,
      vertical: false,
      opacity: 0,
    };

    const updateGlow = (event) => {
      const bounds = card.getBoundingClientRect();
      const isNear =
        event?.x > bounds.left - CONFIG.proximity &&
        event?.x < bounds.right + CONFIG.proximity &&
        event?.y > bounds.top - CONFIG.proximity &&
        event?.y < bounds.bottom + CONFIG.proximity;

      card.style.setProperty("--active", isNear ? 1 : CONFIG.opacity);

      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      let angle = (Math.atan2(event?.y - centerY, event?.x - centerX) * 180) / Math.PI;
      if (angle < 0) angle += 360;

      card.style.setProperty("--start", angle + 90);
    };

    const restyle = () => {
      container.style.setProperty("--gap", CONFIG.gap);
      container.style.setProperty("--blur", CONFIG.blur);
      container.style.setProperty("--spread", CONFIG.spread);
      container.style.setProperty("--direction", CONFIG.vertical ? "column" : "row");
    };

    restyle();

    container.addEventListener("pointermove", updateGlow);
    return () => container.removeEventListener("pointermove", updateGlow);
  }, [identifier]);

  return (
    <div
      ref={containerRef}
      className={`glow-container-${identifier} glow-container`}
    >
      <article
        ref={cardRef}
        className={`glow-card glow-card-${identifier} h-fit cursor-pointer border border-[#2a2e5a] transition-all duration-300 relative bg-[#000000] text-gray-200 rounded-xl hover:border-transparent w-full`}
      >
        <div className="glows"></div>
        {children}
      </article>
    </div>
  );
};

export default GlowCard;
