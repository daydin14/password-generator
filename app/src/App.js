// Dependencies
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Styles
import './assets/styles/App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Routes
import AppRoutes from './AppRoutes';

function App() {
  return (
    <Router basename='/password-generator'>
      <Header />
      <div >
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
