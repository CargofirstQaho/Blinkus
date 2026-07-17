import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContractReviewPage from './ContractReviewPage';
import { renderWithProviders } from '../../../../../tests/utils';
import {
  saveContractDraftApi,
  getLatestContractDraftApi,
  getContractByIdApi,
  listFinalizedContractsApi,
  finalizeContractApi,
  uploadContractApi,
  deleteContractDraftApi,
} from '../services/contractApi';

jest.mock('../services/contractApi', () => ({
  saveContractDraftApi: jest.fn(),
  getLatestContractDraftApi: jest.fn(),
  getContractByIdApi: jest.fn(),
  listFinalizedContractsApi: jest.fn(),
  finalizeContractApi: jest.fn(),
  uploadContractApi: jest.fn(),
  deleteContractDraftApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockContract = {
  _id: 'ct-1',
  contractNumber: 'CNT/2024/001',
  contractDate: '2024-01-15',
  contractType: 'Sale Contract',
  status: 'DRAFT',
  buyerName: 'Acme Buyer',
  sellerName: 'Acme Seller',
  buyer: {
    companyName: 'Buyer Co',
    address: 'Buyer Address',
    country: 'India',
    contactPerson: 'Jane Buyer',
    phone: '+91 1111111',
    email: 'buyer@example.com',
    taxNumber: 'BTAX1',
  },
  seller: {
    companyName: 'Seller Co',
    address: 'Seller Address',
    country: 'China',
    contactPerson: 'John Seller',
    phone: '+86 2222222',
    email: 'seller@example.com',
    taxNumber: 'STAX1',
  },
  commodity: { commodity: 'Basmati Rice', hsCode: '10063020', originCountry: 'India', qualitySpecification: 'Grade A' },
  shipment: { incoterm: 'FOB', loadingPort: 'Mumbai', destinationPort: 'Shanghai', partialShipment: 'Not Allowed', transshipment: 'Not Allowed', quantity: 100, unit: 'MT' },
  price: { currency: 'USD', unitPrice: 500, totalContractValue: 50000 },
  paymentTerms: { advancePercent: 30, balancePercent: 70, paymentMethod: 'LC' },
  packing: { packagingType: 'Jute Bags', bagMarking: 'XYZ' },
  inspection: { inspectionAgency: 'SGS', inspectionRequirement: 'Pre-shipment' },
  insurance: { responsibility: 'Seller' },
  forceMajeure: 'Standard force majeure clause text',
  arbitration: 'ICC arbitration clause text',
  governingLaw: 'Laws of India',
  standardClauses: {},
  clauses: [],
};

describe('ContractReviewPage', () => {
  beforeEach(() => {
    saveContractDraftApi.mockReset();
    getLatestContractDraftApi.mockReset();
    getContractByIdApi.mockReset();
    listFinalizedContractsApi.mockReset();
    finalizeContractApi.mockReset();
    uploadContractApi.mockReset();
    deleteContractDraftApi.mockReset();
    mockNavigate.mockReset();
  });

  it('shows a spinner while the contract is loading', () => {
    getContractByIdApi.mockReturnValue(new Promise(() => {}));
    const { container } = renderWithProviders(<ContractReviewPage />, {
      route: '/trade/international/contract-drafting/review?id=ct-1',
    });

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.getByText('Loading contract…')).toBeInTheDocument();
  });

  it('shows a not found message when there is no contract to review', async () => {
    renderWithProviders(<ContractReviewPage />);

    expect(await screen.findByText('Contract not found')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to contracts/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/contract-drafting');
  });

  it('loads a contract from the query string and renders its details', async () => {
    getContractByIdApi.mockResolvedValue(mockContract);
    renderWithProviders(<ContractReviewPage />, { route: '/trade/international/contract-drafting/review?id=ct-1' });

    await waitFor(() => expect(getContractByIdApi).toHaveBeenCalledWith('ct-1'));

    expect(await screen.findByText('Contract Review')).toBeInTheDocument();
    expect(screen.getByText('CONTRACT DETAILS')).toBeInTheDocument();
    expect(screen.getByText('COMMODITY DETAILS')).toBeInTheDocument();
    expect(screen.getByText('BUYER DETAILS')).toBeInTheDocument();
    expect(screen.getByText('SELLER DETAILS')).toBeInTheDocument();
    expect(screen.getByText('SHIPMENT TERMS')).toBeInTheDocument();
    expect(screen.getByText('PRICE & PAYMENT')).toBeInTheDocument();
    expect(screen.getByText('PACKING & INSPECTION')).toBeInTheDocument();
    expect(screen.getByText('CONTRACT CLAUSES')).toBeInTheDocument();
    expect(screen.getByText('Basmati Rice')).toBeInTheDocument();
    expect(screen.getByText('Buyer Co')).toBeInTheDocument();
    expect(screen.getByText('Seller Co')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /finalize & generate pdf/i })).toBeInTheDocument();
  });

  it('finalizes the contract and shows the open pdf link', async () => {
    getContractByIdApi.mockResolvedValue(mockContract);
    finalizeContractApi.mockResolvedValue({ ...mockContract, status: 'FINALIZED', pdfUrl: 'https://files/ct-001.pdf' });
    renderWithProviders(<ContractReviewPage />, { route: '/trade/international/contract-drafting/review?id=ct-1' });

    const finalizeButton = await screen.findByRole('button', { name: /finalize & generate pdf/i });
    await userEvent.click(finalizeButton);

    await waitFor(() => expect(finalizeContractApi).toHaveBeenCalledWith('ct-1', mockContract));

    expect(await screen.findByText('Finalized')).toBeInTheDocument();
    const openLink = screen.getByText('Open PDF').closest('a');
    expect(openLink).toHaveAttribute('href', 'https://files/ct-001.pdf');
  });

  it('renders an uploaded contract without the finalize action', async () => {
    const mockUpload = {
      _id: 'ct-2',
      contractNumber: 'CNT/2024/002',
      contractMode: 'UPLOAD',
      status: 'FINALIZED',
      buyerName: 'Acme Buyer',
      sellerName: 'Acme Seller',
      documentUrl: 'https://files/contract-upload.pdf',
      commodity: {},
    };
    getContractByIdApi.mockResolvedValue(mockUpload);
    renderWithProviders(<ContractReviewPage />, { route: '/trade/international/contract-drafting/review?id=ct-2' });

    expect(await screen.findByText('Uploaded Contract')).toBeInTheDocument();
    expect(screen.getByText('CONTRACT DOCUMENT')).toBeInTheDocument();
    expect(screen.getByText(/Buyer: Acme Buyer.*Seller: Acme Seller/)).toBeInTheDocument();

    const viewLink = screen.getByText('View Document').closest('a');
    expect(viewLink).toHaveAttribute('href', 'https://files/contract-upload.pdf');

    expect(screen.queryByRole('button', { name: /finalize & generate pdf/i })).not.toBeInTheDocument();
  });
});
