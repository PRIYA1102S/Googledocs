# Google Docs Clone - Frontend

This is the frontend part of the Google Docs-like application built using the MERN stack (MongoDB, Express, React, Node.js). The frontend is designed to provide a user-friendly interface for creating, editing, and managing documents.

## Features

- **Document Creation and Editing**: Users can create new documents and edit existing ones using a rich text editor.
- **User Authentication**: Users can register, log in, and manage their accounts securely.
- **Responsive Design**: The application is designed to be responsive and work on various devices.

## Folder Structure

```
frontend
├── public
│   └── index.html          # Main HTML file
├── src
│   ├── components          # Reusable components
│   │   ├── DocumentEditor.jsx
│   │   ├── TextElement.jsx
│   │   └── ImageElement.jsx
│   ├── contexts            # Context API for state management
│   │   └── AuthContext.js
│   ├── hooks               # Custom hooks
│   │   └── useAuth.js
│   ├── pages               # Application pages
│   │   ├── Home.jsx
│   │   └── DocumentPage.jsx
│   ├── services            # API service functions
│   │   ├── documentService.js
│   │   └── userService.js
│   ├── utils               # Utility functions
│   │   └── helpers.js
│   ├── App.jsx             # Main application component
│   └── index.js            # Entry point of the application
├── package.json            # NPM configuration file
└── README.md               # Documentation for the frontend
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the frontend directory:
   ```
   cd google-docs-clone/frontend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm start
```

The application will be available at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.