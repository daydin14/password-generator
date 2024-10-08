// Dependencies
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect } from '@jest/globals';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher

// Components
import App from '../App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
