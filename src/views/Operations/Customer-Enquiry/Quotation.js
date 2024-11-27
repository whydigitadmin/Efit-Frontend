import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
// import TextField from '@mui/material/TextField';
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
import { Autocomplete, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import { getAllActiveCurrency } from 'utils/CommonFunctions';

const Quotation = () => {
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
  const [partyList, setPartyList] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    date: dayjs(),
    quoteNo: '',
    customerName: '',
    customerID: '',
    enquiryNo: '',
    enquiryDate: dayjs(),
    orgId: orgId,
    referenceDate: null,
    kindAttention: '',
    contactNo: '',
    taxCode: '',
    productionManager: '',
    currency: '',


    grossAmount: "",
    amountInWords: "",
    netAmount: '',
  });

  const [fieldErrors, setFieldErrors] = useState({

    active: true,
    date: dayjs(),
    quoteNo: '',
    customerName: '',
    customerID: '',
    enquiryNo: '',
    enquiryDate: dayjs(),
    orgId: orgId,
    referenceDate: null,
    kindAttention: '',
    contactNo: '',
    taxCode: '',
    productionManager: '',
    currency: '',


    grossAmount: 0,
    amountInWords: 0,
  });

  const listViewColumns = [
    { accessorKey: 'Currency', header: 'Currency', size: 140 },
    { accessorKey: 'customerID', header: 'Ex.Rate', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'quoteNo', header: 'Document Id', size: 140 }
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      partNo: '',
      partDescription: '',
      drawingNo: '',
      revisionNo: '',
      unit: '',
      unitPrice: '',
      qtyOffered: '',
      basicPrice: '',
      discount: '',
      discountAmount: '',
      quoteAmount: '',
      deliveryDate: '',
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      partNo: '',
      partDescription: '',
      drawingNo: '',
      revisionNo: '',
      unit: '',
      unitPrice: '',
      qtyOffered: '',
      basicPrice: '',
      discount: '',
      discountAmount: '',
      quoteAmount: '',
      deliveryDate: '',
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const CurrencyData = await getAllActiveCurrency(orgId);
        setCurrencies(CurrencyData);
        console.log('Currency', CurrencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getGeneralJournalquoteNo();
    getAllGeneralJournalByOrgId();
    getAccountNameFromGroup();
  }, []);

  useEffect(() => {
    const totalDebit = detailsTableData.reduce((sum, row) => sum + Number(row.revisionNo || 0), 0);
    const totalCredit = detailsTableData.reduce((sum, row) => sum + Number(row.unit || 0), 0);

    setFormData((prev) => ({
      ...prev,
      amountInWords: totalDebit,
      grossAmount: totalCredit
    }));
  }, [detailsTableData]);

  const getGeneralJournalquoteNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getGeneralJournalquoteNo?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        quoteNo: response.paramObjectsMap.generalJournalquoteNo,
        date: dayjs()
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllGeneralJournalByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllGeneralJournalByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.generalJournalVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getGeneralJournalById = async (row) => {
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getGeneralJournalById?id=${row.original.id}`);

      if (result) {
        const glVO = result.paramObjectsMap.generalJournalVO[0];
        setEditId(row.original.id);

        setFormData({
          id: glVO.id || '',
          date: glVO.date ? dayjs(glVO.date, 'YYYY-MM-DD') : dayjs(),
          quoteNo: glVO.quoteNo || '',
          currency: glVO.currency || '',
          customerID: glVO.customerID || '',
          refNo: glVO.refNo || '',
          referenceDate: glVO.referenceDate ? dayjs(glVO.referenceDate, 'YYYY-MM-DD') : dayjs(),
          taxCode: glVO.taxCode || '',
          orgId: glVO.orgId || '',
          amountInWords: glVO.amountInWords || '',
          grossAmount: glVO.grossAmount || ''
          // active: glVO.active || false,
        });
        setDetailsTableData(
          glVO.particularsJournalVO.map((row) => ({
            id: row.id,
            partNo: row.partNo,
            unit: row.unit,
            revisionNo: row.revisionNo,
            unitPrice: row.unitPrice,
            drawingNo: row.drawingNo,
            partDescription: row.partDescription
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

  const handleDebitChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, revisionNo: value, unit: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          revisionNo: !value ? 'Debit Amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleCreditChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, unit: value, revisionNo: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          unit: !value ? 'Credit Amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

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
      date: dayjs(),
      customerID: '',
      orgId: orgId,
      referenceDate: null,

      taxCode: '',
      grossAmount: 0,
      amountInWords: 0,
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({

      date: null,
      customerID: '',
      orgId: orgId,
      referenceDate: '',

      taxCode: '',
    });
    setDetailsTableData([
      { id: 1, partNo: '', unit: '', drawingNo: '', partDescription: '', revisionNo: '', unitPrice: '', }
    ]);
    setDetailsTableErrors('');
    setEditId('');
    getGeneralJournalquoteNo();
  };


  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      partNo: '',
      unit: '',
      drawingNo: '',
      partDescription: '',
      revisionNo: '',
      unitPrice: '',
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { partNo: '', unit: '', revisionNo: '', unitPrice: '', }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;
    if (!lastRow) return false;
    if (table === detailsTableData) {
      return (
        !lastRow.partNo ||
        !lastRow.unit ||
        !lastRow.unitPrice ||
        // !lastRow.drawingNo ||
        !lastRow.partDescription ||
        !lastRow.revisionNo ||
        !lastRow.qtyOffered ||
        !lastRow.basicPrice ||
        !lastRow.discount ||
        !lastRow.discountAmount ||
        !lastRow.quoteAmount ||
        !lastRow.deliveryDate
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        const lastRow = table[table.length - 1];

        // Add error messages for required fields
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !lastRow.partNo ? 'Part Number is required' : '',
          unit: !lastRow.unit ? 'Unit is required' : '',
          unitPrice: !lastRow.unitPrice ? 'Unit Price is required' : '',
          drawingNo: !lastRow.drawingNo ? 'Drawing Number is required' : '',
          partDescription: !lastRow.partDescription ? 'Part Description is required' : '',
          revisionNo: !lastRow.revisionNo ? 'Revision Number is required' : '',
          qtyOffered: !lastRow.qtyOffered ? 'Quantity Offered is required' : '',
          basicPrice: !lastRow.basicPrice ? 'Basic Price is required' : '',
          discount: !lastRow.discount ? 'Discount is required' : '',
          discountAmount: !lastRow.discountAmount ? 'Discount Amount is required' : '',
          quoteAmount: !lastRow.quoteAmount ? 'Quote Amount Amount is required' : '',
          deliveryDate: !lastRow.deliveryDate ? 'Delivery Date is required' : ''
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

      // Update both table data and error state
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

  const handleSave = async () => {
    const errors = {};
    let isValid = true;
    // if (!formData.quoteNo) errors.quoteNo = 'Quote Number is required';
    if (!formData.customerName) errors.customerName = 'Customer Name is required';
    // if (!formData.customerID) errors.customerID = 'Customer ID is required';
    if (!formData.enquiryNo) errors.enquiryNo = 'Enquiry Number is required';
    if (!formData.referenceDate) errors.referenceDate = 'Reference Date is required';
    if (!formData.kindAttention) errors.kindAttention = 'Kind Attention is required';
    // if (!formData.contactNo) errors.contactNo = 'Contact Number is required';
    // if (!formData.taxCode) errors.taxCode =   'Tax Code is required';
    if (!formData.productionManager) errors.productionManager = 'Production Manager is required';
    if (!formData.currency) errors.currency = 'Currency is required';
    if (!formData.grossAmount) errors.grossAmount = 'Gross Amount is required';
    if (!formData.amountInWords) errors.amountInWords = 'Amount in Words is required';
    if (!formData.netAmount) errors.netAmount = 'Net Amount is required';

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'Part No is required';
        detailTableDataValid = false;
      }
      if (!row.partDescription) {
        rowErrors.partDescription = 'Part Description is required';
        detailTableDataValid = false;
      }
      if (!formData.drawingNo) {
        errors.drawingNo = 'Drawing No is required'; // Custom error message
        isValid = false;
      }
      if (!row.revisionNo) {
        rowErrors.revisionNo = 'revisionNo  is required';
        detailTableDataValid = false;
      }
      if (!row.unit) {
        rowErrors.unit = ' unit is required';
        detailTableDataValid = false;
      }
      if (!row.unitPrice) {
        rowErrors.unitPrice = 'unitPrice  is required';
        detailTableDataValid = false;
      }
      if (!row.qtyOffered) {
        rowErrors.qtyOffered = 'qtyOffered is required';
        detailTableDataValid = false;
      }
      if (!row.basicPrice) {
        rowErrors.basicPrice = 'basicPrice is required';
        detailTableDataValid = false;
      }
      if (!row.discount) {
        rowErrors.discount = 'discount is required';
        detailTableDataValid = false;
      }
      if (!row.discountAmount) {
        rowErrors.discountAmount = 'discountAmount is required';
        detailTableDataValid = false;
      }
      if (!row.quoteAmount) {
        rowErrors.quoteAmount = 'quoteAmount is required';
        detailTableDataValid = false;
      }
      if (!row.deliveryDate) {
        rowErrors.deliveryDate = 'deliveryDate is required';
        detailTableDataValid = false;
      }


      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        partNo: row.partNo,
        unit: row.unit,
        revisionNo: row.revisionNo,
        unitPrice: row.unitPrice,
        drawingNo: row.drawingNo,
        partDescription: row.partDescription
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        currency: formData.currency,
        customerID: formData.customerID,
        finYear: finYear,
        orgId: orgId,
        particularsJournalDTO: GeneralJournalVO,
        referenceDate: dayjs(formData.referenceDate).format('YYYY-MM-DD'),
        refNo: formData.refNo,
        taxCode: formData.taxCode,
        grossAmount: formData.grossAmount,
        amountInWords: formData.amountInWords,
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/transaction/updateCreateGeneralJournal`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'General Journal Updated Successfully' : 'General Journal Created successfully');
          getAllGeneralJournalByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'General Journal creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'General Journal creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
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
                    id="outlined-textarea-zip"
                    label="Quote No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="quoteNo"
                    value={formData.quoteNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
                        value={formData.date}
                        onChange={(date) => handleDateChange('date', date)}
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
                        error={!!fieldErrors.customerName}  // Shows error if customerName has a value in fieldErrors
                        helperText={fieldErrors.customerName} // Displays the error message
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Customer ID"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerID"
                    value={formData.customerID}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.enquiryNo ? partyList.find((c) => c.partyname === formData.enquiryNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'enquiryNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Enquiry No"
                        name="enquiryNo"
                        error={!!fieldErrors.enquiryNo}
                        helperText={fieldErrors.enquiryNo}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
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
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Reference Date"
                        value={formData.referenceDate}
                        onChange={(date) => handleDateChange('referenceDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {/* {fieldErrors.referenceDate && <p className="dateErrMsg">Ref Date is required</p>} */}
                    {fieldErrors.referenceDate && (
                      <p className="dateErrMsg">Ref Date is required</p>
                    )}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="kindAttention"
                      label="Kind Attention"
                      // label={
                      //   <span>
                      //     Drawing Id <span className="asterisk">*</span>
                      //   </span>
                      // }
                      name="kindAttention"
                      size="small"
                      value={formData.kindAttention}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.kindAttention}
                      helperText={fieldErrors.kindAttention}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Contact No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="taxCode"
                      label="Tax Code"
                      size="small"
                      name="taxCode"
                      value={formData.taxCode}
                      onChange={handleInputChange}
                      disabled
                      inputProps={{ maxLength: 10 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.productionManager ? partyList.find((c) => c.partyname === formData.productionManager) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'productionManager',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="productionManager"
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
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="currency"
                      label="Currency"
                      // label={
                      //   <span>
                      //     Drawing Id <span className="asterisk">*</span>
                      //   </span>
                      // }
                      name="currency"
                      size="small"
                      value={formData.currency}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.currency}
                      helperText={fieldErrors.currency}
                    />
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
                    <Tab value={0} label="Quote details" />
                    <Tab value={1} label="Summary" />
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
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Part No</th>
                                    <th className="table-header">Part Description</th>
                                    <th className="table-header">Drawing No</th>
                                    <th className="table-header">Revision No</th>
                                    <th className="table-header">Unit</th>
                                    <th className="table-header">Unit Price</th>
                                    <th className="table-header">Qty Offered</th>
                                    <th className="table-header">Basic Price</th>
                                    <th className="table-header">Discount %</th>
                                    <th className="table-header">Discount Amount</th>
                                    <th className="table-header">Quote Amount</th>
                                    <th className="table-header">Delivery Date</th>
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
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.partNo}
                                          style={{ width: '150px' }}
                                          className={detailsTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                          onChange={(e) =>
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, partNo: e.target.value } : r))
                                            )
                                          }
                                        >
                                          <option value="">-- Select --</option>
                                          {accountNames.map((item) => (
                                            <option key={item.id} value={item.accountName}>
                                              {item.accountName}
                                            </option>
                                          ))}
                                        </select>
                                        {detailsTableErrors[index]?.partNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].partNo}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.partDescription}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, partDescription: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partDescription: !value ? 'Sub Ledger Name is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.partDescription ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.partDescription && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].partDescription}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <Autocomplete
                                          disablePortal
                                          options={partyList.map((option, index) => ({ ...option, key: index }))}
                                          getOptionLabel={(option) => option.partyname || ''}
                                          sx={{ width: '100%' }}
                                          size="small"
                                          value={formData.drawingNo ? partyList.find((c) => c.partyname === formData.drawingNo) : null}
                                          onChange={(event, newValue) => {
                                            handleInputChange({
                                              target: {
                                                name: 'drawingNo',
                                                value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                              },
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Drawing No"
                                              name="drawingNo"
                                              error={!!fieldErrors.drawingNo}  // Shows red border if there's an error
                                              helperText={fieldErrors.drawingNo}  // Shows the error message
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 40, width: 200 },
                                              }}
                                            />
                                          )}
                                        />
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.revisionNo}
                                          onChange={(e) => handleDebitChange(e, row, index)}
                                          maxLength="20"
                                          className={detailsTableErrors[index]?.revisionNo ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.revisionNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].revisionNo}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.unit}
                                          onChange={(e) => handleCreditChange(e, row, index)}
                                          maxLength="20"
                                          className={detailsTableErrors[index]?.unit ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {detailsTableErrors[index]?.unit && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].unit}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.unitPrice}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, unitPrice: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unitPrice: !value ? 'unitPrice is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.unitPrice ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {detailsTableErrors[index]?.unitPrice && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].unitPrice}
                                          </div>
                                        )}
                                      </td>

                                      {/*  */}

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.qtyOffered}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, qtyOffered: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qtyOffered: !value ? 'qtyOffered is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.qtyOffered ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {detailsTableErrors[index]?.qtyOffered && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].qtyOffered}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.basicPrice}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, basicPrice: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                basicPrice: !value ? 'basicPrice is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.basicPrice ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.basicPrice && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].basicPrice}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.discount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, discount: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                discount: !value ? 'discount is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.discount ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.discount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].discount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.discountAmount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, discountAmount: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                discountAmount: !value ? 'discountAmount is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.discountAmount ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.discountAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].discountAmount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.quoteAmount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, quoteAmount: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                quoteAmount: !value ? 'quoteAmount is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.quoteAmount ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.quoteAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].quoteAmount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="date"
                                          value={row.deliveryDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, deliveryDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                deliveryDate: !date ? 'Delivery Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.deliveryDate ? 'error form-control' : 'form-control'}
                                        // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
                                        />
                                        {detailsTableErrors[index]?.deliveryDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].deliveryDate}
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
                      <div className="row mt-2">
                        <div className="col-md-3 mb-3">
                          <TextField
                            id="outlined-textarea-zip"
                            label="Gross Amount"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="grossAmount"
                            value={formData.grossAmount}
                            onChange={handleInputChange}
                            helperText={
                              <span style={{ color: 'red' }}>{fieldErrors.grossAmount ? 'Total Credit Amount is required' : ''}</span>
                            }
                            inputProps={{ maxLength: 40 }}
                          />
                        </div>
                        <div className="col-md-5">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="netAmount"
                              label="Net Amount"
                              size="small"
                              name="netAmount"
                              value={formData.netAmount}
                              multiline
                              minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onClick={() => { }}
                              error={!!fieldErrors.netAmount}
                              helperText={fieldErrors.netAmount}
                            />
                          </FormControl>
                        </div>
                      </div>
                      <div className='row mt-3'>
                        <div className="col-md-8">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="amountInWords"
                              label="amountInWords"
                              size="small"
                              name="amountInWords"
                              value={formData.amountInWords}
                              multiline
                              minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.amountInWords}
                              helperText={fieldErrors.amountInWords}
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
export default Quotation;
