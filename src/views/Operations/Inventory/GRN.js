import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { toast } from 'react-toastify';

const GRN = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [accountNames, setAccountNames] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);


  const [formData, setFormData] = useState({
    purchaseEnquiryNo: '',
    docDate: dayjs(),
    docId: '',


  });

  const [fieldErrors, setFieldErrors] = useState({
    purchaseEnquiryNo: '',
    docDate: new Date(),


  });

  const listViewColumns = [
    { accessorKey: 'currency', header: 'GRN Date  ', size: 140 },
    { accessorKey: 'exRate', header: 'Doc Id', size: 140 },
    { accessorKey: 'refNo', header: 'Location', size: 140 },
    { accessorKey: 'docId', header: 'Inward No', size: 140 },
    { accessorKey: 'docId', header: 'Supplier Name', size: 140 },
    { accessorKey: 'docId', header: 'PO No/PC No', size: 140 },
    { accessorKey: 'refNo', header: 'GST No', size: 140 },
    { accessorKey: 'refNo', header: 'GST Type', size: 140 },
    { accessorKey: 'refNo', header: 'Address', size: 140 },
    { accessorKey: 'refNo', header: 'Currency', size: 140 },
    { accessorKey: 'refNo', header: 'Exchange Rate', size: 140 },
    { accessorKey: 'refNo', header: 'GRN Clear Time', size: 140 },
    { accessorKey: 'refNo', header: 'INV /DC-No', size: 140 },
    { accessorKey: 'refNo', header: 'INV /DC-Date', size: 140 },
    { accessorKey: 'refNo', header: 'Customer Name', size: 140 },
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      itemCode: '',
      itemName: '',
      hSN_SAC_Code: '',
      taxType: '',
      primaryUnit: '',
      stock: '',
      inspectionable: '',
      poRate: '',
      orderQty: '',
      challanQty: '',
      pendingQty: '',
      pendingQty: '',
      receivedQty: '',
      acceptQty: '',
      rejectQty: '',
      excessQty: '',
      amount: '',
      sGST: '',
      cGST: '',
      iGST: '',
      taxValue: '',
      landedValue: ''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      itemCode: '',
      itemName: '',
      hSN_SAC_Code: '',
      taxType: '',
      primaryUnit: '',
      stock: '',
      inspectionable: '',
      poRate: '',
      orderQty: '',
      challanQty: '',
      pendingQty: '',
      receivedQty: '',
      acceptQty: '',
      rejectQty: '',
      excessQty: '',
      amount: '',
      sGST: '',
      cGST: '',
      iGST: '',
      taxValue: '',
      landedValue: ''
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);
        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getGeneralJournalDocId();
    getAllGeneralJournalByOrgId();
    getAccountNameFromGroup();
  }, []);

  // api
  const getGeneralJournalDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getGeneralJournalDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.generalJournalDocId,
        docDate: dayjs()
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  // list api
  const getAllGeneralJournalByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllGeneralJournalByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.generalJournalVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  // edit api
  const getGeneralJournalById = async (row) => {
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getGeneralJournalById?id=${row.original.id}`);

      if (result) {
        const glVO = result.paramObjectsMap.generalJournalVO[0];
        setEditId(row.original.id);

        setFormData({
          voucherSubType: glVO.voucherSubType || '',
          id: glVO.id || '',
          purchaseEnquiryNo: glVO.purchaseEnquiryNo || '',
          docDate: glVO.docDate ? dayjs(glVO.docDate, 'YYYY-MM-DD') : dayjs(),
          docId: glVO.docId || '',
          currency: glVO.currency || '',
          exRate: glVO.exRate || '',
          refNo: glVO.refNo || '',
          refDate: glVO.refDate ? dayjs(glVO.refDate, 'YYYY-MM-DD') : dayjs(),
          remarks: glVO.remarks || '',
          orgId: glVO.orgId || '',
          // active: glVO.active || false,
        });
        setDetailsTableData(
          glVO.particularsJournalVO.map((row) => ({
            id: row.id,
            item: row.item,
            itemDesc: row.itemDesc,
            unit: row.unit,
            qtyRequired: row.qtyRequired,
            remarks: row.remarks
          }))
        );

        console.log('DataToEdit', glVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAccountNameFromGroup = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getAccountNameFromGroup?orgId=${orgId}`);
      setAccountNames(response.paramObjectsMap.generalJournalVO);
      console.log('generalJournalVO', response.paramObjectsMap.generalJournalVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };



  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;

    let errorMessage = '';

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      setFormData({ ...formData, [name]: value.toUpperCase() });

      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Preserve the cursor position for text-based inputs
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
    // const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      docId: '',
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      grnDate: null,
      docId: '',
      location: '',
      inwardNo: '',
      supplierName: '',
      po_No_PC_No: '',
      gstNo: '',
      gstType: '',
      address: '',
      currency: '',
      exchangeRate: '',
      grnClearTime: '',
      iNV_DC_No: '',
      iNV_DC_Date: '',
      customerName: ''

    });
    setDetailsTableData([
      { id: 1, itemCode: '', itemName: '', hSN_SAC_Code: '', taxType: '', primaryUnit: '', stock: '', inspectionable: '', poRate: '', challanQty: '', pendingQty: '', receivedQty: '', acceptQty: '', rejectQty: '', excessQty: '', amount: '', sGST: '', cGST: '', iGST: '', taxValue: '' }

    ]);
    setDetailsTableErrors('');
    setEditId('');
    getGeneralJournalDocId();
  };



  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      itemCode: '',
      itemName: '',
      hSN_SAC_Code: '',
      taxType: '',
      primaryUnit: '',
      stock: '',
      inspectionable: '',
      poRate: '',
      orderQty: '',
      challanQty: '',
      pendingQty: '',
      receivedQty: '',
      acceptQty: '',
      rejectQty: '',
      excessQty: '',
      amount: '',
      sGST: '',
      cGST: '',
      iGST: '',
      taxValue: '',
      landedValue: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { itemCode: '', itemName: '', taxType: '', primaryUnit: '', stock: '', poRate: '', orderQty: '', challanQty: '', pendingQty: '', receivedQty: '', acceptQty: '', rejectQty: '', excessQty: '', amount: '', sGST: '', cGST: '', iGST: '', taxValue: '' }]);

  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return (
        !lastRow.itemCode ||
        !lastRow.itemName ||
        !lastRow.hSN_SAC_Code ||
        !lastRow.taxType ||
        !lastRow.primaryUnit ||
        !lastRow.stock ||
        !lastRow.inspectionable ||
        !lastRow.poRate ||
        !lastRow.orderQty ||
        !lastRow.challanQty ||
        !lastRow.pendingQty ||
        !lastRow.receivedQty ||
        !lastRow.acceptQty ||
        !lastRow.rejectQty ||
        !lastRow.excessQty ||
        !lastRow.amount ||
        !lastRow.sGST ||
        !lastRow.cGST ||
        !lastRow.iGST ||
        !lastRow.taxValue ||
        !lastRow.landedValue
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          itemCode: !table[table.length - 1].itemCode ? 'Item Code is required' : '',
          itemName: !table[table.length - 1].itemName ? 'Item Name is required' : '',
          itemName: !table[table.length - 1].hSN_SAC_Code ? ' HSN/SAC Code is required' : '',
          itemName: !table[table.length - 1].taxType ? 'Tax Type is required' : '',
          itemName: !table[table.length - 1].primaryUnit ? 'Primary Unit is required' : '',
          itemName: !table[table.length - 1].stock ? 'Stock is required' : '',
          itemName: !table[table.length - 1].inspectionable ? 'Inspectionable is required' : '',
          itemName: !table[table.length - 1].poRate ? 'PO Rate is required' : '',
          itemName: !table[table.length - 1].orderQty ? 'Order Qty is required' : '',
          itemName: !table[table.length - 1].challanQty ? 'Challan Qty is required' : '',
          itemName: !table[table.length - 1].pendingQty ? 'Pending Qty is required' : '',
          itemName: !table[table.length - 1].receivedQty ? 'Received Qty is required' : '',
          itemName: !table[table.length - 1].acceptQty ? 'Accept Qty is required' : '',
          itemName: !table[table.length - 1].rejectQty ? 'Reject Qty is required' : '',
          itemName: !table[table.length - 1].excessQty ? 'Excess Qty is required' : '',
          itemName: !table[table.length - 1].amount ? 'Amount is required' : '',
          itemName: !table[table.length - 1].sGST ? 'SGST is required' : '',
          itemName: !table[table.length - 1].cGST ? 'CGST is required' : '',
          itemName: !table[table.length - 1].iGST ? 'IGST is required' : '',
          itemName: !table[table.length - 1].taxValue ? 'TaxValue is required' : '',
          itemName: !table[table.length - 1].landedValue ? 'Landed Value is required' : ''
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // errors message

  const handleSave = async () => {
    const errors = {};
    if (!formData.location) {
      errors.location = 'customer Name is required';
    }
    if (!formData.inwardNo) {
      errors.inwardNo = 'Inward No is required';
    }
    if (!formData.supplierName) {
      errors.supplierName = 'Supplier Name is required';
    }
    if (!formData.po_No_PC_No) {
      errors.po_No_PC_No = 'PO No/PC No is required';
    }
    if (!formData.gstNo) {
      errors.gstNo = 'GST No is required';
    }
    if (!formData.gstType) {
      errors.gstType = 'GST Type is required';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    }
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.exchangeRate) {
      errors.exchangeRate = 'Exchange Rate is required';
    }
    if (!formData.grnClearTime) {
      errors.grnClearTime = 'GRN Clear Time  is required';
    }
    if (!formData.iNV_DC_No) {
      errors.iNV_DC_No = 'INV /DC-No  is required';
    }
    if (!formData.iNV_DC_Date) {
      errors.iNV_DC_Date = 'INV /DC Date  is required';
    }
    if (!formData.customerName) {
      errors.customerName = 'Customer Name is required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.itemCode) {
        rowErrors.itemCode = 'Item Code is required';
        detailTableDataValid = false;
      }
      if (!row.itemName) {
        rowErrors.itemName = 'Item Name is required';
        detailTableDataValid = false;
      }
      if (!row.hSN_SAC_Code) {
        rowErrors.hSN_SAC_Code = ' HSN/SAC Code is required';
        detailTableDataValid = false;
      }
      if (!row.taxType) {
        rowErrors.taxType = 'Tax Type is required';
        detailTableDataValid = false;
      }
      if (!row.primaryUnit) {
        rowErrors.primaryUnit = 'Primary Unit is required';
        detailTableDataValid = false;
      }
      if (!row.stock) {
        rowErrors.stock = 'stock is required';
        detailTableDataValid = false;
      }
      if (!row.inspectionable) {
        rowErrors.inspectionable = 'Inspectionable is required';
        detailTableDataValid = false;
      }
      if (!row.poRate) {
        rowErrors.poRate = 'PO Rate is required';
        detailTableDataValid = false;
      }
      if (!row.orderQty) {
        rowErrors.orderQty = 'Order Qty is required';
        detailTableDataValid = false;
      }
      if (!row.challanQty) {
        rowErrors.challanQty = 'Challan Qty is required';
        detailTableDataValid = false;
      }
      if (!row.pendingQty) {
        rowErrors.pendingQty = 'Pending Qty is required';
        detailTableDataValid = false;
      }
      if (!row.receivedQty) {
        rowErrors.receivedQty = 'Received Qty is required';
        detailTableDataValid = false;
      }
      if (!row.acceptQty) {
        rowErrors.acceptQty = 'Accept Qty is required';
        detailTableDataValid = false;
      }
      if (!row.rejectQty) {
        rowErrors.rejectQty = 'Reject Qty is required';
        detailTableDataValid = false;
      }
      if (!row.excessQty) {
        rowErrors.excessQty = 'Excess Qty is required';
        detailTableDataValid = false;
      }
      if (!row.amount) {
        rowErrors.amount = 'Amount is required';
        detailTableDataValid = false;
      }
      if (!row.sGST) {
        rowErrors.sGST = 'SGST is required';
        detailTableDataValid = false;
      }
      if (!row.cGST) {
        rowErrors.cGST = ' CGST is required';
        detailTableDataValid = false;
      }
      if (!row.iGST) {
        rowErrors.iGST = 'IGST is required';
        detailTableDataValid = false;
      }
      if (!row.taxValue) {
        rowErrors.taxValue = 'TaxValue is required';
        detailTableDataValid = false;
      }
      if (!row.landedValue) {
        rowErrors.landedValue = 'Landed Value is required';
        detailTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        item: row.item,
        itemDesc: row.itemDesc,
        unit: row.unit,
        qtyRequired: row.qtyRequired,
        remarks: row.remarks
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        currency: formData.currency,
        exRate: formData.exRate,
        finYear: finYear,
        orgId: orgId,
        particularsJournalDTO: GeneralJournalVO,
        refDate: dayjs(formData.refDate).format('YYYY-MM-DD'),
        refNo: formData.refNo,
        remarks: formData.remarks
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/transaction/updateCreateGeneralJournal`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Goods Received Note Updated Successfully' : 'Goods Received Note Created successfully');
          getAllGeneralJournalByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Goods Received Note creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Goods Received Note creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  // BulkUploadOpen
  const handleBulkUploadOpen = () => {
    setUploadOpen(true);
  };
  // UploadClose
  const handleBulkUploadClose = () => {
    setUploadOpen(false);
  };
  // FileUpload
  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  // file upload save 
  const handleSubmit = () => {
    toast.success("File uploded sucessfully")
    console.log('Submit clicked');
    handleBulkUploadClose();
    // getAllData();
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

                {/* Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="GRN Date"
                        value={formData.grnDate}
                        onChange={(date) => handleDateChange('grnDate', date)}
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                {/* doc Id */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Doc Id"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    value={formData.docId}
                    onChange={handleInputChange}
                    error={!!fieldErrors.docId}
                    helperText={fieldErrors.docId}
                  // inputRef={UOMDescriptionRef}
                  />
                </div>
                {/* Location */}
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.location}>
                    <InputLabel id="demo-simple-select-label">
                      {
                        <span>
                          Location <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Location"
                      onChange={handleInputChange}
                      name="location"
                      value={formData.location}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.location}>
                          {item.location}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.location && <FormHelperText style={{ color: 'red' }}>Location is required</FormHelperText>}
                  </FormControl>
                </div>
                {/* Inward No */}
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.inwardNo}>
                    <InputLabel id="demo-simple-select-label">
                      {
                        <span>
                          Inward No
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Work Order No"
                      onChange={handleInputChange}
                      name="inwardNo"
                      value={formData.inwardNo}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.inwardNo}>
                          {item.inwardNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.inwardNo && <FormHelperText style={{ color: 'red' }}>Inward No No is required</FormHelperText>}
                  </FormControl>
                </div>

                {/* Supplier Name */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Supplier Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    error={!!fieldErrors.supplierName}
                    helperText={fieldErrors.supplierName}
                  />
                </div>

                {/* PO No/PC No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="PO No/PC No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="po_No_PC_No"
                    value={formData.po_No_PC_No}
                    onChange={handleInputChange}
                    error={!!fieldErrors.po_No_PC_No}
                    helperText={fieldErrors.po_No_PC_No}
                  />
                </div>

                {/* GST No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="GST No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="gstNo"
                    value={formData.gstNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.gstNo}
                    helperText={fieldErrors.gstNo}
                  // inputRef={UOMDescriptionRef}
                  />
                </div>

                {/* GST Type */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="GST Type"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="gstType"
                    value={formData.gstType}
                    onChange={handleInputChange}
                    error={!!fieldErrors.gstType}
                    helperText={fieldErrors.gstType}
                  // inputRef={UOMDescriptionRef}
                  />
                </div>

                {/* Address */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={!!fieldErrors.address}
                    helperText={fieldErrors.address}
                  // inputRef={UOMDescriptionRef}
                  />
                </div>

                {/* currency */}
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
                  // inputRef={UOMDescriptionRef}
                  />
                </div>

                {/* Exchange Rate */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Exchange Rate"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="exchangeRate"
                    value={formData.exchangeRate}
                    onChange={handleInputChange}
                    error={!!fieldErrors.exchangeRate}
                    helperText={fieldErrors.exchangeRate}
                  // inputRef={UOMDescriptionRef}
                  />
                </div>

                {/* GRN Clear Time */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="GRN Clear Time"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="grnClearTime"
                    value={formData.grnClearTime}
                    onChange={handleInputChange}
                    error={!!fieldErrors.grnClearTime}
                    helperText={fieldErrors.grnClearTime}
                  // inputRef={UOMDescriptionRef}
                  />
                </div>

                {/* INV /DC-No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="INV /DC-No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="iNV_DC_No"
                    value={formData.iNV_DC_No}
                    onChange={handleInputChange}
                    error={!!fieldErrors.iNV_DC_No}
                    helperText={fieldErrors.iNV_DC_No}
                  // inputRef={UOMDescriptionRef}
                  />
                </div>

                {/* INV /DC Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="INV /DC Date"
                        value={formData.iNV_DC_Date}
                        onChange={(date) => handleDateChange('iNV_DC_Date', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {/* {fieldErrors.iNV_DC_Date && <p className="dateErrMsg">INV /DC Date is required</p>} */}
                  </FormControl>
                </div>

                {/* Customer Name */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Customer Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    error={!!fieldErrors.customerName}
                    helperText={fieldErrors.customerName}
                  // inputRef={UOMDescriptionRef}
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
                    <Tab value={0} label="Item" />
                    <Tab value={1} label="GRN Summary" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                          <ActionButton icon={CloudUploadIcon} title='Upload' onClick={handleBulkUploadOpen} />
                          {uploadOpen && (
                            <CommonBulkUpload
                              open={uploadOpen}
                              handleClose={handleBulkUploadClose}
                              title="Upload Files"
                              uploadText="Upload file"
                              downloadText="Sample File"
                              onSubmit={handleSubmit}
                              // sampleFileDownload={FirstData}
                              handleFileUpload={handleFileUpload}
                              apiUrl={`excelfileupload/excelUploadForSample`}
                              screen="PutAway"
                            />
                          )}
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Item Code</th>
                                    <th className="table-header">Item Name</th>
                                    <th className="table-header"> HSN SAC Code</th>
                                    <th className="table-header">Tax Type</th>
                                    <th className="table-header">Primary Unit</th>
                                    <th className="table-header">Stock</th>
                                    <th className="table-header">Inspectionable</th>
                                    <th className="table-header">PO Rate</th>
                                    <th className="table-header">Order Qty</th>
                                    <th className="table-header">Challan Qty</th>
                                    <th className="table-header">Pending Qty</th>
                                    <th className="table-header">Received Qty</th>
                                    <th className="table-header">Accept Qty</th>
                                    <th className="table-header">Reject Qty</th>
                                    <th className="table-header">Excess Qty</th>
                                    <th className="table-header">Amount</th>
                                    <th className="table-header">SGST %</th>
                                    <th className="table-header">CGST %</th>
                                    <th className="table-header">IGST %</th>
                                    <th className="table-header">TaxValue</th>
                                    <th className="table-header">Landed Value</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detailsTableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              detailsTableData,
                                              setDetailsTableData,
                                              detailsTableErrors,
                                              setDetailsTableErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2" >
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.itemCode}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, itemCode: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemCode: !value ? 'Item Code is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.itemCode ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.itemCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].itemCode}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.itemName}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, itemName: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemName: !value ? 'Item Name is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.itemName ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.itemName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].itemName}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.hSN_SAC_Code}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, hSN_SAC_Code: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                hSN_SAC_Code: !value ? ' HSN/SAC Code is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.hSN_SAC_Code ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.hSN_SAC_Code && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].hSN_SAC_Code}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.taxType}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, taxType: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                taxType: !value ? 'Tax Type is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.taxType ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.taxType && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].taxType}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.primaryUnit}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, primaryUnit: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                primaryUnit: !value ? 'Primary Unit is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.primaryUnit ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.primaryUnit && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].primaryUnit}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.stock}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, stock: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                stock: !value ? 'Stock is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.stock ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.stock && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].stock}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.inspectionable}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, inspectionable: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                inspectionable: !value ? 'Inspectionable is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.inspectionable ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.inspectionable && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].inspectionable}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.poRate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, poRate: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                poRate: !value ? 'PO Rate is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.poRate ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.poRate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].poRate}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.orderQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, orderQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                orderQty: !value ? 'Order Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.orderQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.orderQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].orderQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.challanQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, challanQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                challanQty: !value ? 'Challan Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.challanQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.challanQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].challanQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.pendingQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, pendingQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                pendingQty: !value ? 'Pending Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.pendingQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.pendingQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].pendingQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.receivedQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, receivedQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                receivedQty: !value ? 'Received Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.receivedQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.receivedQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].receivedQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.acceptQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, acceptQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                acceptQty: !value ? 'Accept Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.acceptQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.acceptQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].acceptQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.rejectQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, rejectQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                rejectQty: !value ? 'Reject Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.rejectQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.rejectQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].rejectQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.excessQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, excessQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                excessQty: !value ? 'Excess Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.excessQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.excessQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].excessQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.amount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                amount: !value ? 'Amount is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.amount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].amount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '70px' }}
                                          type="text"
                                          value={row.sGST}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, sGST: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sGST: !value ? 'SGST %  is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.sGST ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.sGST && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].sGST}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '70px' }}
                                          type="text"
                                          value={row.cGST}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, cGST: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                cGST: !value ? 'CGST % is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.cGST ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.cGST && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].cGST}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '70px' }}
                                          type="text"
                                          value={row.iGST}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, iGST: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                iGST: !value ? 'IGST %  is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.iGST ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.iGST && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].iGST}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '70px' }}
                                          type="text"
                                          value={row.taxValue}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, taxValue: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                taxValue: !value ? 'Tax Value is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.taxValue ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.taxValue && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].taxValue}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.landedValue}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, landedValue: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                landedValue: !value ? 'Landed Value is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.landedValue ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.landedValue && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].landedValue}
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
                      <div className="row d-flex mt-2">

                        {/* Customer PO No */}

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
                            label="Total Amount Tax"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="totalAmountTax"
                            value={formData.totalAmountTax}
                            onChange={handleInputChange}
                            error={!!fieldErrors.totalAmountTax}
                            helperText={fieldErrors.totalAmountTax}
                          />
                        </div>
                        <div className="col-md-8">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="Remarks"
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
                  )}

                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getGeneralJournalById} />
          )}
        </div>
      </div>
    </>
  );
};
export default GRN;
