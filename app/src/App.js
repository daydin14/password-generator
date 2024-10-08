// Dependencies
import React from 'react';

// Styles
import './assets/styles/App.css';

function App() {
  const companyName = 'daydin14';
  const year = new Date().getFullYear();
  const rights = 'All rights reserved.';
  const author = 'David Aydin';

  return (
    <div>
      {/* Header */}
      <header>
        <h1>Dave's PG</h1>
        <nav>
          <ul>
            <li>Home</li>
          </ul>
        </nav>
      </header>
      {/* Main */}
      <main>
        <h1>Hello World</h1>
      </main>
      {/* Footer */}
      <footer>
        <p>{companyName} &copy; {year} {rights}</p>
        <p>Created by {author}</p>
      </footer>
    </div>
  );
}

export default App;
