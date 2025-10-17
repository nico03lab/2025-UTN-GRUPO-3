// components/FileUpload.jsx
import { useState, useEffect } from 'react';

export const FileUpload = ({ name, label, onChange, required = false, currentFile = null }) => {
  const [file, setFile] = useState(null);

  // Si hay un archivo actual (al volver a este paso), mostrarlo
  useEffect(() => {
    if (currentFile) {
      setFile(currentFile);
    }
  }, [currentFile]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      onChange(name, selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      onChange(name, droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    onChange(name, null);
    // Limpiar el input
    const input = document.getElementById(`file-upload-${name}`);
    if (input) input.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>

      <div
        className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-base-content/40"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v24a4 4 0 004 4h24a4 4 0 004-4V20l-12-12z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm">
            <label
              htmlFor={`file-upload-${name}`}
              className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-focus"
            >
              <span>Upload files</span>
              <input
                id={`file-upload-${name}`}
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required={required}
              />
            </label>
            <p className="pl-1 text-base-content/60">or drag and drop</p>
          </div>
          <p className="text-xs text-base-content/60">PDF, JPG, PNG up to 10MB</p>
        </div>
      </div>

      {file && (
        <div className="mt-3 p-3 bg-base-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg 
                className="w-5 h-5 text-success" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-base-content/60">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Eliminar archivo"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};