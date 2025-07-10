# Backend Documentation for Google Docs Clone

## Overview
This backend application is built using the MERN stack (MongoDB, Express, React, Node.js) and serves as the server-side component for a Google Docs-like application. It provides RESTful APIs for managing documents and user authentication.

## Features
- User registration and login
- Document creation, retrieval, updating, and deletion
- JWT-based authentication for secure access

## Folder Structure
```
backend
├── src
│   ├── controllers        # Contains controllers for handling requests
│   ├── models             # Contains Mongoose models for MongoDB
│   ├── routes             # Contains route definitions
│   ├── services           # Contains business logic
│   ├── middlewares        # Contains middleware functions
│   ├── utils              # Contains utility functions
│   ├── config             # Contains configuration files
│   └── app.js             # Entry point of the application
├── package.json           # NPM package configuration
└── README.md              # Documentation for the backend
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd google-docs-clone/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Configuration
- Update the database connection settings in `src/config/db.js` to connect to your MongoDB instance.

## Running the Application
To start the backend server, run:
```
npm start
```
The server will run on `http://localhost:5000` by default.

## API Endpoints
### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login an existing user
- `GET /api/users/:id` - Get user details

### Document Routes
- `POST /api/documents` - Create a new document
- `GET /api/documents/:id` - Retrieve a document by ID
- `PUT /api/documents/:id` - Update a document by ID
- `DELETE /api/documents/:id` - Delete a document by ID

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.