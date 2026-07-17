import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreditNotePage from './CreditNotePage';
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

const completeOrg = {
  _id: 'org-1',
  organizationName: 'Acme Trading Co.',
  contact: { address: '221B Baker Street, Mumbai' },
  kyc: { gst: { number: '27AAAAA0000A1Z5' } },
};

describe('CreditNotePage', () => {
  beforeEach(() => {
    saveCreditNoteDraftApi.mockReset();
    getLatestCreditNoteDraftApi.mockReset();
    getCreditNoteByIdApi.mockReset();
    generateCreditNotePdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('renders all form sections', async () => {
    getLatestCreditNoteDraftApi.mockResolvedValue(null);
    renderWithProviders(<CreditNotePage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    expect(screen.getByText('Credit Note')).toBeInTheDocument();
    expect(screen.getByText('Credit Note Information')).toBeInTheDocument();
    expect(screen.getByText('Customer Information')).toBeInTheDocument();
    expect(screen.getByText('Item Table')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Additional Information')).toBeInTheDocument();
    expect(screen.getAllByText('Save Draft').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Save & Generate').length).toBeGreaterThan(0);
  });

  it('disables the Save & Generate buttons while the form is incomplete', async () => {
    getLatestCreditNoteDraftApi.mockResolvedValue(null);
    renderWithProviders(<CreditNotePage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    const generateButtons = screen.getAllByText('Save & Generate', { exact: false }).map((el) => el.closest('button'));
    for (const btn of generateButtons) {
      await waitFor(() => expect(btn).toBeDisabled());
      expect(btn).toHaveAttribute('title', 'Complete all required fields to enable');
    }
  });

  it('displays the organization details when the organization profile is loaded', async () => {
    getLatestCreditNoteDraftApi.mockResolvedValue(null);
    renderWithProviders(<CreditNotePage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    expect(screen.getByText('Acme Trading Co.')).toBeInTheDocument();
    expect(screen.getByText('221B Baker Street, Mumbai')).toBeInTheDocument();
    expect(screen.getByText(/GSTIN: 27AAAAA0000A1Z5/)).toBeInTheDocument();
  });

  it('adds a new line item when "Add Line Item" is clicked', async () => {
    getLatestCreditNoteDraftApi.mockResolvedValue(null);
    renderWithProviders(<CreditNotePage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    expect(screen.getAllByText(/^Item \d$/)).toHaveLength(1);

    await userEvent.click(screen.getByRole('button', { name: /add line item/i }));

    expect(screen.getAllByText(/^Item \d$/)).toHaveLength(2);
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders the existing draft values when a draft is loaded', async () => {
    const mockDraft = {
      _id: 'cn-1',
      creditNoteNumber: 'CN-2024-001',
      creditNoteInfo: { creditNoteDate: '2024-01-15', referenceInvoiceNumber: 'INV-001', referenceInvoiceDate: '2024-01-01', currency: 'INR', placeOfSupply: 'Maharashtra' },
      customerInfo: {
        customerName: 'Jane Customer',
        customerCompany: 'Acme Buyer Corp',
        billingAddress: '1 Main St',
        shippingAddress: '2 Dock Rd',
        gstNumber: '27AAAAA0000A1Z5',
        email: 'jane@acme.com',
        phone: '+91 98765 43210',
      },
      lineItems: [{ itemName: 'Steel Widget', description: 'Steel widget', hsnCode: '7326', quantity: 10, unit: 'PCS', unitPrice: 5, taxPercent: 18 }],
      summary: { creditAmount: 59 },
      reasonForCreditNote: 'Sales Return',
      notes: 'Refund for return',
      termsAndConditions: 'Standard terms',
    };
    getCreditNoteByIdApi.mockResolvedValue(mockDraft);
    renderWithProviders(<CreditNotePage />, {
      route: '/?id=cn-1',
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    await waitFor(() => expect(getCreditNoteByIdApi).toHaveBeenCalledWith('cn-1'));
    await waitFor(() => expect(screen.getByDisplayValue('Jane Customer')).toBeInTheDocument());

    expect(screen.getByDisplayValue('Acme Buyer Corp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('INV-001')).toBeInTheDocument();
    expect(screen.getAllByText('Draft: CN-2024-001').length).toBeGreaterThan(0);
  });
});
