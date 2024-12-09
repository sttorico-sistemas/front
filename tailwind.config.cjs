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
			colors: {
				primary: {
					DEFAULT: '#4361ee',
					light: '#eaf1ff',
					'dark-light': 'rgba(67,97,238,.15)',
				},
				secondary: {
					DEFAULT: '#805dca',
					light: '#ebe4f7',
					'dark-light': 'rgb(128 93 202 / 15%)',
				},
				info: {
					DEFAULT: '#0ea5e9'
				},
				success: {
					DEFAULT: '#00AB55',
					light: '#f0fdf4',
				},
				warning: {
					DEFAULT: '#E2A03F'
				},
				secondry: {
					DEFAULT: '#805DCA'
				},
				primary_3: {
					DEFAULT: '#255471',
					table: '#1384AD'
				},
				// success: {
				//     DEFAULT: '#00ab55',
				//     light: '#ddf5f0',
				//     'dark-light': 'rgba(0,171,85,.15)',
				// },
				danger: {
					DEFAULT: '#E7515A',
					light: '#fff5f5',
					'dark-light': 'rgba(231,81,90,.15)',
				},
				// warning: {
				//     DEFAULT: '#e2a03f',
				//     light: '#fff9ed',
				//     'dark-light': 'rgba(226,160,63,.15)',
				// },
				// info: {
				//     DEFAULT: '#2196f3',
				//     light: '#e7f7ff',
				//     'dark-light': 'rgba(33,150,243,.15)',
				// },
				dark: {
					primary: '#162640',
					DEFAULT: '#3b3f5c',
					light: '#eaeaec',
					'dark-light': 'rgba(59,63,92,.15)',
				},
				black: {
					DEFAULT: '#0e1726',
					light: '#A9AAB1',
					'dark-light': 'rgba(14,23,38,.15)',
				},
				white: {
					DEFAULT: '#ffffff',
					light: '#e0e6ed',
					dark: '#888ea8',
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
				background: 'hsl(var(--background))',
				border: 'hsl(var(--border))'
			},
			fontFamily: {
				nunito: ['Nunito', 'sans-serif'],
			},
			spacing: {
				4.5: '18px',
			},
			boxShadow: {
				'3xl': '0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)',
			},
			gridRow: {
      	'span-8': 'span 8 / span 8',
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
