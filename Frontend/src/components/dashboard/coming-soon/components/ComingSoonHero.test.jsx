import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import ComingSoonHero from './ComingSoonHero';

describe('ComingSoonHero', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ComingSoonHero />);
      expect(
        screen.getByText('Upcoming Trade Intelligence Modules')
      ).toBeInTheDocument();
    });

    it('renders Blinkus Roadmap badge', () => {
      render(<ComingSoonHero />);
      expect(screen.getByText(/Blinkus Roadmap/i)).toBeInTheDocument();
    });

    it('renders description paragraph', () => {
      render(<ComingSoonHero />);
      expect(screen.getByText(/next generation of AI-powered trade tools/i)).toBeInTheDocument();
    });

    it('renders heading as h1', () => {
      render(<ComingSoonHero />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });
});
