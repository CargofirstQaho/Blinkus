const ERP_PAYMENT_ENABLED  = import.meta.env.VITE_ERP_PAYMENT_ENABLED  === 'true';
const CHAT_PAYMENT_ENABLED = import.meta.env.VITE_CHAT_PAYMENT_ENABLED === 'true';

const ENTITLEMENT_RULES = {
  chat: { mode: CHAT_PAYMENT_ENABLED ? 'subscription' : 'free' },
  erp:  { mode: ERP_PAYMENT_ENABLED  ? 'subscription' : 'free' },
};

function isTradeActive(trade) {
  if (!trade) return false;
  if (trade.status !== 'active' || !trade.unlimitedAccess) return false;
  if (!trade.endDate) return false;
  return new Date(trade.endDate).getTime() > Date.now();
}

function isChatUnlimited(chat) {
  if (!chat) return false;
  if (!chat.unlimitedAccess) return false;
  if (chat.source === 'free') return true;
  if (!chat.endDate) return false;
  return new Date(chat.endDate).getTime() > Date.now();
}

export function canAccessChat({ chat, trade } = {}) {
  if (ENTITLEMENT_RULES.chat.mode === 'free') return true;
  return isChatUnlimited(chat) || isTradeActive(trade);
}

export function canAccessERP({ trade } = {}) {
  if (ENTITLEMENT_RULES.erp.mode === 'free') return true;
  return isTradeActive(trade);
}

export function canAccessTradeHistory(subscription) {
  return canAccessERP(subscription);
}

export function canAccessInternational(subscription) {
  return canAccessERP(subscription);
}

export function canAccessDomestic(subscription) {
  return canAccessERP(subscription);
}

export function canAccessAddOrganization(subscription) {
  return canAccessERP(subscription);
}
