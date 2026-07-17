import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContractUploadPage from './ContractUploadPage';
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

async function fillStep1AndContinue(container) {
  await userEvent.type(container.querySelector('input[name="contractNumber"]'), 'CNT/2024/001');
  await userEvent.type(container.querySelector('input[name="buyerName"]'), 'Acme Buyer');
  await userEvent.type(container.querySelector('input[name="sellerName"]'), 'Acme Seller');
  await userEvent.click(screen.getByRole('checkbox'));
  await userEvent.click(screen.getByRole('button', { name: /continue to upload/i }));
}

describe('ContractUploadPage', () => {
  beforeEach(() => {
    saveContractDraftApi.mockReset();
    getLatestContractDraftApi.mockReset();
    getContractByIdApi.mockReset();
    listFinalizedContractsApi.mockReset();
    finalizeContractApi.mockReset();
    uploadContractApi.mockReset();
    deleteContractDraftApi.mockReset();
    checkContractNumberApi.mockReset();
    mockNavigate.mockReset();
  });

  it('renders the contract details step and navigates back to contracts', async () => {
    const { container } = renderWithProviders(<ContractUploadPage />);

    expect(screen.getByText('Upload Existing Contract')).toBeInTheDocument();
    expect(screen.getByText('Contract Information')).toBeInTheDocument();
    expect(container.querySelector('input[name="contractNumber"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="buyerName"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="sellerName"]')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to contracts/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/contract-drafting');
  });

  it('shows validation errors when submitting an empty form', async () => {
    renderWithProviders(<ContractUploadPage />);

    await userEvent.click(screen.getByRole('button', { name: /continue to upload/i }));

    expect(await screen.findByText('Contract number is required')).toBeInTheDocument();
    expect(screen.getByText('Buyer name is required')).toBeInTheDocument();
    expect(screen.getByText('Seller name is required')).toBeInTheDocument();
    expect(screen.getByText('Invalid input: expected true')).toBeInTheDocument();
  });

  it('moves to step 2 after submitting valid contract details', async () => {
    const { container } = renderWithProviders(<ContractUploadPage />);

    await fillStep1AndContinue(container);

    expect(await screen.findByText(/Drop file here or click to browse/i)).toBeInTheDocument();
    expect(screen.getByText('CNT/2024/001')).toBeInTheDocument();
    expect(screen.getByText('Acme Buyer')).toBeInTheDocument();
    expect(screen.getByText('Acme Seller')).toBeInTheDocument();
    expect(screen.getByText(/Drop file here or click to browse/i)).toBeInTheDocument();
  });

  it('shows an error for an invalid file type', async () => {
    const { container } = renderWithProviders(<ContractUploadPage />);
    await fillStep1AndContinue(container);

    const fileInput = document.querySelector('input[type="file"]');
    const badFile = new File(['contents'], 'contract.txt', { type: 'application/pdf' });
    await userEvent.upload(fileInput, badFile);

    expect(await screen.findByText('Only PDF, DOC, and DOCX files are allowed')).toBeInTheDocument();
  });

  it('uploads the file and shows the success screen', async () => {
    uploadContractApi.mockResolvedValue({
      contractNumber: 'CNT/2024/001',
      buyerName: 'Acme Buyer',
      sellerName: 'Acme Seller',
      documentUrl: 'https://files/contract.pdf',
    });
    const { container } = renderWithProviders(<ContractUploadPage />);
    await fillStep1AndContinue(container);

    const fileInput = document.querySelector('input[type="file"]');
    const goodFile = new File(['contents'], 'contract.pdf', { type: 'application/pdf' });
    await userEvent.upload(fileInput, goodFile);

    expect(await screen.findByText('contract.pdf')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /upload & finalize/i }));

    expect(await screen.findByText('Contract Uploaded')).toBeInTheDocument();
    expect(screen.getByText('FINALIZED')).toBeInTheDocument();
    const viewLink = screen.getByText('View Document').closest('a');
    expect(viewLink).toHaveAttribute('href', 'https://files/contract.pdf');
  });

  it('returns to step 1 from step 2 when "Back" is clicked', async () => {
    const { container } = renderWithProviders(<ContractUploadPage />);
    await fillStep1AndContinue(container);

    expect(await screen.findByText(/Drop file here or click to browse/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /^back$/i }));

    expect(await screen.findByText('Contract Information')).toBeInTheDocument();
  });
});
