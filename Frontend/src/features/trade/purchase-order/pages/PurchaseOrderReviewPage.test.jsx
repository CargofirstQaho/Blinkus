import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PurchaseOrderReviewPage from './PurchaseOrderReviewPage';
import { renderWithProviders } from '../../../../tests/utils';
import {
  saveDraftApi,
  getLatestDraftApi,
  getPurchaseOrderByIdApi,
  generatePdfApi,
  deleteDraftApi,
} from '../services/purchaseOrderApi';

jest.mock('../services/purchaseOrderApi', () => ({
  saveDraftApi: jest.fn(),
  getLatestDraftApi: jest.fn(),
  getPurchaseOrderByIdApi: jest.fn(),
  generatePdfApi: jest.fn(),
  deleteDraftApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockPo = {
  _id: 'po-1',
  purchaseOrderNumber: 'PO-2024-001',
  buyerDetails: {
    buyerName: 'Jane Doe',
    buyerCompany: 'Acme Buyer Corp',
    buyerAddress: '1 Main St',
    buyerCity: 'Mumbai',
    buyerCountry: 'India',
    buyerEmail: 'jane@acme.com',
    buyerPhone: '+91 98765 43210',
  },
  shipToDetails: {
    companyName: 'Warehouse LLC',
    address: '2 Dock Rd',
    country: 'India',
    contactPerson: 'Store Manager',
    phone: '+91 98765 00000',
  },
  orderDetails: { poDate: '2024-01-15', expectedDelivery: '2024-02-01', currency: 'USD', paymentTerms: 'Net 30', incoterms: 'FOB' },
  items: [{ itemNumber: '1', productName: 'Steel Widget', description: 'Steel widget', hsCode: '732690', quantity: 10, unit: 'PCS', unitPrice: 5 }],
  bankDetails: { bankName: 'State Bank of India', accountName: 'Acme Finance', accountNumber: '0001234567890', ifsc: 'SBIN0001234' },
  notes: { signatory: 'John Authoriser', signatoryDesignation: 'Procurement Manager' },
};

describe('PurchaseOrderReviewPage', () => {
  beforeEach(() => {
    saveDraftApi.mockReset();
    getLatestDraftApi.mockReset();
    getPurchaseOrderByIdApi.mockReset();
    generatePdfApi.mockReset();
    deleteDraftApi.mockReset();
    mockNavigate.mockReset();
  });

  it('shows a spinner while the draft is loading', () => {
    getPurchaseOrderByIdApi.mockReturnValue(new Promise(() => {}));
    const { container } = renderWithProviders(<PurchaseOrderReviewPage />, {
      route: '/trade/domestic/purchase-order/review?id=po-1',
    });

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows a not found message when there is no draft to review', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    renderWithProviders(<PurchaseOrderReviewPage />);

    expect(await screen.findByText('Purchase order not found.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to form/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/domestic/purchase-order');
  });

  it('loads a purchase order from the query string and renders its details', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    getPurchaseOrderByIdApi.mockResolvedValue(mockPo);
    renderWithProviders(<PurchaseOrderReviewPage />, { route: '/trade/domestic/purchase-order/review?id=po-1' });

    await waitFor(() => expect(getPurchaseOrderByIdApi).toHaveBeenCalledWith('po-1'));

    expect(await screen.findByText('Bill To / Buyer')).toBeInTheDocument();
    expect(screen.getByText('Ship To')).toBeInTheDocument();
    expect(screen.getByText('Line Items')).toBeInTheDocument();
    expect(screen.getByText('Acme Buyer Corp')).toBeInTheDocument();
    expect(screen.getByText('Warehouse LLC')).toBeInTheDocument();
    expect(screen.getByText('Steel Widget')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /confirm & generate pdf/i }).length).toBeGreaterThan(0);
  });

  it('generates the PDF and shows the success state with download/view links', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    getPurchaseOrderByIdApi.mockResolvedValue(mockPo);
    generatePdfApi.mockResolvedValue({ ...mockPo, pdfUrl: 'https://files/po-001.pdf' });
    renderWithProviders(<PurchaseOrderReviewPage />, { route: '/trade/domestic/purchase-order/review?id=po-1' });

    const [generateButton] = await screen.findAllByRole('button', { name: /confirm & generate pdf/i });
    await userEvent.click(generateButton);

    expect(await screen.findByText('PDF Generated Successfully')).toBeInTheDocument();
    expect(screen.getByText('GENERATED')).toBeInTheDocument();

    const downloadLink = screen.getByText('Download PDF').closest('a');
    const viewLink = screen.getByText('View PDF').closest('a');
    expect(downloadLink).toHaveAttribute('href', 'https://files/po-001.pdf');
    expect(viewLink).toHaveAttribute('href', 'https://files/po-001.pdf');
  });
});
