import { render, screen } from '@testing-library/react';
import App from './App';

test('Contains Test nav', () => {
  render(<App />);
  const linkElement = screen.getByText(/The test view lets you run a pipeline repeatedly and see the results immediately/i);
  expect(linkElement).toBeInTheDocument();
});
