/**
 * Your Way — 40 Colors & Theme Management System
 * Supports Light mode, Dark mode, and 40 vibrant accent colors.
 */

export interface ThemeColor {
  id: string;
  name: string;
  category: 'Indigos & Violets' | 'Pinks & Magentas' | 'Reds & Corals' | 'Oranges & Ambers' | 'Golds & Yellows' | 'Limes & Greens' | 'Teals & Cyans' | 'Blues & Navies';
  hex: string;
  hoverHex: string;
  rgb: string; // e.g. "99, 102, 241"
  lightBg: string; // for light accent badges
  darkText: string;
}

export type ThemeMode = 'light' | 'dark';

export const THEME_COLORS: ThemeColor[] = [
  // 1-5: Indigos & Violets
  { id: 'indigo-classic', name: 'Classic Indigo', category: 'Indigos & Violets', hex: '#6366f1', hoverHex: '#4f46e5', rgb: '99, 102, 241', lightBg: '#e0e7ff', darkText: '#3730a3' },
  { id: 'electric-violet', name: 'Electric Violet', category: 'Indigos & Violets', hex: '#7c3aed', hoverHex: '#6d28d9', rgb: '124, 58, 237', lightBg: '#ede9fe', darkText: '#5b21b6' },
  { id: 'royal-purple', name: 'Royal Purple', category: 'Indigos & Violets', hex: '#8b5cf6', hoverHex: '#7c3aed', rgb: '139, 92, 246', lightBg: '#f5f3ff', darkText: '#6d28d9' },
  { id: 'deep-amethyst', name: 'Deep Amethyst', category: 'Indigos & Violets', hex: '#9333ea', hoverHex: '#7e22ce', rgb: '147, 51, 234', lightBg: '#faf5ff', darkText: '#6b21a8' },
  { id: 'lavender-dream', name: 'Lavender Mist', category: 'Indigos & Violets', hex: '#a855f7', hoverHex: '#9333ea', rgb: '168, 85, 247', lightBg: '#f3e8ff', darkText: '#7e22ce' },

  // 6-10: Pinks & Magentas
  { id: 'neon-magenta', name: 'Neon Magenta', category: 'Pinks & Magentas', hex: '#c026d3', hoverHex: '#a21caf', rgb: '192, 38, 211', lightBg: '#fae8ff', darkText: '#86198f' },
  { id: 'electric-fuchsia', name: 'Electric Fuchsia', category: 'Pinks & Magentas', hex: '#d946ef', hoverHex: '#c026d3', rgb: '217, 70, 239', lightBg: '#fdf4ff', darkText: '#a21caf' },
  { id: 'vivid-pink', name: 'Vivid Pink', category: 'Pinks & Magentas', hex: '#ec4899', hoverHex: '#db2777', rgb: '236, 72, 153', lightBg: '#fce7f3', darkText: '#9d174d' },
  { id: 'wild-rose', name: 'Wild Rose', category: 'Pinks & Magentas', hex: '#f43f5e', hoverHex: '#e11d48', rgb: '244, 63, 94', lightBg: '#ffe4e6', darkText: '#9f1239' },
  { id: 'raspberry', name: 'Raspberry Crimson', category: 'Pinks & Magentas', hex: '#be123c', hoverHex: '#9f1239', rgb: '190, 18, 60', lightBg: '#ffe4e6', darkText: '#881337' },

  // 11-15: Reds & Corals
  { id: 'crimson-fire', name: 'Crimson Fire', category: 'Reds & Corals', hex: '#e11d48', hoverHex: '#be123c', rgb: '225, 29, 72', lightBg: '#ffe4e6', darkText: '#9f1239' },
  { id: 'scarlet-red', name: 'Scarlet Red', category: 'Reds & Corals', hex: '#ef4444', hoverHex: '#dc2626', rgb: '239, 68, 68', lightBg: '#fee2e2', darkText: '#991b1b' },
  { id: 'ruby-gem', name: 'Ruby Gem', category: 'Reds & Corals', hex: '#dc2626', hoverHex: '#b91c1c', rgb: '220, 38, 38', lightBg: '#fee2e2', darkText: '#7f1d1d' },
  { id: 'coral-reef', name: 'Coral Reef', category: 'Reds & Corals', hex: '#ff6f61', hoverHex: '#e85d4f', rgb: '255, 111, 97', lightBg: '#ffedea', darkText: '#c2382b' },
  { id: 'terracotta', name: 'Terracotta', category: 'Reds & Corals', hex: '#e05638', hoverHex: '#c4452a', rgb: '224, 86, 56', lightBg: '#fbece8', darkText: '#992d16' },

  // 16-20: Oranges & Ambers
  { id: 'sunset-orange', name: 'Sunset Orange', category: 'Oranges & Ambers', hex: '#f97316', hoverHex: '#ea580c', rgb: '249, 115, 22', lightBg: '#ffedd5', darkText: '#9a3412' },
  { id: 'burnt-orange', name: 'Burnt Sienna', category: 'Oranges & Ambers', hex: '#ea580c', hoverHex: '#c2410c', rgb: '234, 88, 12', lightBg: '#ffedd5', darkText: '#7c2d12' },
  { id: 'copper-glow', name: 'Copper Glow', category: 'Oranges & Ambers', hex: '#c2410c', hoverHex: '#9a3412', rgb: '194, 65, 12', lightBg: '#ffedd5', darkText: '#7c2d12' },
  { id: 'vibrant-amber', name: 'Vibrant Amber', category: 'Oranges & Ambers', hex: '#f59e0b', hoverHex: '#d97706', rgb: '245, 158, 11', lightBg: '#fef3c7', darkText: '#92400e' },
  { id: 'warm-marigold', name: 'Warm Marigold', category: 'Oranges & Ambers', hex: '#d97706', hoverHex: '#b45309', rgb: '217, 119, 6', lightBg: '#fef3c7', darkText: '#78350f' },

  // 21-25: Golds & Yellows
  { id: 'sunflower-gold', name: 'Sunflower Gold', category: 'Golds & Yellows', hex: '#eab308', hoverHex: '#ca8a04', rgb: '234, 179, 8', lightBg: '#fef9c3', darkText: '#854d0e' },
  { id: 'pure-gold', name: 'Imperial Gold', category: 'Golds & Yellows', hex: '#ca8a04', hoverHex: '#a16207', rgb: '202, 138, 4', lightBg: '#fef9c3', darkText: '#713f12' },
  { id: 'bright-citron', name: 'Bright Citron', category: 'Golds & Yellows', hex: '#facc15', hoverHex: '#eab308', rgb: '250, 204, 21', lightBg: '#fefce8', darkText: '#854d0e' },
  { id: 'amber-bronze', name: 'Antique Bronze', category: 'Golds & Yellows', hex: '#b45309', hoverHex: '#92400e', rgb: '180, 83, 9', lightBg: '#fef3c7', darkText: '#78350f' },
  { id: 'champagne-gold', name: 'Champagne Ochre', category: 'Golds & Yellows', hex: '#a16207', hoverHex: '#854d0e', rgb: '161, 98, 7', lightBg: '#fef9c3', darkText: '#713f12' },

  // 26-30: Limes & Greens
  { id: 'electric-lime', name: 'Electric Lime', category: 'Limes & Greens', hex: '#84cc16', hoverHex: '#65a30d', rgb: '132, 204, 22', lightBg: '#ecfccb', darkText: '#3f6212' },
  { id: 'olive-chartreuse', name: 'Olive Chartreuse', category: 'Limes & Greens', hex: '#65a30d', hoverHex: '#4d7c0f', rgb: '101, 163, 13', lightBg: '#ecfccb', darkText: '#365314' },
  { id: 'vivid-green', name: 'Vivid Green', category: 'Limes & Greens', hex: '#22c55e', hoverHex: '#16a34a', rgb: '34, 197, 94', lightBg: '#dcfce7', darkText: '#166534' },
  { id: 'forest-emerald', name: 'Forest Emerald', category: 'Limes & Greens', hex: '#16a34a', hoverHex: '#15803d', rgb: '22, 163, 74', lightBg: '#dcfce7', darkText: '#14532d' },
  { id: 'deep-pine', name: 'Deep Pine', category: 'Limes & Greens', hex: '#15803d', hoverHex: '#166534', rgb: '21, 128, 61', lightBg: '#dcfce7', darkText: '#14532d' },

  // 31-35: Teals & Cyans
  { id: 'pure-emerald', name: 'Pure Emerald', category: 'Teals & Cyans', hex: '#10b981', hoverHex: '#059669', rgb: '16, 185, 129', lightBg: '#d1fae5', darkText: '#065f46' },
  { id: 'mint-frost', name: 'Mint Frost', category: 'Teals & Cyans', hex: '#059669', hoverHex: '#047857', rgb: '5, 150, 105', lightBg: '#d1fae5', darkText: '#064e3b' },
  { id: 'ocean-teal', name: 'Ocean Teal', category: 'Teals & Cyans', hex: '#14b8a6', hoverHex: '#0d9488', rgb: '20, 184, 166', lightBg: '#ccfbf1', darkText: '#115e59' },
  { id: 'deep-peacock', name: 'Deep Peacock', category: 'Teals & Cyans', hex: '#0d9488', hoverHex: '#0f766e', rgb: '13, 148, 136', lightBg: '#ccfbf1', darkText: '#134e4a' },
  { id: 'electric-cyan', name: 'Electric Cyan', category: 'Teals & Cyans', hex: '#06b6d4', hoverHex: '#0891b2', rgb: '6, 182, 212', lightBg: '#cffafe', darkText: '#155e75' },

  // 36-40: Blues & Navies
  { id: 'cerulean-sky', name: 'Sky Cerulean', category: 'Blues & Navies', hex: '#0ea5e9', hoverHex: '#0284c7', rgb: '14, 165, 233', lightBg: '#e0f2fe', darkText: '#0369a1' },
  { id: 'pacific-blue', name: 'Pacific Blue', category: 'Blues & Navies', hex: '#0284c7', hoverHex: '#0369a1', rgb: '2, 132, 199', lightBg: '#e0f2fe', darkText: '#075985' },
  { id: 'dodger-blue', name: 'Dodger Blue', category: 'Blues & Navies', hex: '#3b82f6', hoverHex: '#2563eb', rgb: '59, 130, 246', lightBg: '#dbeafe', darkText: '#1e40af' },
  { id: 'royal-azure', name: 'Royal Azure', category: 'Blues & Navies', hex: '#2563eb', hoverHex: '#1d4ed8', rgb: '37, 99, 235', lightBg: '#dbeafe', darkText: '#1e3a8a' },
  { id: 'midnight-cobalt', name: 'Midnight Cobalt', category: 'Blues & Navies', hex: '#1d4ed8', hoverHex: '#1e40af', rgb: '29, 78, 216', lightBg: '#dbeafe', darkText: '#172554' },
];

export const DEFAULT_THEME_COLOR = THEME_COLORS[0]; // Classic Indigo

export function getSavedTheme(): { mode: ThemeMode; color: ThemeColor } {
  try {
    const savedMode = (localStorage.getItem('your_way_theme_mode') as ThemeMode) || 'light';
    const savedColorId = localStorage.getItem('your_way_theme_color');
    const color = THEME_COLORS.find((c) => c.id === savedColorId) || DEFAULT_THEME_COLOR;
    return { mode: savedMode === 'dark' ? 'dark' : 'light', color };
  } catch {
    return { mode: 'light', color: DEFAULT_THEME_COLOR };
  }
}

export function applyTheme(mode: ThemeMode, color: ThemeColor) {
  try {
    // 1. Save to localStorage
    localStorage.setItem('your_way_theme_mode', mode);
    localStorage.setItem('your_way_theme_color', color.id);
    localStorage.setItem('your_way_theme_configured', 'true');

    // 2. Set root class for dark mode
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // 3. Inject CSS Variables for the 40 colors
    root.style.setProperty('--primary-hex', color.hex);
    root.style.setProperty('--primary-hover', color.hoverHex);
    root.style.setProperty('--primary-rgb', color.rgb);
    root.style.setProperty('--primary-light', color.lightBg);
    root.style.setProperty('--primary-dark-text', color.darkText);
  } catch (e) {
    console.warn('Could not apply theme to document root', e);
  }
}

export function initTheme() {
  const { mode, color } = getSavedTheme();
  applyTheme(mode, color);
}
