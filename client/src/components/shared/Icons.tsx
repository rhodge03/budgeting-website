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
// Each animal has a unique color and distinctive shape for easy identification.

const ad: IconProps = { width: 24, height: 24, viewBox: '0 0 24 24', stroke: 'none' };

// Fox — Orange (#E8590C)
export function FoxIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      <path d="M3 1 L8 9 L3 13 L7 16 L12 21 L17 16 L21 13 L16 9 L21 1 L15 7 L12 5 L9 7 Z" fill="#E8590C" />
      <path d="M8 12 L12 18 L16 12 L12 14 Z" fill="white" />
      <circle cx="9" cy="10" r="1.5" fill="white" />
      <circle cx="15" cy="10" r="1.5" fill="white" />
      <circle cx="9" cy="10" r="0.8" fill="#1a1a1a" />
      <circle cx="15" cy="10" r="0.8" fill="#1a1a1a" />
      <ellipse cx="12" cy="14.5" rx="1" ry="0.7" fill="#1a1a1a" />
    </svg>
  );
}

// Cat — Purple (#7C3AED)
export function CatIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      <path d="M4 7 L6 1 L10 7 L14 7 L18 1 L20 7 L20 15 Q20 22 12 22 Q4 22 4 15 Z" fill="#7C3AED" />
      <circle cx="9" cy="12" r="2" fill="#EDE9FE" />
      <circle cx="15" cy="12" r="2" fill="#EDE9FE" />
      <circle cx="9" cy="12" r="1" fill="#1a1a1a" />
      <circle cx="15" cy="12" r="1" fill="#1a1a1a" />
      <ellipse cx="12" cy="16" rx="1.2" ry="0.8" fill="#F9A8D4" />
      <line x1="4" y1="14" x2="1" y2="13" stroke="#7C3AED" strokeWidth="1" />
      <line x1="4" y1="15.5" x2="1" y2="15.5" stroke="#7C3AED" strokeWidth="1" />
      <line x1="20" y1="14" x2="23" y2="13" stroke="#7C3AED" strokeWidth="1" />
      <line x1="20" y1="15.5" x2="23" y2="15.5" stroke="#7C3AED" strokeWidth="1" />
    </svg>
  );
}

// Dog — Brown (#92400E)
export function DogIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      <path d="M6 6 Q3 2 2 6 L3 11 L4 14 Q4 21 12 21 Q20 21 20 14 L21 11 L22 6 Q21 2 18 6 L17 8 L7 8 Z" fill="#92400E" />
      <ellipse cx="7" cy="5" rx="3" ry="4" fill="#78350F" />
      <ellipse cx="17" cy="5" rx="3" ry="4" fill="#78350F" />
      <circle cx="9" cy="12" r="1.5" fill="white" />
      <circle cx="15" cy="12" r="1.5" fill="white" />
      <circle cx="9" cy="12" r="0.8" fill="#1a1a1a" />
      <circle cx="15" cy="12" r="0.8" fill="#1a1a1a" />
      <ellipse cx="12" cy="16" rx="2.5" ry="1.5" fill="#D4A574" />
      <ellipse cx="12" cy="15.5" rx="1" ry="0.6" fill="#1a1a1a" />
      <ellipse cx="12" cy="18" rx="1" ry="0.5" fill="#F87171" />
    </svg>
  );
}

// Bear — Dark Brown (#451A03)
export function BearIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      <circle cx="5" cy="5" r="3.5" fill="#78350F" />
      <circle cx="19" cy="5" r="3.5" fill="#78350F" />
      <circle cx="5" cy="5" r="1.8" fill="#92400E" />
      <circle cx="19" cy="5" r="1.8" fill="#92400E" />
      <ellipse cx="12" cy="13" rx="9" ry="9" fill="#78350F" />
      <circle cx="9" cy="11" r="1.5" fill="white" />
      <circle cx="15" cy="11" r="1.5" fill="white" />
      <circle cx="9" cy="11" r="0.8" fill="#1a1a1a" />
      <circle cx="15" cy="11" r="0.8" fill="#1a1a1a" />
      <ellipse cx="12" cy="15.5" rx="3" ry="2.2" fill="#D4A574" />
      <ellipse cx="12" cy="15" rx="1.2" ry="0.8" fill="#1a1a1a" />
    </svg>
  );
}

// Rabbit — Pink (#EC4899)
export function RabbitIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      <ellipse cx="9" cy="5" rx="2.5" ry="6" fill="#EC4899" />
      <ellipse cx="15" cy="5" rx="2.5" ry="6" fill="#EC4899" />
      <ellipse cx="9" cy="5" rx="1.2" ry="4" fill="#FBCFE8" />
      <ellipse cx="15" cy="5" rx="1.2" ry="4" fill="#FBCFE8" />
      <ellipse cx="12" cy="15" rx="7.5" ry="7" fill="#EC4899" />
      <circle cx="9" cy="13.5" r="1.5" fill="white" />
      <circle cx="15" cy="13.5" r="1.5" fill="white" />
      <circle cx="9" cy="13.5" r="0.8" fill="#1a1a1a" />
      <circle cx="15" cy="13.5" r="0.8" fill="#1a1a1a" />
      <ellipse cx="12" cy="17" rx="1" ry="0.7" fill="#FBCFE8" />
      <circle cx="8" cy="16" r="1.5" fill="#FBCFE8" opacity="0.6" />
      <circle cx="16" cy="16" r="1.5" fill="#FBCFE8" opacity="0.6" />
    </svg>
  );
}

// Owl — Gold (#B45309)
export function OwlIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      <path d="M4 8 L6 2 L9 6 L12 4 L15 6 L18 2 L20 8 Q22 14 20 18 Q18 22 12 22 Q6 22 4 18 Q2 14 4 8 Z" fill="#B45309" />
      <path d="M6 10 Q6 18 12 20 Q18 18 18 10 Z" fill="#FDE68A" />
      <circle cx="9" cy="11" r="3" fill="white" />
      <circle cx="15" cy="11" r="3" fill="white" />
      <circle cx="9" cy="11" r="1.5" fill="#B45309" />
      <circle cx="15" cy="11" r="1.5" fill="#B45309" />
      <circle cx="9" cy="11" r="0.7" fill="#1a1a1a" />
      <circle cx="15" cy="11" r="0.7" fill="#1a1a1a" />
      <path d="M11 15.5 L12 17.5 L13 15.5" fill="#E8590C" />
    </svg>
  );
}

// Penguin — Teal/Dark (#134E4A)
export function PenguinIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      <ellipse cx="12" cy="13" rx="8.5" ry="9.5" fill="#134E4A" />
      <ellipse cx="12" cy="14" rx="5.5" ry="7.5" fill="white" />
      <circle cx="9" cy="9.5" r="1.5" fill="white" />
      <circle cx="15" cy="9.5" r="1.5" fill="white" />
      <circle cx="9" cy="9.5" r="0.8" fill="#1a1a1a" />
      <circle cx="15" cy="9.5" r="0.8" fill="#1a1a1a" />
      <path d="M10.5 13 L12 15 L13.5 13" fill="#F59E0B" />
      <ellipse cx="4" cy="14" rx="1.5" ry="4" fill="#134E4A" transform="rotate(-15 4 14)" />
      <ellipse cx="20" cy="14" rx="1.5" ry="4" fill="#134E4A" transform="rotate(15 20 14)" />
    </svg>
  );
}

// Lion — Amber (#D97706)
export function LionIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      <circle cx="12" cy="12" r="11" fill="#D97706" />
      <circle cx="12" cy="12" r="11" fill="#92400E" opacity="0.3" />
      {/* Mane spikes */}
      <circle cx="12" cy="1" r="2.5" fill="#D97706" />
      <circle cx="5" cy="4" r="2.5" fill="#D97706" />
      <circle cx="19" cy="4" r="2.5" fill="#D97706" />
      <circle cx="2" cy="10" r="2.5" fill="#D97706" />
      <circle cx="22" cy="10" r="2.5" fill="#D97706" />
      <circle cx="3" cy="17" r="2.5" fill="#D97706" />
      <circle cx="21" cy="17" r="2.5" fill="#D97706" />
      {/* Face */}
      <ellipse cx="12" cy="13" rx="7" ry="7.5" fill="#FBBF24" />
      <circle cx="9" cy="11" r="1.5" fill="white" />
      <circle cx="15" cy="11" r="1.5" fill="white" />
      <circle cx="9" cy="11" r="0.8" fill="#1a1a1a" />
      <circle cx="15" cy="11" r="0.8" fill="#1a1a1a" />
      <ellipse cx="12" cy="14.5" rx="1.5" ry="1" fill="#D97706" />
      <line x1="12" y1="15.5" x2="12" y2="17" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}

// Wolf — Slate (#475569)
export function WolfIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      <path d="M3 3 L7 10 L5 13 Q4 19 12 21 Q20 19 19 13 L17 10 L21 3 L17 8 L12 6 L7 8 Z" fill="#475569" />
      <path d="M7 10 L12 8 L17 10 L12 12 Z" fill="#94A3B8" />
      <circle cx="9" cy="11.5" r="1.5" fill="#FEF9C3" />
      <circle cx="15" cy="11.5" r="1.5" fill="#FEF9C3" />
      <circle cx="9" cy="11.5" r="0.8" fill="#1a1a1a" />
      <circle cx="15" cy="11.5" r="0.8" fill="#1a1a1a" />
      <ellipse cx="12" cy="16" rx="1.5" ry="1" fill="#1E293B" />
      <path d="M10 18 L12 20 L14 18" fill="#94A3B8" />
    </svg>
  );
}

// Deer — Forest Green (#166534)
export function DeerIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Antlers */}
      <path d="M8 8 L7 4 L5 2 M7 4 L9 2" fill="none" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 8 L17 4 L19 2 M17 4 L15 2" fill="none" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="12" cy="14" rx="7" ry="8" fill="#166534" />
      {/* Inner face */}
      <ellipse cx="12" cy="15" rx="4" ry="5" fill="#22C55E" opacity="0.3" />
      <circle cx="9" cy="12.5" r="1.5" fill="white" />
      <circle cx="15" cy="12.5" r="1.5" fill="white" />
      <circle cx="9" cy="12.5" r="0.8" fill="#1a1a1a" />
      <circle cx="15" cy="12.5" r="0.8" fill="#1a1a1a" />
      <ellipse cx="12" cy="17" rx="1.5" ry="1" fill="#15803D" />
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
