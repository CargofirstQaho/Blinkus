import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlanCard from './PlanCard';
import { renderWithProviders } from '../../../../tests/utils';

describe('PlanCard', () => {
  it('renders the title, price, and period label', () => {
    renderWithProviders(
      <PlanCard title="Monthly" displayPrice="₹999" periodLabel="/ month" />,
    );

    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('₹999')).toBeInTheDocument();
    expect(screen.getByText('/ month')).toBeInTheDocument();
  });

  it('renders the feature list', () => {
    renderWithProviders(
      <PlanCard title="Monthly" displayPrice="₹999" features={['Feature A', 'Feature B']} />,
    );

    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
  });

  it('renders the "Most popular" badge when highlighted', () => {
    renderWithProviders(<PlanCard title="Six Month" displayPrice="₹4999" highlighted />);

    expect(screen.getByText('Most popular')).toBeInTheDocument();
  });

  it('renders the bonus months badge when bonusMonths is greater than 0', () => {
    renderWithProviders(<PlanCard title="Yearly" displayPrice="₹9999" bonusMonths={2} />);

    expect(screen.getByText('+2 bonus months')).toBeInTheDocument();
  });

  it('renders the savings badge when savingsPercent is greater than 0', () => {
    renderWithProviders(<PlanCard title="Yearly" displayPrice="₹9999" savingsPercent={20} />);

    expect(screen.getByText('Save 20%')).toBeInTheDocument();
  });

  it('shows "Coming soon" and disables the button when comingSoon is true', () => {
    renderWithProviders(<PlanCard title="Yearly" displayPrice="₹9999" comingSoon />);

    const button = screen.getByRole('button', { name: 'Coming soon' });
    expect(button).toBeDisabled();
  });

  it('calls onSelect when the CTA button is clicked', async () => {
    const onSelect = jest.fn();
    renderWithProviders(<PlanCard title="Monthly" displayPrice="₹999" ctaLabel="Choose plan" onSelect={onSelect} />);

    await userEvent.click(screen.getByRole('button', { name: 'Choose plan' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
