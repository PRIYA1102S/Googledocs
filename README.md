 Real-Time Collaborative Document Editor

A **full-stack, real-time collaborative document editing application** built with **React, Node.js, Express, MongoDB, Redis, and Socket.io**.
Features include **JWT authentication, live collaboration, user presence tracking, secure sharing, role-based permissions, and export capabilities**.

 Features

 Authentication & Authorization

* User registration & login
* JWT-based authentication
* Role-based permissions
* Protected routes with React Router & PrivateRoute component
* Context API for global auth state

 Document Management

* Create, read, update, and delete (CRUD) documents
* Document dashboard with user-specific filtering
* Individual document editor
* Auto-save & real-time syncing

Collaboration Features

* Real-time multi-user editing (Socket.io)
* Shared documents via secure shareable links
* Live cursor tracking & user presence indicators
* User avatars and names displayed during editing
* Redis-based **user presence tracking** with TTL to handle connection loss or expiry

 UI/UX

* Light/Dark theme toggle
* Responsive design for mobile & desktop
* Rich text editing with formatting tools
* Modern gradient backgrounds & animations
* Professional landing page with feature showcase

 Technical Features

* **Redis Integration** for:

  * Tracking user presence in documents
  * Storing heartbeat timestamps
  * Automatic removal of inactive users using TTL expiry
* RESTful API endpoints with Express.js
* Real-time WebSocket connections
* Download documents as:

  * PDF (via `jspdf` & `html2canvas`)
  * Word
  * Plain text

 Tech Stack

**Frontend:**

* React.js
* Context API
* React Router
* Socket.io-client
* Tailwind CSS / Custom Styling

**Backend:**

* Node.js
* Express.js
* MongoDB (Mongoose ORM)
* Redis (for presence tracking)
* Socket.io

**Other Libraries:**

* `jsonwebtoken` – Authentication
* `bcrypt` – Password hashing
* `jspdf` & `html2canvas` – Document export
* `dotenv` – Environment configuration

 Installation & Setup

 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/realtime-doc-editor.git
cd realtime-doc-editor


 2️⃣ Install Dependencies

Backend

```bash
cd server
npm install


 Frontend

```bash
cd ../client
npm install


 3️⃣ Set Environment Variables

Create a `.env` file in the **server** folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379


 4️⃣ Run Redis

Make sure Redis is installed and running:

```bash
redis-server


 5️⃣ Start the App

Backend

```bash
cd server
npm run dev

 Frontend

```bash
cd ../client
npm start


 Redis Presence Tracking Logic

* On user connect:

* Save user ID, document ID, and a timestamp in Redis with TTL (e.g., 30 seconds)
* Every few seconds, a heartbeat updates the timestamp and resets TTL
* If TTL expires, the backend automatically removes the user from the active list
* UI updates in real-time to show who’s editing the document

 Folder Structure

root/
│── client/              # React frontend
│── server/              # Node.js + Express backend
│   ├── controllers/     # Route logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Helpers (JWT, Redis)
│   └── socket.js        # Socket.io event handling
└── README.md


