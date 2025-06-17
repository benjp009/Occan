import React from 'react';
import { render, screen } from '@testing-library/react';

test('renders placeholder element', () => {
  render(<div>Hello Test</div>);
  const el = screen.getByText(/hello test/i);
  expect(el).toBeInTheDocument();
});
