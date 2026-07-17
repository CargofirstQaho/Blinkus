import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TradePlanList from './TradePlanList';
import { renderWithProviders } from '../../../../tests/utils';

const plans = {
  monthly: { price: 999, displayPrice: '₹999', bonusMonthsAvailable: 0, savingsPercent: 0 },
  sixMonth: { price: 4999, displayPrice: '₹4999', bonusMonthsAvailable: 1, savingsPercent: 10 },
  yearly: { price: 9999, displayPrice: '₹9999', bonusMonthsAvailable: 2, savingsPercent: 20 },
};

describe('TradePlanList', () => {
  it('renders nothing when plans is not provided', () => {
    const { container } = renderWithProviders(<TradePlanList plans={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a card for each plan with its title and price', () => {
    renderWithProviders(<TradePlanList plans={plans} />);

    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('₹999')).toBeInTheDocument();
    expect(screen.getByText('Six Month')).toBeInTheDocument();
    expect(screen.getByText('₹4999')).toBeInTheDocument();
    expect(screen.getByText('Yearly')).toBeInTheDocument();
    expect(screen.getByText('₹9999')).toBeInTheDocument();
  });

  it('highlights the Six Month plan as "Most popular"', () => {
    renderWithProviders(<TradePlanList plans={plans} />);

    expect(screen.getByText('Most popular')).toBeInTheDocument();
  });

  it('passes bonus months and savings percent through to each card', () => {
    renderWithProviders(<TradePlanList plans={plans} />);

    expect(screen.getByText('+1 bonus month')).toBeInTheDocument();
    expect(screen.getByText('+2 bonus months')).toBeInTheDocument();
    expect(screen.getByText('Save 10%')).toBeInTheDocument();
    expect(screen.getByText('Save 20%')).toBeInTheDocument();
  });

  it('shows "Processing…" and disables all cards when a plan is being selected', () => {
    renderWithProviders(<TradePlanList plans={plans} selectingPlan="sixMonth" />);

    expect(screen.getByRole('button', { name: 'Processing…' })).toBeInTheDocument();
    const choosePlanButtons = screen.getAllByRole('button', { name: 'Choose plan' });
    choosePlanButtons.forEach((button) => expect(button).toBeDisabled());
  });

  it('calls onSelectPlan with the corresponding plan key when a card is chosen', async () => {
    const onSelectPlan = jest.fn();
    renderWithProviders(<TradePlanList plans={plans} onSelectPlan={onSelectPlan} />);

    const choosePlanButtons = screen.getAllByRole('button', { name: 'Choose plan' });
    await userEvent.click(choosePlanButtons[0]);

    expect(onSelectPlan).toHaveBeenCalledWith('monthly');
  });

  it('shows "Coming soon" on every card when comingSoon is true', () => {
    renderWithProviders(<TradePlanList plans={plans} comingSoon />);

    expect(screen.getAllByText('Coming soon')).toHaveLength(6);
    screen.getAllByRole('button', { name: 'Coming soon' }).forEach((button) => expect(button).toBeDisabled());
  });
});
