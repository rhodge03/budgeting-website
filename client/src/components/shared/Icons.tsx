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
// Designed as filled silhouettes for use in circular avatar buttons.

const animalDefaults: IconProps = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor', stroke: 'none' };

export function FoxIcon(props: IconProps) {
  return (
    <svg {...animalDefaults} {...props}>
      <path d="M4 2 L8 10 L4 14 L8 16 L12 20 L16 16 L20 14 L16 10 L20 2 L14 8 L12 6 L10 8 Z" />
      <circle cx="9.5" cy="11" r="1" fill="white" />
      <circle cx="14.5" cy="11" r="1" fill="white" />
    </svg>
  );
}

export function CatIcon(props: IconProps) {
  return (
    <svg {...animalDefaults} {...props}>
      <path d="M4 6 L6 2 L9 7 L15 7 L18 2 L20 6 L20 14 Q20 20 12 20 Q4 20 4 14 Z" />
      <circle cx="9" cy="12" r="1.2" fill="white" />
      <circle cx="15" cy="12" r="1.2" fill="white" />
      <ellipse cx="12" cy="15" rx="1" ry="0.7" fill="white" />
    </svg>
  );
}

export function DogIcon(props: IconProps) {
  return (
    <svg {...animalDefaults} {...props}>
      <path d="M5 5 Q3 3 2 6 L3 12 L4 14 Q4 20 12 20 Q20 20 20 14 L21 12 L22 6 Q21 3 19 5 L17 7 L7 7 Z" />
      <circle cx="9" cy="11" r="1.2" fill="white" />
      <circle cx="15" cy="11" r="1.2" fill="white" />
      <ellipse cx="12" cy="15" rx="2" ry="1.2" fill="white" />
    </svg>
  );
}

export function BearIcon(props: IconProps) {
  return (
    <svg {...animalDefaults} {...props}>
      <circle cx="5" cy="6" r="3" />
      <circle cx="19" cy="6" r="3" />
      <ellipse cx="12" cy="13" rx="9" ry="8" />
      <circle cx="9" cy="11" r="1.2" fill="white" />
      <circle cx="15" cy="11" r="1.2" fill="white" />
      <ellipse cx="12" cy="15" rx="2.5" ry="1.8" fill="white" />
      <ellipse cx="12" cy="15.5" rx="1" ry="0.6" />
    </svg>
  );
}

export function RabbitIcon(props: IconProps) {
  return (
    <svg {...animalDefaults} {...props}>
      <ellipse cx="9" cy="6" rx="2" ry="5.5" />
      <ellipse cx="15" cy="6" rx="2" ry="5.5" />
      <ellipse cx="12" cy="15" rx="7" ry="6.5" />
      <circle cx="9.5" cy="13.5" r="1" fill="white" />
      <circle cx="14.5" cy="13.5" r="1" fill="white" />
      <ellipse cx="12" cy="16.5" rx="1" ry="0.7" fill="white" />
    </svg>
  );
}

export function OwlIcon(props: IconProps) {
  return (
    <svg {...animalDefaults} {...props}>
      <path d="M4 8 L6 3 L9 6 L12 4 L15 6 L18 3 L20 8 Q22 14 20 18 Q18 22 12 22 Q6 22 4 18 Q2 14 4 8 Z" />
      <circle cx="9" cy="12" r="2.5" fill="white" />
      <circle cx="15" cy="12" r="2.5" fill="white" />
      <circle cx="9" cy="12" r="1.2" />
      <circle cx="15" cy="12" r="1.2" />
      <path d="M11 16 L12 18 L13 16" fill="white" stroke="none" />
    </svg>
  );
}

export function PenguinIcon(props: IconProps) {
  return (
    <svg {...animalDefaults} {...props}>
      <ellipse cx="12" cy="13" rx="8" ry="9" />
      <ellipse cx="12" cy="14" rx="5" ry="7" fill="white" />
      <circle cx="9.5" cy="10" r="1" />
      <circle cx="14.5" cy="10" r="1" />
      <path d="M11 13 L12 14.5 L13 13" fill="orange" stroke="none" />
    </svg>
  );
}

export function LionIcon(props: IconProps) {
  return (
    <svg {...animalDefaults} {...props}>
      <circle cx="12" cy="12" r="10" opacity="0.4" />
      <ellipse cx="12" cy="13" rx="7" ry="7.5" />
      <circle cx="9.5" cy="11.5" r="1" fill="white" />
      <circle cx="14.5" cy="11.5" r="1" fill="white" />
      <ellipse cx="12" cy="15" rx="1.5" ry="1" fill="white" />
    </svg>
  );
}

export function WolfIcon(props: IconProps) {
  return (
    <svg {...animalDefaults} {...props}>
      <path d="M3 4 L7 9 L5 12 Q4 18 12 20 Q20 18 19 12 L17 9 L21 4 L17 7 L12 5 L7 7 Z" />
      <circle cx="9" cy="12" r="1" fill="white" />
      <circle cx="15" cy="12" r="1" fill="white" />
      <path d="M10 16 L12 18 L14 16" fill="white" stroke="none" />
    </svg>
  );
}

export function DeerIcon(props: IconProps) {
  return (
    <svg {...animalDefaults} {...props}>
      <path d="M7 2 L7 5 L5 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 2 L17 5 L19 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="12" cy="14" rx="7" ry="7.5" />
      <circle cx="9.5" cy="12.5" r="1" fill="white" />
      <circle cx="14.5" cy="12.5" r="1" fill="white" />
      <ellipse cx="12" cy="16" rx="1.2" ry="0.8" fill="white" />
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
