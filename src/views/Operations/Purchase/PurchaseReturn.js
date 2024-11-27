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

const PurchaseReturn = () => {
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
    purchaseReturnDate: dayjs(),
    purchasepReturnNo: '',
    supplierName: '',
    supplierCode: '',
    purchaseInvoiceNo: '',
    customerName: '',
    purchaseInvoiceDate: '',
    grnTime: '',
    poNoPcNo: '',
    gstNo: '',
    gstState: '',
    address: '',
    gatePassNo: '',
    isReverseChrg: '',
    currency: '',
    exchangeRate: '',
    invDcNo: '',
    invdcDate: null,
    gstType: '',
    toLocation: '',
    orgId: orgId,
    totalAmountTax: "",
    netAmount: '',
    totalAmount: '',
    remarks: '',
    amountInWords: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    purchaseReturnDate: dayjs(),
    purchasepReturnNo: '',
    supplierName: '',
    supplierCode: '',
    purchaseInvoiceNo: '',
    customerName: '',
    purchaseInvoiceDate: '',
    grnTime: '',
    poNoPcNo: '',
    gstNo: '',
    gstState: '',
    address: '',
    gatePassNo: '',
    isReverseChrg: '',
    currency: '',
    exchangeRate: '',
    invDcNo: '',
    invdcDate: null,
    gstType: '',
    toLocation: '',
    orgId: orgId,
    totalAmountTax: "",
    netAmount: '',
    totalAmount: '',
    remarks: '',
    amountInWords: '',
  });

  const listViewColumns = [
    { accessorKey: 'address', header: 'address', size: 140 },
    { accessorKey: 'supplierCode', header: 'Ex.Rate', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'purchasepReturnNo', header: 'Document Id', size: 140 }
  ];

  const [purchaseReturnTable, setPurchaseReturnTable] = useState([
    {
      id: 1,
      itemCode: '',
      itemName: '',
      hsnSacCode: '', 
      taxCode: '', 
      primaryUnit: '',
      poRate: '',
      rejectQty: '',
      unitPrice: '',
      amount: '',
      sgst: '',
      cgst: '',
      igst: '',
      taxValue: '', 
      landedValue:'',
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      id: 1,
      itemCode: '',
      itemName: '',
      hsnSacCode: '', 
      taxCode: '', 
      primaryUnit: '',
      poRate: '',
      rejectQty: '',
      unitPrice: '',
      amount: '',
      sgst: '',
      cgst: '',
      igst: '',
      taxValue: '', 
      landedValue:'',
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
    getGeneralJournalpurchasepReturnNo();
    getAllGeneralJournalByOrgId();
    getAccountNameFromGroup();
  }, []);

  useEffect(() => {
    const totalDebit = purchaseReturnTable.reduce((sum, row) => sum + Number(row.taxCode || 0), 0);
    const totalCredit = purchaseReturnTable.reduce((sum, row) => sum + Number(row.unit || 0), 0);

    setFormData((prev) => ({
      ...prev,
      amountInWords: totalDebit,
      totalAmountTax: totalCredit
    }));
  }, [purchaseReturnTable]);

  const getGeneralJournalpurchasepReturnNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getGeneralJournalpurchasepReturnNo?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        purchasepReturnNo: response.paramObjectsMap.generalJournalpurchasepReturnNo,
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
          purchaseReturnDate: glVO.purchaseReturnDate ? dayjs(glVO.date, 'YYYY-MM-DD') : dayjs(),
          purchasepReturnNo: glVO.purchasepReturnNo || '',
          address: glVO.address || '',
          supplierCode: glVO.supplierCode || '',
          refNo: glVO.refNo || '',
          invdcDate: glVO.invdcDate ? dayjs(glVO.invdcDate, 'YYYY-MM-DD') : dayjs(),
          gstNo: glVO.gstNo || '',
          orgId: glVO.orgId || '',
          amountInWords: glVO.amountInWords || '',
          totalAmountTax: glVO.totalAmountTax || ''
          // active: glVO.active || false,
        });
        setPurchaseReturnTable(
          glVO.particularsJournalVO.map((row) => ({
            id: row.id,
            itemCode: row.itemCode,
            unit: row.unit,
            taxCode: row.taxCode,
            primaryUnit: row.primaryUnit,
            hsnSacCode: row.hsnSacCode,
            itemName: row.itemName
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
      setPurchaseReturnTable((prev) => prev.map((r) => (r.id === row.id ? { ...r, taxCode: value, unit: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          taxCode: !value ? 'Debit Amount is Required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleCreditChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setPurchaseReturnTable((prev) => prev.map((r) => (r.id === row.id ? { ...r, unit: value, taxCode: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          unit: !value ? 'Credit Amount is Required' : ''
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
      purchaseReturnDate: dayjs(),
      supplierCode: '',
      orgId: orgId,
      invdcDate: null,

      gstNo: '',
      totalAmountTax: 0,
      amountInWords: 0,
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({

      date: null,
      supplierCode: '',
      orgId: orgId,
      invdcDate: '',

      gstNo: '',
    });
    setPurchaseReturnTable([
      { id: 1, itemCode: '', unit: '', hsnSacCode: '', itemName: '', taxCode: '', primaryUnit: '', }
    ]);
    setDetailsTableErrors('');
    setEditId('');
    getGeneralJournalpurchasepReturnNo();
  };


  const handleAddRow = () => {
    if (isLastRowEmpty(purchaseReturnTable)) {
      displayRowError(purchaseReturnTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      itemCode: '',
      itemName: '',
      hsnSacCode: '', 
      taxCode: '', 
      primaryUnit: '',
      poRate: '',
      rejectQty: '',
      unitPrice: '',
      amount: '',
      sgst: '',
      cgst: '',
      igst: '',
      taxValue: '', 
      landedValue:'',
    };
    setPurchaseReturnTable([...purchaseReturnTable, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { itemCode: '', unit: '', taxCode: '', primaryUnit: '', }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false; 

    if (table === purchaseReturnTable) {
      return (
        !lastRow.itemCode || 
        !lastRow.itemName || 
        !lastRow.hsnSacCode || 
        !lastRow.taxCode || 
        !lastRow.primaryUnit || 
        !lastRow.poRate || 
        !lastRow.rejectQty || 
        !lastRow.unitPrice || 
        !lastRow.amount || 
        !lastRow.sgst || 
        !lastRow.cgst || 
        !lastRow.igst || 
        !lastRow.taxValue || 
        !lastRow.landedValue
      );
    }
    return false;
};


  const displayRowError = (table) => {
    if (table === purchaseReturnTable) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        const lastRow = table[table.length - 1];
 
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          itemCode: !lastRow.itemCode ? 'Item Code is Required' : '', 
          itemName: !lastRow.itemName ? 'ItemName is Required' : '', 
          hsnSacCode: !lastRow.hsnSacCode ? 'HSNSAC Code is Required' : '', 
          taxCode: !lastRow.taxCode ? 'Tax Code is Required' : '', 
          primaryUnit: !lastRow.primaryUnit ? 'Primary Unit is Required' : '', 
          poRate: !lastRow.poRate ? 'Po Rate is Required' : '', 
          rejectQty: !lastRow.rejectQty ? 'Reject Qty is Required' : '', 
          unitPrice: !lastRow.unitPrice ? 'Unit Price is Required' : '', 
          amount: !lastRow.amount ? 'Amount is Required' : '', 
          sgst: !lastRow.sgst ? 'SGST is Required' : '', 
          cgst: !lastRow.cgst ? 'CGST is Required' : '', 
          igst: !lastRow.igst ? 'IGST is Required' : '', 
          taxValue: !lastRow.taxValue ? 'Tax Value is Required' : '', 
          landedValue: !lastRow.landedValue ? 'Landed Value is Required' : '', 
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
    if (!formData.purchaseReturnDate) errors.purchaseReturnDate = 'Purchase Return Date is Required'; 
    if (!formData.purchasepReturnNo) errors.purchasepReturnNo = 'Purchasep ReturnNo is Required'; 
    if (!formData.supplierName) errors.supplierName = 'SupplierName is Required'; 
    if (!formData.supplierCode) errors.supplierCode = 'SupplierCode is Required'; 
    if (!formData.purchaseInvoiceNo) errors.purchaseInvoiceNo = 'Purchase InvoiceNo is Required'; 
    if (!formData.customerName) errors.customerName = 'Customer Name is Required'; 
    if (!formData.purchaseInvoiceDate) errors.purchaseInvoiceDate = 'Purchase Invoice Date is Required'; 
    if (!formData.grnTime) errors.grnTime = 'GRN Time is Required'; 
    if (!formData.poNoPcNo) errors.poNoPcNo = 'PoNo PcNo is Required'; 
    if (!formData.gstNo) errors.gstNo = 'GST NO is Required'; 
    if (!formData.gstState) errors.gstState = 'GST State is Required'; 
    if (!formData.address) errors.address = 'Address is Required'; 
    if (!formData.gatePassNo) errors.gatePassNo = 'Gate PassNo is Required'; 
    if (!formData.isReverseChrg) errors.isReverseChrg = 'Is Reverse Chrg is Required'; 
    if (!formData.currency) errors.currency = 'Currency is Required'; 
    if (!formData.exchangeRate) errors.exchangeRate = 'Exchange Rate is Required'; 
    if (!formData.invDcNo) errors.invDcNo = 'InvDcNo is Required'; 
    if (!formData.invdcDate) errors.invdcDate = 'InvdcDate is Required'; 
    if (!formData.gstType) errors.gstType = 'GST Type is Required'; 
    if (!formData.toLocation) errors.toLocation = 'To Location is Required'; 
    if (!formData.totalAmountTax) errors.totalAmountTax = 'Total Amount Tax is Required'; 
    if (!formData.netAmount) errors.netAmount = 'Net Amount is Required'; 
    if (!formData.totalAmount) errors.totalAmount = 'Total Amount is Required'; 
    if (!formData.remarks) errors.remarks = 'Remarks is Required'; 
    if (!formData.amountInWords) errors.amountInWords = 'Amount InWords is Required'; 

    let detailTableDataValid = true;
    const newTableErrors = purchaseReturnTable.map((row) => {
      const rowErrors = {};
      if (!row.itemCode) {
        rowErrors.itemCode = 'Part No is Required';
        detailTableDataValid = false;
      }
      if (!row.itemName) {
        rowErrors.itemName = 'Part Description is Required';
        detailTableDataValid = false;
      }
      if (!formData.hsnSacCode) {
        errors.hsnSacCode = 'hsnSacCode No is Required';   
      }
      if (!row.taxCode) {
        rowErrors.taxCode = 'Tax Code  is Required';
        detailTableDataValid = false;
      }
      if (!row.unit) {
        rowErrors.unit = ' unit is Required';
        detailTableDataValid = false;
      }
      if (!row.primaryUnit) {
        rowErrors.primaryUnit = 'primaryUnit  is Required';
        detailTableDataValid = false;
      }
      if (!row.poRate) {
        rowErrors.poRate = 'poRate is Required';
        detailTableDataValid = false;
      }
      if (!row.rejectQty) {
        rowErrors.rejectQty = 'rejectQty is Required';
        detailTableDataValid = false;
      }
      if (!row.unitPrice) {
        rowErrors.unitPrice = 'UnitPrice is Required';
        detailTableDataValid = false;
      }
      if (!row.amount) {
        rowErrors.amount = 'amount is Required';
        detailTableDataValid = false;
      }
      if (!row.sgst) {
        rowErrors.sgst = 'sgst is Required';
        detailTableDataValid = false;
      }
      if (!row.cgst) {
        rowErrors.cgst = 'cgst is Required';
        detailTableDataValid = false;
      }
      if (!row.igst) {
        rowErrors.igst = 'IGST is Required';
        detailTableDataValid = false;
      }
      if (!row.taxValue) {
        rowErrors.taxValue = 'Tac Value is Required';
        detailTableDataValid = false;
      }
      if (!row.landedValue) {
        rowErrors.landedValue = 'Landed Value is Required';
        detailTableDataValid = false;
      }
  


      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = purchaseReturnTable.map((row) => ({
        ...(editId && { id: row.id }),
        itemCode: row.itemCode,
        unit: row.unit,
        taxCode: row.taxCode,
        primaryUnit: row.primaryUnit,
        hsnSacCode: row.hsnSacCode,
        itemName: row.itemName
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        address: formData.address,
        supplierCode: formData.supplierCode,
        finYear: finYear,
        orgId: orgId,
        particularsJournalDTO: GeneralJournalVO,
        invdcDate: dayjs(formData.invdcDate).format('YYYY-MM-DD'),
        refNo: formData.refNo,
        gstNo: formData.gstNo,
        totalAmountTax: formData.totalAmountTax,
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
                    label="Purchasep ReturnNo"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="purchasepReturnNo"
                    value={formData.purchasepReturnNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Purchase Return Date"
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        value={formData.purchaseReturnDate || null}
                        onChange={(newValue) => setFormData({ ...formData, purchaseReturnDate: newValue })}
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
                    value={formData.supplierName ? partyList.find((c) => c.partyname === formData.supplierName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'supplierName',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer Name"
                        name="supplierName"
                        error={!!fieldErrors.supplierName}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.supplierName} // Displays the error message
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
                    label="supplierCode"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="supplierCode"
                    value={formData.supplierCode}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Customer Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerName"
                    value={formData.customerName}
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
                    value={formData.purchaseInvoiceNo ? partyList.find((c) => c.partyname === formData.purchaseInvoiceNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'purchaseInvoiceNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Purchase Invoice No"
                        name="purchaseInvoiceNo"
                        error={!!fieldErrors.purchaseInvoiceNo}
                        helperText={fieldErrors.purchaseInvoiceNo}
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
                        label="Purchase Invoice Date"
                        value={formData.purchaseInvoiceDate ? dayjs(formData.purchaseInvoiceDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('purchaseInvoiceDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.purchaseInvoiceDate}
                        helperText={fieldErrors.purchaseInvoiceDate ? fieldErrors.purchaseInvoiceDate : ''}
                        disabled
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="grnTime"
                      label="GRN Time"
                      // label={
                      //   <span>
                      //     Drawing Id <span className="asterisk">*</span>
                      //   </span>
                      // }
                      name="grnTime"
                      size="small"
                      value={formData.grnTime}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.grnTime}
                      helperText={fieldErrors.grnTime}
                      disabled
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="PO No/PC No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="poNoPcNo"
                    value={formData.poNoPcNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="gstNo"
                      label="GST No"
                      size="small"
                      name="gstNo"
                      value={formData.gstNo}
                      onChange={handleInputChange}
                      disabled
                      inputProps={{ maxLength: 10 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="gstState"
                      label="GST State"
                      size="small"
                      name="gstState"
                      value={formData.gstState}
                      onChange={handleInputChange}
                      disabled
                      inputProps={{ maxLength: 10 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="address"
                      label="Address"
                      // label={
                      //   <span>
                      //     Drawing Id <span className="asterisk">*</span>
                      //   </span>
                      // }
                      name="address"
                      size="small"
                      value={formData.address}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.address}
                      helperText={fieldErrors.address}
                      disabled
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="gatePassNo"
                      label="Gate Pass No"
                      name="gatePassNo"
                      size="small"
                      value={formData.gatePassNo}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.gatePassNo}
                      helperText={fieldErrors.gatePassNo}
                      disabled
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="isReverseChrg"
                      label="is Reverse Chrg"
                      name="isReverseChrg"
                      size="small"
                      value={formData.isReverseChrg}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.isReverseChrg}
                      helperText={fieldErrors.isReverseChrg}
                      disabled
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="currency"
                      label="Currency"
                      name="currency"
                      size="small"
                      value={formData.currency}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.currency}
                      helperText={fieldErrors.currency}
                      disabled
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="exchangeRate"
                      label="Exchange Rate"
                      name="exchangeRate"
                      size="small"
                      value={formData.exchangeRate}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.exchangeRate}
                      helperText={fieldErrors.exchangeRate}
                      disabled
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="invDcNo"
                      label="INV /DC-No"
                      name="invDcNo"
                      size="small"
                      value={formData.invDcNo}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.invDcNo}
                      helperText={fieldErrors.invDcNo}
                      disabled
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="INV /DC-Date"
                        value={formData.invdcDate}
                        onChange={(date) => handleDateChange('invdcDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        disabled
                      />
                    </LocalizationProvider>
                    {/* {fieldErrors.invdcDate && <p className="dateErrMsg">Ref Date is Required</p>} */}
                    {fieldErrors.invdcDate && (
                      <p className="dateErrMsg">Ref Date is Required</p>
                    )}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="gstType"
                      label="GST Type"
                      name="gstType"
                      size="small"
                      value={formData.gstType}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.gstType}
                      helperText={fieldErrors.gstType}
                      disabled
                    />
                  </FormControl>
                </div>
              </div>
              <div className='row d-flex ml'>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.toLocation ? partyList.find((c) => c.partyname === formData.toLocation) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'toLocation',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    clearIcon={<ClearIcon />} // Custom clear icon
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="To Location"
                        name="toLocation"
                        error={!!fieldErrors.toLocation}
                        helperText={fieldErrors.toLocation}
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
                    <Tab value={0} label="Item" />
                    <Tab value={1} label="Purchase Return Summary" />
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
                                    <th className="table-header">Item Code</th>
                                    <th className="table-header">Item Name</th>
                                    <th className="table-header">HSN/SAC Code</th>
                                    <th className="table-header">Tax Code</th> 
                                    <th className="table-header">Primary Unit</th>
                                    <th className="table-header">PO Rate</th>
                                    <th className="table-header">Reject Qty</th>
                                    <th className="table-header">Unit Price</th>
                                    <th className="table-header">Amount</th>
                                    <th className="table-header">SGST %</th>
                                    <th className="table-header">CGST %</th>
                                    <th className="table-header">IGST %</th>
                                    <th className="table-header">Tax Value</th>
                                    <th className="table-header">Landed Value</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {purchaseReturnTable.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              purchaseReturnTable,
                                              setPurchaseReturnTable,
                                              detailsTableErrors,
                                              setDetailsTableErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td>
                                        <Autocomplete
                                          disablePortal
                                          options={partyList.map((option, index) => ({ ...option, key: index }))}
                                          getOptionLabel={(option) => option.partyname || ''}
                                          sx={{ width: '100%' }}
                                          size="small"
                                          value={formData.itemCode ? partyList.find((c) => c.partyname === formData.itemCode) : null}
                                          onChange={(event, newValue) => {
                                            handleInputChange({
                                              target: {
                                                name: 'itemCode',
                                                value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                              },
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Item Code"
                                              name="itemCode"
                                              error={!!fieldErrors.itemCode}  // Shows red border if there's an error
                                              helperText={fieldErrors.itemCode}  // Shows the error message
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
                                          value={row.itemName}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, itemName: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemName: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.itemName ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.itemName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].itemName}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          value={row.hsnSacCode}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, hsnSacCode: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                hsnSacCode: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.hsnSacCode ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.hsnSacCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].hsnSacCode}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.taxCode}
                                          onChange={(e) => handleDebitChange(e, row, index)}
                                          maxLength="20"
                                          className={detailsTableErrors[index]?.taxCode ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.taxCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].taxCode}
                                          </div>
                                        )}
                                      </td>
                                      {/* <td className="border px-2 py-2">
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
                                      </td> */}

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.primaryUnit}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, primaryUnit: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                primaryUnit: !value ? 'primaryUnit is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.primaryUnit ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.primaryUnit && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].primaryUnit}
                                          </div>
                                        )}
                                      </td>

                                      {/*  */}

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.poRate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, poRate: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                poRate: !value ? 'poRate is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.poRate ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.poRate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].poRate}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.rejectQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, rejectQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                rejectQty: !value ? 'rejectQty is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.rejectQty ? 'error form-control' : 'form-control'}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.rejectQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].rejectQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.unitPrice}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, unitPrice: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unitPrice: !value ? 'UnitPrice is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.unitPrice ? 'error form-control' : 'form-control'}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.unitPrice && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].unitPrice}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.amount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                amount: !value ? 'amount is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.amount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].amount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sgst}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, sgst: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sgst: !value ? 'sgst is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.sgst ? 'error form-control' : 'form-control'}
                                          style={{width:'100px'}}
                                        />
                                        {detailsTableErrors[index]?.sgst && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].sgst}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.cgst}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, cgst: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                cgst: !value ? 'cgst is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.cgst ? 'error form-control' : 'form-control'}
                                          style={{width:'100px'}}
                                        />
                                        {detailsTableErrors[index]?.cgst && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].cgst}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.igst}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, igst: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                igst: !value ? 'IGST is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.igst ? 'error form-control' : 'form-control'}
                                          style={{width:'100px'}}
                                        />
                                        {detailsTableErrors[index]?.igst && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].igst}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.taxValue}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, taxValue: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                taxValue: !value ? 'Tax Value is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.taxValue ? 'error form-control' : 'form-control'}
                                          style={{width:'100px'}}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.taxValue && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].taxValue}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.landedValue}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPurchaseReturnTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, landedValue: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                landedValue: !value ? 'Landed Value is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.landedValue ? 'error form-control' : 'form-control'}
                                          style={{width:'100px'}} 
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
                      <div className="row mt-2">
                        <div className="col-md-3 mb-3">
                          <TextField
                            id="outlined-textarea-zip"
                            label="Total Amount Tax"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="totalAmountTax"
                            value={formData.totalAmountTax}
                            onChange={handleInputChange}
                            helperText={
                              <span style={{ color: 'red' }}>{fieldErrors.totalAmountTax ? 'Total Credit Amount is Required' : ''}</span>
                            }
                            inputProps={{ maxLength: 40 }}
                          />
                        </div>
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="outlined-textarea-zip"
                              label="Net Amount"
                              variant="outlined"
                              size="small"
                              fullWidth
                              name="netAmount"
                              value={formData.netAmount}
                              onChange={handleInputChange}
                              helperText={
                                <span style={{ color: 'red' }}>{fieldErrors.netAmount ? 'netAmount is Required' : ''}</span>
                              }
                              inputProps={{ maxLength: 40 }}
                            />
                          </FormControl>
                        </div>
                      </div>
                      <div className='row mt-3'>
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="outlined-textarea-zip"
                              label="Total Amount"
                              variant="outlined"
                              size="small"
                              fullWidth
                              name="totalAmount"
                              value={formData.totalAmount}
                              onChange={handleInputChange}
                              helperText={
                                <span style={{ color: 'red' }}>{fieldErrors.totalAmount ? 'totalAmount is Required' : ''}</span>
                              }
                              inputProps={{ maxLength: 40 }}
                            />
                          </FormControl>
                        </div>
                      </div>
                      <div className='row mt-3'>
                        <div className="col-md-6">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="outlined-textarea-zip"
                              label="Remarks"
                              variant="outlined"
                              size="small"
                              fullWidth
                              name="remarks"
                              value={formData.remarks}
                              onChange={handleInputChange}
                              helperText={
                                <span style={{ color: 'red' }}>{fieldErrors.remarks ? 'remarks is Required' : ''}</span>
                              }
                              inputProps={{ maxLength: 40 }}
                            />
                          </FormControl>
                        </div>
                      </div>
                      <div className='row mt-3'>
                        <div className="col-md-6">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="outlined-textarea-zip"
                              label="Amount in Words"
                              variant="outlined"
                              size="small"
                              fullWidth
                              name="amountInWords"
                              value={formData.amountInWords}
                              onChange={handleInputChange}
                              helperText={
                                <span style={{ color: 'red' }}>{fieldErrors.amountInWords ? 'Amount In Words is Required' : ''}</span>
                              }
                              inputProps={{ maxLength: 40 }}
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
export default PurchaseReturn;
