/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
const rotateX = plugin(function ({ addUtilities }) {
	addUtilities({
		'.rotate-y-180': {
			transform: 'rotateY(180deg)',
		},
	})
})
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		container: {
			center: true,
		},
		extend: {
			gridTemplateColumns: {
				13: 'repeat(13, minmax(0, 1fr))',
				14: 'repeat(14, minmax(0, 1fr))',
				15: 'repeat(15, minmax(0, 1fr))',
				17: 'repeat(17, minmax(0, 1fr))',
				24: 'repeat(24, minmax(0, 1fr))',
				28: 'repeat(28, minmax(0, 1fr))',
			},
			fontSize: {
				'2xs': ['0.65rem', '1rem'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				black: 'hsl(var(--black))',
				dark: 'hsl(var(--dark))',
				highlighter: {
					DEFAULT: 'hsl(var(--highlighter))',
					foreground: 'hsl(var(--highlighter-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary-500))',
					700: 'hsl(var(--primary-700))',
					900: 'hsl(var(--primary-900))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				danger: {
					DEFAULT: 'hsl(var(--danger))',
					foreground: 'hsl(var(--danger-foreground))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			fontFamily: {
				nunito: ['Nunito', 'sans-serif'],
			},
			spacing: {
				4.5: '18px',
			},
			boxShadow: {
				'3xl':
					'0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)',
			},
			gridRow: {
				'span-8': 'span 8 / span 8',
				'span-20': 'span 20 / span 20',
			},
			gridColumn: {
				'span-8': 'span 8 / span 8',
				'span-20': 'span 20 / span 20',
				'span-18': 'span 18 / span 18',
				'span-19': 'span 19 / span 19',
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						'--tw-prose-invert-headings': theme('colors.white.dark'),
						'--tw-prose-invert-links': theme('colors.white.dark'),
						h1: { fontSize: '40px', marginBottom: '0.5rem', marginTop: 0 },
						h2: { fontSize: '32px', marginBottom: '0.5rem', marginTop: 0 },
						h3: { fontSize: '28px', marginBottom: '0.5rem', marginTop: 0 },
						h4: { fontSize: '24px', marginBottom: '0.5rem', marginTop: 0 },
						h5: { fontSize: '20px', marginBottom: '0.5rem', marginTop: 0 },
						h6: { fontSize: '16px', marginBottom: '0.5rem', marginTop: 0 },
						p: { marginBottom: '0.5rem' },
						li: { margin: 0 },
						img: { margin: 0 },
					},
				},
			}),
		},
	},
	plugins: [
		require('@tailwindcss/forms')({
			strategy: 'class',
		}),
		require('@tailwindcss/typography'),
		rotateX,
	],
}
