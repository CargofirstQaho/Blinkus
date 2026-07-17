import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PackingListReviewPage from './PackingListReviewPage';
import { renderWithProviders } from '../../../../tests/utils';
import {
  savePackingListDraftApi,
  getLatestPackingListDraftApi,
  getPackingListByIdApi,
  generatePackingListPdfApi,
} from '../services/packingListApi';

jest.mock('../services/packingListApi', () => ({
  savePackingListDraftApi: jest.fn(),
  getLatestPackingListDraftApi: jest.fn(),
  getPackingListByIdApi: jest.fn(),
  generatePackingListPdfApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockPl = {
  _id: 'pl-1',
  packingListNumber: 'PL-2024-001',
  status: 'DRAFT',
  contractNumber: 'CNT/2024/001',
  packingListInfo: { date: '2024-01-15' },
  exporterDetails: {
    companyName: 'Acme Exporters',
    country: 'India',
    taxNumber: 'EXTAX1',
    email: 'exporter@example.com',
    phone: '+91 1234567890',
    address: 'Exporter Address',
  },
  buyerDetails: {
    companyName: 'Acme Buyers',
    contactPerson: 'Jane Buyer',
    country: 'USA',
    email: 'buyer@example.com',
    phone: '+1 1234567890',
    taxNumber: 'BTAX1',
    address: 'Buyer Address',
  },
  consignee: { name: 'Consignee Co', country: 'USA', phone: '+1 2222222222', email: 'consignee@example.com', address: 'Consignee Address' },
  shippingDetails: { portOfLoading: 'Mumbai', portOfDischarge: 'Shanghai', vessel: 'MV Trader', containerNumber: 'CONT12345', sealNumber: 'SEAL98765' },
  packingItems: [{ marksAndNumbers: 'XYZ-MARK', packagingType: 'Jute Bags', numberOfPackages: 100, commodity: 'Basmati Rice', description: 'Premium Rice', hsnCode: '10063020', netWeight: 5000, grossWeight: 5100, quantity: 100, unit: 'MT' }],
  remarks: 'Some remarks',
  termsAndConditions: 'Some terms',
};

describe('PackingListReviewPage', () => {
  beforeEach(() => {
    savePackingListDraftApi.mockReset();
    getLatestPackingListDraftApi.mockReset();
    getPackingListByIdApi.mockReset();
    generatePackingListPdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('shows a spinner while the packing list is loading', () => {
    getPackingListByIdApi.mockReturnValue(new Promise(() => {}));
    const { container } = renderWithProviders(<PackingListReviewPage />, {
      route: '/trade/international/packing-list/review?id=pl-1',
    });

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.getByText('Loading packing list…')).toBeInTheDocument();
  });

  it('shows a not found message when there is no packing list to review', async () => {
    renderWithProviders(<PackingListReviewPage />);

    expect(await screen.findByText('Packing list not found')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to packing list form/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/packing-list');
  });

  it('loads a packing list from the query string and renders its details', async () => {
    getPackingListByIdApi.mockResolvedValue(mockPl);
    renderWithProviders(<PackingListReviewPage />, { route: '/trade/international/packing-list/review?id=pl-1' });

    await waitFor(() => expect(getPackingListByIdApi).toHaveBeenCalledWith('pl-1'));

    expect(await screen.findByText('Packing List Review')).toBeInTheDocument();
    expect(screen.getByText('PACKING LIST INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('EXPORTER DETAILS')).toBeInTheDocument();
    expect(screen.getByText('BUYER DETAILS')).toBeInTheDocument();
    expect(screen.getByText('CONSIGNEE')).toBeInTheDocument();
    expect(screen.getByText('SHIPPING DETAILS')).toBeInTheDocument();
    expect(screen.getByText('PACKING & GOODS DETAILS')).toBeInTheDocument();
    expect(screen.getByText('REMARKS & TERMS')).toBeInTheDocument();
    expect(screen.getByText('Acme Exporters')).toBeInTheDocument();
    expect(screen.getByText('Acme Buyers')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate pdf/i })).toBeInTheDocument();
  });

  it('generates the PDF and shows the generated state with an open link', async () => {
    getPackingListByIdApi.mockResolvedValue(mockPl);
    generatePackingListPdfApi.mockResolvedValue({ ...mockPl, status: 'GENERATED', pdfUrl: 'https://files/pl-001.pdf' });
    renderWithProviders(<PackingListReviewPage />, { route: '/trade/international/packing-list/review?id=pl-1' });

    const generateButton = await screen.findByRole('button', { name: /generate pdf/i });
    await userEvent.click(generateButton);

    await waitFor(() => expect(generatePackingListPdfApi).toHaveBeenCalledWith('pl-1', mockPl));

    expect(await screen.findByText('PDF Generated')).toBeInTheDocument();
    const openLink = screen.getByText('Open PDF').closest('a');
    expect(openLink).toHaveAttribute('href', 'https://files/pl-001.pdf');
  });
});
