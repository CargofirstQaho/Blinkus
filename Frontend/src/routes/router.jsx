import { createBrowserRouter,Navigate  } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from '../components/layout/AppLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import TradeProtectedRoute from './TradeProtectedRoute';
import Spinner from '../components/ui/Spinner';

const wrap = (Component) => (
  <Suspense fallback={<Spinner fullScreen />}>
    <Component />
  </Suspense>
);

const Home           = lazy(() => import('../pages/Home'));
const Pricing        = lazy(() => import('../pages/Pricing'));
const Login          = lazy(() => import('../pages/Login'));
const Signup         = lazy(() => import('../pages/Signup'));
const VerifyOtp      = lazy(() => import('../pages/VerifyOtp'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const VerifyResetOtp = lazy(() => import('../pages/VerifyResetOtp'));
const ResetPassword  = lazy(() => import('../pages/ResetPassword'));
const GoogleCallback = lazy(() => import('../pages/GoogleCallback'));
const About          = lazy(() => import('../pages/About'));
const Contact        = lazy(() => import('../pages/Contact'));
const Careers        = lazy(() => import('../pages/Careers'));
const Blog           = lazy(() => import('../pages/Blog'));
const Articles       = lazy(() => import('../pages/Articles'));
const PressRelease   = lazy(() => import('../pages/PressRelease'));
const PrivacyPolicy  = lazy(() => import('../pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('../pages/TermsConditions'));
const Consent        = lazy(() => import('../pages/Consent'));
const Dashboard      = lazy(() => import('../pages/Dashboard'));
const Chat           = lazy(() => import('../pages/Chat'));
const Profile        = lazy(() => import('../pages/Profile'));
const Settings       = lazy(() => import('../features/trade/settings/pages/SettingsPage'));
const Credibility       = lazy(() => import('../pages/Credibility'));
const ContractDrafting  = lazy(() => import('../pages/ContractDrafting'));
const ComingSoon        = lazy(() => import('../pages/ComingSoon'));
// const Upgrade           = lazy(() => import('../pages/Upgrade'));
const Upgrade           = lazy(() => import('../features/trade/Upgrade/pages/Upgrade'));
const UpgradeBilling    = lazy(() => import('../features/trade/Upgrade/pages/UpgradeBilling'));
const AddOrganization   = lazy(() => import('../pages/erp/AddOrganization'));
// const AddOrganization   = lazy(() => import('../features/trade/organization/pages/AddOrganizationPage'));
const Domestic          = lazy(() => import('../pages/erp/Domestic'));
const International     = lazy(() => import('../pages/erp/International'));
const TradeHistory      = lazy(() => import('../pages/erp/TradeHistory'));

const PurchaseOrderEntryPage   = lazy(() => import('../features/trade/purchase-order/pages/PurchaseOrderEntryPage'));
const PurchaseOrderPage        = lazy(() => import('../features/trade/purchase-order/pages/PurchaseOrderPage'));
const PurchaseOrderReviewPage  = lazy(() => import('../features/trade/purchase-order/pages/PurchaseOrderReviewPage'));
const CreditNoteEntryPage   = lazy(() => import('../features/trade/credit-note/pages/CreditNoteEntryPage'));
const CreditNotePage        = lazy(() => import('../features/trade/credit-note/pages/CreditNotePage'));
const CreditNoteReviewPage  = lazy(() => import('../features/trade/credit-note/pages/CreditNoteReviewPage'));
const DebitNoteEntryPage    = lazy(() => import('../features/trade/debit-note/pages/DebitNoteEntryPage'));
const DebitNotePage         = lazy(() => import('../features/trade/debit-note/pages/DebitNotePage'));
const DebitNoteReviewPage   = lazy(() => import('../features/trade/debit-note/pages/DebitNoteReviewPage'));
const EWayBillPage          = lazy(() => import('../modules/trade/pages/domestic/EWayBillPage'));
const ContractDraftingPage       = lazy(() => import('../features/trade/international/contracts/pages/ContractEntryPage'));
const ContractUploadPage         = lazy(() => import('../features/trade/international/contracts/pages/ContractUploadPage'));
const ContractDraftFormPage      = lazy(() => import('../features/trade/international/contracts/pages/ContractDraftFormPage'));
const ContractReviewPage         = lazy(() => import('../features/trade/international/contracts/pages/ContractReviewPage'));
const ProformaInvoiceEntryPage  = lazy(() => import('../features/trade/proforma-invoice/pages/ProformaInvoiceEntryPage'));
const ProformaInvoicePage       = lazy(() => import('../features/trade/proforma-invoice/pages/ProformaInvoicePage'));
const ProformaInvoiceReviewPage = lazy(() => import('../features/trade/proforma-invoice/pages/ProformaInvoiceReviewPage'));
const PackingListEntryPage  = lazy(() => import('../features/trade/packing-list/pages/PackingListEntryPage'));
const PackingListPage       = lazy(() => import('../features/trade/packing-list/pages/PackingListPage'));
const PackingListReviewPage = lazy(() => import('../features/trade/packing-list/pages/PackingListReviewPage'));
const CommercialInvoiceEntryPage  = lazy(() => import('../features/trade/commercial-invoice/pages/CommercialInvoiceEntryPage'));
const CommercialInvoicePage       = lazy(() => import('../features/trade/commercial-invoice/pages/CommercialInvoicePage'));
const CommercialInvoiceReviewPage = lazy(() => import('../features/trade/commercial-invoice/pages/CommercialInvoiceReviewPage'));
const TradeHistoryPage      = lazy(() => import('../modules/trade/pages/history/TradeHistoryPage'));
const TradeDraftsPage       = lazy(() => import('../modules/trade/pages/drafts/TradeDraftsPage'));
const TradeQualityInspectionPage = lazy(() => import('../modules/trade/pages/quality-inspection/TradeQualityInspectionPage'));
const ShipmentOverviewPage       = lazy(() => import('../modules/trade/pages/shipment/ShipmentOverviewPage'));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true,                   element: wrap(Home)           },
      { path: 'pricing',               element: wrap(Pricing)        },
      { path: 'about',                 element: wrap(About)          },
      { path: 'contact',               element: wrap(Contact)        },
      { path: 'careers',               element: wrap(Careers)        },
      { path: 'blog',                  element: wrap(Blog)           },
      { path: 'articles',              element: wrap(Articles)       },
      { path: 'press-release',         element: wrap(PressRelease)   },
      { path: 'privacy-policy',        element: wrap(PrivacyPolicy)  },
      { path: 'terms-and-conditions',  element: wrap(TermsConditions) },
      { path: 'terms-of-service',      element: wrap(TermsConditions) },
      { path: 'auth/google/callback',  element: wrap(GoogleCallback) },
      {
        element: <GuestRoute />,
        children: [
          { path: 'login',            element: wrap(Login)          },
          { path: 'signup',           element: wrap(Signup)         },
          { path: 'verify-otp',       element: wrap(VerifyOtp)      },
          { path: 'forgot-password',  element: wrap(ForgotPassword) },
          { path: 'verify-reset-otp', element: wrap(VerifyResetOtp) },
          { path: 'reset-password',   element: wrap(ResetPassword)  },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: 'consent', element: wrap(Consent) },
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard',              element: wrap(Dashboard)    },
          { path: 'dashboard/coming-soon',       element: wrap(ComingSoon)       },
          { path: 'dashboard/credibility',       element: wrap(Credibility)      },
          { path: 'dashboard/contract-drafting', element: wrap(ContractDrafting) },
          { path: 'chat/:chatId',          element: wrap(Chat)         },
          { path: 'profile',               element: wrap(Profile)      },
          { path: 'settings',              element: wrap(Settings)     },
          { path: '/trade/upgrade',        element: wrap(Upgrade)         },
          { path: 'trade/upgrade/billing', element: wrap(UpgradeBilling)  },
          {
            element: <TradeProtectedRoute />,
            children: [
              { path: 'trade/add-organization', element: wrap(AddOrganization) },
              { path: 'trade/drafts',           element: wrap(TradeDraftsPage) },
              { path: 'erp/domestic',           element: wrap(Domestic)        },
              { path: 'erp/international',      element: wrap(International)   },
              { path: 'erp/trade-history',      element: wrap(TradeHistory)    },
              { path: 'trade/domestic/purchase-order',             element: wrap(PurchaseOrderEntryPage)   },
              { path: 'trade/domestic/purchase-order/form',        element: wrap(PurchaseOrderPage)        },
              { path: 'trade/domestic/purchase-order/review',      element: wrap(PurchaseOrderReviewPage)  },
              { path: 'trade/domestic/credit-note',                element: wrap(CreditNoteEntryPage)      },
              { path: 'trade/domestic/credit-note/form',           element: wrap(CreditNotePage)           },
              { path: 'trade/domestic/credit-note/review',         element: wrap(CreditNoteReviewPage)     },
              { path: 'trade/domestic/debit-note',                 element: wrap(DebitNoteEntryPage)       },
              { path: 'trade/domestic/debit-note/form',            element: wrap(DebitNotePage)            },
              { path: 'trade/domestic/debit-note/review',          element: wrap(DebitNoteReviewPage)      },
              { path: 'trade/domestic/e-way-bill',            element: wrap(EWayBillPage)             },
              { path: 'trade/international/contract-drafting',        element: wrap(ContractDraftingPage)      },
              { path: 'trade/international/contract-drafting/upload', element: wrap(ContractUploadPage)        },
              { path: 'trade/international/contract-drafting/draft',  element: wrap(ContractDraftFormPage)     },
              { path: 'trade/international/contract-drafting/review', element: wrap(ContractReviewPage)        },
              { path: 'trade/international/proforma-invoice',             element: wrap(ProformaInvoiceEntryPage)  },
              { path: 'trade/international/proforma-invoice/form',     element: wrap(ProformaInvoicePage)       },
              { path: 'trade/international/proforma-invoice/review',   element: wrap(ProformaInvoiceReviewPage) },
              { path: 'trade/international/packing-list',              element: wrap(PackingListEntryPage)      },
              { path: 'trade/international/packing-list/form',         element: wrap(PackingListPage)           },
              { path: 'trade/international/packing-list/review',       element: wrap(PackingListReviewPage)     },
              { path: 'trade/international/commercial-invoice',         element: wrap(CommercialInvoiceEntryPage)  },
              { path: 'trade/international/commercial-invoice/form',    element: wrap(CommercialInvoicePage)       },
              { path: 'trade/international/commercial-invoice/review',  element: wrap(CommercialInvoiceReviewPage) },
              { path: 'trade/quality-inspection',                     element: wrap(TradeQualityInspectionPage)  },
              { path: 'trade/shipment',                               element: wrap(ShipmentOverviewPage)        },
              { path: 'trade/history',                                element: wrap(TradeHistoryPage)            },
            ],
          },
        ],
      },
    ],
  },
   {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
