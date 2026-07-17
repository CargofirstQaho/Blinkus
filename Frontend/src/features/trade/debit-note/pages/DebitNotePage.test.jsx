import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DebitNotePage from './DebitNotePage';
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

const completeOrg = {
  _id: 'org-1',
  organizationName: 'Acme Trading Co.',
  contact: { address: '221B Baker Street, Mumbai' },
  kyc: { gst: { number: '27AAAAA0000A1Z5' } },
};

describe('DebitNotePage', () => {
  beforeEach(() => {
    saveDebitNoteDraftApi.mockReset();
    getLatestDebitNoteDraftApi.mockReset();
    getDebitNoteByIdApi.mockReset();
    generateDebitNotePdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('renders all form sections', async () => {
    getLatestDebitNoteDraftApi.mockResolvedValue(null);
    renderWithProviders(<DebitNotePage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    expect(screen.getByText('Debit Note')).toBeInTheDocument();
    expect(screen.getByText('Debit Note Information')).toBeInTheDocument();
    expect(screen.getByText('Supplier Information')).toBeInTheDocument();
    expect(screen.getByText('Line Items')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Additional Information')).toBeInTheDocument();
    expect(screen.getAllByText('Save Draft').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Save & Generate', { exact: false }).length).toBeGreaterThan(0);
  });

  it('disables the Save & Generate buttons while the form is incomplete', async () => {
    getLatestDebitNoteDraftApi.mockResolvedValue(null);
    renderWithProviders(<DebitNotePage />, {
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
    getLatestDebitNoteDraftApi.mockResolvedValue(null);
    renderWithProviders(<DebitNotePage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    expect(screen.getByText('Acme Trading Co.')).toBeInTheDocument();
    expect(screen.getByText('221B Baker Street, Mumbai')).toBeInTheDocument();
    expect(screen.getByText(/GSTIN: 27AAAAA0000A1Z5/)).toBeInTheDocument();
  });

  it('adds a new line item when "Add Line Item" is clicked', async () => {
    getLatestDebitNoteDraftApi.mockResolvedValue(null);
    renderWithProviders(<DebitNotePage />, {
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
      _id: 'dn-1',
      debitNoteNumber: 'DN-2024-001',
      debitNoteInfo: { debitNoteDate: '2024-01-15', referenceInvoiceNumber: 'INV-001', referenceInvoiceDate: '2024-01-01', currency: 'INR' },
      supplierInfo: {
        supplierName: 'John Supplier',
        supplierCompany: 'Acme Supplier Corp',
        gstNumber: '27AAAAA0000A1Z5',
        address: '1 Main St',
        phone: '+91 98765 43210',
        email: 'john@acme.com',
      },
      lineItems: [{ itemName: 'Steel Widget', description: 'Steel widget', hsnCode: '7326', quantity: 10, unit: 'PCS', rate: 5, taxPercent: 18 }],
      summary: { balanceDue: 59 },
      reasonForDebitNote: 'Price Difference',
      notes: 'Adjustment note',
      termsAndConditions: 'Standard terms',
    };
    getDebitNoteByIdApi.mockResolvedValue(mockDraft);
    renderWithProviders(<DebitNotePage />, {
      route: '/?id=dn-1',
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    await waitFor(() => expect(getDebitNoteByIdApi).toHaveBeenCalledWith('dn-1'));
    await waitFor(() => expect(screen.getByDisplayValue('John Supplier')).toBeInTheDocument());

    expect(screen.getByDisplayValue('Acme Supplier Corp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('INV-001')).toBeInTheDocument();
    expect(screen.getAllByText('Draft: DN-2024-001').length).toBeGreaterThan(0);
  });
});
