import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import DocumentTypeMaster from 'views/Finance/DocumentType/documentType';
import DocumentTypeMappingMaster from 'views/Finance/DocumentType/documentTypeMapping';
import MultipleDocumentIdGeneration from 'views/Finance/DocumentType/multipleDocumentIdGeneration';
import ReconcileCash from 'views/Finance/Reconcile/ReconcileCash';
import ReconcileCorp from 'views/Finance/Reconcile/ReconcileCorp';
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// login option 3 routing
// const Fin1 = Loadable(lazy(() => import('views/Finance')));
const AdjustmentJournal = Loadable(lazy(() => import('views/Finance/AdjustmentJournal')));
const Department = Loadable(lazy(() => import('views/Finance/opsTransaction/Department')));
const Designation = Loadable(lazy(() => import('views/Finance/opsTransaction/Designation')));
const DrawingMaster = Loadable(lazy(() => import('views/Finance/opsTransaction/DrawingMaster')));
const Gst = Loadable(lazy(() => import('views/Finance/opsTransaction/Gst')));
const ItemMaster = Loadable(lazy(() => import('views/Finance/opsTransaction/ItemMaster')));
const MachineMaster = Loadable(lazy(() => import('views/Finance/opsTransaction/MachineMaster')));
const MeasuringInstrument = Loadable(lazy(() => import('views/Finance/opsTransaction/MeasuringInstrument')));
const StockLocation = Loadable(lazy(() => import('views/Finance/opsTransaction/StockLocation')));
const Uom = Loadable(lazy(() => import('views/Finance/opsTransaction/Uom')));
const ItemWiseProcess = Loadable(lazy(() => import('views/Finance/opsTransaction/ItemWiseProcess')));
const ShiftMaster = Loadable(lazy(() => import('views/Finance/opsTransaction/ShiftMaster')));
const ProcessMaster = Loadable(lazy(() => import('views/Finance/opsTransaction/ProcessMaster')));
const Deposit = Loadable(lazy(() => import('views/Finance/Deposit')));
const Withdrawal = Loadable(lazy(() => import('views/Finance/Withdrawal')));
const ContraVoucher = Loadable(lazy(() => import('views/Finance/ContraVoucher')));
const SetTaxRate = Loadable(lazy(() => import('views/Finance/SetTaxRate')));
const TaxMaster = Loadable(lazy(() => import('views/Finance/taxMaster/taxMaster')));
const Taxes = Loadable(lazy(() => import('views/Finance/Taxes')));
const TcsMaster = Loadable(lazy(() => import('views/Finance/tcsMaster/TcsMaster')));
const TdsMaster = Loadable(lazy(() => import('views/Finance/tdsMaster/TdsMaster')));
const HsnSacCode = Loadable(lazy(() => import('views/Finance/HsnSacCode')));
const HsnSacCodesListing = Loadable(lazy(() => import('views/Finance/HsnSacCodesListing')));
const Group = Loadable(lazy(() => import('views/Finance/Group')));
const Account = Loadable(lazy(() => import('views/Finance/account/Account')));
const ExRates = Loadable(lazy(() => import('views/Finance/ExRates')));
const SubLedgerAccount = Loadable(lazy(() => import('views/Finance/SubLedgerAcount')));
const CostCentre = Loadable(lazy(() => import('views/Finance/costcenter/CostCentre')));
const Daily = Loadable(lazy(() => import('views/Finance/daily/DailyRate')));
const ChartOfCostcenter = Loadable(lazy(() => import('views/Finance/chartOfCostcenter/ChartOfCostcenter')));
const BRSOpening = Loadable(lazy(() => import('views/Finance/BRSOpening')));
const ArBillBalance = Loadable(lazy(() => import('views/Finance/receiptAr/ArBillBalance')));
const ChequeBookMaster = Loadable(lazy(() => import('views/Finance/chequeBookMaster/ChequeBookMaster')));
const GLOpeningBalance = Loadable(lazy(() => import('views/Finance/glOpening/GlOpening')));
const FundTransfer = Loadable(lazy(() => import('views/Finance/FundTransfer')));
const GeneralJournal = Loadable(lazy(() => import('views/Finance/GeneralJournal/GeneralJournal')));
const Receipt = Loadable(lazy(() => import('views/Finance/receipt/Receipt')));
const Payment = Loadable(lazy(() => import('views/Finance/payment/Payment')));
const ApBillBalance = Loadable(lazy(() => import('views/Finance/paymentAp/ApBillBalance')));
const Reconcile = Loadable(lazy(() => import('views/Finance/Reconcile/Reconcile')));
const ReceiptRegister = Loadable(lazy(() => import('views/Finance/receiptRegister/ReceiptRegister')));
const PaymentRegister = Loadable(lazy(() => import('views/Finance/paymentRegister/PaymentRegister')));
const ReconciliationSummary = Loadable(lazy(() => import('views/Finance/ReconciliationSummaryReport/ReconciliationSummary')));
// const CompanyMain = Loadable(lazy(() => import('views/company/companyMain')));
// const CreateCompany = Loadable(lazy(() => import('views/company/CreateCompany')));
const CreateCompany = Loadable(lazy(() => import('views/companySetup/CreateCompany')));
const CompanySetup = Loadable(lazy(() => import('views/companySetup/CompanySetup')));
const Country = Loadable(lazy(() => import('views/basicMaster/country')));
const State = Loadable(lazy(() => import('views/basicMaster/state')));
const City = Loadable(lazy(() => import('views/basicMaster/city')));
const Currency = Loadable(lazy(() => import('views/basicMaster/currency')));
const Region = Loadable(lazy(() => import('views/basicMaster/RegionMaster')));
const FinYear = Loadable(lazy(() => import('views/basicMaster/finYear')));
// const Branch = Loadable(lazy(() => import('views/company/branch')));
const Roles = Loadable(lazy(() => import('views/basicMaster/roles')));
const ScreenNames = Loadable(lazy(() => import('views/basicMaster/ScreenNames')));
const Employee = Loadable(lazy(() => import('views/basicMaster/employee')));
const ChargeTypeRequest = Loadable(lazy(() => import('views/Finance/ChargeTypeRequest')));
const JobCard = Loadable(lazy(() => import('views/Finance/JobCard')));
const AdjustmentOffset = Loadable(lazy(() => import('views/Finance/AdjustmentOffset')));
// const ExcelUpload = Loadable(lazy(() => import('views/Finance/excelUpload')));
const TaxInvoiceDetail = Loadable(lazy(() => import('views/Finance/taxInvoice/taxInvoiceDetail')));
const CreditNoteDetail = Loadable(lazy(() => import('views/Finance/creditNote/CreditNoteDetail')));
const CostInvoice = Loadable(lazy(() => import('views/Finance/costInvoice/CostInvoice')));
const CostDebitNote = Loadable(lazy(() => import('views/Finance/costDebitNote/CostDebitNote')));
const ListOfValues = Loadable(lazy(() => import('views/Finance/listOfValues/listOfValues')));
const PaymentVoucher = Loadable(lazy(() => import('views/Finance/paymentVoucher/paymentVoucher')));
const ARAPDetail = Loadable(lazy(() => import('views/Finance/ARAP-Details')));
const ARAPAdjustment = Loadable(lazy(() => import('views/Finance/APAP-Adjustment')));
const PartMaster = Loadable(lazy(() => import('views/Finance/PartyMaster')));
const MaterialType = Loadable(lazy(() => import('views/Finance/opsTransaction/MaterialType')));
const Enquiry = Loadable(lazy(() => import('views/Operations/Customer-Enquiry/Enquiry')));
const Quotation = Loadable(lazy(() => import('views/Operations/Customer-Enquiry/Quotation')));
const WorkOrder = Loadable(lazy(() => import('views/Operations/Customer-Enquiry/WorkOrder')));
const PurchaseEnquiry = Loadable(lazy(() => import('views/Operations/Purchase/PurchaseEnquiry')));
const PurChaseIndent = Loadable(lazy(() => import('views/Operations/Purchase/PurchaseIndent')));
const PurchaseQuotation = Loadable(lazy(() => import('views/Operations/Purchase/PurchaseQuotation')));
const PurchaseOrder = Loadable(lazy(() => import('views/Operations/Purchase/PurchaseOrder')));
const PurchaseInvoice = Loadable(lazy(() => import('views/Operations/Purchase/PurchaseInvoice')));
const PurchaseReturn = Loadable(lazy(() => import('views/Operations/Purchase/PurchaseReturn')));
const GateInwardEntry = Loadable(lazy(() => import('views/Operations/Inbound-Outbound/GateInwardEntry')));
const GateOutwardEntry = Loadable(lazy(() => import('views/Operations/Inbound-Outbound/GateOutwardEntry')));
const GRN = Loadable(lazy(() => import('views/Operations/Inventory/GRN')));
const PutAway = Loadable(lazy(() => import('views/Operations/Inventory/Putaway')));
const ThirdPartyReportDetails = Loadable(lazy(() => import('views/Operations/Inventory/ThirdPartyReportDetails')));
const RouteCardEntry = Loadable(lazy(() => import('views/Operations/Inventory/RouteCardEntry')));
const ItemIssueToProduction = Loadable(lazy(() => import('views/Operations/Inventory/ItemIssueToProduction')));
const PickList = Loadable(lazy(() => import('views/Operations/Inventory/PickList')));
const IdentificationTag = Loadable(lazy(() => import('views/Operations/Inventory/IdentificationTag')));

// const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const FinanceRoute = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/companysetup/createcompany',
      element: <CreateCompany />
    },
    {
      path: '/companysetup/companysetup',
      element: <CompanySetup />
    },
    // {
    //   path: '/company/companyMain',
    //   element: <CompanyMain />
    // },
    // {
    //   path: '/company/CreateCompany',
    //   element: <CreateCompany />
    // },
    {
      path: '/Finance/SetTaxRate',
      element: <SetTaxRate />
    },
    {
      path: '/finance/partyMaster',
      element: <PartMaster />
    },
    {
      path: '/Finance/TaxMaster',
      element: <TaxMaster />
    },
    {
      path: '/Finance/Taxes',
      element: <Taxes />
    },
    {
      path: '/Finance/tcsMaster/TcsMaster',
      element: <TcsMaster />
    },
    {
      path: '/Finance/tdsMaster/TdsMaster',
      element: <TdsMaster />
    },
    {
      path: '/Finance/HsnSacCode',
      element: <HsnSacCode />
    },
    {
      path: '/Finance/HsnSacCodesListing',
      element: <HsnSacCodesListing />
    },
    {
      path: '/Finance/Group',
      element: <Group />
    },
    {
      path: '/Finance/account/Account',
      element: <Account />
    },
    {
      path: '/Finance/ExRates',
      element: <ExRates />
    },
    {
      path: '/Finance/SubLedgerAccount',
      element: <SubLedgerAccount />
    },
    {
      path: '/Finance/costcenter/CostCentre',
      element: <CostCentre />
    },
    {
      path: '/Finance/daily/DailyRate',
      element: <Daily />
    },
    {
      path: '/Finance/chartOfCostcenter/ChartOfCostcenter',
      element: <ChartOfCostcenter />
    },
    {
      path: '/Finance/BRSOpening',
      element: <BRSOpening />
    },
    {
      path: '/Finance/receipt/ArBillBalance',
      element: <ArBillBalance />
    },
    {
      path: '/Finance/chequeBookMaster/ChequeBookMaster',
      element: <ChequeBookMaster />
    },
    {
      path: '/Finance/glOpening/GlOpening',
      element: <GLOpeningBalance />
    },
    {
      path: '/Finance/FundTransfer',
      element: <FundTransfer />
    },
    {
      path: '/Finance/GeneralJournal/GeneralJournal',
      element: <GeneralJournal />
    },
    {
      path: '/Finance/receipt/Receipt',
      element: <Receipt />
    },
    {
      path: '/Finance/payment/Payment',
      element: <Payment />
    },
    {
      path: '/Finance/payment/ApBillBalance',
      element: <ApBillBalance />
    },
    {
      path: '/Finance/Reconcile/Reconcile',
      element: <Reconcile />
    },
    {
      path: '/Finance/Reconcile/ReconcileCash',
      element: <ReconcileCash />
    },
    {
      path: '/Finance/Reconcile/ReconcileCorp',
      element: <ReconcileCorp />
    },
    {
      path: '/Finance/receiptRegister/ReceiptRegister',
      element: <ReceiptRegister />
    },
    {
      path: '/Finance/paymentRegister/PaymentRegister',
      element: <PaymentRegister />
    },
    {
      path: '/Finance/ReconciliationSummaryReport/ReconciliationSummary',
      element: <ReconciliationSummary />
    },
    {
      path: '/basicMaster/country',
      element: <Country />
    },
    {
      path: '/basicMaster/state',
      element: <State />
    },
    {
      path: '/basicMaster/city',
      element: <City />
    },
    {
      path: '/basicMaster/currency',
      element: <Currency />
    },
    {
      path: '/basicMaster/RegionMaster',
      element: <Region />
    },
    {
      path: '/basicMaster/finYear',
      element: <FinYear />
    },
    {
      path: '/basicMaster/roles',
      element: <Roles />
    },
    {
      path: '/basicMaster/ScreenNames',
      element: <ScreenNames />
    },
    {
      path: '/basicMaster/employee',
      element: <Employee />
    },
    {
      path: '/Finance/ChargeTypeRequest',
      element: <ChargeTypeRequest />
    },
    {
      path: '/Finance/taxInvoice/TaxInvoiceDetail',
      element: <TaxInvoiceDetail />
    },
    {
      path: '/Finance/creditNote/CreditNoteDetail',
      element: <CreditNoteDetail />
    },
    {
      path: '/Finance/costInvoice/CostInvoice',
      element: <CostInvoice />
    },
    {
      path: '/Finance/costDebitNote/CostDebitNote',
      element: <CostDebitNote />
    },
    {
      path: 'Finance/listOfValues/listOfValues',
      element: <ListOfValues />
    },
    {
      path: 'Finance/paymentVoucher/paymentVoucher',
      element: <PaymentVoucher />
    },
    {
      path: 'Finance/ARAP-Details',
      element: <ARAPDetail />
    },
    {
      path: 'Finance/ARAP-Adjustment',
      element: <ARAPAdjustment />
    },
    {
      path: 'Finance/DocumentType/documentType',
      element: <DocumentTypeMaster />
    },
    {
      path: 'Finance/DocumentType/documentTypeMapping',
      element: <DocumentTypeMappingMaster />
    },
    {
      path: 'Finance/DocumentType/multipleDocumentIdGeneration',
      element: <MultipleDocumentIdGeneration />
    },
    {
      path: '/Finance/AdjustmentJournal',
      element: <AdjustmentJournal />
    },
    {
      path: '/Finance/Deposit',
      element: <Deposit />
    },
    {
      path: '/Finance/Withdrawal',
      element: <Withdrawal />
    },
    {
      path: 'Finance/JobCard',
      element: <JobCard />
    },
    {
      path: 'Finance/AdjustmentOffset',
      element: <AdjustmentOffset />
    },
    // {
    //   path: 'Finance/ExcelUpload',
    //   element: <ExcelUpload />
    // },
    {
      path: '/Finance/ContraVoucher',
      element: <ContraVoucher />
    },
    {
      path: '/Finance/opsTransaction/Department',
      element: <Department />
    },
    {
      path: '/Finance/opsTransaction/Designation',
      element: <Designation />
    },
    {
      path: '/Finance/opsTransaction/DrawingMaster',
      element: <DrawingMaster />
    },
    {
      path: '/Finance/opsTransaction/Gst',
      element: <Gst />
    },
    {
      path: '/Finance/opsTransaction/ItemMaster',
      element: <ItemMaster />
    },
    {
      path: '/Finance/opsTransaction/MachineMaster',
      element: <MachineMaster />
    },
    {
      path: '/Finance/opsTransaction/MeasuringInstrument',
      element: <MeasuringInstrument />
    },
    {
      path: '/Finance/opsTransaction/StockLocation',
      element: <StockLocation />
    },
    {
      path: '/Finance/opsTransaction/Uom',
      element: <Uom />
    },
    {
      path: '/Finance/opsTransaction/ItemWiseProcess',
      element: <ItemWiseProcess />
    },
    {
      path: '/Finance/opsTransaction/ShiftMaster',
      element: <ShiftMaster />
    },
    {
      path: '/Finance/opsTransaction/ProcessMaster',
      element: <ProcessMaster />
    },
    {
      path: '/Finance/opsTransaction/MaterialType',
      element: <MaterialType />
    },
    {
      path: '/Operations/Customer-Enquiry/Enquiry',
      element: <Enquiry />
    },
    {
      path: '/Operations/Customer-Enquiry/Quotation',
      element: <Quotation />
    },
    {
      path: '/Operations/Customer-Enquiry/WorkOrder',
      element: <WorkOrder />
    },
    {
      path: '/Operations/Purchase/PurchaseEnquiry',
      element: <PurchaseEnquiry />
    },
    {
      path: '/Operations/Purchase/PurchaseIndent',
      element: <PurChaseIndent />
    },
    {
      path: '/Operations/Purchase/PurchaseQuotation',
      element: <PurchaseQuotation />
    },
    {
      path: '/Operations/Purchase/PurchaseOrder',
      element: <PurchaseOrder />
    },
    {
      path: '/Operations/Purchase/PurchaseInvoice',
      element: <PurchaseInvoice />
    },
    {
      path: '/Operations/Purchase/PurchaseReturn',
      element: <PurchaseReturn />
    },
    {
      path: '/Inbound-Outbound/Gate-Inward-Entry',
      element: <GateInwardEntry />
    },
    {
      path: '/Inbound-Outbound/Gate-Outward-Entry',
      element: <GateOutwardEntry />
    },
    {
      path: '/Inventory/GRN',
      element: <GRN />
    },
    {
      path: '/Inventory/Putaway',
      element: <PutAway />
    },
    {
      path: '/Inventory/Third-Party-Report-Details',
      element: <ThirdPartyReportDetails />
    },
    {
      path: '/Inventory/Route-Card-Entry',
      element: <RouteCardEntry />
    },
    {
      path: '/Inventory/Item-Issue-To-Production',
      element: <ItemIssueToProduction />
    },
    {
      path: '/Inventory/Pick-List',
      element: <PickList />
    },
    {
      path: '/Inventory/Identification-Tag',
      element: <IdentificationTag />
    },
  ]
};

export default FinanceRoute;
