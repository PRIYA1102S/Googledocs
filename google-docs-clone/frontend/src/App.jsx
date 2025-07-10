import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import DocumentPage from './pages/DocumentPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/document/:id" component={DocumentPage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;