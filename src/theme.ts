import { extendTheme } from '@chakra-ui/react'
import '@fontsource/oswald'
import '@fontsource/reenie-beanie'

export const theme = extendTheme({
	styles: {
		global: {
			html: {},
			body: {
				px: '8',
				bg: 'blackAlpha.900',
				color: 'white',
				fontSize: '1.2rem',
				fontWeight: 'normal',
				letterSpacing: 'wider',
			},
		},
	},
	fonts: {
		heading: `'Oswald', sans-serif`,
		body: `'Oswald', sans-serif`,
	},
	components: {
		Input: {
			baseStyle: {
				field: {
					fontSize: '100%',
				},
			},
			variants: {
				flushed: {
					field: {
						px: '2',
						letterSpacing: 'wider',
					},
				},
			},
			defaultProps: {
				variant: 'flushed',
			},
		},
		Button: {
			baseStyle: {
				fontWeight: 'normal',
				textTransform: 'uppercase',
			},
			sizes: {
				md: {
					height: '45px',
					width: '110px',
					fontSize: '2xl',
				},
			},
			variants: {
				solid: {
					bg: 'white',
					borderRadius: 'sm',
				},
			},
		},
	},
})
