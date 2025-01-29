'use client';

import { useState } from 'react';
import supabase from '../utils/supabase';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    if (!file) return alert('No file selected.');

    const fileExt = file.name.split('.').pop();
    const filePath = `uploads/${Date.now()}.${fileExt}`;

    setUploading(true);
    const { data, error } = await supabase.storage
      .from('users-bucket')
      .upload(filePath, file);

    setUploading(false);

    if (error) {
      console.error('Upload error:', error.message);
      alert('File upload failed');
    } else {
      alert('File uploaded successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">Upload a File</h1>
        
        <div className="mb-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={uploadFile}
          disabled={uploading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition ${
            uploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  );
};

export default Upload;
