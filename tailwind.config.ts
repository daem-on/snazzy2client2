import plugin from "tailwindcss/plugin";
import colors from "tailwindcss/colors";

module.exports = {
	content: [
		'./src/**/*.{css,vue}',
		'./index.html',
	],
	darkMode: 'media',
	theme: {
		colors: {
			'white-transparent': 'rgba(255, 255, 255, 0.445)',
			'wood-transparent': 'rgba(150, 78, 44, 0.5)',
			'wood-transparent-600': 'rgba(180, 97, 59, 0.5)',
			black: colors.black,
			white: colors.white,
			gray: colors.gray,
			blue: {
				'500': colors.blue[500],
			}
		},
		extend: {
			boxShadow: {
				'down': '0px 4px 12px -5px rgba(0, 0, 0, 0.5)',
				'up': '0px 10px 22px -5px rgba(0, 0, 0, 0.4)',
				'lg': '0px 12px 29px -16px rgba(0, 0, 0, 0.75)'
			},
			transitionProperty: {
				'outline': 'outline, outline-width, outline-color, outline-offset',
			},
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
