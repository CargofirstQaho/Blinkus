export const PLAN_FEATURES = [
  'Unlimited AI Chat',
  'Buyer Credibility Check',
  'Seller Credibility Check',
  'ERP Access',
  'Purchase Orders',
  'Credit Notes',
  'Debit Notes',
  'Contract Drafting',
  'Proforma Invoice',
  'Packing List',
  'Commercial Invoice',
];

export const FREE_PLAN_FEATURES = [
  { label: 'Limited AI Chat Usage',                included: true  },
  { label: 'No ERP Access',                        included: false },
  { label: 'No Buyer/Seller Credibility Checking', included: false },
  { label: 'No Contract Drafting',                 included: false },
  { label: 'No Order Management',                  included: false },
  { label: 'No Purchase Orders',                   included: false },
  { label: 'No Credit Notes',                      included: false },
  { label: 'No Debit Notes',                       included: false },
  { label: 'No Proforma Invoice',                  included: false },
  { label: 'No Packing List',                      included: false },
  { label: 'No Commercial Invoice',                included: false },
];

export const FREE_LIMITATIONS = [
  'Limited AI Chat Questions Per Day',
  'No ERP Access',
  'No Credibility Checks',
  'No Trade Documents',
  'No Contract Drafting',
];

export const PLANS = [
  {
    key:           'MONTHLY',
    name:          'Monthly',
    originalPrice: 35,
    // price:         31,
    price:         31,
    savings:       11.43,
    badge:         null,
    billingLabel:  '/ month',
    features:      PLAN_FEATURES,
    popular:       false,
  },
  {
    key:           'SIX_MONTHS',
    name:          '6 Months',
    originalPrice: 186,
    price:         22.66,
    // price:         136,
    savings:       26.88,
    badge:         '1 Month Free',
    billingLabel:  '/ months',
    features:      PLAN_FEATURES,
    popular:       true,
  },
  {
    key:           'YEARLY',
    name:          'Yearly',
    originalPrice: 372,
    price:         19.16,
    // price:         230,
    savings:       38.17,
    badge:         '2 Months Free',
    billingLabel:  '/ month',
    features:      PLAN_FEATURES,
    popular:       false,
  },
];
