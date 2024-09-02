import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Container, Typography, Button, CircularProgress, Snackbar } from '@mui/material';
import FileList from './components/FileList';
import UploadModal from './components/UploadModal';
import { File } from './types';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const result = await backend.getFiles();
      setFiles(result.map(([id, file]) => ({ id, ...file })));
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Failed to fetch files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (name: string, content: Blob) => {
    try {
      setLoading(true);
      await backend.uploadFile(name, content, []);
      await fetchFiles();
      setUploadModalOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const success = await backend.deleteFile(id);
      if (success) {
        await fetchFiles();
      } else {
        setError('Failed to delete file. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Failed to delete file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          FileBox
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setUploadModalOpen(true)}
          sx={{ mb: 2 }}
        >
          Upload File
        </Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <FileList files={files} onDelete={handleDelete} />
        )}
        <UploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUpload}
        />
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          message={error}
        />
      </Box>
    </Container>
  );
};

export default App;
