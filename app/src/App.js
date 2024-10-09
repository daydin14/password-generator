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
    <div className="flex flex-col min-h-screen">
      <Router basename='/password-generator'>
        <Header />
        <main className="flex-grow p-4">
          <AppRoutes />
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
