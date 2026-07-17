import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContractEntryPage from './ContractEntryPage';
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

describe('ContractEntryPage', () => {
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

  it('shows the empty state when there are no finalized contracts', async () => {
    getLatestContractDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue([]);
    renderWithProviders(<ContractEntryPage />);

    expect(screen.getByText('International Trade Contracts')).toBeInTheDocument();
    expect(await screen.findByText('No finalized contracts yet')).toBeInTheDocument();
  });

  it('shows finalized contracts and navigates to the review page on click', async () => {
    getLatestContractDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue([
      { _id: 'c-1', contractNumber: 'CT-2024-002', contractMode: 'DRAFT', contractType: 'Sale Contract', buyerName: 'Jane Buyer', sellerName: 'John Seller', contractDate: '2024-01-15' },
    ]);
    renderWithProviders(<ContractEntryPage />);

    expect(await screen.findByText('CT-2024-002')).toBeInTheDocument();
    expect(screen.getByText('Sale Contract')).toBeInTheDocument();
    expect(screen.getByText(/Buyer: Jane Buyer.*Seller: John Seller/)).toBeInTheDocument();

    await userEvent.click(screen.getByText('CT-2024-002'));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/contract-drafting/review?id=c-1');
  });

  it('navigates to the upload and draft pages from the create-new-contract options', async () => {
    getLatestContractDraftApi.mockResolvedValue(null);
    listFinalizedContractsApi.mockResolvedValue([]);
    renderWithProviders(<ContractEntryPage />);

    await waitFor(() => expect(listFinalizedContractsApi).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: /upload existing contract/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/contract-drafting/upload');

    await userEvent.click(screen.getByRole('button', { name: /draft new contract/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/contract-drafting/draft');
  });
});
