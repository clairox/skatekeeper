import { Center, SimpleGrid } from '@chakra-ui/react'
import React from 'react'

type ScoreDisplayProps = {
	score: number
}

const ScoreDisplay: React.FunctionComponent<ScoreDisplayProps> = ({ score }) => {
	const letters = ['S', 'K', 'A', 'T', 'E']
	const blankLetterColor = 'whiteAlpha.500'
	const filledLetterColor = 'white'

	return (
		<SimpleGrid as={'span'} fontSize="2xl" columns={5}>
			{letters.map((letter, idx) => {
				const isFilled = idx < 5 - score
				return (
					<Center
						fontFamily={`'Reenie Beanie', sans-serif`}
						fontSize="5xl"
						fontWeight="bold"
						color={isFilled ? filledLetterColor : blankLetterColor}
					>
						{letter}
					</Center>
				)
			})}
		</SimpleGrid>
	)
}

export default ScoreDisplay
