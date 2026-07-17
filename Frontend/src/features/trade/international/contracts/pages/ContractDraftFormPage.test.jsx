import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContractDraftFormPage from './ContractDraftFormPage';
import { renderWithProviders } from '../../../../../tests/utils';
import {
  saveContractDraftApi,
  getLatestContractDraftApi,
  getContractByIdApi,
  listFinalizedContractsApi,
  finalizeContractApi,
  uploadContractApi,
  deleteContractDraftApi,
  checkContractNumberApi,
} from '../services/contractApi';

jest.mock('../services/contractApi', () => ({
  saveContractDraftApi: jest.fn(),
  getLatestContractDraftApi: jest.fn(),
  getContractByIdApi: jest.fn(),
  listFinalizedContractsApi: jest.fn(),
  finalizeContractApi: jest.fn(),
  uploadContractApi: jest.fn(),
  deleteContractDraftApi: jest.fn(),
  checkContractNumberApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ContractDraftFormPage', () => {
  beforeEach(() => {
    saveContractDraftApi.mockReset();
    getLatestContractDraftApi.mockReset().mockResolvedValue(null);
    getContractByIdApi.mockReset();
    listFinalizedContractsApi.mockReset();
    finalizeContractApi.mockReset();
    uploadContractApi.mockReset();
    deleteContractDraftApi.mockReset();
    checkContractNumberApi.mockReset().mockResolvedValue(true);
    mockNavigate.mockReset();
  });

  it('renders all sections and the primary actions', async () => {
    renderWithProviders(<ContractDraftFormPage />);

    expect(screen.getByText('Draft New Contract')).toBeInTheDocument();
    expect(screen.getByText('Contract Header')).toBeInTheDocument();
    expect(screen.getByText('Buyer Information')).toBeInTheDocument();
    expect(screen.getByText('Seller Information')).toBeInTheDocument();
    expect(screen.getByText('Commodity Information')).toBeInTheDocument();
    expect(screen.getByText('Shipment Information')).toBeInTheDocument();
    expect(screen.getByText('Price Details')).toBeInTheDocument();
    expect(screen.getByText('Payment Terms')).toBeInTheDocument();
    expect(screen.getByText('Packing Details')).toBeInTheDocument();
    expect(screen.getByText('Inspection')).toBeInTheDocument();
    expect(screen.getByText('Insurance')).toBeInTheDocument();
    expect(screen.getByText('Force Majeure')).toBeInTheDocument();
    expect(screen.getByText('Arbitration')).toBeInTheDocument();
    expect(screen.getByText('Governing Law')).toBeInTheDocument();
    expect(screen.getByText('Standard Clause Library')).toBeInTheDocument();
    expect(screen.getByText('Custom Clauses')).toBeInTheDocument();
    expect(screen.getAllByText('Save Draft').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Save & Review').length).toBeGreaterThan(0);
  });

  it('navigates back to the contracts list when "Back to Contracts" is clicked', async () => {
    renderWithProviders(<ContractDraftFormPage />);

    await userEvent.click(screen.getByRole('button', { name: /back to contracts/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/contract-drafting');
  });

  it('shows a validation error when saving and reviewing an empty contract', async () => {
    renderWithProviders(<ContractDraftFormPage />);

    const [reviewButton] = screen.getAllByRole('button', { name: /save & review/i });
    await userEvent.click(reviewButton);

    expect(await screen.findByText('Contract Number is required before generating.')).toBeInTheDocument();
    expect(saveContractDraftApi).not.toHaveBeenCalled();
  });

  it('adds a custom clause when "Add Clause" is clicked', async () => {
    renderWithProviders(<ContractDraftFormPage />);

    await userEvent.click(screen.getByRole('button', { name: /custom clauses/i }));
    expect(screen.getByText(/No custom clauses yet/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /add clause/i }));

    expect(screen.queryByText(/No custom clauses yet/i)).not.toBeInTheDocument();
    expect(screen.getByText('Clause 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Clause Title *')).toBeInTheDocument();
  });

  it('enables a standard clause and shows its default content', async () => {
    renderWithProviders(<ContractDraftFormPage />);

    await userEvent.click(screen.getByRole('button', { name: /standard clause library/i }));

    const qualityClausesRow = screen.getByText('Quality Claims').closest('div');
    const toggleButton = qualityClausesRow.querySelector('button');
    await userEvent.click(toggleButton);

    expect(await screen.findByDisplayValue(/The Buyer shall inspect the goods upon receipt/)).toBeInTheDocument();
  });

  it('renders the existing draft values when a draft is loaded', async () => {
    const mockDraft = {
      _id: 'ct-1',
      contractNumber: 'CNT/2024/001',
      contractDate: '2024-01-15',
      contractType: 'Sales Contract',
      buyerName: 'Acme Buyer',
      sellerName: 'Acme Seller',
      buyer: { companyName: 'Buyer Co', country: 'India' },
      seller: { companyName: 'Seller Co', country: 'China' },
      commodity: { commodity: 'Basmati Rice', hsCode: '10063020' },
      shipment: { incoterm: 'FOB', quantity: 100, unit: 'MT' },
      price: { currency: 'USD', unitPrice: 500, totalContractValue: 50000 },
    };
    getContractByIdApi.mockResolvedValue(mockDraft);
    renderWithProviders(<ContractDraftFormPage />, { route: '/?id=ct-1' });

    await waitFor(() => expect(getContractByIdApi).toHaveBeenCalledWith('ct-1'));
    await waitFor(() => expect(screen.getByDisplayValue('Buyer Co')).toBeInTheDocument());

    expect(screen.getByDisplayValue('Seller Co')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Acme Buyer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Basmati Rice')).toBeInTheDocument();
    expect(screen.getByText('Draft: CNT/2024/001')).toBeInTheDocument();
  });
});
