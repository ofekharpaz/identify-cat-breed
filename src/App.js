import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Your main application styles
import CatImage from './assets/cat-image.png'; // Example image import
import PictureImage from './assets/upload-picture.png';
import CatIcon from './assets/cat-icon.png'; // Cat icon image
import PawIcon from './assets/paw-icon.png'; // Paw icon image
import LoadingSpinner from './LoadingSpinner'; // Import the loading spinner component
import CatBackgroundButton from './assets/cat_background.svg'; // Import the background image for button
import WhiteCatBackgroundButton from './assets/white_cat_background.svg'; // Import the background image for button

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading state
  const [currentView, setCurrentView] = useState('upload'); // State to manage view switching
  const [catFact, setCatFact] = useState('');

  // Ref for floating-menu-active indicator
  const activeIndicatorRef = useRef(null);

  // Effect to update active indicator position on currentView change
  useEffect(() => {
    if (activeIndicatorRef.current) {
      const activeIcon = document.querySelector(
        `.menu-icon.${currentView === 'upload' ? 'upload' : 'facts'}`
      );
      if (activeIcon) {
        const menuRect = activeIcon.getBoundingClientRect();
        const floatingMenuRect = activeIndicatorRef.current.parentElement.getBoundingClientRect();

        activeIndicatorRef.current.style.left = `${menuRect.left - floatingMenuRect.left}px`;
        activeIndicatorRef.current.style.width = `${menuRect.width}px`;
      }
    }
  }, [currentView]);

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

      // Determine backend URL based on NODE_ENV
      const backendURL = process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_BACKEND_URL_DEV
        : process.env.REACT_APP_BACKEND_URL_PROD;
      console.log('backend url', backendURL)
      axios
        .post(`${backendURL}/predict`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log('Response from server:', response.data);
          setPredictions(response.data.predictions);
        })
        .catch((error) => {
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

  // Function to generate a random cat fact
  const generateCatFact = () => {
    setLoading(true); // Set loading state to true

    fetch('https://meowfacts.herokuapp.com/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.data && data.data.length > 0) {
          console.log('Random Cat Fact:', data.data[0]);
          setCatFact(data.data[0]); // Set the fetched cat fact
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch((error) => {
        console.error('Error fetching cat fact:', error);
        // Optionally handle error scenarios
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after request completes
      });
  };

  // Fetch a random cat fact when component mounts
  useEffect(() => {
    generateCatFact();
  }, []);

  // Function to open Google search with breed name
  const openGoogleSearch = (breedName) => {
    window.open(`https://www.google.com/search?q=${breedName}`, '_blank');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="floating-menu">
          <img
            src={CatIcon}
            alt="Cat Icon"
            className={`menu-icon upload ${currentView === 'upload' ? 'active' : ''}`}
            onClick={() => setCurrentView('upload')}
          />
          <img
            src={PawIcon}
            alt="Paw Icon"
            className={`menu-icon facts ${currentView === 'facts' ? 'active' : ''}`}
            onClick={() => setCurrentView('facts')}
          />
          {/* Active indicator */}
          <div ref={activeIndicatorRef} className="floating-menu-active"></div>
        </div>
        <div className="main-content">
          {currentView === 'upload' ? (
            <>
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
                          <img src={PictureImage} alt="Upload Icon" className="upload-icon" />
                        </>
                      )}
                      {selectedFile && (
                        <div className="preview-container">
                          <img src={previewImage} alt="Uploaded Preview" className="uploaded-image" />
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
                    <h2 className="results-heading">Results</h2>
                    {loading && <LoadingSpinner />} {/* Render loading spinner component */}
                    {!loading && predictions.length > 0 && (
                      <div className="prediction">
                        <p>
                          • Breed -{' '}
                          <a href="#!" onClick={() => openGoogleSearch(predictions[0].class.replace(/_/g, ' '))}>
                            {predictions[0].class.replace(/_/g, ' ')}
                          </a>
                        </p>
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
                    {!loading && <span className="upload-button-icon"></span>}
                  </button>
                  <img className="btn-background" src={CatBackgroundButton} alt="Cat" />
                </div>
              </div>
            </>
          ) : (
            <div className="facts-container">
              <h1>Random Cat Facts</h1>
              <div className="fact">
                {loading ? (
                  <LoadingSpinner /> // Render loading spinner while fetching fact
                ) : (
                  <p>{catFact}</p> // Display fetched cat fact
                )}
              </div>
              {/* Button to generate random cat fact */}
              <div className="button-section">
                <button
                  className={`upload-button ${loading ? 'disabled' : ''}`}
                  onClick={generateCatFact}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Generate Fact'}
                  {!loading && <span className="upload-button-icon"></span>}
                </button>
                <img className="btn-background" src={WhiteCatBackgroundButton} alt="Cat" />
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
