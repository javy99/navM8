# navM8

navM8 is a full-stack web application designed to connect travelers with local guides for authentic, personalized travel experiences. The application aims to make exploring new places more accessible and enjoyable by leveraging local insights without the financial burden of traditional tour services.

## Features

- **Search for Tours by City:** Allows travelers to search for available tours based on specific cities.
- **Booking Tours:** Provides a secure method for booking tours with local guides.
- **Creating Tours:** Enables users to create and offer tours, showcasing unique experiences in their city.
- **Profile Creation:** Allows users to create personalized profiles to either offer or seek tour services.
- **Real-Time Messaging:** Facilitates direct communication between travelers and guides for better planning and interaction.
- **Rating and Review System:** After completing a tour, travelers can rate and review the tour, aiding future travelers in making informed decisions.

## Prerequisites

- **Node.js:** Version 18.18.0 or later
- **npm:** Version 9.8.1 or later

## Installation

### Development Environment Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/repo/navM8.git
   cd navM8
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```sh
   cd frontend
   ```

2. Create a `.env` file with the following content:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

The frontend will be available at [http://localhost:3001](http://localhost:3001).

### Backend Setup

1. Navigate to the backend directory:

   ```sh
   cd backend
   ```

2. Create a `.env` file with the following content:

   ```env
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NODE_ENV=development
   BACKEND_PORT=3000
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Start the backend server:
   ```sh
   npm start
   ```

The backend will run on port 3000.

## Running the Application

- Ensure that both the frontend and backend servers are running.
- Access the frontend at [http://localhost:3001](http://localhost:3001).

## Additional Tools

1. **ESLint and Prettier:** For code linting and formatting.

   - To run linting:
     ```sh
     npm run lint
     ```
   - For automatic fixes:
     ```sh
     npm run lint:fix
     ```

2. **TypeScript:** For type-checking.
   - To compile TypeScript files:
     ```sh
     npm run build
     ```
