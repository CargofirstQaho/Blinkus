import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PurchaseOrderPage from './PurchaseOrderPage';
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

const completeOrg = {
  _id: 'org-1',
  organizationName: 'Acme Trading Co.',
  contact: { address: '221B Baker Street, Mumbai' },
  kyc: { gst: { number: '27AAAAA0000A1Z5' } },
};

describe('PurchaseOrderPage', () => {
  beforeEach(() => {
    saveDraftApi.mockReset();
    getLatestDraftApi.mockReset();
    getPurchaseOrderByIdApi.mockReset();
    generatePdfApi.mockReset();
    deleteDraftApi.mockReset();
    mockNavigate.mockReset();
  });

  it('shows the empty form immediately with no draft id, and never requests the latest draft', async () => {
    const { container } = renderWithProviders(<PurchaseOrderPage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    await waitFor(() => expect(screen.getByText('New Purchase Order')).toBeInTheDocument());

    expect(getLatestDraftApi).not.toHaveBeenCalled();
    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  it('renders all form sections once the draft has loaded', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    renderWithProviders(<PurchaseOrderPage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    await waitFor(() => expect(screen.getByText('New Purchase Order')).toBeInTheDocument());

    expect(screen.getByText('Purchase Order')).toBeInTheDocument();
    expect(screen.getByText('Auto-number on first save')).toBeInTheDocument();
    expect(screen.getByText('Buyer / Bill-To Details')).toBeInTheDocument();
    expect(screen.getByText('Ship To Details')).toBeInTheDocument();
    expect(screen.getByText('Order Details')).toBeInTheDocument();
    expect(screen.getByText('Line Items')).toBeInTheDocument();
    expect(screen.getByText('Bank Details')).toBeInTheDocument();
    expect(screen.getByText('Notes & Signatures')).toBeInTheDocument();
    expect(screen.getByText('Save Draft')).toBeInTheDocument();
    expect(screen.getByText('Save & Generate')).toBeInTheDocument();
  });

  it('disables the Save & Generate button while the form is incomplete', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    renderWithProviders(<PurchaseOrderPage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    await waitFor(() => expect(screen.getByText('New Purchase Order')).toBeInTheDocument());

    const generateButton = screen.getByText('Save & Generate').closest('button');
    await waitFor(() => expect(generateButton).toBeDisabled());
    expect(generateButton).toHaveAttribute('title', 'Complete all required fields to enable');
  });

  it('displays the organization header card when the organization profile is loaded', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    renderWithProviders(<PurchaseOrderPage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    await waitFor(() => expect(screen.getByText('New Purchase Order')).toBeInTheDocument());

    expect(screen.getByText('Acme Trading Co.')).toBeInTheDocument();
    expect(screen.getByText('221B Baker Street, Mumbai')).toBeInTheDocument();
    expect(screen.getByText('GST: 27AAAAA0000A1Z5')).toBeInTheDocument();
  });

  it('adds a new line item when "Add Item" is clicked', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    renderWithProviders(<PurchaseOrderPage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    await waitFor(() => expect(screen.getByText('New Purchase Order')).toBeInTheDocument());

    expect(screen.getAllByText(/^Item \d$/)).toHaveLength(1);

    await userEvent.click(screen.getByRole('button', { name: /add item/i }));

    expect(screen.getAllByText(/^Item \d$/)).toHaveLength(2);
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders the existing draft values when opened via ?id= from Trade → Drafts', async () => {
    const mockDraft = {
      _id: 'po-1',
      purchaseOrderNumber: 'PO-2024-001',
      buyerDetails: {
        buyerName: 'Jane Doe',
        buyerCompany: 'Acme Buyer Corp',
        buyerAddress: '1 Main St',
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
    getPurchaseOrderByIdApi.mockResolvedValue(mockDraft);
    renderWithProviders(<PurchaseOrderPage />, {
      route: '/trade/domestic/purchase-order/form?id=po-1',
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    await waitFor(() => expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument());

    expect(getPurchaseOrderByIdApi).toHaveBeenCalledWith('po-1');
    expect(getLatestDraftApi).not.toHaveBeenCalled();
    expect(screen.getByDisplayValue('Acme Buyer Corp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Warehouse LLC')).toBeInTheDocument();
    expect(screen.getByDisplayValue('State Bank of India')).toBeInTheDocument();
    expect(screen.getAllByText('PO-2024-001').length).toBeGreaterThan(0);
  });
});
