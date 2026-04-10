import electrotechPreset from '@electrotech/config-tailwind/preset';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
  presets: [electrotechPreset],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#264b82',
          muted: '#e5efff',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          secondary: '#222222',
        },
        muted: {
          DEFAULT: '#8d8d8d',
        },
      },
      maxWidth: {
        content: '1344px',
      },
    },
  },
};

export default config;
