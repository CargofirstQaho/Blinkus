import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import chatReducer from '../redux/slices/chatSlice';
import chatHistoryReducer from '../redux/slices/chatHistorySlice';
import aiUsageReducer from '../redux/slices/aiUsageSlice';
import dashboardReducer from '../redux/slices/dashboardSlice';
import subscriptionReducer from '../redux/slices/subscriptionSlice';
import pricingReducer from '../redux/slices/pricingSlice';
import entitlementReducer from '../redux/slices/entitlementSlice';
import organizationReducer from '../features/trade/organization/store/organizationSlice';
import purchaseOrderReducer from '../features/trade/purchase-order/store/purchaseOrderSlice';
import creditNoteReducer from '../features/trade/credit-note/store/creditNoteSlice';
import debitNoteReducer from '../features/trade/debit-note/store/debitNoteSlice';
import contractReducer from '../features/trade/international/contracts/store/contractSlice';
import proformaInvoiceReducer from '../features/trade/proforma-invoice/store/proformaInvoiceSlice';
import packingListReducer from '../features/trade/packing-list/store/packingListSlice';
import commercialInvoiceReducer from '../features/trade/commercial-invoice/store/commercialInvoiceSlice';

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      chat: chatReducer,
      chatHistory: chatHistoryReducer,
      aiUsage: aiUsageReducer,
      dashboard: dashboardReducer,
      subscription: subscriptionReducer,
      pricing: pricingReducer,
      entitlement: entitlementReducer,
      tradeOrganization: organizationReducer,
      purchaseOrder: purchaseOrderReducer,
      creditNote: creditNoteReducer,
      debitNote: debitNoteReducer,
      contract: contractReducer,
      proformaInvoice: proformaInvoiceReducer,
      packingList: packingListReducer,
      commercialInvoice: commercialInvoiceReducer,
    },
    preloadedState,
  });
}

export const authenticatedState = {
  auth: {
    user: { _id: 'user-1', name: 'Test User', email: 'test@example.com', mobile: '+1234567890', company: 'Test Co', plan: 'free', isPremium: false, permissions: [] },
    isAuthenticated: true,
    authLoading: false,
    initialized: true,
    plan: 'free',
    isPremium: false,
    permissions: [],
    subscriptionEndsAt: null,
    usage: { aiQuestionsToday: 0, aiQuestionsLimit: 20 },
  },
};

export const unauthenticatedState = {
  auth: {
    user: null,
    isAuthenticated: false,
    authLoading: false,
    initialized: true,
    plan: 'free',
    isPremium: false,
    permissions: [],
    subscriptionEndsAt: null,
    usage: { aiQuestionsToday: 0, aiQuestionsLimit: 20 },
  },
};

export const loadingState = {
  auth: {
    user: null,
    isAuthenticated: false,
    authLoading: true,
    initialized: false,
    plan: 'free',
    isPremium: false,
    permissions: [],
    subscriptionEndsAt: null,
    usage: { aiQuestionsToday: 0, aiQuestionsLimit: 20 },
  },
};

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store,
    route = '/',
    initialEntries,
    ...renderOptions
  } = {}
) {
  const testStore = store ?? createTestStore(preloadedState);

  function Wrapper({ children }) {
    return (
      <Provider store={testStore}>
        <MemoryRouter initialEntries={initialEntries ?? [route]}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return {
    store: testStore,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
