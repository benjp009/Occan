import { render, screen } from '@testing-library/react';
import ClockLoader from './ClockLoader';

describe('ClockLoader', () => {
  it('renders an SVG loader with accessible label', () => {
    render(<ClockLoader />);
    const loader = screen.getByLabelText(/chargement/i);
    expect(loader).toBeInTheDocument();
    expect(loader.querySelector('svg')).toBeTruthy();
  });
});
