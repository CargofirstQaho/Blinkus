import { screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import PartySection from './PartySection';
import { renderWithProviders } from '../../../../tests/utils';

function Harness({ errors = {}, ...props }) {
  const { register } = useForm();
  return <PartySection {...props} register={register} errors={errors} />;
}

describe('PartySection', () => {
  it('renders the title and core fields with the given name label', () => {
    renderWithProviders(<Harness title="Buyer Information" prefix="buyer" nameLabel="Buyer Name" />);

    expect(screen.getByRole('heading', { name: 'Buyer Information' })).toBeInTheDocument();
    expect(screen.getByText('Buyer Name')).toBeInTheDocument();
    expect(screen.getByText('Contact Person')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('GST Number')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('renders full address fields when showFullAddress is true', () => {
    renderWithProviders(
      <Harness title="Buyer Information" prefix="buyer" nameLabel="Buyer Name" showFullAddress />,
    );

    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Postal Code')).toBeInTheDocument();
  });

  it('does not render full address fields when showFullAddress is false', () => {
    renderWithProviders(
      <Harness title="Customer Details" prefix="customer" nameLabel="Customer Name" showFullAddress={false} />,
    );

    expect(screen.queryByText('City')).not.toBeInTheDocument();
    expect(screen.queryByText('Postal Code')).not.toBeInTheDocument();
  });

  it('renders an error message for the name field', () => {
    renderWithProviders(
      <Harness
        title="Buyer Information"
        prefix="buyer"
        nameLabel="Buyer Name"
        errors={{ buyerName: { message: 'Buyer name is required' } }}
      />,
    );

    expect(screen.getByText('Buyer name is required')).toBeInTheDocument();
  });
});
