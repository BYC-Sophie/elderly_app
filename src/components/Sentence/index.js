import * as React from 'react'
import { Badge } from '@mui/material'

export default function Sentence(props) {
	return (
		<Badge
			sx={{
				m: 6,
				p: 2,
				fontSize: 12,
				textAlign: 'center',
				border: '1px dotted black',
				borderRadius: 2,
			}}
		>
			{props.content}
		</Badge>
	)
}
