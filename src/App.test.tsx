import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tour datamine link', () => {
  render(<App />);
  const linkElement = screen.getByText('Tour Datamine');
  expect(linkElement).toBeInTheDocument();
});
