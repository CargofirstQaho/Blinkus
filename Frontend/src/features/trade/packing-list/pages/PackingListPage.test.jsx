import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PackingListPage from './PackingListPage';
import { renderWithProviders } from '../../../../tests/utils';
import {
  savePackingListDraftApi,
  getLatestPackingListDraftApi,
  getPackingListByIdApi,
  generatePackingListPdfApi,
} from '../services/packingListApi';
import {
  listFinalizedContractsApi,
  getContractByIdApi,
} from '../../international/contracts/services/contractApi';

jest.mock('../services/packingListApi', () => ({
  savePackingListDraftApi: jest.fn(),
  getLatestPackingListDraftApi: jest.fn(),
  getPackingListByIdApi: jest.fn(),
  generatePackingListPdfApi: jest.fn(),
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
  packing: { packagingType: 'Jute Bags', bagMarking: 'XYZ-MARK' },
  price: { unitPrice: 500, currency: 'USD' },
};

describe('PackingListPage', () => {
  beforeEach(() => {
    savePackingListDraftApi.mockReset();
    getLatestPackingListDraftApi.mockReset();
    getPackingListByIdApi.mockReset();
    generatePackingListPdfApi.mockReset();
    listFinalizedContractsApi.mockReset();
    getContractByIdApi.mockReset();
    mockNavigate.mockReset();
  });

  it('renders all sections and shows the no-finalized-contract message when none exist', async () => {
    getLatestPackingListDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue([]);
    renderWithProviders(<PackingListPage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    expect(screen.getByText('Packing List')).toBeInTheDocument();
    expect(await screen.findByText('No Finalized Contract Found')).toBeInTheDocument();

    [
      'Packing List Information', 'Exporter Details', 'Buyer Details', 'Consignee',
      'Shipping Details', 'Packing & Goods Details', 'Remarks & Terms',
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
    getLatestPackingListDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue([]);
    renderWithProviders(<PackingListPage />, {
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

  it('selects a contract and auto-populates exporter, buyer, shipping and packing item details', async () => {
    getLatestPackingListDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue(mockContractList);
    getContractByIdApi.mockResolvedValue(mockContractDetails);
    renderWithProviders(<PackingListPage />, {
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    const contractOption = await screen.findByText('— Select a finalized contract —');
    await userEvent.selectOptions(contractOption.closest('select'), 'c-1');

    await waitFor(() => expect(getContractByIdApi).toHaveBeenCalledWith('c-1'));

    expect(await screen.findByDisplayValue('Seller Co')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Buyer Co')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mumbai')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Shanghai')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('Basmati Rice').length).toBeGreaterThan(0);
    expect(screen.getAllByDisplayValue('10063020').length).toBeGreaterThan(0);
    expect(screen.getAllByDisplayValue('XYZ-MARK').length).toBeGreaterThan(0);
  });

  it('disables the save buttons without a title when no contract is selected', async () => {
    getLatestPackingListDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue(mockContractList);
    renderWithProviders(<PackingListPage />, {
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
      _id: 'pl-1',
      packingListNumber: 'PL-2024-001',
      contract: 'c-1',
      contractNumber: 'CNT/2024/001',
      packingListInfo: { date: '2024-01-15' },
      exporterDetails: { companyName: 'Acme Exporters', address: 'Exporter Address', country: 'India', email: 'exporter@example.com', phone: '+91 1234567890', taxNumber: 'EXTAX1' },
      buyerDetails: { companyName: 'Acme Buyers', address: 'Buyer Address', country: 'USA', contactPerson: 'Jane Buyer', phone: '+1 1234567890', email: 'buyer@example.com', taxNumber: 'BTAX1' },
      consignee: { name: 'Consignee Co', address: 'Consignee Address', country: 'USA', phone: '+1 2222222222', email: 'consignee@example.com' },
      shippingDetails: { portOfLoading: 'Mumbai', portOfDischarge: 'Shanghai', vessel: 'MV Trader', containerNumber: 'CONT12345', sealNumber: 'SEAL98765' },
      packingItems: [{ marksAndNumbers: 'XYZ-MARK', packagingType: 'Jute Bags', numberOfPackages: 100, commodity: 'Basmati Rice', description: 'Premium Rice', hsnCode: '10063020', netWeight: 5000, grossWeight: 5100, quantity: 100, unit: 'MT' }],
      remarks: 'Some remarks',
      termsAndConditions: 'Some terms',
    };
    getPackingListByIdApi.mockResolvedValue(mockDraft);
    listFinalizedContractsApi.mockResolvedValue(mockContractList);
    renderWithProviders(<PackingListPage />, {
      route: '/?id=pl-1',
      preloadedState: {
        tradeOrganization: { organization: completeOrg, loading: false, loaded: true, saving: false },
      },
    });

    await waitFor(() => expect(getPackingListByIdApi).toHaveBeenCalledWith('pl-1'));
    await waitFor(() => expect(screen.getByDisplayValue('Acme Exporters')).toBeInTheDocument());

    expect(screen.getByDisplayValue('Acme Buyers')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Consignee Co')).toBeInTheDocument();
    expect(screen.getByDisplayValue('MV Trader')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('Basmati Rice').length).toBeGreaterThan(0);
    expect(screen.getByText('Draft: PL-2024-001')).toBeInTheDocument();
  });
});
