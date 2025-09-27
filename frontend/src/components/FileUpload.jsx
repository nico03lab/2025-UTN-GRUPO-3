import { useState } from "react";

export const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
    return (
    <div className="w-full max-w-lg mx-auto">
      <label className="block text-sm font-medium mb-2 text-gray-300">
        Cover photo
      </label>

      <div
        className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-500 rounded-md cursor-pointer hover:border-blue-500"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <div className="flex text-sm text-gray-400">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400"
            >
              <span>Upload files</span>
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                accept="image/png, image/jpeg, image/gif"
                multiple
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB each</p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-gray-300">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-800 p-2 rounded"
            >
              <span>{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-400 hover:text-red-300 text-xs"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

