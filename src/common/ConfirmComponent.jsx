import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,Button } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ConfirmComponent(props){
  const {t} = useTranslation();
  const [value,setValue] = useState();

  const onCancel = () =>{
    props.handleClose();
    setValue('');
  }

  return (
    <Dialog open={props.open} onClose={props.handleClose} component="span">
      <DialogTitle component="span">{props.title}</DialogTitle>
      <DialogContent component="span">
        <DialogContentText component="span">
          {props.content}
        </DialogContentText>
        {
          props.label && <TextField
          autoFocus
          value={value}
          onChange={e=>setValue(e.target.value)}
          margin="dense"
          id="name"
          label={props.label}
          fullWidth
          variant="standard"
        />
        }
      </DialogContent>
      <DialogActions component="span">
        <Button className="fw-bold" variant="outlined" color="error" style={{fontSize:props.FONT_SIZE}} onClick={onCancel}>{t('cancel')}</Button>
        <Button className="fw-bold" variant="outlined" color="success" style={{fontSize:props.FONT_SIZE}} onClick={e=>{setValue('');props.handleSubmit(value)}}>{t('agree')}</Button>
      </DialogActions>
    </Dialog>
  )
}