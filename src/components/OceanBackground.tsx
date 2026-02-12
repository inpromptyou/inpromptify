"use client";

export default function OceanBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden ocean-bg">
      {/* Base gradient layer */}
      <div className="absolute inset-0 ocean-gradient" />

      {/* Animated wave layers */}
      <div className="absolute inset-0 ocean-wave-1" />
      <div className="absolute inset-0 ocean-wave-2" />
      <div className="absolute inset-0 ocean-wave-3" />

      {/* Caustic light rays */}
      <div className="absolute inset-0 ocean-caustics" />

      {/* Floating particles / bubbles */}
      <div className="absolute inset-0 ocean-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="ocean-particle" />
        ))}
      </div>
    </div>
  );
}
