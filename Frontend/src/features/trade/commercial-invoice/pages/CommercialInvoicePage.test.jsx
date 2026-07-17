import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommercialInvoicePage from './CommercialInvoicePage';
import { renderWithProviders } from '../../../../tests/utils';
import {
  saveCommercialInvoiceDraftApi,
  getLatestCommercialInvoiceDraftApi,
  getCommercialInvoiceByIdApi,
  generateCommercialInvoicePdfApi,
} from '../services/commercialInvoiceApi';
import {
  listFinalizedContractsApi,
  getContractByIdApi,
} from '../../international/contracts/services/contractApi';

jest.mock('../services/commercialInvoiceApi', () => ({
  saveCommercialInvoiceDraftApi: jest.fn(),
  getLatestCommercialInvoiceDraftApi: jest.fn(),
  getCommercialInvoiceByIdApi: jest.fn(),
  generateCommercialInvoicePdfApi: jest.fn(),
}));

jest.mock('../../international/contracts/services/contractApi', () => ({
  listFinalizedContractsApi: jest.fn(),
  getContractByIdApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const completeOrg = {
  _id: 'org-1',
  organizationName: 'Acme Trading Co.',
  organizationEmail: 'acme@example.com',
  contact: { address: '221B Baker Street, Mumbai', phone: '+91 98765 43210' },
  kyc: { gst: { number: '27AAAAA0000A1Z5' } },
};

const mockContractList = [
  { _id: 'c-1', contractNumber: 'CNT/2024/001', buyerName: 'Jane Buyer', sellerName: 'John Seller' },
];

const mockContractDetails = {
  _id: 'c-1',
  contractNumber: 'CNT/2024/001',
  buyer: { companyName: 'Buyer Co', address: 'Buyer Address', country: 'India', contactPerson: 'Jane Buyer', phone: '+91 1111111', email: 'buyer@example.com', taxNumber: 'BTAX1' },
  seller: { companyName: 'Seller Co', address: 'Seller Address', country: 'China', email: 'seller@example.com', phone: '+86 2222222', taxNumber: 'STAX1' },
  commodity: { commodity: 'Basmati Rice', hsCode: '10063020', originCountry: 'India' },
  shipment: { quantity: 100, unit: 'MT', loadingPort: 'Mumbai', destinationPort: 'Shanghai' },
  price: { unitPrice: 500, currency: 'USD' },
};

describe('CommercialInvoicePage', () => {
  beforeEach(() => {
    saveCommercialInvoiceDraftApi.mockReset();
    getLatestCommercialInvoiceDraftApi.mockReset();
    getCommercialInvoiceByIdApi.mockReset();
    generateCommercialInvoicePdfApi.mockReset();
    listFinalizedContractsApi.mockReset();
    getContractByIdApi.mockReset();
    mockNavigate.mockReset();
  });

  it('renders all sections and shows the no-finalized-contract message when none exist', async () => {
    getLatestCommercialInvoiceDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue([]);
    renderWithProviders(<CommercialInvoicePage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    expect(screen.getByText('Commercial Invoice')).toBeInTheDocument();
    expect(await screen.findByText('No Finalized Contract Found')).toBeInTheDocument();

    [
      'Invoice Information', 'Exporter Details', 'Buyer Details', 'Notify Party', 'Consignee',
      'Shipping Information', 'Goods Details', 'Financial Information', 'Bank Details',
      'Declaration & Terms', 'Signature',
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    const saveDraftButtons = screen.getAllByText('Save Draft').map((el) => el.closest('button'));
    for (const btn of saveDraftButtons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute('title', 'A finalized contract is required');
    }
  });

  it('displays the organization details and auto-fills exporter information', async () => {
    getLatestCommercialInvoiceDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue([]);
    renderWithProviders(<CommercialInvoicePage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });
    await waitFor(() => expect(listFinalizedContractsApi).toHaveBeenCalled());

    expect(screen.getByText('Acme Trading Co.')).toBeInTheDocument();
    expect(screen.getByText('221B Baker Street, Mumbai')).toBeInTheDocument();
    expect(screen.getByText(/GSTIN: 27AAAAA0000A1Z5/)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByDisplayValue('Acme Trading Co.')).toBeInTheDocument());
    expect(screen.getByDisplayValue('27AAAAA0000A1Z5')).toBeInTheDocument();
  });

  it('selects a contract and auto-populates buyer, exporter, shipping and goods details', async () => {
    getLatestCommercialInvoiceDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue(mockContractList);
    getContractByIdApi.mockResolvedValue(mockContractDetails);
    renderWithProviders(<CommercialInvoicePage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    const contractOption = await screen.findByText('— Select a finalized contract —');
    await userEvent.selectOptions(contractOption.closest('select'), 'c-1');

    await waitFor(() => expect(getContractByIdApi).toHaveBeenCalledWith('c-1'));

    expect(await screen.findByDisplayValue('Buyer Co')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Seller Co')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('Basmati Rice').length).toBeGreaterThan(0);
    expect(screen.getAllByDisplayValue('10063020').length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue('Mumbai')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Shanghai')).toBeInTheDocument();
  });

  it('disables the save buttons without a title when no contract is selected', async () => {
    getLatestCommercialInvoiceDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue(mockContractList);
    renderWithProviders(<CommercialInvoicePage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });
    await waitFor(() => expect(listFinalizedContractsApi).toHaveBeenCalled());

    const [saveDraftButton] = screen.getAllByText('Save Draft').map((el) => el.closest('button'));
    expect(saveDraftButton).toBeDisabled();
    expect(saveDraftButton).not.toHaveAttribute('title');
  });

  it('renders the existing draft values when a draft is loaded', async () => {
    const mockDraft = {
      _id: 'ci-1',
      commercialInvoiceNumber: 'CI-2024-001',
      contract: 'c-1',
      contractNumber: 'CNT/2024/001',
      invoiceInfo: { date: '2024-01-15' },
      exporterDetails: { companyName: 'Acme Exporters', address: 'Exporter Address', country: 'India', email: 'exporter@example.com', phone: '+91 1234567890', taxNumber: 'EXTAX1' },
      buyerDetails: { companyName: 'Acme Buyers', address: 'Buyer Address', country: 'USA', contactPerson: 'Jane Buyer', phone: '+1 1234567890', email: 'buyer@example.com', taxNumber: 'BTAX1' },
      notifyParty: { name: 'Notify Co', address: 'Notify Address', country: 'USA', phone: '+1 1111111111', email: 'notify@example.com' },
      consignee: { name: 'Consignee Co', address: 'Consignee Address', country: 'USA', phone: '+1 2222222222', email: 'consignee@example.com' },
      shippingDetails: { vessel: 'MV Trader', blNumber: 'BL12345', portOfLoading: 'Mumbai', portOfDischarge: 'LA', finalDestination: 'Los Angeles' },
      goodsItems: [{ commodity: 'Basmati Rice', hsnCode: '10063020', description: 'Premium Rice', quantity: 100, unit: 'MT', unitPrice: 500 }],
      financial: { currency: 'USD', tax: 100, freight: 50, insurance: 25, total: 50175 },
      bankDetails: { bankName: 'HDFC Bank', accountNumber: '1234567890', swift: 'HDFCINBB', ifsc: 'HDFC0000123' },
      declaration: 'Some declaration',
      termsAndConditions: 'Some terms',
      signatory: { name: 'John Signer', designation: 'Director' },
    };
    getCommercialInvoiceByIdApi.mockResolvedValue(mockDraft);
    listFinalizedContractsApi.mockResolvedValue(mockContractList);
    renderWithProviders(<CommercialInvoicePage />, {
      route: '/?id=ci-1',
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    await waitFor(() => expect(getCommercialInvoiceByIdApi).toHaveBeenCalledWith('ci-1'));
    await waitFor(() => expect(screen.getByDisplayValue('Acme Exporters')).toBeInTheDocument());

    expect(screen.getByDisplayValue('Acme Buyers')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Notify Co')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Consignee Co')).toBeInTheDocument();
    expect(screen.getByDisplayValue('HDFC Bank')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Signer')).toBeInTheDocument();
    expect(screen.getByText('Draft: CI-2024-001')).toBeInTheDocument();
  });
});
