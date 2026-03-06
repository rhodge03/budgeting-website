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
// Each animal uses natural, subdued colors and realistic proportions.

const ad: IconProps = { width: 24, height: 24, viewBox: '0 0 24 24', stroke: 'none' };

// Fox — Russet (#A0674B)
export function FoxIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ears */}
      <path d="M5.5 2.5 L8.5 8 L3 8.5 Z" fill="#A0674B" />
      <path d="M18.5 2.5 L21 8.5 L15.5 8 Z" fill="#A0674B" />
      <path d="M6.3 4 L8 7.5 L4.5 7.8 Z" fill="#C09070" />
      <path d="M17.7 4 L19.5 7.8 L16 7.5 Z" fill="#C09070" />
      {/* Head */}
      <ellipse cx="12" cy="14" rx="8" ry="8" fill="#A0674B" />
      {/* Muzzle/cheeks */}
      <path d="M7.5 14.5 Q12 13 16.5 14.5 L14.5 20 Q12 21.5 9.5 20 Z" fill="#DACED0" />
      {/* Eyes */}
      <ellipse cx="9" cy="12" rx="1.1" ry="1.3" fill="#1E1710" />
      <ellipse cx="15" cy="12" rx="1.1" ry="1.3" fill="#1E1710" />
      <ellipse cx="9.3" cy="11.5" rx="0.35" ry="0.45" fill="white" opacity="0.4" />
      <ellipse cx="15.3" cy="11.5" rx="0.35" ry="0.45" fill="white" opacity="0.4" />
      {/* Nose */}
      <ellipse cx="12" cy="16.5" rx="1.2" ry="0.9" fill="#1E1710" />
      <path d="M12 17.4 L12 18.5" stroke="#1E1710" strokeWidth="0.6" />
    </svg>
  );
}

// Cat — Warm Gray (#7A7370)
export function CatIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ears */}
      <path d="M5 7.5 L7 1.5 L10.5 7.5 Z" fill="#7A7370" />
      <path d="M13.5 7.5 L17 1.5 L19 7.5 Z" fill="#7A7370" />
      <path d="M6.2 6 L7.5 3 L9.5 6.5 Z" fill="#9B9490" />
      <path d="M14.5 6.5 L16.5 3 L17.8 6 Z" fill="#9B9490" />
      {/* Head */}
      <ellipse cx="12" cy="14" rx="8.5" ry="8.5" fill="#7A7370" />
      {/* Lighter muzzle */}
      <ellipse cx="12" cy="16.5" rx="3.5" ry="2.8" fill="#9B9490" />
      {/* Eyes — vertical pupils */}
      <ellipse cx="8.8" cy="12.5" rx="1.6" ry="1.8" fill="#C4B99A" />
      <ellipse cx="15.2" cy="12.5" rx="1.6" ry="1.8" fill="#C4B99A" />
      <ellipse cx="8.8" cy="12.5" rx="0.5" ry="1.4" fill="#1E1710" />
      <ellipse cx="15.2" cy="12.5" rx="0.5" ry="1.4" fill="#1E1710" />
      {/* Nose */}
      <path d="M11 16 L12 17 L13 16 Z" fill="#B09090" />
      {/* Whiskers */}
      <line x1="5" y1="15" x2="1.5" y2="14.2" stroke="#9B9490" strokeWidth="0.6" />
      <line x1="5" y1="16.5" x2="1.5" y2="16.5" stroke="#9B9490" strokeWidth="0.6" />
      <line x1="19" y1="15" x2="22.5" y2="14.2" stroke="#9B9490" strokeWidth="0.6" />
      <line x1="19" y1="16.5" x2="22.5" y2="16.5" stroke="#9B9490" strokeWidth="0.6" />
    </svg>
  );
}

// Dog — Tawny Brown (#8B7355)
export function DogIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Floppy ears */}
      <ellipse cx="5.5" cy="10" rx="3.5" ry="6" fill="#6B5B45" transform="rotate(-10 5.5 10)" />
      <ellipse cx="18.5" cy="10" rx="3.5" ry="6" fill="#6B5B45" transform="rotate(10 18.5 10)" />
      {/* Head */}
      <ellipse cx="12" cy="12.5" rx="7.5" ry="8" fill="#8B7355" />
      {/* Forehead patch */}
      <ellipse cx="12" cy="9.5" rx="3" ry="2.5" fill="#6B5B45" />
      {/* Muzzle */}
      <ellipse cx="12" cy="17" rx="3.5" ry="2.8" fill="#BBA88A" />
      {/* Eyes */}
      <ellipse cx="9" cy="12" rx="1.3" ry="1.4" fill="#1E1710" />
      <ellipse cx="15" cy="12" rx="1.3" ry="1.4" fill="#1E1710" />
      <ellipse cx="9.4" cy="11.5" rx="0.4" ry="0.5" fill="white" opacity="0.35" />
      <ellipse cx="15.4" cy="11.5" rx="0.4" ry="0.5" fill="white" opacity="0.35" />
      {/* Nose */}
      <ellipse cx="12" cy="16" rx="1.4" ry="1" fill="#1E1710" />
      <ellipse cx="12" cy="16" rx="0.4" ry="0.2" fill="#3A3028" />
    </svg>
  );
}

// Bear — Dark Umber (#5C4033)
export function BearIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Round ears */}
      <circle cx="5.5" cy="5.5" r="3.2" fill="#5C4033" />
      <circle cx="18.5" cy="5.5" r="3.2" fill="#5C4033" />
      <circle cx="5.5" cy="5.5" r="1.6" fill="#7A5C4A" />
      <circle cx="18.5" cy="5.5" r="1.6" fill="#7A5C4A" />
      {/* Head */}
      <ellipse cx="12" cy="13.5" rx="9" ry="8.5" fill="#5C4033" />
      {/* Muzzle */}
      <ellipse cx="12" cy="16" rx="3.5" ry="2.8" fill="#7A5C4A" />
      {/* Eyes */}
      <ellipse cx="8.5" cy="12" rx="1" ry="1.1" fill="#1E1710" />
      <ellipse cx="15.5" cy="12" rx="1" ry="1.1" fill="#1E1710" />
      <ellipse cx="8.7" cy="11.6" rx="0.3" ry="0.4" fill="white" opacity="0.3" />
      <ellipse cx="15.7" cy="11.6" rx="0.3" ry="0.4" fill="white" opacity="0.3" />
      {/* Nose */}
      <ellipse cx="12" cy="15.5" rx="1.3" ry="0.9" fill="#1E1710" />
      <path d="M12 16.4 L12 17.5" stroke="#1E1710" strokeWidth="0.6" />
    </svg>
  );
}

// Rabbit — Warm Taupe (#9B8E7E)
export function RabbitIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Tall ears */}
      <ellipse cx="8.5" cy="5" rx="2.2" ry="6.5" fill="#9B8E7E" />
      <ellipse cx="15.5" cy="5" rx="2.2" ry="6.5" fill="#9B8E7E" />
      <ellipse cx="8.5" cy="5" rx="1" ry="4.5" fill="#C4B5A5" />
      <ellipse cx="15.5" cy="5" rx="1" ry="4.5" fill="#C4B5A5" />
      {/* Head */}
      <ellipse cx="12" cy="15.5" rx="7" ry="6.5" fill="#9B8E7E" />
      {/* Cheeks */}
      <ellipse cx="8" cy="16.5" rx="2.5" ry="2" fill="#B0A494" />
      <ellipse cx="16" cy="16.5" rx="2.5" ry="2" fill="#B0A494" />
      {/* Eyes */}
      <ellipse cx="9" cy="14" rx="1.2" ry="1.3" fill="#1E1710" />
      <ellipse cx="15" cy="14" rx="1.2" ry="1.3" fill="#1E1710" />
      <ellipse cx="9.3" cy="13.5" rx="0.35" ry="0.45" fill="white" opacity="0.4" />
      <ellipse cx="15.3" cy="13.5" rx="0.35" ry="0.45" fill="white" opacity="0.4" />
      {/* Nose */}
      <path d="M11.2 16.8 L12 17.5 L12.8 16.8 Z" fill="#C0A0A0" />
      {/* Mouth lines */}
      <path d="M12 17.5 Q10.5 19 9.5 18.5" fill="none" stroke="#7A7068" strokeWidth="0.5" />
      <path d="M12 17.5 Q13.5 19 14.5 18.5" fill="none" stroke="#7A7068" strokeWidth="0.5" />
    </svg>
  );
}

// Owl — Olive Brown (#6E6350)
export function OwlIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ear tufts */}
      <path d="M5 7 L6.5 2 L9 7" fill="#6E6350" />
      <path d="M15 7 L17.5 2 L19 7" fill="#6E6350" />
      {/* Body */}
      <ellipse cx="12" cy="14" rx="9" ry="8.5" fill="#6E6350" />
      {/* Facial disc */}
      <ellipse cx="12" cy="13" rx="6.5" ry="6" fill="#8A7E6A" />
      {/* Eye rings */}
      <circle cx="9" cy="12" r="2.8" fill="#BEB5A0" />
      <circle cx="15" cy="12" r="2.8" fill="#BEB5A0" />
      {/* Eyes */}
      <circle cx="9" cy="12" r="1.6" fill="#C4953A" />
      <circle cx="15" cy="12" r="1.6" fill="#C4953A" />
      <circle cx="9" cy="12" r="0.8" fill="#1E1710" />
      <circle cx="15" cy="12" r="0.8" fill="#1E1710" />
      <ellipse cx="9.3" cy="11.5" rx="0.25" ry="0.3" fill="white" opacity="0.4" />
      <ellipse cx="15.3" cy="11.5" rx="0.25" ry="0.3" fill="white" opacity="0.4" />
      {/* Beak */}
      <path d="M11.2 15 L12 17 L12.8 15 Z" fill="#9A8560" />
      {/* Breast pattern */}
      <path d="M8 18 Q12 21 16 18" fill="none" stroke="#8A7E6A" strokeWidth="0.6" />
      <path d="M9 19.5 Q12 22 15 19.5" fill="none" stroke="#8A7E6A" strokeWidth="0.6" />
    </svg>
  );
}

// Penguin — Dark Slate (#3D4F5F)
export function PenguinIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Body */}
      <ellipse cx="12" cy="13.5" rx="8" ry="9" fill="#3D4F5F" />
      {/* White belly */}
      <ellipse cx="12" cy="15" rx="5" ry="6.5" fill="#E8E4E0" />
      {/* Flippers */}
      <ellipse cx="4.5" cy="14" rx="1.5" ry="4.5" fill="#3D4F5F" transform="rotate(-12 4.5 14)" />
      <ellipse cx="19.5" cy="14" rx="1.5" ry="4.5" fill="#3D4F5F" transform="rotate(12 19.5 14)" />
      {/* Eyes */}
      <ellipse cx="9.5" cy="10" rx="1" ry="1.1" fill="#1E1710" />
      <ellipse cx="14.5" cy="10" rx="1" ry="1.1" fill="#1E1710" />
      <ellipse cx="9.7" cy="9.6" rx="0.3" ry="0.35" fill="white" opacity="0.4" />
      <ellipse cx="14.7" cy="9.6" rx="0.3" ry="0.35" fill="white" opacity="0.4" />
      {/* Beak */}
      <path d="M10.5 12.5 L12 14 L13.5 12.5 Z" fill="#A0845A" />
    </svg>
  );
}

// Lion — Muted Gold (#9A7D4A)
export function LionIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Mane */}
      <circle cx="12" cy="12" r="11" fill="#7A6238" />
      {/* Mane texture */}
      <circle cx="12" cy="1.5" r="2.5" fill="#9A7D4A" />
      <circle cx="5.5" cy="4" r="2.5" fill="#9A7D4A" />
      <circle cx="18.5" cy="4" r="2.5" fill="#9A7D4A" />
      <circle cx="2.5" cy="10" r="2.5" fill="#9A7D4A" />
      <circle cx="21.5" cy="10" r="2.5" fill="#9A7D4A" />
      <circle cx="4" cy="17" r="2.5" fill="#9A7D4A" />
      <circle cx="20" cy="17" r="2.5" fill="#9A7D4A" />
      {/* Face */}
      <ellipse cx="12" cy="13" rx="6.5" ry="7" fill="#C4A76A" />
      {/* Eyes */}
      <ellipse cx="9.5" cy="11.5" rx="1" ry="1.1" fill="#1E1710" />
      <ellipse cx="14.5" cy="11.5" rx="1" ry="1.1" fill="#1E1710" />
      <ellipse cx="9.7" cy="11.1" rx="0.3" ry="0.35" fill="white" opacity="0.3" />
      <ellipse cx="14.7" cy="11.1" rx="0.3" ry="0.35" fill="white" opacity="0.3" />
      {/* Nose */}
      <ellipse cx="12" cy="14.5" rx="1.3" ry="0.9" fill="#7A6238" />
      <path d="M12 15.4 L12 16.8" stroke="#7A6238" strokeWidth="0.6" />
      {/* Mouth */}
      <path d="M12 16.8 Q10.5 17.8 10 17.2" fill="none" stroke="#7A6238" strokeWidth="0.5" />
      <path d="M12 16.8 Q13.5 17.8 14 17.2" fill="none" stroke="#7A6238" strokeWidth="0.5" />
    </svg>
  );
}

// Wolf — Cool Gray (#5A6370)
export function WolfIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Ears */}
      <path d="M4 3.5 L7.5 9 L3 10 Z" fill="#5A6370" />
      <path d="M20 3.5 L21 10 L16.5 9 Z" fill="#5A6370" />
      <path d="M5.2 5 L7 8.5 L4 9 Z" fill="#74808C" />
      <path d="M18.8 5 L20 9 L17 8.5 Z" fill="#74808C" />
      {/* Head */}
      <ellipse cx="12" cy="13.5" rx="8.5" ry="8.5" fill="#5A6370" />
      {/* Lighter face */}
      <path d="M7 13 L12 11 L17 13 L14 19.5 Q12 21 10 19.5 Z" fill="#8A949E" />
      {/* Eyes — amber */}
      <ellipse cx="8.8" cy="12" rx="1.2" ry="1.3" fill="#C4A855" />
      <ellipse cx="15.2" cy="12" rx="1.2" ry="1.3" fill="#C4A855" />
      <ellipse cx="8.8" cy="12" rx="0.6" ry="0.8" fill="#1E1710" />
      <ellipse cx="15.2" cy="12" rx="0.6" ry="0.8" fill="#1E1710" />
      {/* Nose */}
      <ellipse cx="12" cy="16.5" rx="1.3" ry="0.9" fill="#1E1710" />
    </svg>
  );
}

// Deer — Sage (#6B7F5E)
export function DeerIcon(props: IconProps) {
  return (
    <svg {...ad} {...props}>
      {/* Antlers */}
      <path d="M8 8 L7 4.5 L5 2.5 M7 4.5 L9 2.5" fill="none" stroke="#7A6550" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M16 8 L17 4.5 L19 2.5 M17 4.5 L15 2.5" fill="none" stroke="#7A6550" strokeWidth="1.3" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="12" cy="14.5" rx="7" ry="7.5" fill="#6B7F5E" />
      {/* Lighter face */}
      <ellipse cx="12" cy="16" rx="3.5" ry="4" fill="#8A9C7A" />
      {/* Eyes */}
      <ellipse cx="9" cy="13" rx="1.2" ry="1.4" fill="#1E1710" />
      <ellipse cx="15" cy="13" rx="1.2" ry="1.4" fill="#1E1710" />
      <ellipse cx="9.3" cy="12.5" rx="0.35" ry="0.45" fill="white" opacity="0.35" />
      <ellipse cx="15.3" cy="12.5" rx="0.35" ry="0.45" fill="white" opacity="0.35" />
      {/* Nose */}
      <ellipse cx="12" cy="17.5" rx="1.3" ry="0.9" fill="#3D4A35" />
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
