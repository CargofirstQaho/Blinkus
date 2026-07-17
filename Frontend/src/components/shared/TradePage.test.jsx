import { screen } from '@testing-library/react';
import { Package } from 'lucide-react';
import TradePage from './TradePage';
import { renderWithProviders } from '../../tests/utils';

describe('TradePage', () => {
  it('renders the title, description, and default badge', () => {
    renderWithProviders(
      <TradePage icon={Package} title="Sample Module" description="Sample description text" />,
    );

    expect(screen.getByRole('heading', { name: 'Sample Module' })).toBeInTheDocument();
    expect(screen.getByText('Sample description text')).toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('renders a custom badge when provided', () => {
    renderWithProviders(
      <TradePage icon={Package} title="Sample Module" description="Sample description" badge="Beta" />,
    );

    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Coming Soon')).not.toBeInTheDocument();
  });

  it('does not render the Key Features, Workflow Preview, or Future Automation sections when their lists are empty', () => {
    renderWithProviders(
      <TradePage icon={Package} title="Sample Module" description="Sample description" />,
    );

    expect(screen.queryByText('Key Features')).not.toBeInTheDocument();
    expect(screen.queryByText('Workflow Preview')).not.toBeInTheDocument();
    expect(screen.queryByText('Future Automation')).not.toBeInTheDocument();
  });

  it('renders feature, workflow, and automation sections when provided', () => {
    renderWithProviders(
      <TradePage
        icon={Package}
        title="Sample Module"
        description="Sample description"
        features={[{ icon: Package, title: 'Feature One', description: 'Feature one description' }]}
        workflow={[{ title: 'Step One', description: 'Step one description' }]}
        automation={[{ title: 'Automation One', description: 'Automation one description' }]}
      />,
    );

    expect(screen.getByText('Key Features')).toBeInTheDocument();
    expect(screen.getByText('Feature One')).toBeInTheDocument();

    expect(screen.getByText('Workflow Preview')).toBeInTheDocument();
    expect(screen.getByText('Step One')).toBeInTheDocument();

    expect(screen.getByText('Future Automation')).toBeInTheDocument();
    expect(screen.getByText('Automation One')).toBeInTheDocument();
  });
});
