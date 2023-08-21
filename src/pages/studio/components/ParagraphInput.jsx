import {Box, TextField} from "@mui/material";


export default function ParagraphInput() {
  return (
    <Box>
      <TextField
        multiline
        rows={4}
      />
    </Box>
  )
}