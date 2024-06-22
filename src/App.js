import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Your main application styles
import CatImage from './assets/cat-image.png'; // Example image import
import PictureImage from './assets/upload-picture.png';
import LoadingSpinner from './LoadingSpinner'; // Import the loading spinner component
import CatBackgroundButton from './assets/cat_background.svg'; // Import the background image for button

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading state

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Access the uploaded file
    validateAndPreviewFile(file);
  };

  // Function to handle drag and drop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    validateAndPreviewFile(file);
  };

  // Function to validate file and set preview if valid
  const validateAndPreviewFile = (file) => {
    // Check if file is an image
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (file && validTypes.includes(file.type)) {
      setSelectedFile(file);

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Optionally handle invalid file types here
      console.log('Invalid file type');
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

  // Function to clear selected file and preview image
  const clearFile = (event) => {
    event.preventDefault(); // Prevent default form submission
    setSelectedFile(null);
    setPreviewImage(null);
    
    // Clear the file input value to allow re-upload of the same file
    const fileInput = document.getElementById('upload-input');
    if (fileInput) {
      fileInput.value = null;
    }
  };

  // Function to handle upload button click
  const handleUpload = () => {
    if (selectedFile) {
      setLoading(true); // Set loading state to true

      const formData = new FormData();
      formData.append('image', selectedFile);

      axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log('Response from server:', response.data);
        // Replace underscores with spaces in the first prediction class name
        if (response.data.predictions.length > 0) {
          const firstPrediction = response.data.predictions[0];
          firstPrediction.class = firstPrediction.class.replace(/_/g, ' ');
          setPredictions([firstPrediction]);
        } else {
          setPredictions([]);
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        // Optionally handle error scenarios
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after request completes
      });
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="main-content">
          <h1>Identify Your Cat Breed</h1>
          <div className="grid-container">
            <div
              className={`upload-section ${selectedFile ? 'uploaded' : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <label htmlFor="upload-input" className="upload-container">
                <input
                  type="file"
                  id="upload-input"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <div className={`upload-box ${selectedFile ? 'uploaded' : ''}`}>
                  {!selectedFile && (
                    <>
                      <span className="upload-text">Drag and drop an image</span>
                      <span className="upload-description">or browse to upload.</span>
                      <span className="file-requirements">File must be JPEG, JPG or PNG and up to 40MB</span>
                      <span className="checkmark">✓ Free to use</span>
                      <img
                        src={PictureImage}
                        alt="Upload Icon"
                        className="upload-icon"
                      />
                    </>
                  )}
                  {selectedFile && (
                    <div className="preview-container">
                      <img
                        src={previewImage}
                        alt="Uploaded Preview"
                        className="uploaded-image"
                      />
                      <button className="clear-button" onClick={clearFile}>
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </label>
            </div>
            <div className="predictions">
              <div className="prediction-container">
                <h2>Results</h2>
                {loading && <LoadingSpinner />} {/* Render loading spinner component */}
                {!loading && predictions.length > 0 && (
                  <div className="prediction">
                    <p>• Breed - {predictions[0].class}</p>
                    <p>• Confidence - {predictions[0].confidence}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="cat-section">
              <img src={CatImage} alt="Cat" className="cat-image" />
            </div>
            <div className="button-section">
              <button
                className={`upload-button ${loading ? 'disabled' : ''}`}
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Upload Photo'}
                {!loading && (
                  <span className="upload-button-icon"></span>
                )}
              </button>
              <img className="btn-background" src={CatBackgroundButton} alt="Cat" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
