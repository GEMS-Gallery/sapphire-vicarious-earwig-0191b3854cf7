import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (name: string, content: Blob) => Promise<void>;
}

const UploadModal: React.FC<UploadModalProps> = ({ open, onClose, onUpload }) => {
  const { control, handleSubmit, reset } = useForm();
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data: { name: string; file: FileList }) => {
    if (data.file && data.file[0]) {
      setUploading(true);
      try {
        await onUpload(data.name, data.file[0]);
        reset();
        onClose();
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Upload File
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: 'File name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="File Name"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="file"
            control={control}
            defaultValue={null}
            rules={{ required: 'File is required' }}
            render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
              <TextField
                {...field}
                type="file"
                onChange={(e) => onChange(e.target.files)}
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={uploading}
            sx={{ mt: 2 }}
          >
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UploadModal;
