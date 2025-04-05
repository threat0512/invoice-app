import { Box, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
// import { useEffect, useState } from "react";
// import { useEffect } from "react";
// import { getInvoicesBelongingTo } from "../../../service/service";
// import { AuthContext } from "../../../context/AuthContextProvider";

export default function SearchBar({invoiceSearchTxt, setInvoiceSearchTxt, tagSelectionTxt, setTagSelectionText}: {
	invoiceSearchTxt: string,
	setInvoiceSearchTxt: Function,
	tagSelectionTxt: string,
	setTagSelectionText: Function
}) {
	
	useEffect(() => {
		console.log('mounted')
	}, [])

	return (
		<>
			<Box sx={{display:'flex', justifyContent: 'space-between'}}>
				<TextField 
					label="search invoices" 
					type="search"
					variant="outlined" 
					size="small"
					fullWidth
					sx={{marginRight: '1em'}}
					value={invoiceSearchTxt}
					onChange={(e) => setInvoiceSearchTxt(e.target.value)}
				/>
				<TextField 
					fullWidth 
					sx={{marginRight: '1em'}} 
					label="tag selection string" 
					size='small'
					value={tagSelectionTxt}
					onChange={(e) => {
						let newVal = e.target.value.toUpperCase()
						if (!/^[A-Z0-9_\-,|\(\)]*$/.test(newVal)) {
							console.log('here');
							return;
						}
						setTagSelectionText(newVal)}}
				/>
			</Box>

			<Box sx={{display: 'flex', justifyContent: 'right'}}>
				<Typography sx={{marginRight: '1em'}}>what's this?</Typography>
			</Box>
		</>
	);
}