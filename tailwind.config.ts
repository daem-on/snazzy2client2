import plugin from "tailwindcss/plugin";

module.exports = {
	content: [
		'./src/**/*.{css,vue}',
		'./index.html',
	],
	darkMode: 'media',
	theme: {
		extend: {
			colors: {
				'white-transparent': 'rgba(255, 255, 255, 0.445)',
				'wood-transparent': 'rgba(150, 78, 44, 0.5)',
				'wood-transparent-600': 'rgba(180, 97, 59, 0.5)',
			},
			boxShadow: {
				'lg': '0px 12px 29px -16px rgba(0, 0, 0, 0.75)'
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		plugin(({ addUtilities }) => addUtilities({
			'.rotate-y-180': {
				transform: 'rotateY(180deg)',
			},
			'.bg-white-stripe': {
				background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff50 10px, #ffffff50 20px)',
			}
		})),
	],
}
