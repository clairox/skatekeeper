import { extendTheme } from '@chakra-ui/react'
import '@fontsource/oswald'

export const theme = extendTheme({
	styles: {
		global: {
			body: {
				fontSize: '120%',
				fontWeight: 'normal',
				bg: 'blackAlpha.900',
				color: 'white',
				letterSpacing: 'wider',
			},
		},
	},
	fonts: {
		heading: `'Oswald', sans-serif`,
		body: `'Oswald', sans-serif`,
	},
	//TODO: text weight and sizing
	components: {
		Text: {
			defaultProps: {
				size: '2xl',
			},
		},
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
