import { screen } from '@testing-library/react';
import EWayBillPage from './EWayBillPage';
import { renderWithProviders } from '../../../../tests/utils';

describe('EWayBillPage', () => {
  it('renders the page header with title, badge, and description', () => {
    renderWithProviders(<EWayBillPage />);

    expect(screen.getByRole('heading', { name: 'E-Way Bill' })).toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText(/Generate, manage, and track GST-compliant electronic way bills/)).toBeInTheDocument();
  });

  it('renders the key features section', () => {
    renderWithProviders(<EWayBillPage />);

    expect(screen.getByText('Key Features')).toBeInTheDocument();
    expect(screen.getByText('Transport Details')).toBeInTheDocument();
    expect(screen.getByText('GST Compliance')).toBeInTheDocument();
    expect(screen.getByText('Shipment Tracking')).toBeInTheDocument();
    expect(screen.getByText('QR Code Generation')).toBeInTheDocument();
    expect(screen.getByText('Extension & Cancellation')).toBeInTheDocument();
    expect(screen.getByText('Consolidated e-Way Bills')).toBeInTheDocument();
  });

  it('renders the workflow preview section', () => {
    renderWithProviders(<EWayBillPage />);

    expect(screen.getByText('Workflow Preview')).toBeInTheDocument();
    expect(screen.getByText('Create Invoice')).toBeInTheDocument();
    expect(screen.getByText('Enter Transport')).toBeInTheDocument();
    expect(screen.getByText('Generate e-Way Bill')).toBeInTheDocument();
    expect(screen.getByText('Print & Dispatch')).toBeInTheDocument();
  });

  it('renders the future automation section', () => {
    renderWithProviders(<EWayBillPage />);

    expect(screen.getByText('Future Automation')).toBeInTheDocument();
    expect(screen.getByText('Auto e-Way bill on invoice creation')).toBeInTheDocument();
    expect(screen.getByText('Threshold value detection')).toBeInTheDocument();
    expect(screen.getByText('Validity expiry notifications')).toBeInTheDocument();
  });
});
