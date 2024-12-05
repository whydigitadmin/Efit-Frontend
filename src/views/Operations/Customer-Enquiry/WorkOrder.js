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

function WorkOrder() {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [customerNameData, setCustomerNameData] = useState([]);
  const [item, setItem] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [quotationNo, setQuotationNo] = useState([]);
  const [productionManager, setProductionManager] = useState([]);
  const [allAccountName, setAllAccountName] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [docId, setDocId] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    docDate: dayjs(),
    customer: '',
    customerPoNo: '',
    quotationNo: '',
    currency: '',
    customerDueDate: dayjs(),
    vapDueDate: dayjs(),
    productionMgr: '',

    // 2nd table
    grossAmount: '',
    netAmount: '',
    totalDiscount: '',
    narration: '',
    amtInWords: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: dayjs(),
    customerName: '',
    customerPoNo: '',
    quotationNo: '',
    currency: '',
    customerDueDate: dayjs(),
    vapDueDate: dayjs(),
    productionMgr: '',

    // 2nd table
    grossAmount: '',
    netAmount: '',
    totalDiscount: '',
    narration: '',
    amtInWords: ''
  });

  const listViewColumns = [
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'customerPoNo', header: 'Customer PO No', size: 140 },
    { quotationNo: 'quotationNo', header: 'Quotation No', size: 140 },
    { currency: 'currency', header: 'Currency', size: 140 },
    { currency: 'customerDueDate', header: 'Customer Due Date', size: 140 },
    { currency: 'vapDueDate', header: 'Vap Due Date', size: 140 },
    { currency: 'productionMgr', header: 'Production Mgr', size: 140 },
  ];
  const [companyList, setCustomerList] = useState([]);
  const [fillGridData, setFillGridData] = useState([]);

  const [quotationDetails, setQuotationDetails] = useState([
    {
      id: 1,
      partNo: '',
      partName: '',
      drawingNo: '',
      revisionNo: '',
      uom: '',
      ordQty: '',
      freeQty: '',
      availableStockQty: '',
      requiredQty: ''

    }
  ]);
  const [quotationDetailsTableErrors, setQuotationDetailsTableErrors] = useState([
    {
      id: 1,
      partNo: '',
      partName: '',
      drawingNo: '',
      revisionNo: '',
      uom: '',
      ordQty: '',
      freeQty: '',
      availableStockQty: '',
      requiredQty: ''
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

  const handleSaveSelectedRows = async () => { }
  const handleSelectAll = () => { }
  const getMachineMasterById = () => { }

  useEffect(() => {
    getAllCompany();

    getAllProductionManager(orgId);
    getAllAdjustmentJournalByOrgId();

  }, []);

  // getAllCompany
  const getAllCompany = async () => {
    try {
      const response = await apiCalls('get', `/customerenquiry/getCustomerNameAndCode?orgId=${orgId}`);
      console.log('All Company :', response);

      if (response.status === true) {
        setCustomerList(response.paramObjectsMap.partymasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  // quotationNo api

  const getAllQuotationNo = async (customerr) => {

    console.log("formData", customerr)
    try {
      const response = await apiCalls('get', `/customerenquiry/getQuotationNumber?orgId=${orgId}&customerName=${customerr}`);
      if (response.status === true) {
        const quotationNoData = response.paramObjectsMap.quotationVO
          .map(({ id, quotationNo }) => ({ id, quotationNo }));
        setQuotationNo(quotationNoData);
        return quotationNoData;
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  // Production Manager api

  const getAllProductionManager = async (orgId) => {
    try {
      const response = await apiCalls('get', `customerenquiry/getProductionManager?orgId=${orgId}`);
      if (response.status === true) {
        const productionManagerData = response.paramObjectsMap.employeeVO
          .map(({ id, productionManager }) => ({ id, productionManager }));
        setProductionManager(productionManagerData);
        return productionManagerData;
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };



  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      customerName: '',
      customerPoNo: '',
      quotationNo: '',
      currency: '',
      customerDueDate: dayjs(),
      vapDueDate: dayjs(),
      productionMgr: '',

      // 2nd table
      grossAmount: '',
      netAmount: '',
      totalDiscount: '',
      narration: '',
      amtInWords: ''
    });
    setFieldErrors({
      docDate: dayjs(),
      customerName: '',
      customerPoNo: '',
      quotationNo: '',
      currency: '',
      customerDueDate: dayjs(),
      vapDueDate: dayjs(),
      productionMgr: '',

      // 2nd table
      grossAmount: '',
      netAmount: '',
      totalDiscount: '',
      narration: '',
      amtInWords: ''
    });
    setQuotationDetails([
      {
        id: 1,
        partNo: '',
        partName: '',
        drawingNo: '',
        revisionNo: '',
        uom: '',
        ordQty: '',
        freeQty: '',
        availableStockQty: '',
        requiredQty: ''
      }
    ]);
    setQuotationDetailsTableErrors('');
    setAttachmentData([
      {
        id: 1,
        fileName: '',
        attachments: ''
      }
    ]);
    setAttachmentTableErrors('');
    setEditId('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
    let errorMessage = '';
    const alphaNumericRegex = /^[A-Za-z0-9]*$/;


    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      if (name === 'customer') {
        const selectedCustomer = companyList.find((scr) => scr.customer === value);

        console.log("customer", selectedCustomer)

        if (selectedCustomer) {
          setFormData((prevData) => ({
            ...prevData,
            currency: selectedCustomer.currency,
            customer: selectedCustomer.customer
          }));
          getAllQuotationNo(selectedCustomer.customer);
        }
      }
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
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
      partNo: '',
      partName: '',
      drawingNo: '',
      revisionNo: '',
      uom: '',
      ordQty: '',
      freeQty: '',
      availableStockQty: '',
      requiredQty: ''
    };
    setQuotationDetails([...quotationDetails, newRow]);
    setQuotationDetailsTableErrors([
      ...quotationDetailsTableErrors,
      {
        partNo: '',
        partName: '',
        drawingNo: '',
        revisionNo: '',
        uom: '',
        ordQty: '',
        freeQty: '',
        availableStockQty: '',
        requiredQty: ''
      }
    ]);
  };

  const isLastRowEmptyQuotation = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === quotationDetails) {
      return (
        !lastRow.partNo ||
        !lastRow.partName ||
        !lastRow.drawingNo ||
        !lastRow.revisionNo ||
        !lastRow.uom ||
        !lastRow.ordQty ||
        !lastRow.freeQty ||
        !lastRow.availableStockQty ||
        !lastRow.requiredQty
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
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          partName: !table[table.length - 1].partName ? 'Part name is required' : '',
          capacity: !table[table.length - 1].capacity ? 'capacity is required' : '',
          drawingNo: !table[table.length - 1].drawingNo ? 'Drawing No is required' : '',
          revisionNo: !table[table.length - 1].revisionNo ? 'Revision No is required' : '',
          uom: !table[table.length - 1].uom ? 'UOM is required' : '',
          ordQty: !table[table.length - 1].ordQty ? 'Ord Qty is required' : '',
          freeQty: !table[table.length - 1].freeQty ? ' Free Qty is required' : '',
          availableStockQty: !table[table.length - 1].availableStockQty ? 'Available Stock Qty is required' : '',
          requiredQty: !table[table.length - 1].requiredQty ? 'Required Qty is required' : '',

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
    if (!formData.customerPoNo) {
      errors.customerPoNo = 'Customer Po No  is required';
    }
    if (!formData.quotationNo) {
      errors.quotationNo = 'Quotation No is required';
    }
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.customerDueDate) {
      errors.customerDueDate = 'Customer Due Date  is required';
    }
    if (!formData.vapDueDate) {
      errors.vapDueDate = 'Vap Due Date  is required';
    }
    if (!formData.productionMgr) {
      errors.productionMgr = 'Production Mgr  is required';
    }


    // 2nd table
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
      if (!row.partNo) {
        rowErrors.partNo = 'Part No is required';
        quotationTableDataValid = false;
      }
      if (!row.partName) {
        rowErrors.partName = 'Part name is required';
        quotationTableDataValid = false;
      }
      if (!row.drawingNo) {
        rowErrors.drawingNo = 'Drawing No is required';
        quotationTableDataValid = false;
      }
      if (!row.revisionNo) {
        rowErrors.revisionNo = 'Revision No  is required';
        quotationTableDataValid = false;
      }
      if (!row.uom) {
        rowErrors.uom = 'UOM is required';
        quotationTableDataValid = false;
      }
      if (!row.ordQty) {
        rowErrors.ordQty = 'Ord Qty is required';
        quotationTableDataValid = false;
      }
      if (!row.freeQty) {
        rowErrors.freeQty = 'Free Qty is required';
        quotationTableDataValid = false;
      }
      if (!row.availableStockQty) {
        rowErrors.availableStockQty = 'Available Stock Qty is required';
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
        createdBy: loginUserName,
        finYear: finYear,
        orgId: orgId,
        accountParticularsDTO: AdjustmentJournalVO,
        adjustmentType: formData.adjustmentType,
        currency: formData.currency,
        exRate: parseInt(formData.exRate),
        refDate: dayjs(formData.refDate).format('YYYY-MM-DD'),
        refNo: formData.refNo,
        suppRefDate: dayjs(formData.suppRefDate).format('YYYY-MM-DD'),
        suppRefNo: formData.suppRefNo,
        remarks: formData.remarks
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `transaction/updateCreateAdjustmentJournal`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Work Order Updated Successfully' : 'Work Order Created successfully');
          getAllAdjustmentJournalByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Work Order creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Work Order creation failed');
      }
    } else {
      setFieldErrors(errors);
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
          docDate: adVO.docDate ? dayjs(adVO.docDate, 'YYYY-MM-DD') : dayjs(),
          customerName: adVO.customerName,
          customerPoNo: adVO.customerPoNo,
          quotationNo: adVO.quotationNo,
          currency: adVO.currency,
          customerDueDate: adVO.customerDueDate ? dayjs(adVO.customerDueDate, 'YYYY-MM-DD') : dayjs(),
          vapDueDate: adVO.vapDueDate ? dayjs(adVO.vapDueDate, 'YYYY-MM-DD') : dayjs(),
          productionMgr: adVO.productionMgr,
          orgId: adVO.orgId,
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
                {/* WO No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="docId"
                    label=" WO No"
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
                {/* Docdate */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Docdate"
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
                {/* Customer Name */}
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customer}>
                    <InputLabel id="customer">Customer Name</InputLabel>
                    <Select
                      labelId="customer"
                      label="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      name="customer"
                    >
                      {companyList?.map((row) => (
                        <MenuItem key={row.id} value={row.customer}>
                          {row.customer}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.customer && <FormHelperText>{fieldErrors.customer}</FormHelperText>}
                  </FormControl>
                </div>
                {/* <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={customer}
                    getOptionLabel={(option) => option.customer || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.customer ? customer.find((c) => c.item === formData.customer) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'customer',
                          value: newValue ? newValue.customer : '',
                        },
                      });
                    }}

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer Name"
                        name="customer"
                        error={!!fieldErrors.customer}
                        helperText={fieldErrors.customer}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div> */}
                {/* Customer PO No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="customerPoNo"
                    label='Customer Po No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerPoNo"
                    value={formData.customerPoNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerPoNo ? fieldErrors.customerPoNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.customerPoNo}
                  />
                </div>
                {/* Quotation No */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={quotationNo}
                    getOptionLabel={(option) => option.quotationNo || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.quotationNo ? quotationNo.find((c) => c.quotationNo === formData.quotationNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'quotationNo',
                          value: newValue ? newValue.quotationNo : '',
                        },
                      });
                    }}

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Quotation No"
                        name="quotationNo"
                        error={!!fieldErrors.quotationNo}
                        helperText={fieldErrors.quotationNo}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                {/* Currency */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Currency"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    error={!!fieldErrors.currency}
                    helperText={fieldErrors.currency}
                    disabled
                  />
                </div>
                {/* Customer Due Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Customer Due Date"
                        value={formData.customerDueDate ? dayjs(formData.customerDueDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('customerDueDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.customerDueDate}
                        helperText={fieldErrors.customerDueDate ? fieldErrors.customerDueDate : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                {/* Vap Due Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label={
                          <span>
                            Vap Due Date <span className="asterisk">*</span>
                          </span>
                        }
                        value={formData.vapDueDate ? dayjs(formData.vapDueDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('vapDueDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.vapDueDate}
                        helperText={fieldErrors.validTill ? fieldErrors.vapDueDate : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                {/* Production Mgr */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={productionManager}
                    getOptionLabel={(option) => option.productionManager || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.productionManager ? productionManager.find((c) => c.productionManager === formData.productionManager) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'productionManager',
                          value: newValue ? newValue.productionManager : '',
                        },
                      });
                    }}

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Production Manager"
                        name="productionManager"
                        error={!!fieldErrors.productionManager}
                        helperText={fieldErrors.productionManager}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
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
                    <Tab value={0} label="Quotation Details" />
                    <Tab value={1} label="Attachment" />
                    <Tab value={2} label="Summary" />
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
                                      <th className="table-header px-2 py-2 text-white text-center">Part No</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Part name</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Drawing No</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Revision No</th>
                                      <th className="table-header px-2 py-2 text-white text-center">
                                        {
                                          <span>
                                            UOM <span className="asterisk">*</span>
                                          </span>
                                        }
                                      </th>
                                      <th className="table-header px-2 py-2 text-white text-center">
                                        {
                                          <span>
                                            Ord Qty <span className="asterisk">*</span>
                                          </span>
                                        }
                                      </th>
                                      <th className="table-header px-2 py-2 text-white text-center">Free Qty</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Available Stock Qty</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Required Qty</th>
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
                                            value={row.partNo}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, partNo: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  partNo: !value ? 'Part No is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.partNo && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].partNo}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.partName}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, partName: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  partName: !value ? 'Part name is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.partName ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.partName && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].partName}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.drawingNo}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, drawingNo: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  drawingNo: !value ? 'Drawing No is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.drawingNo ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.drawingNo && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].drawingNo}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.revisionNo}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, revisionNo: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  revisionNo: !value ? 'Revision No is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.revisionNo ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.revisionNo && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].revisionNo}
                                            </div>
                                          )}
                                        </td><td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.uom}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, uom: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  uom: !value ? 'UOM is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.uom ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.uom && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].uom}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.ordQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, ordQty: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  ordQty: !value ? 'Ord Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.ordQty ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.ordQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].ordQty}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.freeQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, freeQty: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  freeQty: !value ? 'Free Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.freeQty ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.freeQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].freeQty}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.availableStockQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, availableStockQty: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  availableStockQty: !value ? 'Available Stock Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.availableStockQty ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.availableStockQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].availableStockQty}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.requiredQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, requiredQty: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  requiredQty: !value ? 'Available Stock Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.requiredQty ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.requiredQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].requiredQty}
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
                                      Template
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                      Description
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
                  {value === 2 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="row mt-2">
                          <>
                            <div className="row">
                              <div className="col-md-12 mb-3">
                                <TextField
                                  label="Customer Special Requirement"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="grossAmount"
                                  value={formData.grossAmount}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.grossAmount}
                                  helperText={fieldErrors.grossAmount}
                                  multiline
                                  rows={4} // Adjust the number of rows as needed
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

  )
};

export default WorkOrder;
