import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputLabel, Autocomplete, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import Draggable from 'react-draggable';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import Paper from '@mui/material/Paper';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import Checkbox from '@mui/material/Checkbox';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import sampleFile from '../../../assets/sample-files/sample_data_buyerorder.xls';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function SalesInvoiceLocal() {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [allAccountName, setAllAccountName] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [docId, setDocId] = useState('');
  const [partyList, setPartyList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    salesInvoiceLocalNo: '',
    customerName: '',
    billingaddress: '',
    gSTNo: '',
    packingListNo: '',
    salesOrderNo: '',
    currency: '',
    exchangeRate: '',
    location: '',
    salesInvoiceDate: dayjs(),
    invoiceNo: '',
    shippingAddress: '',
    taxType: '',
    orgId: orgId,
  });


  const [fieldErrors, setFieldErrors] = useState({
    salesInvoiceLocalNo: '',
    customerName: '',
    billingaddress: '',
    gSTNo: '',
    packingListNo: '',
    salesOrderNo: '',
    currency: '',
    exchangeRate: '',
    location: '',
    salesInvoiceDate: new Date(),
    invoiceNo: '',
    shippingAddress: '',
    taxType: '',
    orgId: orgId,
  });

  const listViewColumns = [
    { accessorKey: 'salesInvoiceLocalNo', header: 'Inspection No *', size: 140 },
    { accessorKey: 'customerName', header: 'Route Card No', size: 140 },
    { accessorKey: 'billingaddress', header: 'billingaddress', size: 140 },
    { accessorKey: 'gSTNo', header: 'GST No', size: 140 },
    { accessorKey: 'packingListNo', header: 'Part Name', size: 140 },
    { accessorKey: 'salesOrderNo', header: 'Sales Order No', size: 140 },
    { accessorKey: 'currency', header: 'Currency', size: 140 },
    { accessorKey: 'exchangeRate', header: 'Exchange Rate', size: 140 },
    { accessorKey: 'location', header: 'Location', size: 140 },
    { accessorKey: 'salesInvoiceDate', header: 'salesInvoiceDate', size: 140 },
    { accessorKey: 'invoiceNo', header: 'InvoiceNo', size: 140 },
    { accessorKey: 'shippingAddress', header: 'Shipping Address', size: 140 },
    { accessorKey: 'taxType', header: 'Tax Type', size: 140 },
  ];

  const [quotationDetails, setQuotationDetails] = useState([
    {
      id: 1,
      item: '',
      itemDesc: '',
      units: '',
      avlstkqty: '',
      qty: '',
      rate: '',
      taxCode: '',
      basicAmount: '',
      discount: '',
      discountAmount: '',
      taxableAmount: '',
      sGST: '',
      cGST: '',
      iGST: '',
      taxAmount: '',
      discount: '',
      discountPrice: '',
      quoteAmount: ''
    }
  ]);
  const [quotationDetailsTableErrors, setQuotationDetailsTableErrors] = useState([
    {
      id: 1,
      item: '',
      itemDesc: '',
      units: '',
      avlstkqty: '',
      qty: '',
      rate: '',
      taxCode: '',
      basicAmount: '',
      discount: '',
      discountAmount: '',
      taxableAmount: '',
      sGST: '',
      cGST: '',
      iGST: '',
      taxAmount: '',
      landedValue: '',
      discountPrice: '',
      quoteAmount: ''
    }
  ]);
  // const [attachmentData, setAttachmentData] = useState([
  //   {
  //     id: 1,
  //     characterstics: '',
  //     methodofinspection: '',
  //     specification: '',
  //     avlstkqty: '',
  //     qty: '',
  //     observation: '',
  //     landedValue1: ''

  //   }
  // ]);
  // const [attachmentTableErrors, setAttachmentTableErrors] = useState([
  //   {
  //     characterstics: '',
  //     methodofinspection: '',
  //     specification: '',
  //     avlstkqty: '',
  //     qty: '',
  //     observation: '',
  //     landedValue1: ''
  //   }
  // ]);
  // const [file, setFile] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // const handleFileChange = (event) => {
  //   attachmentData.attachments(event.target.files[0]);
  // };

  const handleSaveSelectedRows = async () => { }
  const handleSelectAll = () => { }
  const getMachineMasterById = () => { }
  useEffect(() => {

    // getAdjustmentJournalDocId();
    // getAllAdjustmentJournalByOrgId();
    // getAllAccountName();
  }, []);

  const handleClear = () => {
    setFormData({
      customerName: '',
      billingaddress: '',
      gSTNo: '',
      packingListNo: '',
      salesOrderNo: '',
      currency: '',
      exchangeRate: '',
      location: '',
      salesInvoiceDate: dayjs(),
      invoiceNo: '',
      shippingAddress: '',
      taxType: ''
    });
    setFieldErrors({
      salesInvoiceLocalNo: '',
      customerName: '',
      billingaddress: '',
      gSTNo: '',
      packingListNo: '',
      salesOrderNo: '',
      currency: '',
      exchangeRate: '',
      location: '',
      salesInvoiceDate: null,
      invoiceNo: '',
      shippingAddress: '',
      exRate: '',
      shippingAddress: '',
      customerName: '',
      taxType: ''
    });
    setQuotationDetails([
      {
        id: 1,
        item: '',
        itemDesc: '',
        units: '',
        avlstkqty: '',
        qty: '',
        rate: '',
        taxCode: '',
        basicAmount: '',
        discount: '',
        discountAmount: '',
        taxableAmount: '',
        sGST: '',
        cGST: '',
        iGST: '',
        taxAmount: '',
        landedValue: '',
        discountPrice: '',
        quoteAmount: ''
      }
    ]);
    setQuotationDetailsTableErrors('');
    // setAttachmentData([
    //   {
    //     id: 1,
    //     characterstics: '',
    //     methodofinspection: '',
    //     specification: '',
    //     avlstkqty: '',
    //     qty: '',
    //     observation: '',
    //     landedValue1: ''



    //   }
    // ]);
    // setAttachmentTableErrors('');
    setEditId('');
    getAdjustmentJournalDocId();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let inputValue = type === 'checkbox' ? checked : value;

    const numberFields = ['billExRate', 'billNo', 'creditAmt', 'exchangeRate', 'debitAmt', 'yearEndExRate', 'grossAmount', 'totalTaxAmount', 'totalAmount'];

    if (numberFields.includes(name)) {
      const numericRegex = /^[0-9]*$/;

      if (!numericRegex.test(inputValue)) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: 'Only numbers are allowed',
        }));
        return;
      }
    }

    // Update form data and clear error
    setFormData((prev) => ({ ...prev, [name]: inputValue }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRowQuotation = () => {
    if (isLastRowEmptyQuotation(quotationDetails)) {
      displayRowErrorQuotation(quotationDetails);
      return;
    }
    const newRow = {
      id: Date.now(),
      item: '',
      itemDesc: '',
      units: '',
      avlstkqty: '',
      qty: '',
      rate: '',
      taxCode: '',
      basicAmount: '',
      discount: '',
      discountAmount: '',
      taxableAmount: '',
      sGST: '',
      cGST: '',
      iGST: '',
      taxAmount: '',
      landedValue: '',
      discountPrice: '',
      quoteAmount: ''
    };
    setQuotationDetails([...quotationDetails, newRow]);
    setQuotationDetailsTableErrors([
      ...quotationDetailsTableErrors,
      {
        item: '',
        itemDesc: '',
        units: '',
        avlstkqty: '',
        qty: '',
        rate: '',
        taxCode: '',
        basicAmount: '',
        discount: '',
        discountAmount: '',
        taxableAmount: '',
        sGST: '',
        cGST: '',
        iGST: '',
        taxAmount: '',
        landedValue: '',
        discountPrice: '',
        quoteAmount: ''
      }
    ]);
  };

  const isLastRowEmptyQuotation = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === quotationDetails) {
      return (
        !lastRow.item ||
        !lastRow.itemDesc ||
        !lastRow.units ||
        !lastRow.avlstkqty ||
        !lastRow.qty ||
        !lastRow.rate ||
        !lastRow.taxCode ||
        !lastRow.basicAmount ||
        !lastRow.discount ||
        !lastRow.discountAmount ||
        !lastRow.taxableAmount ||
        !lastRow.sGST ||
        !lastRow.cGST ||
        !lastRow.iGST ||
        !lastRow.taxAmount ||
        !lastRow.landedValue
      );
    }
    return false;
  };

  const displayRowErrorQuotation = (table) => {
    if (table === quotationDetails) {
      setQuotationDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !table[table.length - 1].item ? 'item is required' : '',
          itemDesc: !table[table.length - 1].itemDesc ? 'Item Desc is required' : '', capacity: !table[table.length - 1].capacity ? 'capacity is required' : '',
          units: !table[table.length - 1].units ? 'Units is required' : '',
          qty: !table[table.length - 1].qty ? 'qty is required' : '',
          avlstkqty: !table[table.length - 1].avlstkqty ? 'Avlstkqty is required' : '',
          rate: !table[table.length - 1].rate ? 'Rate is required' : '',
          taxCode: !table[table.length - 1].taxCode ? 'Tax Code is required' : '',
          basicAmount: !table[table.length - 1].basicAmount ? 'basic Amount is required' : '',
          discount: !table[table.length - 1].discount ? 'Discount % is required' : '',
          discountAmount: !table[table.length - 1].discountAmount ? 'Discount Amount is required' : '',
          taxableAmount: !table[table.length - 1].taxableAmount ? 'Taxable Amount is required' : '',
          sGST: !table[table.length - 1].sGST ? 'SGST % is required' : '',
          cGST: !table[table.length - 1].cGST ? 'CGST % is required' : '',
          iGST: !table[table.length - 1].iGST ? 'IGST % is required' : '',
          taxAmount: !table[table.length - 1].taxAmount ? 'Tax Amount is required' : '',
          landedValue: !table[table.length - 1].landedValue ? 'Landed Value is required' : ''
        };
        return newErrors;
      });
    }
  };

  // const handleAddRowAttachment = () => {
  //   if (isLastRowEmptyAttachment(attachmentData)) {
  //     displayRowErrorAttachment(attachmentData);
  //     return;
  //   }
  //   // const newRow = {
  //   //   id: Date.now(),
  //   //   characterstics: '',
  //   //   methodofinspection: '',
  //   //   specification: '',
  //   //   avlstkqty: '',
  //   //   qty: '',
  //   //   observation: '',
  //   //   landedValue1: ''
  //   // };
  //   setAttachmentData([...attachmentData, newRow]);
  //   setAttachmentTableErrors([
  //     ...attachmentTableErrors,
  //     {
  //       characterstics: '',
  //       methodofinspection: '',
  //       specification: '',
  //       avlstkqty: '',
  //       qty: '',
  //       observation: '',
  //       landedValue1: ''

  //     }
  //   ]);
  // };

  // const isLastRowEmptyAttachment = (table) => {
  //   const lastRow = table[table.length - 1];
  //   if (!lastRow) return false;

  //   if (table === attachmentData) {
  //     return (
  //       !lastRow.characterstics ||
  //       !lastRow.methodofinspection ||
  //       !lastRow.specification ||
  //       !lastRow.avlstkqty ||
  //       !lastRow.qty ||
  //       !lastRow.observation ||
  //       !lastRow.landedValue1


  //     );
  //   }
  //   return false;
  // };

  // const displayRowErrorAttachment = (table) => {
  //   if (table === attachmentData) {
  //     setAttachmentTableErrors((prevErrors) => {
  //       const newErrors = [...prevErrors];
  //       newErrors[table.length - 1] = {
  //         ...newErrors[table.length - 1],
  //         characterstics: !table[table.length - 1].characterstics ? 'Characterstics is required' : '',
  //         methodofinspection: !table[table.length - 1].methodofinspection ? 'Item Desc is required' : '',
  //         specification: !table[table.length - 1].specification ? 'Specification is required' : '',
  //         avlstkqty: !table[table.length - 1].avlstkqty ? 'avlstkqty is required' : '',
  //         qty: !table[table.length - 1].qty ? 'qty is required' : '',
  //         observation: !table[table.length - 1].observation ? 'Observation is required' : '',
  //         landedValue1: !table[table.length - 1].landedValue1 ? 'landedValue1 is required' : '',



  //       };
  //       return newErrors;
  //     });
  //   }
  // };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const handleView = () => {
    setShowForm(!showForm);
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.customerName) {
      errors.customerName = ' Customer Nameis  required';
    }
    if (!formData.packingListNo) {
      errors.packingListNo = 'Part Name is  required';
    }
    if (!formData.salesOrderNo) {
      errors.salesOrderNo = 'Sales Order No is  required';
    }
    if (!formData.billingaddress) {
      errors.billingaddress = 'Billing Address is  required';
    }

    if (!formData.exchangeRate) {
      errors.exchangeRate = 'Exchange Rate is  required';
    }
    if (!formData.shippingAddress) {
      errors.shippingAddress = 'Shipping Address is  required';
    }

    if (!formData.contactName) {
      errors.contactName = ' Contact Name is  required';
    }

    if (!formData.taxType) {
      errors.taxType = 'Tax Type is  required';
    }


    let quotationTableDataValid = true;
    const newQuotationTableErrors = quotationDetails.map((row) => {
      const rowErrors = {};
      if (!row.item) {
        rowErrors.item = 'item is required';
        quotationTableDataValid = false;
      }
      if (!row.itemDesc) {
        rowErrors.itemDesc = 'Item Desc is required';
        quotationTableDataValid = false;
      }
      if (!row.units) {
        rowErrors.units = 'Units is required';
        quotationTableDataValid = false;
      }
      if (!row.avlstkqty) {
        rowErrors.avlstkqty = 'Avlstkqty is required';
        quotationTableDataValid = false;
      }
      if (!row.qty) {
        rowErrors.qty = 'qty  is required';
        quotationTableDataValid = false;
      }
      if (!row.rate) {
        rowErrors.rate = 'Rate is required';
        quotationTableDataValid = false;
      }
      if (!row.taxCode) {
        rowErrors.taxCode = 'Tax Code is required';
        quotationTableDataValid = false;
      } if (!row.basicAmount) {
        rowErrors.basicAmount = 'basic Amount is required';
        quotationTableDataValid = false;
      } if (!row.discount) {
        rowErrors.discount = 'Discount % is required';
        quotationTableDataValid = false;
      } if (!row.discountAmount) {
        rowErrors.discountAmount = 'Discount Amount is required';
        quotationTableDataValid = false;
      } if (!row.taxableAmount) {
        rowErrors.taxableAmount = 'Taxable Amount is required';
        quotationTableDataValid = false;
      } if (!row.sGST) {
        rowErrors.sGST = 'SGST % is required';
        quotationTableDataValid = false;
      } if (!row.cGST) {
        rowErrors.cGST = 'CGST % is required';
        quotationTableDataValid = false;
      } if (!row.iGST) {
        rowErrors.iGST = 'IGST % is required';
        quotationTableDataValid = false;
      } if (!row.taxAmount) {
        rowErrors.taxAmount = 'Tax Amount is required';
        quotationTableDataValid = false;
      }
      if (!row.landedValue) {
        rowErrors.landedValue = 'Landed Value is required';
        quotationTableDataValid = false;
      }
      return rowErrors;
    });
    let detailTableDataValid2 = true;
    // const newAttachmentTableErrors = quotationDetails.map((row) => {
    //   const rowErrors = {};
    //   if (!row.characterstics) {
    //     rowErrors.characterstics = 'Characterstics is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.methodofinspection) {
    //     rowErrors.methodofinspection = 'Item Desc is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.specification) {
    //     rowErrors.specification = 'Specification is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.avlstkqty) {
    //     rowErrors.avlstkqty = 'avlstkqty is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.qty) {
    //     rowErrors.qty = 'qty is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.observation) {
    //     rowErrors.observation = 'Observation is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.landedValue1) {
    //     rowErrors.landedValue1 = 'landedValue1 is required';
    //     detailTableDataValid2 = false;
    //   }
    //   return rowErrors;
    // });
    setFieldErrors(errors);
    setQuotationDetailsTableErrors(newQuotationTableErrors);
    // setAttachmentTableErrors(newAttachmentTableErrors);

    if (Object.keys(errors).length === 0 && (detailTableDataValid2 && quotationTableDataValid)) {
      const AdjustmentVO = quotationDetails.map((row) => ({
        ...(editId && { id: row.id }),
        accountsName: row.accountName,
        creditAmount: parseInt(row.creditAmount),
        debitAmount: parseInt(row.debitAmount),
        debitBase: parseInt(row.debitBase),
        creditBase: parseInt(row.creditBase),
        subLedgerCode: row.subLedgerCode,
        subledgerName: row.subledgerName
      }));
      // const AdjustmentJournalVO = attachmentData.map((row) => ({
      //   ...(editId && { id: row.id }),
      //   accountsName: row.accountName,
      //   creditAmount: parseInt(row.creditAmount),
      //   debitAmount: parseInt(row.debitAmount),
      //   debitBase: parseInt(row.debitBase),
      //   creditBase: parseInt(row.creditBase),
      //   subLedgerCode: row.subLedgerCode,
      //   subledgerName: row.subledgerName
      // }));
      const saveFormData = {
        ...(editId && { id: editId }),
        // branch: branch,
        //       branchCode: branchCode,
        //       createdBy: loginUserName,
        //       finYear: finYear,
        //       orgId: orgId,
        //       accountParticularsDTO: AdjustmentJournalVO,
        //       adjustmentType: formData.adjustmentType,
        //       currency: formData.currency,
        //       exRate: parseInt(formData.exRate),
        //       refDate: dayjs(formData.refDate).format('YYYY-MM-DD'),
        //       refNo: formData.refNo,
        //       suppRefDate: dayjs(formData.suppRefDate).format('YYYY-MM-DD'),
        //       suppRefNo: formData.suppRefNo,
        //       landedValue: formData.landedValue
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `transaction/updateCreateAdjustmentJournal`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'In Process Inspection Updated Successfully' : 'In Process Inspection Created successfully');
          getAllAdjustmentJournalByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'In Process Inspection creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'In Process Inspection creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };
  const getAdjustmentJournalDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getAdjustmentJournalDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setDocId(response.paramObjectsMap.adjustmentJournalDocId);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllAdjustmentJournalByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllAdjustmentJournalByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.adjustmentJournalVO || []);
      // showForm(true);
      console.log('adjustmentJournalVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllAdjustmentJournalById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getAdjustmentJournalById?id=${row.original.id}`);

      if (result) {
        const adVO = result.paramObjectsMap.adjustmentJournalVO[0];
        setEditId(row.original.id);
        setDocId(adVO.docId);
        setFormData({
          // docDate: adVO.docDate ? dayjs(adVO.docDate, 'YYYY-MM-DD') : dayjs(),
          // adjustmentType: adVO.adjustmentType,
          // currency: adVO.currency,
          // exRate: adVO.exRate,
          // refNo: adVO.refNo,
          // refDate: adVO.refDate ? dayjs(adVO.refDate, 'YYYY-MM-DD') : dayjs(),
          // suppRefNo: adVO.suppRefNo,
          // suppRefDate: adVO.suppRefDate ? dayjs(adVO.refDate, 'YYYY-MM-DD') : dayjs(),
          // landedValue: adVO.landedValue,
          // orgId: adVO.orgId,
          // totalDebitAmount: adVO.totalDebitAmount,
          // totalCreditAmount: adVO.totalCreditAmount
        });
        setQuotationDetails(
          adVO.accountParticularsVO.map((row) => ({
            id: row.id,
            accountName: row.accountsName,
            creditAmount: row.creditAmount,
            debitAmount: row.debitAmount,
            debitBase: row.debitBase,
            creditBase: row.creditBase,
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
          }))
        );

        console.log('DataToEdit', adVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleBulkUploadOpen = () => {
    setUploadOpen(true);
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false);
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };

  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>

          {showForm ? (
            <>
              <div className="row d-flex ml">
                {/* Sales Invoice Local No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Sales Invoice Local No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="salesInvoiceLocalNo"
                    value={formData.salesInvoiceLocalNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                {/* Sales Invoice Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Sales Invoice Date"
                        // label={
                        //   <span>
                        //     Sales Invoice Date <span className="asterisk">*</span>
                        //   </span>
                        // }
                        value={formData.salesInvoiceDate}
                        onChange={(date) => handleDateChange('salesInvoiceDate', date)}
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                {/* Customer Name*/}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.customerName ? partyList.find((c) => c.partyname === formData.customerName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'customerName',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer Name"
                        name="customerName"
                        error={!!fieldErrors.customerName}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.customerName} // Displays the error message
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                {/*Packing List No */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.packingListNo ? partyList.find((c) => c.partyname === formData.packingListNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'packingListNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Packing List No"
                        name="packingListNo"
                        error={!!fieldErrors.packingListNo}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.packingListNo} // Displays the error message
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                {/* Sales Order No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Sales Order No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="salesOrderNo"
                    value={formData.salesOrderNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.salesOrderNo}
                    helperText={fieldErrors.salesOrderNo}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* GST No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="GST No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="gSTNo"
                    value={formData.gSTNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.gSTNo}
                    helperText={fieldErrors.gSTNo}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* Currency */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Currency"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="customer"
                    value={formData.currency}
                    onChange={handleInputChange}
                    error={!!fieldErrors.currency}
                    helperText={fieldErrors.currency}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* Exchange Rate */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="exchangeRate"
                    label="Exchange Rate"
                    name="exchangeRate"
                    variant="outlined"
                    size="small"
                    value={formData.exchangeRate}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    inputProps={{
                      inputMode: "numeric", // Helps restrict to numbers in mobile browsers
                      pattern: "[0-9]*" // HTML validation for numeric input
                    }}
                    error={!!fieldErrors.exchangeRate}
                    helperText={fieldErrors.exchangeRate || ''}
                  />
                </div>
                {/* Location */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Location"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    error={!!fieldErrors.location}
                    helperText={fieldErrors.location}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* Billing Address */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Billing Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="billingaddress"
                    value={formData.billingaddress}
                    onChange={handleInputChange}
                    error={!!fieldErrors.billingaddress}
                    helperText={fieldErrors.billingaddress}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* Shipping Address */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Shipping Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="taxType"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    error={!!fieldErrors.shippingAddress}
                    helperText={fieldErrors.shippingAddress}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* Tax Type */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Tax Type"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="taxType"
                    value={formData.taxType}
                    onChange={handleInputChange}
                    error={!!fieldErrors.taxType}
                    helperText={fieldErrors.taxType}
                  // inputRef={processDescriptionRef}
                  />
                </div>
              </div>
              <div className="row mt-2">
                <Box sx={{ width: '100%' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value={0} label="Sales Invoice Local Details" />
                    <Tab value={1} label="Sales Invoice Summary" />
                    <Tab value={2} label="Terms and Conditions" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowQuotation} />
                          <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
                        </div>
                        {uploadOpen && (
                          <CommonBulkUpload
                            open={uploadOpen}
                            handleClose={handleBulkUploadClose}
                            title="Upload Files"
                            uploadText="Upload file"
                            downloadText="Sample File"
                            onSubmit={handleSubmit}
                            sampleFileDownload={sampleFile}
                            handleFileUpload={handleFileUpload}
                            // apiUrl={`buyerOrder/ExcelUploadForBuyerOrder?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
                            screen="Machine Master"
                          ></CommonBulkUpload>
                        )}
                        {listView ? (
                          <div className="mt-4">
                            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getMachineMasterById} />
                          </div>
                        ) : (
                          <div className="row mt-2">
                            <div className="col-lg-12">
                              <div className="table-responsive">
                                <table className="table table-bordered ">
                                  <thead>
                                    <tr style={{ backgroundColor: '#673AB7' }}>
                                      {/* <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                      </th> */}
                                      <th className="table-header px-2 py-2 text-white text-center" style={{ width: '10px' }}>Action</th>
                                      <th className="table-header px-2 py-2 text-white text-center" style={{ width: '50px' }}>S.No</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Item</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Item Desc</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Units</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Avlstkqty</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Qty</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Rate</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Tax Code</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Basic Amount</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Discount %</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Discount Amount</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Taxable Amount</th>
                                      <th className="table-header px-2 py-2 text-white text-center">SGST %</th>
                                      <th className="table-header px-2 py-2 text-white text-center">CGST %</th>
                                      <th className="table-header px-2 py-2 text-white text-center">IGST %</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Tax Amount</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Landed Value</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {quotationDetails.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="col-md-1 border px-2 py-2 text-center">
                                          <ActionButton
                                            className=" mb-2"
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                quotationDetails,
                                                setQuotationDetails,
                                                quotationDetailsTableErrors,
                                                setQuotationDetailsTableErrors
                                              )
                                            }
                                          />
                                        </td>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.item}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, item: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  item: !value ? 'Item is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.item ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.item && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].item}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.itemDesc}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, itemDesc: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  itemDesc: !value ? 'Item Desc is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.itemDesc ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.itemDesc && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].itemDesc}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.units}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, units: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  units: !value ? 'units is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.units ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.units && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].units}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.avlstkqty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, avlstkqty: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  avlstkqty: !value ? 'avlstkqty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.avlstkqty ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.avlstkqty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].avlstkqty}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.qty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  qty: !value ? 'qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.qty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].qty}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.rate}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, rate: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  rate: !value ? 'Rate is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.rate && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].rate}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.taxCode}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, taxCode: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  taxCode: !value ? 'Tax Code is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.taxCode ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.taxCode && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].taxCode}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.basicAmount}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, basicAmount: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  basicAmount: !value ? 'basic Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.basicAmount ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.basicAmount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].basicAmount}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.discount}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, discount: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  discount: !value ? 'Discount % is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.discount ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.discount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].discount}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.discountAmount}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, discountAmount: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  discountAmount: !value ? 'Discount Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.discountAmount ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.discountAmount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].discountAmount}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.taxableAmount}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, taxableAmount: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  taxableAmount: !value ? 'Taxable Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.taxableAmount ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.taxableAmount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].taxableAmount}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.sGST}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sGST: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sGST: !value ? 'SGST % is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.sGST ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.sGST && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].sGST}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.cGST}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, cGST: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  cGST: !value ? 'CGST % is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.cGST ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.cGST && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].cGST}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.iGST}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, iGST: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  iGST: !value ? 'IGST % is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.iGST ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.iGST && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].iGST}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.taxAmount}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, taxAmount: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  taxAmount: !value ? 'Tax Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.taxAmount ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.taxAmount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].taxAmount}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.landedValue}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, landedValue: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  landedValue: !value ? 'Landed Value is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.landedValue ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.landedValue && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].landedValue}
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {value === 1 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="row mt-2">
                          <>
                            <div className="row">
                              {/* Gross Amount */}
                              <div className="col-md-3 mb-3">
                                <TextField
                                  id="grossAmount"
                                  label="Gross Amount"
                                  name="grossAmount"
                                  variant="outlined"
                                  size="small"
                                  value={formData.grossAmount}
                                  onChange={handleInputChange}
                                  required
                                  fullWidth
                                  inputProps={{
                                    inputMode: "numeric", // Helps restrict to numbers in mobile browsers
                                    pattern: "[0-9]*" // HTML validation for numeric input
                                  }}
                                  error={!!fieldErrors.grossAmount}
                                  helperText={fieldErrors.grossAmount || ''}
                                />
                              </div>
                              {/* Total Tax Amount */}
                              <div className="col-md-3 mb-3">
                                <TextField
                                  id="totalTaxAmount"
                                  label="Total Tax Amount"
                                  name="totalTaxAmount"
                                  variant="outlined"
                                  size="small"
                                  value={formData.totalTaxAmount}
                                  onChange={handleInputChange}
                                  required
                                  fullWidth
                                  inputProps={{
                                    inputMode: "numeric", // Helps restrict to numbers in mobile browsers
                                    pattern: "[0-9]*" // HTML validation for numeric input
                                  }}
                                  error={!!fieldErrors.totalTaxAmount}
                                  helperText={fieldErrors.totalTaxAmount || ''}
                                />
                              </div>
                              {/* Total Amount */}
                              <div className="col-md-3 mb-3">
                                <TextField
                                  id="totalAmount"
                                  label="Total Amount"
                                  name="totalAmount"
                                  variant="outlined"
                                  size="small"
                                  value={formData.totalAmount}
                                  onChange={handleInputChange}
                                  required
                                  fullWidth
                                  inputProps={{
                                    inputMode: "numeric", // Helps restrict to numbers in mobile browsers
                                    pattern: "[0-9]*" // HTML validation for numeric input
                                  }}
                                  error={!!fieldErrors.totalAmount}
                                  helperText={fieldErrors.totalAmount || ''}
                                />
                              </div>
                              {/* Total Amount in Words */}
                              <div className="col-md-8 mb-3">
                                <FormControl fullWidth variant="filled">
                                  <TextField
                                    id="totalAmountinWords"
                                    label="Total Amount in Words"
                                    size="small"
                                    name="totalAmountinWords"
                                    value={formData.totalAmountinWords}
                                    multiline
                                    minRows={2}
                                    inputProps={{ maxLength: 30 }}
                                    onChange={handleInputChange}
                                  />
                                </FormControl>
                              </div>
                              {/* remarks */}
                              <div className="col-md-8">
                                <FormControl fullWidth variant="filled">
                                  <TextField
                                    id="remarks"
                                    label="Remarks"
                                    size="small"
                                    name="remarks"
                                    value={formData.remarks}
                                    multiline
                                    minRows={2}
                                    inputProps={{ maxLength: 30 }}
                                    onChange={handleInputChange}
                                  />
                                </FormControl>
                              </div>
                            </div>
                          </>
                        </div>
                      </div>
                    </>
                  )}
                  {value === 2 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="row mt-2">
                          <>
                            <div className="row">
                              {/* Terms */}
                              <div className="col-md-3 mb-3">
                                <TextField
                                  label="Terms"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="terms"
                                  value={formData.terms}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.terms}
                                  helperText={fieldErrors.terms}
                                // inputRef={processDescriptionRef}
                                />
                              </div>
                              {/* Description */}
                              <div className="col-md-3 mb-3">
                                <TextField
                                  label="Description"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="description"
                                  value={formData.description}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.description}
                                  helperText={fieldErrors.description}
                                // inputRef={processDescriptionRef}
                                />
                              </div>
                            </div>
                          </>
                        </div>
                      </div>
                    </>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllAdjustmentJournalById} />
          )}
        </div>
        <Dialog
          open={modalOpen}
          maxWidth={'md'}
          fullWidth={true}
          onClose={handleCloseModal}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle textAlign="center" style={{ cursor: 'move' }} id="draggable-dialog-title">
            <h6>Grid Details</h6>
          </DialogTitle>
          <DialogContent className="pb-0">
            <div className="row">
              <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr style={{ backgroundColor: '#673AB7' }}>
                        <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                          <Checkbox checked={selectAll} onChange={handleSelectAll} sx={{
                            color: 'white', // Unchecked color
                            '&.Mui-checked': {
                              color: 'white' // Checked color
                            }
                          }} />
                        </th>
                        <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                          S.No
                        </th>
                        <th className="px-2 py-2 text-white text-center">GST No *</th>
                        <th className="px-2 py-2 text-white text-center">Part Desc</th>
                        <th className="px-2 py-2 text-white text-center">SKU</th>
                        <th className="px-2 py-2 text-white text-center">Batch No</th>
                        {/* <th className="px-2 py-2 text-white text-center">Qty *</th> */}
                        <th className="px-2 py-2 text-white text-center">Avl. Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotationDetails.map((row, index) => (
                        <tr key={index}>
                          <td className="border p-0 text-center">
                            <Checkbox
                              checked={selectedRows.includes(index)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));

                              }}
                            />
                          </td>
                          <td className="text-center p-0">
                            <div style={{ paddingTop: 12 }}>{index + 1}</div>
                          </td>
                          <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                            {row.gSTNo}
                          </td>
                          <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                            {row.partDesc}
                          </td>
                          <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                            {row.sku}
                          </td>
                          <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                            {row.batchNo}
                          </td>
                          {/* <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.qty}
                                </td> */}
                          <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                            {row.availQty}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ p: '1.25rem' }} className="pt-0">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button color="secondary" onClick={handleSaveSelectedRows} variant="contained">
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>

  )
};

export default SalesInvoiceLocal;
