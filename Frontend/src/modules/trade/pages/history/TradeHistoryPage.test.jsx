import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TradeHistoryPage from './TradeHistoryPage';
import { renderWithProviders } from '../../../../tests/utils';
import { getUnifiedHistoryApi } from '../../../../features/trade/history/services/shipmentHistoryApi';

jest.mock('../../../../features/trade/history/services/shipmentHistoryApi', () => ({
  getUnifiedHistoryApi: jest.fn(),
  updateShipmentStatusApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockDocuments = [
  {
    documentType: 'PURCHASE_ORDER',
    id: 'po-1',
    number: 'PO-2024-001',
    status: 'DRAFT',
    buyer: 'Acme Buyer Corp',
    seller: 'Acme Seller Ltd',
    commodity: 'Steel Widgets',
    country: 'India',
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2024-01-10T10:00:00.000Z',
  },
  {
    documentType: 'CONTRACT',
    id: 'ct-1',
    number: 'CNT/2024/001',
    status: 'GENERATED',
    buyer: 'Jane Buyer',
    seller: 'John Seller',
    commodity: 'Basmati Rice',
    country: 'China',
    createdAt: '2024-01-05T10:00:00.000Z',
    updatedAt: '2024-01-06T10:00:00.000Z',
  },
];

describe('TradeHistoryPage', () => {
  beforeEach(() => {
    getUnifiedHistoryApi.mockReset();
    mockNavigate.mockReset();
  });

  it('renders the page header', async () => {
    getUnifiedHistoryApi.mockResolvedValue({ documents: [], pagination: null });
    renderWithProviders(<TradeHistoryPage />);

    expect(screen.getByRole('heading', { name: 'Trade History' })).toBeInTheDocument();
    expect(screen.getByText(/Every trade document/)).toBeInTheDocument();

    await waitFor(() => expect(getUnifiedHistoryApi).toHaveBeenCalled());
  });

  it('shows a loading skeleton while history is being fetched', async () => {
    let resolveFn;
    getUnifiedHistoryApi.mockReturnValue(new Promise((resolve) => { resolveFn = resolve; }));
    const { container } = renderWithProviders(<TradeHistoryPage />);

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);

    resolveFn({ documents: [], pagination: null });
    await waitFor(() => expect(container.querySelectorAll('.animate-pulse').length).toBe(0));
  });

  it('renders the empty state when there are no trade documents', async () => {
    getUnifiedHistoryApi.mockResolvedValue({ documents: [], pagination: null });
    renderWithProviders(<TradeHistoryPage />);

    expect(await screen.findByText('No Trade Documents Yet')).toBeInTheDocument();
  });

  it('shows an error message when the history request fails', async () => {
    getUnifiedHistoryApi.mockRejectedValue(new Error('Network error'));
    renderWithProviders(<TradeHistoryPage />);

    expect(await screen.findByText('Failed to load trade history')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders a card for each returned document with its type, number, and status', async () => {
    getUnifiedHistoryApi.mockResolvedValue({ documents: mockDocuments, pagination: null });
    renderWithProviders(<TradeHistoryPage />);

    expect(await screen.findByText('PO-2024-001')).toBeInTheDocument();
    expect(screen.getByText('Purchase Order')).toBeInTheDocument();
    expect(screen.getAllByText('Draft').length).toBeGreaterThan(0);
    expect(screen.getByText('Buyer: Acme Buyer Corp')).toBeInTheDocument();
    expect(screen.getByText('Seller: Acme Seller Ltd')).toBeInTheDocument();

    expect(screen.getByText('CNT/2024/001')).toBeInTheDocument();
    expect(screen.getByText('Contract')).toBeInTheDocument();
    expect(screen.getAllByText('Generated').length).toBeGreaterThan(0);
  });

  it('navigates to the purchase order form when a draft document card is clicked', async () => {
    getUnifiedHistoryApi.mockResolvedValue({ documents: [mockDocuments[0]], pagination: null });
    renderWithProviders(<TradeHistoryPage />);

    await userEvent.click(await screen.findByText('PO-2024-001'));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/domestic/purchase-order/form');
  });

  it('navigates to the shipment page when a contract document card is clicked', async () => {
    getUnifiedHistoryApi.mockResolvedValue({ documents: [mockDocuments[1]], pagination: null });
    renderWithProviders(<TradeHistoryPage />);

    await userEvent.click(await screen.findByText('CNT/2024/001'));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/shipment?id=ct-1');
  });

  it('renders the filter bar with a search input', async () => {
    getUnifiedHistoryApi.mockResolvedValue({ documents: [], pagination: null });
    renderWithProviders(<TradeHistoryPage />);

    expect(screen.getByPlaceholderText(/Search contract, invoice, packing list/i)).toBeInTheDocument();
  });
});
