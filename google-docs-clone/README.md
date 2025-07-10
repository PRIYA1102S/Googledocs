# Google Docs Clone

This project is a Google Docs-like application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to create, edit, and manage documents in a collaborative environment.

## Features

- User authentication (registration and login)
- Create, read, update, and delete documents
- Rich text editing capabilities
- Responsive design for various devices

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - JSON Web Tokens (JWT) for authentication

- **Frontend:**
  - React.js
  - React Router for navigation
  - Context API for state management

## Folder Structure

```
google-docs-clone
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── middlewares
│   │   ├── utils
│   │   ├── config
│   │   └── app.js
│   └── package.json
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── hooks
│   │   ├── contexts
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── index.js
│   └── public
│   └── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Set up your MongoDB database and update the connection string in `backend/src/config/db.js`.

4. Start the backend server:
   ```
   npm start
   ```

5. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

6. Start the frontend application:
   ```
   npm start
   ```

### Usage

- Register a new user or log in with existing credentials.
- Create new documents or edit existing ones using the document editor.
- Save changes and manage your documents effectively.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.