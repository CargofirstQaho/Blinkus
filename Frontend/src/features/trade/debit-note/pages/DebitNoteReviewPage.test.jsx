import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DebitNoteReviewPage from './DebitNoteReviewPage';
import { renderWithProviders } from '../../../../tests/utils';
import {
  saveDebitNoteDraftApi,
  getLatestDebitNoteDraftApi,
  getDebitNoteByIdApi,
  generateDebitNotePdfApi,
} from '../services/debitNoteApi';

jest.mock('../services/debitNoteApi', () => ({
  saveDebitNoteDraftApi: jest.fn(),
  getLatestDebitNoteDraftApi: jest.fn(),
  getDebitNoteByIdApi: jest.fn(),
  generateDebitNotePdfApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockDn = {
  _id: 'dn-1',
  debitNoteNumber: 'DN-2024-001',
  status: 'DRAFT',
  debitNoteInfo: {
    debitNoteDate: '2024-01-15',
    referenceInvoiceNumber: 'INV-001',
    referenceInvoiceDate: '2024-01-01',
    currency: 'INR',
  },
  supplierInfo: {
    supplierName: 'John Supplier',
    supplierCompany: 'Acme Supplier Corp',
    gstNumber: '27AAAAA0000A1Z5',
    address: '1 Main St',
    phone: '+91 98765 43210',
    email: 'john@acme.com',
  },
  lineItems: [
    { itemName: 'Steel Widget', description: 'Steel widget', hsnCode: '7326', quantity: 10, unit: 'PCS', rate: 5, taxPercent: 18, taxAmount: 9, total: 59 },
  ],
  summary: { subtotal: 50, tax: 9, grandTotal: 59, balanceDue: 59 },
  reasonForDebitNote: 'Price Difference',
  notes: 'Adjustment note',
  termsAndConditions: 'Standard terms',
};

describe('DebitNoteReviewPage', () => {
  beforeEach(() => {
    saveDebitNoteDraftApi.mockReset();
    getLatestDebitNoteDraftApi.mockReset();
    getDebitNoteByIdApi.mockReset();
    generateDebitNotePdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('shows a spinner while the debit note is loading', () => {
    getDebitNoteByIdApi.mockReturnValue(new Promise(() => {}));
    const { container } = renderWithProviders(<DebitNoteReviewPage />, {
      route: '/trade/domestic/debit-note/review?id=dn-1',
    });

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.getByText('Loading debit note…')).toBeInTheDocument();
  });

  it('shows a not found message when there is no debit note to review', async () => {
    renderWithProviders(<DebitNoteReviewPage />);

    expect(await screen.findByText('Debit note not found')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to debit note form/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/domestic/debit-note');
  });

  it('loads a debit note from the query string and renders its details', async () => {
    getDebitNoteByIdApi.mockResolvedValue(mockDn);
    renderWithProviders(<DebitNoteReviewPage />, { route: '/trade/domestic/debit-note/review?id=dn-1' });

    await waitFor(() => expect(getDebitNoteByIdApi).toHaveBeenCalledWith('dn-1'));

    expect(await screen.findByText('Debit Note Review')).toBeInTheDocument();
    expect(screen.getByText('DEBIT NOTE INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('SUPPLIER INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('LINE ITEMS')).toBeInTheDocument();
    expect(screen.getByText('ADDITIONAL INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('John Supplier')).toBeInTheDocument();
    expect(screen.getByText('Steel Widget')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate pdf/i })).toBeInTheDocument();
  });

  it('generates the PDF and shows the generated state with an open link', async () => {
    getDebitNoteByIdApi.mockResolvedValue(mockDn);
    generateDebitNotePdfApi.mockResolvedValue({ ...mockDn, status: 'GENERATED', pdfUrl: 'https://files/dn-001.pdf' });
    renderWithProviders(<DebitNoteReviewPage />, { route: '/trade/domestic/debit-note/review?id=dn-1' });

    const generateButton = await screen.findByRole('button', { name: /generate pdf/i });
    await userEvent.click(generateButton);

    await waitFor(() => expect(generateDebitNotePdfApi).toHaveBeenCalledWith('dn-1', mockDn));

    expect(await screen.findByText('PDF Generated')).toBeInTheDocument();
    const openLink = screen.getByText('Open PDF').closest('a');
    expect(openLink).toHaveAttribute('href', 'https://files/dn-001.pdf');
  });
});
