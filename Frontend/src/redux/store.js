import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer         from './slices/authSlice';
import chatReducer         from './slices/chatSlice';
import chatHistoryReducer  from './slices/chatHistorySlice';
import aiUsageReducer      from './slices/aiUsageSlice';
import dashboardReducer    from './slices/dashboardSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import pricingReducer      from './slices/pricingSlice';
import entitlementReducer  from './slices/entitlementSlice';
import organizationReducer  from '../features/trade/organization/store/organizationSlice';
import purchaseOrderReducer from '../features/trade/purchase-order/store/purchaseOrderSlice';
import creditNoteReducer    from '../features/trade/credit-note/store/creditNoteSlice';
import debitNoteReducer     from '../features/trade/debit-note/store/debitNoteSlice';
import contractReducer      from '../features/trade/international/contracts/store/contractSlice';
import proformaInvoiceReducer from '../features/trade/proforma-invoice/store/proformaInvoiceSlice';
import packingListReducer     from '../features/trade/packing-list/store/packingListSlice';
import commercialInvoiceReducer from '../features/trade/commercial-invoice/store/commercialInvoiceSlice';
import billingReducer           from '../features/trade/Upgrade/Billing/store/billingSlice';

const appReducer = combineReducers({
  auth:              authReducer,
  chat:              chatReducer,
  chatHistory:       chatHistoryReducer,
  aiUsage:           aiUsageReducer,
  dashboard:         dashboardReducer,
  subscription:      subscriptionReducer,
  pricing:           pricingReducer,
  entitlement:       entitlementReducer,
  tradeOrganization: organizationReducer,
  purchaseOrder:     purchaseOrderReducer,
  creditNote:        creditNoteReducer,
  debitNote:         debitNoteReducer,
  contract:          contractReducer,
  proformaInvoice:   proformaInvoiceReducer,
  packingList:       packingListReducer,
  commercialInvoice: commercialInvoiceReducer,
  billing:           billingReducer,
});

export const RESET_STATE = 'app/resetState';
export const resetState = () => ({ type: RESET_STATE });

const rootReducer = (state, action) => {
  if (action.type === RESET_STATE) {
    const initialized = state?.auth?.initialized;
    const nextState = appReducer(undefined, action);
    return { ...nextState, auth: { ...nextState.auth, initialized } };
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
