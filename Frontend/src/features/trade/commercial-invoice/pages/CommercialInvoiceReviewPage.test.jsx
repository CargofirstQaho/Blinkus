import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommercialInvoiceReviewPage from './CommercialInvoiceReviewPage';
import { renderWithProviders } from '../../../../tests/utils';
import {
  saveCommercialInvoiceDraftApi,
  getLatestCommercialInvoiceDraftApi,
  getCommercialInvoiceByIdApi,
  generateCommercialInvoicePdfApi,
} from '../services/commercialInvoiceApi';

jest.mock('../services/commercialInvoiceApi', () => ({
  saveCommercialInvoiceDraftApi: jest.fn(),
  getLatestCommercialInvoiceDraftApi: jest.fn(),
  getCommercialInvoiceByIdApi: jest.fn(),
  generateCommercialInvoicePdfApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockCi = {
  _id: 'ci-1',
  commercialInvoiceNumber: 'CI-2024-001',
  status: 'DRAFT',
  contractNumber: 'CNT/2024/001',
  invoiceInfo: { date: '2024-01-15' },
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
  shippingDetails: { vessel: 'MV Trader', blNumber: 'BL12345', portOfLoading: 'Mumbai', portOfDischarge: 'LA', finalDestination: 'Los Angeles' },
  goodsItems: [{ commodity: 'Basmati Rice', hsnCode: '10063020', description: 'Premium Rice', quantity: 100, unit: 'MT', unitPrice: 500, amount: 50000 }],
  financial: { currency: 'USD', tax: 100, freight: 50, insurance: 25, total: 50175, subTotal: 50000 },
  bankDetails: { bankName: 'HDFC Bank', accountNumber: '1234567890', swift: 'HDFCINBB', ifsc: 'HDFC0000123' },
  declaration: 'Some declaration',
  termsAndConditions: 'Some terms',
  signatory: { name: 'John Signer', designation: 'Director' },
};

describe('CommercialInvoiceReviewPage', () => {
  beforeEach(() => {
    saveCommercialInvoiceDraftApi.mockReset();
    getLatestCommercialInvoiceDraftApi.mockReset();
    getCommercialInvoiceByIdApi.mockReset();
    generateCommercialInvoicePdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('shows a spinner while the commercial invoice is loading', () => {
    getCommercialInvoiceByIdApi.mockReturnValue(new Promise(() => {}));
    const { container } = renderWithProviders(<CommercialInvoiceReviewPage />, {
      route: '/trade/international/commercial-invoice/review?id=ci-1',
    });

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.getByText('Loading commercial invoice…')).toBeInTheDocument();
  });

  it('shows a not found message when there is no commercial invoice to review', async () => {
    renderWithProviders(<CommercialInvoiceReviewPage />);

    expect(await screen.findByText('Commercial invoice not found')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to commercial invoice form/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/commercial-invoice');
  });

  it('loads a commercial invoice from the query string and renders its details', async () => {
    getCommercialInvoiceByIdApi.mockResolvedValue(mockCi);
    renderWithProviders(<CommercialInvoiceReviewPage />, { route: '/trade/international/commercial-invoice/review?id=ci-1' });

    await waitFor(() => expect(getCommercialInvoiceByIdApi).toHaveBeenCalledWith('ci-1'));

    expect(await screen.findByText('Commercial Invoice Review')).toBeInTheDocument();
    expect(screen.getByText('COMMERCIAL INVOICE INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('EXPORTER DETAILS')).toBeInTheDocument();
    expect(screen.getByText('BUYER DETAILS')).toBeInTheDocument();
    expect(screen.getByText('NOTIFY PARTY')).toBeInTheDocument();
    expect(screen.getByText('CONSIGNEE')).toBeInTheDocument();
    expect(screen.getByText('SHIPPING DETAILS')).toBeInTheDocument();
    expect(screen.getByText('GOODS DETAILS')).toBeInTheDocument();
    expect(screen.getByText('FINANCIAL INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('BANK DETAILS')).toBeInTheDocument();
    expect(screen.getByText('DECLARATION & TERMS')).toBeInTheDocument();
    expect(screen.getByText('Acme Exporters')).toBeInTheDocument();
    expect(screen.getByText('Acme Buyers')).toBeInTheDocument();
    expect(screen.getByText('Basmati Rice')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate pdf/i })).toBeInTheDocument();
  });

  it('generates the PDF and shows the generated state with an open link', async () => {
    getCommercialInvoiceByIdApi.mockResolvedValue(mockCi);
    generateCommercialInvoicePdfApi.mockResolvedValue({ ...mockCi, status: 'GENERATED', pdfUrl: 'https://files/ci-001.pdf' });
    renderWithProviders(<CommercialInvoiceReviewPage />, { route: '/trade/international/commercial-invoice/review?id=ci-1' });

    const generateButton = await screen.findByRole('button', { name: /generate pdf/i });
    await userEvent.click(generateButton);

    await waitFor(() => expect(generateCommercialInvoicePdfApi).toHaveBeenCalledWith('ci-1', mockCi));

    expect(await screen.findByText('PDF Generated')).toBeInTheDocument();
    const openLink = screen.getByText('Open PDF').closest('a');
    expect(openLink).toHaveAttribute('href', 'https://files/ci-001.pdf');
  });
});
