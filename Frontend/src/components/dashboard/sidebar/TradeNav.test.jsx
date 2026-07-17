import { screen, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import TradeNav from './TradeNav';
import { SidebarCtx } from './SidebarContext';
import { createTestStore } from '../../../tests/utils';

function renderTradeNav(sidebarCtx = { isCollapsed: false, isMobile: false, onClose: null }, preloadedState = {}) {
  const store = createTestStore(preloadedState);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <SidebarCtx.Provider value={sidebarCtx}>
          <TradeNav />
        </SidebarCtx.Provider>
      </MemoryRouter>
    </Provider>,
  );
}

describe('TradeNav', () => {
  it('renders the Trade section label', () => {
    renderTradeNav();
    expect(screen.getByText('Trade')).toBeInTheDocument();
  });

  it('is collapsed by default', () => {
    renderTradeNav();
    expect(screen.queryByText('Add Organization')).not.toBeInTheDocument();
  });

  it('expands to show Add Organization, Domestic, International, and Trade History when clicked', () => {
    renderTradeNav();

    fireEvent.click(screen.getByRole('button', { name: 'Trade' }));

    expect(screen.getByText('Add Organization')).toBeInTheDocument();
    expect(screen.getByText('Domestic')).toBeInTheDocument();
    expect(screen.getByText('International')).toBeInTheDocument();
    expect(screen.getByText('Trade History')).toBeInTheDocument();
  });

  it('expands the Domestic subgroup to show its document types', () => {
    renderTradeNav({ isCollapsed: false, isMobile: false, onClose: null }, {
      entitlement: {
        chat: true,
        erp: true,
        erpModules: { addOrganization: true, domestic: true, international: true, tradeHistory: true },
        featureFlags: { erpPaymentEnabled: true, chatPaymentEnabled: false, chatLimitsEnabled: true },
        loaded: true,
      },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Trade' }));
    fireEvent.click(screen.getByRole('button', { name: 'Domestic' }));

    expect(screen.getByText('Purchase Order')).toBeInTheDocument();
    expect(screen.getByText('Credit Note')).toBeInTheDocument();
    expect(screen.getByText('Debit Note')).toBeInTheDocument();
  });

  it('expands the International subgroup to show its document types', () => {
    renderTradeNav({ isCollapsed: false, isMobile: false, onClose: null }, {
      entitlement: {
        chat: true,
        erp: true,
        erpModules: { addOrganization: true, domestic: true, international: true, tradeHistory: true },
        featureFlags: { erpPaymentEnabled: true, chatPaymentEnabled: false, chatLimitsEnabled: true },
        loaded: true,
      },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Trade' }));
    fireEvent.click(screen.getByRole('button', { name: 'International' }));

    expect(screen.getByText('Contract Drafting')).toBeInTheDocument();
    expect(screen.getByText('Proforma Invoice')).toBeInTheDocument();
    expect(screen.getByText('Packing List')).toBeInTheDocument();
    expect(screen.getByText('Commercial Invoice')).toBeInTheDocument();
  });
});
