import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { File } from '../types';

interface FileListProps {
  files: File[];
  onDelete: (id: number) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onDelete }) => {
  return (
    <List>
      {files.map((file) => (
        <ListItem key={file.id}>
          <ListItemText
            primary={file.name}
            secondary={`Size: ${file.size} bytes | Created: ${new Date(Number(file.createdAt) / 1000000).toLocaleString()}`}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(file.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default FileList;
