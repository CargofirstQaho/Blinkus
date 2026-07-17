import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreditNoteReviewPage from './CreditNoteReviewPage';
import { renderWithProviders } from '../../../../tests/utils';
import {
  saveCreditNoteDraftApi,
  getLatestCreditNoteDraftApi,
  getCreditNoteByIdApi,
  generateCreditNotePdfApi,
} from '../services/creditNoteApi';

jest.mock('../services/creditNoteApi', () => ({
  saveCreditNoteDraftApi: jest.fn(),
  getLatestCreditNoteDraftApi: jest.fn(),
  getCreditNoteByIdApi: jest.fn(),
  generateCreditNotePdfApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockCn = {
  _id: 'cn-1',
  creditNoteNumber: 'CN-2024-001',
  status: 'DRAFT',
  creditNoteInfo: {
    creditNoteDate: '2024-01-15',
    referenceInvoiceNumber: 'INV-001',
    referenceInvoiceDate: '2024-01-01',
    currency: 'INR',
    placeOfSupply: 'Maharashtra',
  },
  customerInfo: {
    customerName: 'Jane Customer',
    customerCompany: 'Acme Buyer Corp',
    billingAddress: '1 Main St',
    shippingAddress: '2 Dock Rd',
    gstNumber: '27AAAAA0000A1Z5',
    email: 'jane@acme.com',
    phone: '+91 98765 43210',
  },
  lineItems: [
    { itemName: 'Steel Widget', description: 'Steel widget', hsnCode: '7326', quantity: 10, unit: 'PCS', unitPrice: 5, taxPercent: 18, taxAmount: 9, total: 59 },
  ],
  summary: { subTotal: 50, cgst: 4.5, sgst: 4.5, igst: 0, total: 59, creditAmount: 59 },
  reasonForCreditNote: 'Sales Return',
  notes: 'Refund for return',
  termsAndConditions: 'Standard terms',
};

describe('CreditNoteReviewPage', () => {
  beforeEach(() => {
    saveCreditNoteDraftApi.mockReset();
    getLatestCreditNoteDraftApi.mockReset();
    getCreditNoteByIdApi.mockReset();
    generateCreditNotePdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('shows a spinner while the credit note is loading', () => {
    getCreditNoteByIdApi.mockReturnValue(new Promise(() => {}));
    const { container } = renderWithProviders(<CreditNoteReviewPage />, {
      route: '/trade/domestic/credit-note/review?id=cn-1',
    });

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.getByText('Loading credit note…')).toBeInTheDocument();
  });

  it('shows a not found message when there is no credit note to review', async () => {
    renderWithProviders(<CreditNoteReviewPage />);

    expect(await screen.findByText('Credit note not found')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to credit note form/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/domestic/credit-note');
  });

  it('loads a credit note from the query string and renders its details', async () => {
    getCreditNoteByIdApi.mockResolvedValue(mockCn);
    renderWithProviders(<CreditNoteReviewPage />, { route: '/trade/domestic/credit-note/review?id=cn-1' });

    await waitFor(() => expect(getCreditNoteByIdApi).toHaveBeenCalledWith('cn-1'));

    expect(await screen.findByText('Credit Note Review')).toBeInTheDocument();
    expect(screen.getByText('CREDIT NOTE INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('CUSTOMER INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('ITEM TABLE')).toBeInTheDocument();
    expect(screen.getByText('ADDITIONAL INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('Jane Customer')).toBeInTheDocument();
    expect(screen.getByText('Steel Widget')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate pdf/i })).toBeInTheDocument();
  });

  it('generates the PDF and shows the generated state with an open link', async () => {
    getCreditNoteByIdApi.mockResolvedValue(mockCn);
    generateCreditNotePdfApi.mockResolvedValue({ ...mockCn, status: 'GENERATED', pdfUrl: 'https://files/cn-001.pdf' });
    renderWithProviders(<CreditNoteReviewPage />, { route: '/trade/domestic/credit-note/review?id=cn-1' });

    const generateButton = await screen.findByRole('button', { name: /generate pdf/i });
    await userEvent.click(generateButton);

    await waitFor(() => expect(generateCreditNotePdfApi).toHaveBeenCalledWith('cn-1', mockCn));

    expect(await screen.findByText('PDF Generated')).toBeInTheDocument();
    const openLink = screen.getByText('Open PDF').closest('a');
    expect(openLink).toHaveAttribute('href', 'https://files/cn-001.pdf');
  });
});
