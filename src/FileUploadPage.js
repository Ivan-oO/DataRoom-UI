import React, { useState } from 'react';
import './FileUploadPage.css'; // Importing the CSS file

function FileUploadPage() {
  const [files, setFiles] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newFiles = [...event.dataTransfer.files];
    setFiles(currentFiles => [...currentFiles, ...newFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div 
      className="file-upload-container" 
      onDrop={handleDrop} 
      onDragOver={handleDragOver}
    >
      <div className="file-system-area">
        {files.map((file, index) => (
          <div key={index} className="file-shortcut">
            <span>{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUploadPage;
