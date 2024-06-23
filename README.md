# Cat Breed Identifier App

Cat Breed Identifier is a web application built with React and Python Flask that identifies cat breeds from uploaded images using machine learning models provided by Roboflow.

## Features

- **Upload and Predict**: Upload an image of your cat to identify its breed.
- **Random Cat Facts**: Get random facts about cats to entertain and educate.
- **Responsive UI**: Enjoy a responsive user interface suitable for various devices.

## Technologies Used

### Frontend (React)
- **React**: JavaScript library for building user interfaces.
- **axios**: Promise-based HTTP client for making requests to the backend.
- **CSS**: Styling for the application.
- **State Management**: Utilized `useState` hook for managing component state.
- **Effect Hook**: Used `useEffect` for handling side effects like fetching random cat facts.
  
### Backend (Python Flask)
- **Flask**: Micro web framework for Python used to create RESTful APIs.
- **InferenceSDK**: Python SDK provided by Roboflow for running inference on machine learning models.
- **Base64 Encoding**: Used to encode image data for sending to Roboflow's model API.

## Installation

### Frontend (React)
1. Clone the repository:

`git clone https://github.com/ofek-harpaz/cat-breed-identifier.git`

2. Navigate into the project directory:

`cd cat-breed-identifier`

3. Install dependencies:

`npm install`

4. Start the development server:

`npm start`

5. Open your browser and visit `http://localhost:3000` to view the app.

### Backend (Python Flask)
1. Clone the backend repository: https://github.com/ofekharpaz/cat-breed-backend

`git clone https://github.com/ofekharpaz/cat-breed-backend`

2. Navigate into the backend directory:

`cd cat-breed-identifier-backend`

3. Install Python dependencies (preferably in a virtual environment):

`pip install -r requirements.txt`

4. Set up environment variables:
- Obtain your Roboflow API key from [Roboflow](https://app.roboflow.com/).
- Set `ROBOFLOW_API_KEY` in your environment variables.

5. Run the Flask server:

`python app.py`

6. The Flask server will run locally on `http://localhost:5000`.