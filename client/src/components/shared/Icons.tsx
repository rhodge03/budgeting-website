import React, { type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const defaults: IconProps = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

// ── Category Icons ──────────────────────────────────────────

export function GridIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function DollarIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export function VaultIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="9" x2="12" y2="7" />
      <line x1="2" y1="20" x2="5" y2="20" />
      <line x1="19" y1="20" x2="22" y2="20" />
    </svg>
  );
}

export function SunsetIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="9" x2="12" y2="3" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
    </svg>
  );
}

export function CalculatorIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <rect x="8" y="6" width="8" height="4" rx="1" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="8" y1="18" x2="8" y2="18.01" />
      <line x1="12" y1="18" x2="12" y2="18.01" />
      <line x1="16" y1="18" x2="16" y2="18.01" />
    </svg>
  );
}

// ── Animal Avatar Icons ─────────────────────────────────────
// Side-profile or 3/4-view portraits with natural colors.

const ad: IconProps = { width: 24, height: 24, viewBox: '0 0 24 24', stroke: 'none' };

// Fox — side profile, warm rust
export function FoxIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ear */}
      <path d="M14 1 L18 7 L11 8 Z" fill="#C4683C" />
      <path d="M14.8 3 L17 7 L12.5 7.5 Z" fill="#D4956A" />
      {/* Head — tapered fox skull shape */}
      <path d="M18 7 Q22 10 21 14 Q20 18 16 20 L8 21 Q3 19 2 15 L1 11 Q2 8 6 7 Q10 6 14 7 Z" fill="#C4683C" />
      {/* White cheek/throat marking */}
      <path d="M4 13 Q3 16 5 19 L9 20 Q7 17 6 14 Z" fill="#F0E6DA" />
      {/* Darker back of head */}
      <path d="M14 7 Q18 8 19 11 Q20 8 18 7 Z" fill="#A8522A" />
      {/* Eye — almond shaped */}
      <ellipse cx="11" cy="12" rx="1.8" ry="1.4" fill="#D4A040" />
      <ellipse cx="11.3" cy="12" rx="0.9" ry="1.1" fill="#1A1008" />
      <ellipse cx="11.6" cy="11.5" rx="0.35" ry="0.3" fill="white" opacity="0.5" />
      {/* Dark eye line */}
      <path d="M8.8 11.5 Q11 10.5 13.2 11.5" fill="none" stroke="#6B3018" strokeWidth="0.5" />
      {/* Nose */}
      <ellipse cx="3.5" cy="14" rx="1.4" ry="1.1" fill="#1A1008" />
      {/* Mouth line */}
      <path d="M4.8 15 Q6 15.5 7 15" fill="none" stroke="#8B4020" strokeWidth="0.4" />
    </svg>
  );
}

// Cat — 3/4 view, soft blue-grey tabby
export function CatIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ears — tall, pointed */}
      <path d="M7 2 L10 8 L4 9 Z" fill="#7A8B9A" />
      <path d="M17 1 L20 8 L14 8 Z" fill="#7A8B9A" />
      <path d="M7.8 4 L9.5 8 L5.5 8.5 Z" fill="#A8B5C0" />
      <path d="M17.5 3 L19 7.5 L15 7.8 Z" fill="#A8B5C0" />
      {/* Head — rounder cat face */}
      <path d="M4 9 Q1 13 3 17 Q5 21 12 22 Q19 21 21 17 Q23 13 20 9 Q17 7 12 7 Q7 7 4 9 Z" fill="#7A8B9A" />
      {/* Tabby forehead M */}
      <path d="M8 9 L10 11 L12 9 L14 11 L16 9" fill="none" stroke="#5A6A78" strokeWidth="0.7" />
      {/* Lighter muzzle */}
      <path d="M8 16 Q12 15 16 16 Q15 20 12 21 Q9 20 8 16 Z" fill="#C4CDD5" />
      {/* Eyes — almond with vertical slit pupils */}
      <ellipse cx="8.5" cy="13.5" rx="2" ry="1.6" fill="#8AAA50" />
      <ellipse cx="15.5" cy="13.5" rx="2" ry="1.6" fill="#8AAA50" />
      <ellipse cx="8.5" cy="13.5" rx="0.6" ry="1.3" fill="#1A1008" />
      <ellipse cx="15.5" cy="13.5" rx="0.6" ry="1.3" fill="#1A1008" />
      {/* Nose — small triangle */}
      <path d="M11 17 L12 18 L13 17 Z" fill="#C09A9A" />
      {/* Whisker dots */}
      <circle cx="7" cy="17.5" r="0.4" fill="#5A6A78" />
      <circle cx="6" cy="18.5" r="0.4" fill="#5A6A78" />
      <circle cx="17" cy="17.5" r="0.4" fill="#5A6A78" />
      <circle cx="18" cy="18.5" r="0.4" fill="#5A6A78" />
    </svg>
  );
}

// Dog — side profile, golden retriever
export function DogIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ear — floppy, hanging */}
      <path d="M16 6 Q20 5 21 9 Q22 14 19 17 Q17 14 16 10 Z" fill="#A07030" />
      {/* Head — longer muzzle, broader skull */}
      <path d="M16 6 Q18 4 17 7 Q16 3 13 3 Q8 3 5 6 Q2 9 1 13 Q2 16 5 18 L10 20 Q14 20 17 18 Q19 16 19 13 Q18 9 16 7 Z" fill="#C49340" />
      {/* Lighter muzzle/chin */}
      <path d="M1 13 Q2 16 5 18 L10 20 Q8 18 5 16 Q3 14 2 12 Z" fill="#DCC088" />
      {/* Brow ridge — darker */}
      <path d="M7 6 Q10 4 14 5 Q12 7 8 7 Z" fill="#A07030" />
      {/* Eye — warm, friendly */}
      <ellipse cx="11" cy="10" rx="1.6" ry="1.5" fill="#4A2E10" />
      <ellipse cx="11.4" cy="9.6" rx="0.5" ry="0.4" fill="white" opacity="0.35" />
      {/* Nose */}
      <ellipse cx="3" cy="13" rx="1.8" ry="1.4" fill="#2A1A0A" />
      {/* Mouth */}
      <path d="M4.5 14.5 Q7 16 10 15.5" fill="none" stroke="#8A6528" strokeWidth="0.5" />
      {/* Nostril highlight */}
      <ellipse cx="2.8" cy="12.5" rx="0.4" ry="0.3" fill="#4A3020" />
    </svg>
  );
}

// Bear — front face, rich brown
export function BearIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ears — small, rounded */}
      <circle cx="5" cy="4.5" r="3" fill="#6B3A20" />
      <circle cx="19" cy="4.5" r="3" fill="#6B3A20" />
      <circle cx="5" cy="4.5" r="1.5" fill="#8A5030" />
      <circle cx="19" cy="4.5" r="1.5" fill="#8A5030" />
      {/* Head — broad, heavy */}
      <path d="M3 8 Q1 13 3 18 Q6 23 12 23 Q18 23 21 18 Q23 13 21 8 Q18 4 12 4 Q6 4 3 8 Z" fill="#6B3A20" />
      {/* Muzzle — wide, prominent */}
      <path d="M7 15 Q12 13 17 15 Q16 20 12 21 Q8 20 7 15 Z" fill="#8A5C3A" />
      {/* Brow — heavier, furrowed */}
      <path d="M5 9.5 Q8 8 12 8.5 Q16 8 19 9.5" fill="none" stroke="#4A2210" strokeWidth="1" />
      {/* Eyes — small relative to head */}
      <ellipse cx="8.5" cy="12" rx="1" ry="0.9" fill="#1A0E04" />
      <ellipse cx="15.5" cy="12" rx="1" ry="0.9" fill="#1A0E04" />
      <ellipse cx="8.8" cy="11.7" rx="0.3" ry="0.25" fill="white" opacity="0.3" />
      <ellipse cx="15.8" cy="11.7" rx="0.3" ry="0.25" fill="white" opacity="0.3" />
      {/* Nose — large, dark */}
      <ellipse cx="12" cy="16" rx="1.8" ry="1.3" fill="#1A0E04" />
      {/* Mouth */}
      <path d="M12 17.3 L12 18.5" stroke="#4A2A10" strokeWidth="0.5" />
      <path d="M12 18.5 Q10 19.5 9 19" fill="none" stroke="#4A2A10" strokeWidth="0.4" />
      <path d="M12 18.5 Q14 19.5 15 19" fill="none" stroke="#4A2A10" strokeWidth="0.4" />
    </svg>
  );
}

// Rabbit — 3/4 view, warm sand/buff
export function RabbitIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ears — very long, one upright, one slightly tilted */}
      <ellipse cx="9" cy="4" rx="2" ry="5.5" fill="#C4A878" />
      <ellipse cx="15" cy="3.5" rx="2" ry="5.5" fill="#C4A878" transform="rotate(8 15 3.5)" />
      <ellipse cx="9" cy="4" rx="0.8" ry="3.8" fill="#D8BFA0" />
      <ellipse cx="15" cy="3.5" rx="0.8" ry="3.8" fill="#D8BFA0" transform="rotate(8 15 3.5)" />
      {/* Head */}
      <path d="M5 10 Q3 14 4 17 Q6 22 12 22 Q18 22 20 17 Q21 14 19 10 Q17 8 12 8 Q7 8 5 10 Z" fill="#C4A878" />
      {/* Puffy cheeks */}
      <ellipse cx="7" cy="17" rx="3" ry="2.5" fill="#D4BA92" />
      <ellipse cx="17" cy="17" rx="3" ry="2.5" fill="#D4BA92" />
      {/* Eyes — large, dark, round (prey animal) */}
      <ellipse cx="8.5" cy="13.5" rx="1.8" ry="2" fill="#1A0E04" />
      <ellipse cx="15.5" cy="13.5" rx="1.8" ry="2" fill="#1A0E04" />
      <ellipse cx="9" cy="12.8" rx="0.6" ry="0.5" fill="white" opacity="0.4" />
      <ellipse cx="16" cy="12.8" rx="0.6" ry="0.5" fill="white" opacity="0.4" />
      {/* Nose — Y-shaped */}
      <path d="M11.3 17.5 L12 18.3 L12.7 17.5" fill="#C8988A" stroke="#C8988A" strokeWidth="0.3" />
      {/* Mouth — split lip */}
      <path d="M12 18.3 L12 19.5" stroke="#A08068" strokeWidth="0.4" />
      <path d="M12 19.5 Q10.5 20.5 10 20" fill="none" stroke="#A08068" strokeWidth="0.3" />
      <path d="M12 19.5 Q13.5 20.5 14 20" fill="none" stroke="#A08068" strokeWidth="0.3" />
    </svg>
  );
}

// Owl — front face, tawny with facial disc
export function OwlIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ear tufts */}
      <path d="M5 5 L7 1 L10 6" fill="#8B6E48" />
      <path d="M14 6 L17 1 L19 5" fill="#8B6E48" />
      {/* Body/head — rounded */}
      <path d="M3 7 Q1 13 3 18 Q6 23 12 23 Q18 23 21 18 Q23 13 21 7 Q18 4 12 4 Q6 4 3 7 Z" fill="#8B6E48" />
      {/* Facial disc — heart shaped, lighter */}
      <path d="M5 8 Q4 13 6 17 Q9 20 12 19 Q15 20 18 17 Q20 13 19 8 Q16 6 12 6 Q8 6 5 8 Z" fill="#C4AA80" />
      {/* Feather pattern on disc */}
      <path d="M6 10 Q9 12 12 10 Q15 12 18 10" fill="none" stroke="#A08858" strokeWidth="0.5" />
      {/* Eyes — large, forward-facing (realistic for owls) */}
      <circle cx="9" cy="12.5" r="2.5" fill="#E8D8B0" />
      <circle cx="15" cy="12.5" r="2.5" fill="#E8D8B0" />
      <circle cx="9" cy="12.5" r="1.5" fill="#C89020" />
      <circle cx="15" cy="12.5" r="1.5" fill="#C89020" />
      <circle cx="9" cy="12.5" r="0.8" fill="#1A0E04" />
      <circle cx="15" cy="12.5" r="0.8" fill="#1A0E04" />
      <ellipse cx="9.3" cy="12" rx="0.3" ry="0.25" fill="white" opacity="0.5" />
      <ellipse cx="15.3" cy="12" rx="0.3" ry="0.25" fill="white" opacity="0.5" />
      {/* Beak — small, hooked */}
      <path d="M11 16 Q12 15.5 13 16 L12 18 Z" fill="#8A7A50" />
      {/* Breast feather markings */}
      <path d="M8 20 L9 19 L10 20" fill="none" stroke="#A08858" strokeWidth="0.4" />
      <path d="M11 20.5 L12 19.5 L13 20.5" fill="none" stroke="#A08858" strokeWidth="0.4" />
      <path d="M14 20 L15 19 L16 20" fill="none" stroke="#A08858" strokeWidth="0.4" />
    </svg>
  );
}

// Penguin — side profile, dark navy with white front
export function PenguinIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Body — upright, oval */}
      <path d="M6 5 Q3 9 3 14 Q3 20 8 22 L16 22 Q21 20 21 14 Q21 9 18 5 Q15 2 12 2 Q9 2 6 5 Z" fill="#2A3A4A" />
      {/* White belly — extends up to chin */}
      <path d="M8 8 Q7 12 7 16 Q8 21 12 22 Q16 21 17 16 Q17 12 16 8 Q14 7 12 7 Q10 7 8 8 Z" fill="#EDE8E2" />
      {/* Flipper — left */}
      <path d="M4 10 Q2 14 3 18 Q4 16 5 12 Z" fill="#2A3A4A" />
      {/* Head detail — darker cap */}
      <path d="M6 5 Q9 2 12 2 Q15 2 18 5 Q16 6 12 6 Q8 6 6 5 Z" fill="#1A2A38" />
      {/* Eye patch — white/yellow */}
      <ellipse cx="9" cy="7" rx="1.8" ry="1.2" fill="#E0D8A0" />
      <ellipse cx="15" cy="7" rx="1.8" ry="1.2" fill="#E0D8A0" />
      {/* Eyes */}
      <ellipse cx="9.2" cy="7" rx="0.8" ry="0.9" fill="#1A0E04" />
      <ellipse cx="14.8" cy="7" rx="0.8" ry="0.9" fill="#1A0E04" />
      <ellipse cx="9.5" cy="6.7" rx="0.25" ry="0.2" fill="white" opacity="0.4" />
      <ellipse cx="15.1" cy="6.7" rx="0.25" ry="0.2" fill="white" opacity="0.4" />
      {/* Beak — orange, slightly hooked */}
      <path d="M10.5 9.5 Q12 8.5 13.5 9.5 L12 11.5 Z" fill="#CC7A30" />
      {/* Feet */}
      <path d="M9 22 L7 23.5 L10 23.5 Z" fill="#CC7A30" />
      <path d="M15 22 L14 23.5 L17 23.5 Z" fill="#CC7A30" />
    </svg>
  );
}

// Lion — front face, warm golden with full mane
export function LionIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Mane — shaggy, organic shape */}
      <path d="M12 0 Q6 0 3 3 Q0 6 0 12 Q0 18 3 21 Q6 24 12 24 Q18 24 21 21 Q24 18 24 12 Q24 6 21 3 Q18 0 12 0 Z" fill="#8A6828" />
      {/* Mane texture — wavy strands */}
      <path d="M4 4 Q6 6 5 8" fill="none" stroke="#A88038" strokeWidth="1" />
      <path d="M20 4 Q18 6 19 8" fill="none" stroke="#A88038" strokeWidth="1" />
      <path d="M2 11 Q4 12 3 14" fill="none" stroke="#A88038" strokeWidth="1" />
      <path d="M22 11 Q20 12 21 14" fill="none" stroke="#A88038" strokeWidth="1" />
      <path d="M4 18 Q6 17 6 19" fill="none" stroke="#A88038" strokeWidth="1" />
      <path d="M20 18 Q18 17 18 19" fill="none" stroke="#A88038" strokeWidth="1" />
      {/* Face */}
      <path d="M7 7 Q5 11 6 15 Q8 20 12 20 Q16 20 18 15 Q19 11 17 7 Q15 5 12 5 Q9 5 7 7 Z" fill="#D4AA50" />
      {/* Brow — strong, furrowed */}
      <path d="M8 9 Q10 8 12 8.5 Q14 8 16 9" fill="none" stroke="#9A7828" strokeWidth="0.7" />
      {/* Eyes — intense, amber */}
      <ellipse cx="9.5" cy="11" rx="1.3" ry="1.1" fill="#C89020" />
      <ellipse cx="14.5" cy="11" rx="1.3" ry="1.1" fill="#C89020" />
      <ellipse cx="9.5" cy="11" rx="0.6" ry="0.7" fill="#1A0E04" />
      <ellipse cx="14.5" cy="11" rx="0.6" ry="0.7" fill="#1A0E04" />
      {/* Nose — broad, dark */}
      <path d="M10.5 14 Q12 13 13.5 14 L12 15.5 Z" fill="#3A2210" />
      {/* Mouth */}
      <path d="M12 15.5 L12 17" stroke="#8A6828" strokeWidth="0.5" />
      <path d="M12 17 Q10 18 9.5 17.5" fill="none" stroke="#8A6828" strokeWidth="0.4" />
      <path d="M12 17 Q14 18 14.5 17.5" fill="none" stroke="#8A6828" strokeWidth="0.4" />
    </svg>
  );
}

// Wolf — 3/4 view, silver-grey with thick ruff
export function WolfIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ears — tall, erect, thick */}
      <path d="M6 2 L9 8 L4 9 Z" fill="#6A7580" />
      <path d="M18 1 L21 8 L16 8 Z" fill="#6A7580" />
      <path d="M6.8 4 L8.5 7.5 L5.5 8.2 Z" fill="#8A9AA5" />
      <path d="M18.5 3.5 L20 7.5 L17 7.5 Z" fill="#8A9AA5" />
      {/* Thick neck ruff */}
      <path d="M3 10 Q1 15 3 19 Q5 22 12 23 Q19 22 21 19 Q23 15 21 10 Q18 7 12 7 Q6 7 3 10 Z" fill="#6A7580" />
      {/* Lighter ruff fur */}
      <path d="M5 18 Q8 21 12 22 Q16 21 19 18 Q17 19 12 20 Q7 19 5 18 Z" fill="#8A9AA5" />
      {/* Face — angular, V-shaped lighter area */}
      <path d="M7 11 Q12 9 17 11 L15 18 Q12 20 9 18 Z" fill="#A0AAB5" />
      {/* Darker mask around eyes */}
      <path d="M7 11 Q9 10 12 10 Q15 10 17 11 Q15 12 12 11.5 Q9 12 7 11 Z" fill="#4A5560" />
      {/* Eyes — amber, intense */}
      <ellipse cx="9" cy="12.5" rx="1.4" ry="1.2" fill="#C0A030" />
      <ellipse cx="15" cy="12.5" rx="1.4" ry="1.2" fill="#C0A030" />
      <ellipse cx="9" cy="12.5" rx="0.7" ry="0.8" fill="#1A0E04" />
      <ellipse cx="15" cy="12.5" rx="0.7" ry="0.8" fill="#1A0E04" />
      {/* Nose */}
      <ellipse cx="12" cy="16" rx="1.5" ry="1.1" fill="#1A0E04" />
      {/* Mouth line */}
      <path d="M12 17.1 L12 18" stroke="#4A5560" strokeWidth="0.5" />
    </svg>
  );
}

// Deer — side profile, warm fawn with antlers
export function DeerIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Antlers — branching, natural */}
      <path d="M14 6 L15 3 L17 1" fill="none" stroke="#7A6040" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M15 3 L13 1.5" fill="none" stroke="#7A6040" strokeWidth="1" strokeLinecap="round" />
      <path d="M14.5 4.5 L17 3.5" fill="none" stroke="#7A6040" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M18 6 L19 3 L21 1.5" fill="none" stroke="#7A6040" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M19 3 L17.5 1.5" fill="none" stroke="#7A6040" strokeWidth="1" strokeLinecap="round" />
      {/* Ear */}
      <ellipse cx="20" cy="8" rx="2" ry="3.5" fill="#A88058" transform="rotate(20 20 8)" />
      <ellipse cx="20" cy="8" rx="1" ry="2.5" fill="#C4A880" transform="rotate(20 20 8)" />
      {/* Head — long, elegant, tapered muzzle */}
      <path d="M20 8 Q23 10 22 14 Q21 17 17 19 L8 20 Q3 18 1 14 Q0 11 2 9 Q4 7 8 6 Q12 5 16 6 Z" fill="#A88058" />
      {/* Lighter face/chin */}
      <path d="M3 12 Q2 15 4 18 L8 19 Q6 17 4 14 Z" fill="#D4BFA0" />
      {/* Eye — large, gentle, dark (prey animal) */}
      <ellipse cx="12" cy="11.5" rx="2" ry="2.2" fill="#1A0E04" />
      <ellipse cx="12.5" cy="10.8" rx="0.6" ry="0.5" fill="white" opacity="0.35" />
      {/* White eye ring */}
      <ellipse cx="12" cy="11.5" rx="2.3" ry="2.5" fill="none" stroke="#D4BFA0" strokeWidth="0.5" />
      {/* Nose — dark, moist */}
      <ellipse cx="2.5" cy="13" rx="1.5" ry="1.2" fill="#2A1A0A" />
      {/* Mouth */}
      <path d="M3.8 14 Q6 15 8 14.5" fill="none" stroke="#7A5A38" strokeWidth="0.4" />
    </svg>
  );
}

// Map of animal key → component for lookup by stored avatarIcon string
export const ANIMAL_ICONS: Record<string, (props: IconProps) => React.JSX.Element> = {
  fox: FoxIcon,
  cat: CatIcon,
  dog: DogIcon,
  bear: BearIcon,
  rabbit: RabbitIcon,
  owl: OwlIcon,
  penguin: PenguinIcon,
  lion: LionIcon,
  wolf: WolfIcon,
  deer: DeerIcon,
};

export const ANIMAL_KEYS = Object.keys(ANIMAL_ICONS);

// Category icon map
export const CATEGORY_ICONS: Record<string, (props: IconProps) => React.JSX.Element> = {
  all: GridIcon,
  income: DollarIcon,
  savings: VaultIcon,
  retirement: SunsetIcon,
  tax: CalculatorIcon,
};
