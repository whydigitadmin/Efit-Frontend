import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { showToast } from 'utils/toast-component';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormHelperText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import dayjs from 'dayjs';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { date } from 'yup';

const RouteCardEntry = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();
  const [customer, setCustomer] = useState([]);
  const [workOrder, setWorkOrder] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    routeCardNo: '',
    docDate: dayjs(),
    customerName: '',
    woNo: '',
    fgPartName: '',
    fgPartDescription: '',
    fgQty: '',
    batchQty: '',
    rmType: '',
    rmSize: '',
    rmBatchNo: '',
    rmQty: '',
    narration: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    routeCardNo: '',
    docDate: dayjs(),
    customerName: '',
    woNo: '',
    fgPartName: '',
    fgPartDescription: '',
    fgQty: '',
    batchQty: '',
    rmType: '',
    rmSize: '',
    rmBatchNo: '',
    rmQty: '',
    narration: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [routeCardEntryDetailsData, setRouteCardEntryDetailsData] = useState([
    {
      id: 1,
      operationDesc: '',
      machineCenter: '',
      processStart: null,
      processEnd: null,
      acceptedQty: '',
      qtyRework: '',
      reject: '',
      optrSign: '',
      remarks: ''
    }
  ]);
  const [routeCardEntryErrors, setRouteCardEntryErrors] = useState([
    {
      operationDesc: '',
      machineCenter: '',
      processStart: null,
      processEnd: null,
      acceptedQty: '',
      qtyRework: '',
      reject: '',
      optrSign: '',
      remarks: ''
    }
  ]);

  const [routeCardEngDeptData, setRouteCardEngDeptData] = useState([
    {
      preparedBy: '',
      prepareDate: null,
      approvedByManager: '',
      approvedDate: null
    }
  ]);
  const [routeCardEngDeptErrors, setRouteCardEngDeptErrors] = useState([
    {
      preparedBy: '',
      prepareDate: null,
      approvedByManager: '',
      approvedDate: null
    }
  ]);

  const [routeCardClosureData, setRouteCardClosureData] = useState([
    {
      qaManagerSign: '',
      qaManagerDate: null,
      plantManagerSign: '',
      plantManagerDate: null
    }
  ]);
  const [routeCardClosureErrors, setRouteCardClosureErrors] = useState([
    {
      qaManagerSign: '',
      qaManagerDate: null,
      plantManagerSign: '',
      plantManagerDate: null
    }
  ]);

  const [routeCardEntrySummaryData, setRouteCardEntrySummaryData] = useState([
    {
      invoice: '',
      invoiceDate: null,
      quantity: '',
      stockQuantity: ''
    }
  ]);
  const [routeCardEntrySummaryErrors, setRouteCardEntrySummaryErrors] = useState([
    {
      invoice: '',
      invoiceDate: null,
      quantity: '',
      stockQuantity: ''
    }
  ]);

  const [attachmentsData, setAttachmentsData] = useState([
    {
      fileAttachment: ''
    }
  ]);
  const [attachmentsErrors, setAttachmentsErrors] = useState([
    {
      fileAttachment: ''
    }
  ]);

  // List

   const [listViewData, setListViewData] = useState([]);

  const columns = [
    { accessorKey: 'customerName', header: 'List Code', size: 140 },
    { accessorKey: 'customerName', header: 'Description', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

    // customerName API
    const getCustomerName = async () => {
      try {
        const response = await apiCalls('get', `/inventory/getCustomerNameAndCodeFromRouteCardEntry?orgId=${orgId}`);
  
        // Update state with the new docId
        setCustomer(response.paramObjectsMap.routeCardEntryVO);
  
        // Optionally update formData if docId is part of it
        setFormData((prevFormData) => ({
          ...prevFormData,
        }));
      } catch (error) {
        console.error('Error fetching gate passes:', error);
      }
    };

     // WorkOrder API
     const getWorkOrderNoFromRouteCardEntry = async (customerCode) => {
      try {
        const response = await apiCalls('get', `/inventory/getWorkOrderNoFromRouteCardEntry?customerCode=${customerCode}&orgId=${orgId}`);
  
        // Update state with the new docId
        setWorkOrder(response.paramObjectsMap.routeCardEntryVO);
  
        // Optionally update formData if docId is part of it
        setFormData((prevFormData) => ({
          ...prevFormData,
        }));
      } catch (error) {
        console.error('Error fetching gate passes:', error);
      }
    };


  useEffect(() => {
    getRouteCardEntry();
    getCustomerName();
    getWorkOrderNoFromRouteCardEntry();
  }, []);

  // List API
  const getRouteCardEntry = async () => {
    try {
      const response = await apiCalls('get', `/inventory/getRouteCardEntryByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.routeCardEntryVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };
  const handleBulkUploadOpen = () => {
    setUploadOpen(true); // Open dialog
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false); // Close dialog
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };

  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        handleAddRow();
      }
    }
  };

  // Route Card Entry Details
  const handleAddRow = () => {
    if (isLastRowEmpty(routeCardEntryDetailsData)) {
      displayRowError(routeCardEntryDetailsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      operationDesc: '',
      machineCenter: '',
      processStart: null,
      processEnd: null,
      acceptedQty: '',
      qtyRework: '',
      reject: '',
      optrSign: '',
      remarks: ''
    };
    setRouteCardEntryDetailsData([...routeCardEntryDetailsData, newRow]);
    setRouteCardEntryErrors([
      ...routeCardEntryErrors,
      {
        operationDesc: '',
        machineCenter: '',
        processStart: null,
        processEnd: null,
        acceptedQty: '',
        qtyRework: '',
        reject: '',
        optrSign: '',
        remarks: ''
      }
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === routeCardEntryDetailsData) {
      return (
        !lastRow.operationDesc ||
        !lastRow.machineCenter ||
        !lastRow.processStart ||
        !lastRow.processEnd ||
        !lastRow.acceptedQty ||
        !lastRow.qtyRework ||
        !lastRow.reject ||
        !lastRow.optrSign ||
        !lastRow.remarks
      );
    }
    return false;
  };
  const displayRowError = (table) => {
    if (table === routeCardEntryDetailsData) {
      setRouteCardEntryErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          operationDesc: !table[table.length - 1].operationDesc ? 'Operation Description is required' : '',
          machineCenter: !table[table.length - 1].machineCenter ? 'Machine/Work Center is required' : '',
          processStart: !table[table.length - 1].processStart ? 'Process Start is required' : '',
          processEnd: !table[table.length - 1].processEnd ? 'Process End is required' : '',
          acceptedQty: !table[table.length - 1].acceptedQty ? 'Accepted Qty is required' : '',
          qtyRework: !table[table.length - 1].qtyRework ? 'Qty Rework is required' : '',
          reject: !table[table.length - 1].reject ? 'Reject is required' : '',
          optrSign: !table[table.length - 1].optrSign ? 'OPTR Sign is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : ''
        };
        return newErrors;
      });
    }
  };
  // Delete Row Button
  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  // handle File Attach Add Row
  const handleFileAttachAddRow = () => {
    if (isLastRowEmptyFileAttach(attachmentsData)) {
      displayRowFileAttachError(attachmentsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      fileAttachment: '',
    };
    setAttachmentsData([...attachmentsData, newRow]);
    setAttachmentsErrors([...attachmentsErrors, { fileAttachment: '' }]);
  };
  const isLastRowEmptyFileAttach = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === attachmentsData) {
      return !lastRow.fileAttachment;
    }
    return false;
  };

  const displayRowFileAttachError = (table) => {
    if (table === attachmentsData) {
      setAttachmentsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          fileAttachment: !table[table.length - 1].fileAttachment ? 'File Attachments is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteFileAttachRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    // If the row exists, proceed to delete
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  // handle Clear

  const handleClear = () => {
    setFormData({
      routeCardNo: '',
      docDate: dayjs(),
      customerName: '',
      woNo: '',
      fgPartName: '',
      fgPartDescription: '',
      fgQty: '',
      batchQty: '',
      rmType: '',
      rmSize: '',
      rmBatchNo: '',
      rmQty: '',
      narration: ''
    });
    setFieldErrors({});
    setRouteCardEntryDetailsData([
      {
        id: 1,
        operationDesc: '',
        machineCenter: '',
        processStart: null,
        processEnd: null,
        acceptedQty: '',
        qtyRework: '',
        reject: '',
        optrSign: '',
        remarks: ''
      }
    ]);
    setRouteCardEntryErrors('');
    setRouteCardEngDeptData([
      {
        preparedBy: '',
        prepareDate: null,
        approvedByManager: '',
        approvedDate: null
      }
    ]);
    setRouteCardEngDeptErrors('');
    setRouteCardClosureData([
      {
        qaManagerSign: '',
        qaManagerDate: null,
        plantManagerSign: '',
        plantManagerDate: null
      }
    ]);
    setRouteCardClosureErrors('');
    setRouteCardEntrySummaryData([
      {
        invoice: '',
        invoiceDate: null,
        quantity: '',
        stockQuantity: ''
      }
    ]);
    setRouteCardEntrySummaryErrors('');
    setAttachmentsData([
      {
        fileAttachment: ''
      }
    ]);
    setAttachmentsErrors('');
    setEditId('');
  };
  // handle Save
  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.routeCardNo) errors.routeCardNo = 'Route Card No is required';
    if (!formData.routeDate) errors.routeDate = 'Route Date is required';
    if (!formData.customerName) errors.customerName = 'Customer Name is required';
    if (!formData.woNo) errors.woNo = 'WO No is required';
    if (!formData.fgPartName) errors.fgPartName = 'Fg Part Name is required';
    if (!formData.fgPartDescription) errors.fgPartDescription = 'Fg Part Description is required';
    if (!formData.fgQty) errors.fgQty = 'Fg Qty is required';
    if (!formData.batchQty) errors.batchQty = 'Batch Qty is required';
    if (!formData.rmType) errors.rmType = 'Rm Type is required';
    if (!formData.rmSize) errors.rmSize = 'Rm Size is required';
    if (!formData.rmBatchNo) errors.rmBatchNo = 'Rm Batch No is required';
    if (!formData.rmQty) errors.rmQty = 'Rm Qty No is required';
    if (!formData.narration) errors.narration = 'Narration is required';
    // route Card Entry
    let routeCardEntryDetailsDataValid = true;
    if (!routeCardEntryDetailsData || !Array.isArray(routeCardEntryDetailsData) || routeCardEntryDetailsData.length === 0) {
      routeCardEntryDetailsDataValid = false;
      setRouteCardEntryErrors([{ general: 'Purchase Order Details Data is required' }]);
    } else {
      const newTableErrors = routeCardEntryDetailsData.map((row, index) => {
        const rowErrors = {};
        if (!row.operationDesc) {
          rowErrors.operationDesc = 'Operation Description is required';
          routeCardEntryDetailsDataValid = false;
        }
        if (!row.machineCenter) {
          rowErrors.machineCenter = 'Machine/Work Center is required';
          routeCardEntryDetailsDataValid = false;
        }
        if (!row.processStart) {
          rowErrors.processStart = 'Process Start is required';
          routeCardEntryDetailsDataValid = false;
        }
        if (!row.processEnd) {
          rowErrors.processEnd = 'Process End is required';
          routeCardEntryDetailsDataValid = false;
        }
        if (!row.acceptedQty) {
          rowErrors.acceptedQty = 'Accepted Qty is required';
          routeCardEntryDetailsDataValid = false;
        }
        if (!row.qtyRework) {
          rowErrors.qtyRework = 'Qty Rework is required';
          routeCardEntryDetailsDataValid = false;
        }
        if (!row.reject) {
          rowErrors.reject = 'Reject is required';
          routeCardEntryDetailsDataValid = false;
        }
        if (!row.optrSign) {
          rowErrors.optrSign = 'OPTR Sign is required';
          routeCardEntryDetailsDataValid = false;
        }
        if (!row.remarks) {
          rowErrors.remarks = 'Remarks is required';
          routeCardEntryDetailsDataValid = false;
        }

        return rowErrors;
      });
      setRouteCardEntryErrors(newTableErrors);
    }

    // route Card Eng Dept
    let routeCardEngDeptDataValid = true;
    const newTableErrors1 = routeCardEngDeptData.map((row) => {
      const rowErrors = {};
      if (!row.preparedBy) {
        rowErrors.preparedBy = 'Prepared By is required';
        routeCardEngDeptDataValid = false;
      }
      if (!row.prepareDate) {
        rowErrors.prepareDate = 'Date is required';
        routeCardEngDeptDataValid = false;
      }
      if (!row.approvedByManager) {
        rowErrors.approvedByManager = 'Approved By (Manager) is required';
        routeCardEngDeptDataValid = false;
      }
      if (!row.approvedDate) {
        rowErrors.approvedDate = 'Date is required';
        routeCardEngDeptDataValid = false;
      }
      return rowErrors;
    });

    setRouteCardEngDeptErrors(newTableErrors1);

    // route Card Closure Data
    let routeCardClosureDataValid = true;
    const routeCardClosureErrors = routeCardClosureData.map((row) => {
      const rowErrors = {};
      if (!row.qaManagerSign) {
        rowErrors.qaManagerSign = 'QA Manager Sign is required';
        routeCardClosureDataValid = false;
      }
      if (!row.qaManagerDate) {
        rowErrors.qaManagerDate = 'Date is required';
        routeCardClosureDataValid = false;
      }
      if (!row.plantManagerSign) {
        rowErrors.plantManagerSign = 'Plant Manager Sign is required';
        routeCardClosureDataValid = false;
      }
      if (!row.plantManagerDate) {
        rowErrors.plantManagerDate = 'Date is required';
        routeCardClosureDataValid = false;
      }
      return rowErrors;
    });

    setRouteCardClosureErrors(routeCardClosureErrors);

    // route Card Entry Summary
    let routeCardEntrySummaryDataValid = true;
    const routeCardEntrySummaryErrors = routeCardEntrySummaryData.map((row) => {
      const rowErrors = {};
      if (!row.invoice) {
        rowErrors.invoice = 'Invoice is required';
        routeCardEntrySummaryDataValid = false;
      }
      if (!row.invoiceDate) {
        rowErrors.invoiceDate = 'Date is required';
        routeCardEntrySummaryDataValid = false;
      }
      if (!row.quantity) {
        rowErrors.quantity = 'Quantity is required';
        routeCardEntrySummaryDataValid = false;
      }
      if (!row.stockQuantity) {
        rowErrors.stockQuantity = 'Stock Quantity is required';
        routeCardEntrySummaryDataValid = false;
      }
      return rowErrors;
    });

    setRouteCardEntrySummaryErrors(routeCardEntrySummaryErrors);
    // File attachment
    let attachmentDataValid = true;
    const attachmentErrors = attachmentsData.map((row) => {
      const rowErrors = {};
      if (!row.fileAttachment) {
        rowErrors.fileAttachment = 'File Attachment is required';
        attachmentDataValid = false;
      }
      return rowErrors;
    });

    setRouteCardEntrySummaryErrors(attachmentErrors);

    setFieldErrors(errors);

    if (
      Object.keys(errors).length === 0 &&
      routeCardEntryDetailsDataValid &&
      routeCardEngDeptDataValid &&
      routeCardClosureDataValid &&
      routeCardEntrySummaryDataValid &&
      attachmentDataValid
    ) {
      setIsLoading(true);

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        listCode: formData.listCode,
        listDescription: formData.listDescription,
        // listOfValues1DTO: detailsVo,
        createdBy: loginUserName,
        orgId: orgId
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      //  Save API
      try {
        const response = await apiCalls('put', '/inventory/updateCreateRouteCardEntry', saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Route Card Entry updated successfully' : 'Route Card Entry created successfully');
          // getAllListOfValuesByOrgId();
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Route Card Entry creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Route Card Entry creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleList = () => {
    setShowForm(!showForm);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} isLoading={isLoading} margin="0 10px 0 10px" />
        </div>
        {uploadOpen && (
          <CommonBulkUpload
            open={uploadOpen}
            handleClose={handleBulkUploadClose}
            title="Upload Files"
            uploadText="Upload file"
            downloadText="Sample File"
            onSubmit={handleSubmit}
            // sampleFileDownload={BrsOpeningExcel}
            handleFileUpload={handleFileUpload}
            // apiUrl={`transaction/excelUploadForBrs?branch=${branch}&branchCode=${branchCode}&createdBy=${loginUserName}&orgId=${orgId}`}
            screen="PutAway"
          />
        )}
        {showForm ? (
          <>
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="routeCardNo"
                    label="Route Card No"
                    name="routeCardNo"
                    size="small"
                    value={formData.routeCardNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.routeCardNo}
                    helperText={fieldErrors.routeCardNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
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
                  <InputLabel id="customerName-label">
                    {
                      <span>
                        customerName <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select labelId="customerName-label" label="customerName" value={formData.customer} onChange={handleInputChange} name="customerName">
                    {customer?.map((row) => (
                      <MenuItem key={row.id} value={row.customer}>
                        {row.customer}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.customer && <FormHelperText>{fieldErrors.customer}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                  <InputLabel id="customerName-label">
                    {
                      <span>
                        WO No <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select labelId="customerName-label" label="WO No" value={formData.workOrder} onChange={handleInputChange} name="customerName">
                    {workOrder?.map((row) => (
                      <MenuItem key={row.id} value={row.workOrder}>
                        {row.workOrder}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.workOrder && <FormHelperText>{fieldErrors.workOrder}</FormHelperText>}
                </FormControl>
              </div>


              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.fgPartName}>
                  <InputLabel id="fgPartName">FG Part Name</InputLabel>
                  <Select
                    labelId="fgPartName"
                    id="fgPartName"
                    label="FG Part Name"
                    onChange={handleInputChange}
                    name="fgPartName"
                    value={formData.fgPartName}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.fgPartName && <FormHelperText>{fieldErrors.fgPartName}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="fgPartDescription"
                    label="FG Part Description"
                    name="fgPartDescription"
                    size="small"
                    value={formData.fgPartDescription}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.fgPartDescription}
                    helperText={fieldErrors.fgPartDescription}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="fgQty"
                    label="FG Qty"
                    name="fgQty"
                    size="small"
                    value={formData.fgQty}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.fgQty}
                    helperText={fieldErrors.fgQty}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="batchQty"
                    label="Batch Qty"
                    name="batchQty"
                    size="small"
                    value={formData.batchQty}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.batchQty}
                    helperText={fieldErrors.batchQty}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="rmType"
                    label="RM Type"
                    name="rmType"
                    size="small"
                    value={formData.rmType}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.rmType}
                    helperText={fieldErrors.rmType}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="rmSize"
                    label="RM Size"
                    name="rmSize"
                    size="small"
                    value={formData.rmSize}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.rmSize}
                    helperText={fieldErrors.rmSize}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="rmBatchNo"
                    label="RM Batch No"
                    name="rmBatchNo"
                    size="small"
                    value={formData.rmBatchNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.rmBatchNo}
                    helperText={fieldErrors.rmBatchNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="rmQty"
                    label="RM Qty"
                    name="rmQty"
                    size="small"
                    value={formData.rmQty}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.rmQty}
                    helperText={fieldErrors.rmQty}
                  />
                </FormControl>
              </div>
            </div>
            {/* <TableComponent formData={formData} setFormData={setFormData} /> */}
            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="Route Card Entry Details" />
                  <Tab value={1} label="Route Card Engineering Departments" />
                  <Tab value={2} label="Route Card Closure" />
                  <Tab value={3} label="Route Card Entry Summary" />
                  <Tab value={4} label="Attachment" />
                  <Tab value={5} label="Remarks" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-12">
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
                                    Operation Description
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Machine / Work Center
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Process Start
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Process End
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Accepted QTY
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Qty Rework
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Reject
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    OPTR/INS SIGN
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Remarks
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {routeCardEntryDetailsData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            routeCardEntryDetailsData,
                                            setRouteCardEntryDetailsData,
                                            routeCardEntryErrors,
                                            setRouteCardEntryErrors
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
                                        type="text"
                                        value={row.operationDesc}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setRouteCardEntryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, operationDesc: value } : r))
                                          );
                                          setRouteCardEntryErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              operationDesc: !value ? 'Operation Description is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={routeCardEntryErrors[index]?.operationDesc ? 'error form-control' : 'form-control'}
                                      />
                                      {routeCardEntryErrors[index]?.operationDesc && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {routeCardEntryErrors[index].operationDesc}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.machineCenter}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setRouteCardEntryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, machineCenter: value } : r))
                                          );
                                          setRouteCardEntryErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              machineCenter: !value ? 'Machine/Work Center is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={routeCardEntryErrors[index]?.machineCenter ? 'error form-control' : 'form-control'}
                                      />
                                      {routeCardEntryErrors[index]?.machineCenter && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {routeCardEntryErrors[index].machineCenter}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="date"
                                        value={row.processStart}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setRouteCardEntryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, processStart: value } : r))
                                          );
                                          setRouteCardEntryErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              processStart: !value ? 'Process Start is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={routeCardEntryErrors[index]?.processStart ? 'error form-control' : 'form-control'}
                                      />
                                      {routeCardEntryErrors[index]?.processStart && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {routeCardEntryErrors[index].processStart}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="date"
                                        value={row.processEnd}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setRouteCardEntryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, processEnd: value } : r))
                                          );
                                          setRouteCardEntryErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              processEnd: !value ? 'Process End is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={routeCardEntryErrors[index]?.processEnd ? 'error form-control' : 'form-control'}
                                      />
                                      {routeCardEntryErrors[index]?.processEnd && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {routeCardEntryErrors[index].processEnd}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.acceptedQty}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setRouteCardEntryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, acceptedQty: value } : r))
                                          );
                                          setRouteCardEntryErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              acceptedQty: !value ? 'Accepted Qty is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={routeCardEntryErrors[index]?.acceptedQty ? 'error form-control' : 'form-control'}
                                      />
                                      {routeCardEntryErrors[index]?.acceptedQty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {routeCardEntryErrors[index].acceptedQty}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.qtyRework}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setRouteCardEntryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, qtyRework: value } : r))
                                          );
                                          setRouteCardEntryErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              qtyRework: !value ? 'Qty Rework is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={routeCardEntryErrors[index]?.qtyRework ? 'error form-control' : 'form-control'}
                                      />
                                      {routeCardEntryErrors[index]?.qtyRework && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {routeCardEntryErrors[index].qtyRework}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.reject}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setRouteCardEntryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, reject: value } : r))
                                          );
                                          setRouteCardEntryErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              reject: !value ? 'Reject is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={routeCardEntryErrors[index]?.reject ? 'error form-control' : 'form-control'}
                                      />
                                      {routeCardEntryErrors[index]?.reject && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {routeCardEntryErrors[index].reject}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.optrSign}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setRouteCardEntryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, optrSign: value } : r))
                                          );
                                          setRouteCardEntryErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              optrSign: !value ? 'OPTR/INS Sign is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={routeCardEntryErrors[index]?.optrSign ? 'error form-control' : 'form-control'}
                                      />
                                      {routeCardEntryErrors[index]?.optrSign && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {routeCardEntryErrors[index].optrSign}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.remarks}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setRouteCardEntryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                          );
                                          setRouteCardEntryErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              remarks: !value ? 'Remarks is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={routeCardEntryErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                      />
                                      {routeCardEntryErrors[index]?.remarks && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {routeCardEntryErrors[index].remarks}
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
                {value === 1 && (
                  <>
                    <div className="row d-flex">
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!routeCardEngDeptErrors.preparedBy}>
                          <InputLabel id="preparedBy">Prepared By</InputLabel>
                          <Select
                            labelId="preparedBy"
                            id="preparedBy"
                            label="Prepared By"
                            onChange={handleInputChange}
                            name="preparedBy"
                            value={routeCardEngDeptData.preparedBy}
                          >
                            <MenuItem value="Head Office">Head Office</MenuItem>
                            <MenuItem value="Branch">Branch</MenuItem>
                          </Select>
                          {routeCardEngDeptErrors.preparedBy && <FormHelperText>{routeCardEngDeptErrors.preparedBy}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Date"
                              value={routeCardEngDeptData.prepareDate ? dayjs(routeCardEngDeptData.prepareDate, 'YYYY-MM-DD') : null}
                              onChange={(date) => handleDateChange('prepareDate', date)}
                              slotProps={{
                                textField: { size: 'small', clearable: true }
                              }}
                              format="DD-MM-YYYY"
                              error={!!routeCardEngDeptErrors.prepareDate}
                              helperText={routeCardEngDeptErrors.prepareDate ? routeCardEngDeptErrors.prepareDate : ''}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!routeCardEngDeptErrors.approvedByManager}>
                          <InputLabel id="approvedByManager">Approved By (Manager)</InputLabel>
                          <Select
                            labelId="approvedByManager"
                            id="approvedByManager"
                            label="Approved By (Manager)"
                            onChange={handleInputChange}
                            name="approvedByManager"
                            value={routeCardEngDeptData.approvedByManager}
                          >
                            <MenuItem value="Head Office">Head Office</MenuItem>
                            <MenuItem value="Branch">Branch</MenuItem>
                          </Select>
                          {routeCardEngDeptErrors.approvedByManager && <FormHelperText>{routeCardEngDeptErrors.approvedByManager}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Date"
                              value={routeCardEngDeptData.approvedDate ? dayjs(routeCardEngDeptData.approvedDate, 'YYYY-MM-DD') : null}
                              onChange={(date) => handleDateChange('approvedDate', date)}
                              slotProps={{
                                textField: { size: 'small', clearable: true }
                              }}
                              format="DD-MM-YYYY"
                              error={!!routeCardEngDeptErrors.approvedDate}
                              helperText={routeCardEngDeptErrors.approvedDate ? routeCardEngDeptErrors.approvedDate : ''}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div>
                    </div>
                  </>
                )}
                {value === 2 && (
                  <>
                    <div className="row d-flex">
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.qaManagerSign}>
                          <InputLabel id="qaManagerSign">QA Manager Sign</InputLabel>
                          <Select
                            labelId="qaManagerSign"
                            id="qaManagerSign"
                            label="QA Manager Sign"
                            onChange={handleInputChange}
                            name="qaManagerSign"
                            value={formData.qaManagerSign}
                          >
                            <MenuItem value="Head Office">Head Office</MenuItem>
                            <MenuItem value="Branch">Branch</MenuItem>
                          </Select>
                          {fieldErrors.qaManagerSign && <FormHelperText>{fieldErrors.qaManagerSign}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Date"
                              value={formData.qaManagerDate ? dayjs(formData.qaManagerDate, 'YYYY-MM-DD') : null}
                              onChange={(date) => handleDateChange('qaManagerDate', date)}
                              slotProps={{
                                textField: { size: 'small', clearable: true }
                              }}
                              format="DD-MM-YYYY"
                              error={!!fieldErrors.qaManagerDate}
                              helperText={fieldErrors.qaManagerDate ? fieldErrors.qaManagerDate : ''}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.plantManagerSign}>
                          <InputLabel id="plantManagerSign">Plant Manager Sign</InputLabel>
                          <Select
                            labelId="plantManagerSign"
                            id="plantManagerSign"
                            label="Plant Manager Sign"
                            onChange={handleInputChange}
                            name="plantManagerSign"
                            value={formData.plantManagerSign}
                          >
                            <MenuItem value="Head Office">Head Office</MenuItem>
                            <MenuItem value="Branch">Branch</MenuItem>
                          </Select>
                          {fieldErrors.plantManagerSign && <FormHelperText>{fieldErrors.plantManagerSign}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Date"
                              value={formData.plantManagerDate ? dayjs(formData.plantManagerDate, 'YYYY-MM-DD') : null}
                              onChange={(date) => handleDateChange('plantManagerDate', date)}
                              slotProps={{
                                textField: { size: 'small', clearable: true }
                              }}
                              format="DD-MM-YYYY"
                              error={!!fieldErrors.plantManagerDate}
                              helperText={fieldErrors.plantManagerDate ? fieldErrors.plantManagerDate : ''}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div>
                    </div>
                  </>
                )}
                {value === 3 && (
                  <>
                    <div className="row d-flex">
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="invoice"
                            label="Invoice"
                            name="invoice"
                            size="small"
                            value={routeCardEntrySummaryData.invoice}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!routeCardEntrySummaryErrors.invoice}
                            helperText={routeCardEntrySummaryErrors.invoice}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Date"
                              value={routeCardEntrySummaryData.invoiceDate ? dayjs(routeCardEntrySummaryData.invoiceDate, 'YYYY-MM-DD') : null}
                              onChange={(date) => handleDateChange('invoiceDate', date)}
                              slotProps={{
                                textField: { size: 'small', clearable: true }
                              }}
                              format="DD-MM-YYYY"
                              error={!!routeCardEntrySummaryErrors.invoiceDate}
                              helperText={routeCardEntrySummaryErrors.invoiceDate ? routeCardEntrySummaryErrors.invoiceDate : ''}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="quantity"
                            label="Quantity"
                            name="quantity"
                            size="small"
                            value={routeCardEntrySummaryData.quantity}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!routeCardEntrySummaryErrors.quantity}
                            helperText={routeCardEntrySummaryErrors.quantity}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="stockQuantity"
                            label="Stock Quantity"
                            name="stockQuantity"
                            size="small"
                            value={routeCardEntrySummaryData.stockQuantity}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!routeCardEntrySummaryErrors.stockQuantity}
                            helperText={routeCardEntrySummaryErrors.stockQuantity}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </>
                )}
                {value === 4 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleFileAttachAddRow} />
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
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    File Attachments
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {attachmentsData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            attachmentsData,
                                            setAttachmentsData,
                                            attachmentsErrors,
                                            setAttachmentsErrors
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>

                                    <td className="border px-2 py-2" onClick={handleBulkUploadOpen}>
                                      <input
                                        type="text"
                                        value={row.fileAttachment}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setAttachmentsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, fileAttachment: value } : r))
                                          );
                                          setAttachmentsErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              fileAttachment: !value ? 'File Attachment is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={attachmentsErrors[index]?.fileAttachment ? 'error form-control' : 'form-control'}
                                      />
                                      {attachmentsErrors[index]?.fileAttachment && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {attachmentsErrors[index].fileAttachment}
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
                {value === 5 && (
                  <>
                    <div className="row d-flex">
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="narration"
                            label="Narration"
                            name="narration"
                            size="small"
                            value={formData.narration}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.narration}
                            helperText={fieldErrors.narration}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </>
                )}
              </Box>
            </div>
          </>
        ) : (
          <CommonTable
            data={data && data}
            columns={columns}
            blockEdit={true}
          // toEdit={getListOfValueById}
          />
        )}
      </div>
    </div>
  );
};

export default RouteCardEntry;
