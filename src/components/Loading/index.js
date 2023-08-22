import React from 'react'
// import { Bars } from 'react-loader-spinner'
import { Box } from '@mui/material'

export default function Loading() {
	return (
		<Box
			sx={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			}}
		>
			{/* <Bars
				height='100'
				width='100'
				color='rgba(245, 182, 18, 0.8)'
				ariaLabel='bars-loading'
				wrapperStyle={{}}
				wrapperClass=''
				visible={true}
			/> */}
		</Box>
	)
}
