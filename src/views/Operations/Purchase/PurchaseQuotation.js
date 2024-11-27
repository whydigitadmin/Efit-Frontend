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

function PurchaseQuotation () {
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
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    docDate: dayjs(),
    customerName:'',
    workOrderNo:'',
    enquiryNo:'',
    enquiryDate:null,
    supplierName:'',
    supplierId:'',
    validTill:null,
    kindAttention:'',
    taxCode:'',
    contactPerson:'',
    contactNo:'',
    qStatus:'',
    // 2nd table
    grossAmount:'',
    netAmount:'',
    totalDiscount:'',
    narration:'',
    amtInWords:''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: dayjs(),
    customerName:'',
    workOrderNo:'',
    enquiryNo:'',
    enquiryDate: null,
    supplierName:'',
    supplierId:'',
    validTill: null,
    kindAttention:'',
    taxCode:'',
    contactPerson:'',
    contactNo:'',
    qStatus:'',
    // 2nd table
    grossAmount:'',
    netAmount:'',
    totalDiscount:'',
    narration:'',
    amtInWords:''
  });

  const listViewColumns = [
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'docId', header: 'Document No', size: 140 }
  ];

  const [quotationDetails, setQuotationDetails] = useState([
    {
      id: 1,
      item:'',
      itemDescription:'',
      unit:'',
      quantity:'',
      unitPrice:'',
      basicPrice:'',
      discount:'',
      discountPrice:'',
      quoteAmount:''
    }
  ]);
  const [quotationDetailsTableErrors, setQuotationDetailsTableErrors] = useState([
    {
      id: 1,
      item:'',
      itemDescription:'',
      unit:'',
      quantity:'',
      unitPrice:'',
      basicPrice:'',
      discount:'',
      discountPrice:'',
      quoteAmount:''
    }
  ]);
  const [attachmentData, setAttachmentData] = useState([
    {
      id: 1,
      fileName: '',
      attachments: ''
    }
  ]);
  const [attachmentTableErrors, setAttachmentTableErrors] = useState([
    {
      fileName: '',
      attachments: '' 
    }
  ]);
  // const [file, setFile] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };
 
  const handleFileChange = (event) => {
    attachmentData.attachments(event.target.files[0]);
  };

  const handleSaveSelectedRows = async () => {}
  const handleSelectAll = () => {}
  const getMachineMasterById = () => {}
  useEffect(() => {
    
    // getAdjustmentJournalDocId();
    // getAllAdjustmentJournalByOrgId();
    // getAllAccountName();
  }, []);

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      customerName:'',
      workOrderNo:'',
      enquiryNo:'',
      enquiryDate: null,
      supplierName:'',
      supplierId:'',
      validTill: null,
      kindAttention:'',
      taxCode:'',
      contactPerson:'',
      contactNo:'',
      qStatus:'',
      // 2nd table
      grossAmount:'',
      netAmount:'',
      totalDiscount:'',
      narration:'',
      amtInWords:''
    });
    setFieldErrors({
      docDate: dayjs(),
    customerName:'',
    workOrderNo:'',
    enquiryNo:'',
    enquiryDate: null,
    supplierName:'',
    supplierId:'',
    validTill: null,
    kindAttention:'',
    taxCode:'',
    contactPerson:'',
    contactNo:'',
    qStatus:'',
    // 2nd table
    grossAmount:'',
    netAmount:'',
    totalDiscount:'',
    narration:'',
    amtInWords:''
    });
    setQuotationDetails([
      { id: 1,
        item:'',
      itemDescription:'',
      unit:'',
      quantity:'',
      unitPrice:'',
      basicPrice:'',
      discount:'',
      discountPrice:'',
      quoteAmount:''
      }
    ]);
    setQuotationDetailsTableErrors('');
    setAttachmentData([
      { id: 1,
        fileName: '',
        attachments: '' 
       }
    ]);
    setAttachmentTableErrors('');
    setEditId('');
    getAdjustmentJournalDocId();
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';

    
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    if (!errorMessage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === 'text' || type === 'textarea' ? value.toUpperCase() : value
      }));

      // Preserve cursor position for text inputs
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
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
      item:'',
      itemDescription:'',
      unit:'',
      quantity:'',
      unitPrice:'',
      basicPrice:'',
      discount:'',
      discountPrice:'',
      quoteAmount:''
    };
    setQuotationDetails([...quotationDetails, newRow]);
    setQuotationDetailsTableErrors([
      ...quotationDetailsTableErrors,
      { 
      item:'',
      itemDescription:'',
      unit:'',
      quantity:'',
      unitPrice:'',
      basicPrice:'',
      discount:'',
      discountPrice:'',
      quoteAmount:''
    }
    ]);
  };

  const isLastRowEmptyQuotation = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === quotationDetails) {
      return (
        !lastRow.item ||
        !lastRow.itemDescription ||
        !lastRow.unit ||
        !lastRow.quantity ||
        !lastRow.unitPrice ||
        !lastRow.basicPrice ||
        !lastRow.discount ||
        !lastRow.discountPrice ||
        !lastRow.quoteAmount
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
          item: !table[table.length - 1].item ? 'Item is required' : '',
          itemDescription: !table[table.length - 1].itemDescription ? 'Item Desc is required' : '', capacity: !table[table.length - 1].capacity ? 'capacity is required' : '',
          unit: !table[table.length - 1].unit ? 'Unit is required' : '',
          unitPrice: !table[table.length - 1].unitPrice ? 'Unit Price is required' : '',
          quantity: !table[table.length - 1].quantity ? 'Quantity is required' : '',
          basicPrice: !table[table.length - 1].basicPrice ? 'Basic Price is required' : '',
          discount: !table[table.length - 1].discount ? 'Discount is required' : '',
          discountPrice: !table[table.length - 1].discountPrice ? 'Discount Price is required' : '',
          quoteAmount: !table[table.length - 1].quoteAmount ? 'Quote Amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleAddRowAttachment = () => {
    if (isLastRowEmptyAttachment(attachmentData)) {
      displayRowErrorAttachment(attachmentData);
      return;
    }
    const newRow = {
      id: Date.now(),
      fileName: '',
      attachments: '' 
    };
    setAttachmentData([...attachmentData, newRow]);
    setAttachmentTableErrors([
      ...attachmentTableErrors,
      { 
        fileName: '',
        attachments: '' 
      }
    ]);
  };

  const isLastRowEmptyAttachment = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === attachmentData) {
      return (
        !lastRow.fileName ||
        !lastRow.attachments
      );
    }
    return false;
  };

  const displayRowErrorAttachment = (table) => {
    if (table === attachmentData) {
      setAttachmentTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          fileName: !table[table.length - 1].fileName ? 'File Name is required' : '',
          attachments: !table[table.length - 1].attachments ? 'Attachments is required' : ''
        };
        return newErrors;
      });
    }
  };

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
      errors.customerName = 'Customer Name is required';
    }
    if (!formData.workOrderNo) {
      errors.workOrderNo = 'Work Order No is required';
    }
    if (!formData.enquiryNo) {
      errors.enquiryNo = 'Enquiry No is required';
    }
    if (!formData.enquiryDate) {
      errors.enquiryDate = 'Enquiry Date  is required';
    }
    if (!formData.supplierName) {
      errors.supplierName = 'Supplier Name is required';
    }
    if (!formData.supplierId) {
      errors.supplierId = 'Supplier Id is required';
    }
    if (!formData.validTill) {
      errors.validTill = 'Valid Til is required';
    }
    if (!formData.kindAttention) {
      errors.kindAttention = 'Kind Attention is required';
    }
    if (!formData.taxCode) {
      errors.taxCode = 'Tax Code  is required';
    }
    if (!formData.contactPerson) {
      errors.contactPerson = 'Contact Person is required';
    }
    if (!formData.contactNo) {
      errors.contactNo = 'Contact No  is required';
    }
    if (!formData.qStatus) {
      errors.qStatus = 'qStatus is required';
    }
    if (!formData.grossAmount) {
      errors.grossAmount = 'Gross Amount is required';
    }
    if (!formData.netAmount) {
      errors.netAmount = 'Net Amount is required';
    }
    if (!formData.totalDiscount) {
      errors.totalDiscount = 'Total Discount is required';
    }
    if (!formData.narration) {
      errors.narration = 'Narration  is required';
    }
    if (!formData.amtInWords) {
      errors.amtInWords = 'Amount In Words is required';
    }
    

    let quotationTableDataValid = true;
    const newQuotationTableErrors = quotationDetails.map((row) => {
      const rowErrors = {};
      if (!row.item) {
        rowErrors.item = 'Item is required';
        quotationTableDataValid = false;
      }
      if (!row.itemDescription) {
        rowErrors.itemDescription = 'Item Desc is required';
        quotationTableDataValid = false;
      }
      if (!row.unit) {
        rowErrors.unit = 'Unit is required';
        quotationTableDataValid = false;
      }
      if (!row.quantity) {
        rowErrors.quantity = 'Quantity is required';
        quotationTableDataValid = false;
      }
      if (!row.unitPrice) {
        rowErrors.unitPrice = 'Unit Price  is required';
        quotationTableDataValid = false;
      }
      if (!row.basicPrice) {
        rowErrors.basicPrice = 'Basic Price is required';
        quotationTableDataValid = false;
      }
      if (!row.discount) {
        rowErrors.discount = 'Discount is required';
        quotationTableDataValid = false;
      }
      if (!row.discountPrice) {
        rowErrors.discountPrice = 'Discount Price is required';
        quotationTableDataValid = false;
      }
      if (!row.quoteAmount) {
        rowErrors.quoteAmount = 'Quote Amount is required';
        quotationTableDataValid = false;
      }
      return rowErrors;
    });
    let detailTableDataValid2 = true;
    const newAttachmentTableErrors = quotationDetails.map((row) => {
      const rowErrors = {};
      if (!row.fileName) {
        rowErrors.fileName = 'File Name is required';
        detailTableDataValid2 = false;
      }
      if (!row.attachments) {
        rowErrors.attachments = 'Attachment is required';
        detailTableDataValid2 = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);
    setQuotationDetailsTableErrors(newQuotationTableErrors);
    setAttachmentTableErrors(newAttachmentTableErrors);

    if (Object.keys(errors).length === 0 && (detailTableDataValid2 && quotationTableDataValid) ) {
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
      const AdjustmentJournalVO = attachmentData.map((row) => ({
        ...(editId && { id: row.id }),
        accountsName: row.accountName,
        creditAmount: parseInt(row.creditAmount),
        debitAmount: parseInt(row.debitAmount),
        debitBase: parseInt(row.debitBase),
        creditBase: parseInt(row.creditBase),
        subLedgerCode: row.subLedgerCode,
        subledgerName: row.subledgerName
  }));
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
        //       remarks: formData.remarks
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
              const response = await apiCalls('put', `transaction/updateCreateAdjustmentJournal`, saveFormData);
              if (response.status === true) {
                console.log('Response:', response);
                showToast('success', editId ? 'Adjustment Journal Updated Successfully' : 'Adjustment Journal Created successfully');
                getAllAdjustmentJournalByOrgId();
                handleClear();
              } else {
                showToast('error', response.paramObjectsMap.message || 'Adjustment Journal creation failed');
              }
            } catch (error) {
              console.error('Error:', error);
              showToast('error', 'Adjustment Journal creation failed');
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
          // remarks: adVO.remarks,
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
              <div className="col-md-3 mb-3">
                  <TextField
                    id="docId"
                    label="Document No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    value={docId}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Document Date"
                        value={formData.docDate}
                        onChange={(date) => handleDateChange('docDate', date)}
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                    <InputLabel id="customerName">
                      {
                        <span>
                          Customer Name <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="customerName"
                      id="customerName"
                      label="customerName"
                      onChange={handleInputChange}
                      name="customerName"
                      value={formData.customerName}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.customerName}>
                          {item.customerName}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.customerName && <FormHelperText style={{ color: 'red' }}>Customer Name is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.workOrderNo}>
                    <InputLabel id="workOrderNo">
                      {
                        <span>
                          Work Order No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="workOrderNo"
                      id="workOrderNo"
                      label="workOrderNo"
                      onChange={handleInputChange}
                      name="workOrderNo"
                      value={formData.workOrderNo}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.workOrderNo}>
                          {item.workOrderNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.workOrderNo && <FormHelperText style={{ color: 'red' }}>Work Order No is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.enquiryNo}>
                    <InputLabel id="enquiryNo">
                      {
                        <span>
                          Enquiry No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="enquiryNo"
                      id="enquiryNo"
                      // label="enquiryNo"
                      onChange={handleInputChange}
                      name="enquiryNo"
                      value={formData.enquiryNo}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.enquiryNo}>
                          {item.enquiryNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.enquiryNo && <FormHelperText style={{ color: 'red' }}>Enquiry No is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Enquiry Date"
                      value={formData.enquiryDate ? dayjs(formData.enquiryDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('enquiryDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.enquiryDate}
                      helperText={fieldErrors.enquiryDate ? fieldErrors.enquiryDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="supplierName"
                    label={
                      <span>
                        Supplier Name <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.supplierName ? fieldErrors.supplierName : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.supplierName}
                  />
                </div>
                
                <div className="col-md-3 mb-3">
                  <TextField
                    id="supplierId"
                    label= 'Supplier Id'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.supplierId ? fieldErrors.supplierId : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.supplierId}
                  />
                </div>
                <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Valid Till"
                      value={formData.validTill ? dayjs(formData.validTill, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('validTill', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.validTill}
                      helperText={fieldErrors.validTill ? fieldErrors.validTill : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.kindAttention}>
                    <InputLabel id="kindAttention">
                      {
                        <span>
                          Kind Attention <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="kindAttention"
                      id="kindAttention"
                      label="kindAttention"
                      onChange={handleInputChange}
                      name="kindAttention"
                      value={formData.kindAttention}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.kindAttention}>
                          {item.kindAttention}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.kindAttention && <FormHelperText style={{ color: 'red' }}>Kind Attention is required</FormHelperText>}
                  </FormControl>
                </div>
                
                <div className="col-md-3 mb-3">
                  <TextField
                    id="taxCode"
                    label= 'Tax Code'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="taxCode"
                    value={formData.taxCode}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.taxCode ? fieldErrors.taxCode : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.taxCode}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.contactPerson}>
                    <InputLabel id="contactPerson">
                      {
                        <span>
                          Contact Person <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="contactPerson"
                      id="contactPerson"
                      label="contactPerson"
                      onChange={handleInputChange}
                      name="contactPerson"
                      value={formData.contactPerson}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.contactPerson}>
                          {item.contactPerson}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.contactPerson && <FormHelperText style={{ color: 'red' }}>Contact Person is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="contactNo"
                    label= 'Contact No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.contactNo ? fieldErrors.contactNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.contactNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.qStatus}>
                    <InputLabel id="qStatus">
                      {
                        <span>
                          QStatus <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="qStatus"
                      id="qStatus"
                      label="qStatus"
                      onChange={handleInputChange}
                      name="qStatus"
                      value={formData.qStatus}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.qStatus}>
                          {item.qStatus}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.qStatus && <FormHelperText style={{ color: 'red' }}>QStatus is required</FormHelperText>}
                  </FormControl>
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
                    <Tab value={0} label="Quotation Details" />
                    <Tab value={1} label="Summary" />
                    <Tab value={2} label="Attachment" />
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
                                        <th className="table-header px-2 py-2 text-white text-center"style={{ width: '10px' }}>Action</th>
                                        <th className="table-header px-2 py-2 text-white text-center"style={{ width: '50px' }}>S.No</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Item</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Item Description</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Unit</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Quantity</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Unit Price</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Basic Price</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Discount %</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Discount Amount</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Quote Amount</th>
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
                                              value={row.itemDescription}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setQuotationDetails((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, itemDescription: value } : r))
                                                );
                                                setQuotationDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    itemDescription: !value ? 'Item Desp is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={quotationDetailsTableErrors[index]?.itemDescription ? 'error form-control' : 'form-control'}
                                            />
                                            {quotationDetailsTableErrors[index]?.itemDescription && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {quotationDetailsTableErrors[index].itemDescription}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.unit}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setQuotationDetails((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r))
                                                );
                                                setQuotationDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    unit: !value ? 'Unit is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={quotationDetailsTableErrors[index]?.unit ? 'error form-control' : 'form-control'}
                                            />
                                            {quotationDetailsTableErrors[index]?.unit && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {quotationDetailsTableErrors[index].unit}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.quantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setQuotationDetails((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, quantity: value } : r))
                                                );
                                                setQuotationDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    quantity: !value ? 'Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={quotationDetailsTableErrors[index]?.quantity ? 'error form-control' : 'form-control'}
                                            />
                                            {quotationDetailsTableErrors[index]?.quantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {quotationDetailsTableErrors[index].quantity}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.unitPrice}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setQuotationDetails((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, unitPrice: value } : r))
                                                );
                                                setQuotationDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    unitPrice: !value ? 'Unit Price is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={quotationDetailsTableErrors[index]?.unitPrice ? 'error form-control' : 'form-control'}
                                            />
                                            {quotationDetailsTableErrors[index]?.unitPrice && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {quotationDetailsTableErrors[index].unitPrice}
                                              </div>
                                            )}
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.basicPrice}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setQuotationDetails((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, basicPrice: value } : r))
                                                );
                                                setQuotationDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    basicPrice: !value ? 'Basic Price is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={quotationDetailsTableErrors[index]?.basicPrice ? 'error form-control' : 'form-control'}
                                            />
                                            {quotationDetailsTableErrors[index]?.basicPrice && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {quotationDetailsTableErrors[index].basicPrice}
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
                                                    discount: !value ? 'Discount is required' : ''
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
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.discountPrice}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setQuotationDetails((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, discountPrice: value } : r))
                                                );
                                                setQuotationDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    discountPrice: !value ? 'Discount Price is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={quotationDetailsTableErrors[index]?.discountPrice ? 'error form-control' : 'form-control'}
                                            />
                                            {quotationDetailsTableErrors[index]?.discountPrice && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {quotationDetailsTableErrors[index].discountPrice}
                                              </div>
                                            )}
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.quoteAmount}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setQuotationDetails((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, quoteAmount: value } : r))
                                                );
                                                setQuotationDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    quoteAmount: !value ? 'Quote Amount is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={quotationDetailsTableErrors[index]?.quoteAmount ? 'error form-control' : 'form-control'}
                                            />
                                            {quotationDetailsTableErrors[index]?.quoteAmount && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {quotationDetailsTableErrors[index].quoteAmount}
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
                          <div className="col-md-3 mb-3">
                              <TextField
                                label="Gross Amount"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="grossAmount"
                                value={formData.grossAmount}
                                onChange={handleInputChange}
                                error={!!fieldErrors.grossAmount}
                                helperText={fieldErrors.grossAmount}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Net Amount"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="netAmount"
                                value={formData.netAmount}
                                onChange={handleInputChange}
                                error={!!fieldErrors.netAmount}
                                helperText={fieldErrors.netAmount}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Total Discount"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="totalDiscount"
                                value={formData.totalDiscount}
                                onChange={handleInputChange}
                                error={!!fieldErrors.totalDiscount}
                                helperText={fieldErrors.totalDiscount}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Narration"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="narration"
                                value={formData.narration}
                                onChange={handleInputChange}
                                error={!!fieldErrors.narration}
                                helperText={fieldErrors.narration}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Amount In Words"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="amtInWords"
                                value={formData.amtInWords}
                                onChange={handleInputChange}
                                error={!!fieldErrors.amtInWords}
                                helperText={fieldErrors.amtInWords}
                              />
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
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowAttachment} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-7">
                          <div className="table-responsive">
                            <table className="table table-bordered ">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                    FileName
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '100px' }}>
                                    Attachments
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {attachmentData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            attachmentData,
                                            setAttachmentData,
                                            attachmentTableErrors,
                                            setAttachmentTableErrors
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.fileName}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setAttachmentData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, fileName: value } : r))
                                          );
                                          setAttachmentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              fileName: !value ? 'File Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={attachmentTableErrors[index]?.fileName ? 'error form-control' : 'form-control'}
                                      />
                                      {attachmentTableErrors[index]?.fileName && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {attachmentTableErrors[index].fileName}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2" onClick={handleBulkUploadOpen}>
                                      <input
                                        type="text"
                                        value={row.attachments}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setAttachmentData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, attachments: value } : r))
                                          );
                                          setAttachmentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              attachments: !value ? 'Attachment is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={attachmentTableErrors[index]?.attachments ? 'error form-control' : 'form-control'}
                                      />
                                      {attachmentTableErrors[index]?.attachments && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {attachmentTableErrors[index].attachments}
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
                                <Checkbox checked={selectAll} onChange={handleSelectAll}  sx={{
                                  color: 'white', // Unchecked color
                                  '&.Mui-checked': {
                                    color: 'white' // Checked color
                                  }}} />
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                S.No
                              </th>
                              <th className="px-2 py-2 text-white text-center">Part No *</th>
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
                                  {row.partNo}
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
  
)};

export default PurchaseQuotation;
