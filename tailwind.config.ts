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
			}
		})),
	],
}
