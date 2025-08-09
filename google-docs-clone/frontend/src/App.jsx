import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import DocumentPage from './pages/DocumentPage';
import DocumentsListPage from './pages/DocumentsListPage';
import SharedDocumentPage from './pages/SharedDocumentPage';
import PrivateRoute from './components/PrivateRoute';
import SocketStatus from './components/SocketStatus';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/documents"
              element={
                <PrivateRoute>
                  <DocumentsListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/document/:id"
              element={
                <PrivateRoute>
                  <DocumentPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/shared/:shareableLink"
              element={
                <PrivateRoute>
                  <SharedDocumentPage />
                </PrivateRoute>
              }
            />

          </Routes>
          <SocketStatus />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
