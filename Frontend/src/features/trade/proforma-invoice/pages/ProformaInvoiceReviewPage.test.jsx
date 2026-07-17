import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProformaInvoiceReviewPage from './ProformaInvoiceReviewPage';
import { renderWithProviders } from '../../../../tests/utils';
import {
  saveProformaInvoiceDraftApi,
  getLatestProformaInvoiceDraftApi,
  getProformaInvoiceByIdApi,
  generateProformaInvoicePdfApi,
} from '../services/proformaInvoiceApi';

jest.mock('../services/proformaInvoiceApi', () => ({
  saveProformaInvoiceDraftApi: jest.fn(),
  getLatestProformaInvoiceDraftApi: jest.fn(),
  getProformaInvoiceByIdApi: jest.fn(),
  generateProformaInvoicePdfApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockPi = {
  _id: 'pi-1',
  proformaInvoiceNumber: 'PI-2024-001',
  status: 'DRAFT',
  contractNumber: 'CNT/2024/001',
  invoiceInfo: { invoiceDate: '2024-01-15', currency: 'USD' },
  exporterDetails: {
    companyName: 'Acme Exporters',
    country: 'India',
    taxNumber: 'EXTAX1',
    email: 'exporter@example.com',
    phone: '+91 1234567890',
    address: 'Exporter Address',
  },
  buyerDetails: {
    companyName: 'Acme Buyers',
    contactPerson: 'Jane Buyer',
    country: 'USA',
    email: 'buyer@example.com',
    phone: '+1 1234567890',
    taxNumber: 'BTAX1',
    address: 'Buyer Address',
  },
  notifyParty: { name: 'Notify Co', country: 'USA', phone: '+1 1111111111', email: 'notify@example.com', address: 'Notify Address' },
  consignee: { name: 'Consignee Co', country: 'USA', phone: '+1 2222222222', email: 'consignee@example.com', address: 'Consignee Address' },
  shippingInfo: { portOfLoading: 'Mumbai', portOfDischarge: 'LA', finalDestination: 'Los Angeles', countryOfOrigin: 'India' },
  commercialDetails: [{ commodity: 'Basmati Rice', hsnCode: '10063020', quantity: 100, unit: 'MT', rate: 500, amount: 50000 }],
  financialInfo: { advancePercent: 30, advanceAmount: 15000, balanceAmount: 35000 },
  bankInfo: { bankName: 'HDFC Bank', accountNumber: '1234567890', ifsc: 'HDFC0000123', swift: 'HDFCINBB' },
  notes: 'Some notes',
  termsAndConditions: 'Some terms',
};

describe('ProformaInvoiceReviewPage', () => {
  beforeEach(() => {
    saveProformaInvoiceDraftApi.mockReset();
    getLatestProformaInvoiceDraftApi.mockReset();
    getProformaInvoiceByIdApi.mockReset();
    generateProformaInvoicePdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('shows a spinner while the proforma invoice is loading', () => {
    getProformaInvoiceByIdApi.mockReturnValue(new Promise(() => {}));
    const { container } = renderWithProviders(<ProformaInvoiceReviewPage />, {
      route: '/trade/international/proforma-invoice/review?id=pi-1',
    });

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.getByText('Loading proforma invoice…')).toBeInTheDocument();
  });

  it('shows a not found message when there is no proforma invoice to review', async () => {
    renderWithProviders(<ProformaInvoiceReviewPage />);

    expect(await screen.findByText('Proforma invoice not found')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to proforma invoice form/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/proforma-invoice');
  });

  it('loads a proforma invoice from the query string and renders its details', async () => {
    getProformaInvoiceByIdApi.mockResolvedValue(mockPi);
    renderWithProviders(<ProformaInvoiceReviewPage />, { route: '/trade/international/proforma-invoice/review?id=pi-1' });

    await waitFor(() => expect(getProformaInvoiceByIdApi).toHaveBeenCalledWith('pi-1'));

    expect(await screen.findByText('Proforma Invoice Review')).toBeInTheDocument();
    expect(screen.getByText('PROFORMA INVOICE INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('EXPORTER DETAILS')).toBeInTheDocument();
    expect(screen.getByText('BUYER DETAILS')).toBeInTheDocument();
    expect(screen.getByText('NOTIFY PARTY')).toBeInTheDocument();
    expect(screen.getByText('CONSIGNEE')).toBeInTheDocument();
    expect(screen.getByText('SHIPPING INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('COMMERCIAL DETAILS')).toBeInTheDocument();
    expect(screen.getByText('FINANCIAL INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('BANK INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('NOTES & TERMS')).toBeInTheDocument();
    expect(screen.getByText('Acme Exporters')).toBeInTheDocument();
    expect(screen.getByText('Acme Buyers')).toBeInTheDocument();
    expect(screen.getByText('Basmati Rice')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate pdf/i })).toBeInTheDocument();
  });

  it('generates the PDF and shows the generated state with an open link', async () => {
    getProformaInvoiceByIdApi.mockResolvedValue(mockPi);
    generateProformaInvoicePdfApi.mockResolvedValue({ ...mockPi, status: 'GENERATED', pdfUrl: 'https://files/pi-001.pdf' });
    renderWithProviders(<ProformaInvoiceReviewPage />, { route: '/trade/international/proforma-invoice/review?id=pi-1' });

    const generateButton = await screen.findByRole('button', { name: /generate pdf/i });
    await userEvent.click(generateButton);

    await waitFor(() => expect(generateProformaInvoicePdfApi).toHaveBeenCalledWith('pi-1', mockPi));

    expect(await screen.findByText('PDF Generated')).toBeInTheDocument();
    const openLink = screen.getByText('Open PDF').closest('a');
    expect(openLink).toHaveAttribute('href', 'https://files/pi-001.pdf');
  });
});
