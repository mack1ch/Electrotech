import electrotechPreset from '@electrotech/config-tailwind/preset';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
  presets: [electrotechPreset],
};

export default config;
