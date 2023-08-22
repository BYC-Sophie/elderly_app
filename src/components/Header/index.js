import * as React from 'react'
import { Typography, Divider } from '@mui/material'

export default function Header(props) {
	return (
		<>
			<Typography
				align='left'
				sx={{
					m: 2,
					display: 'inline',
					fontSize: 24,
					fontWeight: 'bold',
				}}
			>
				{props.title}
			</Typography>
			<Divider />
		</>
	)
}
