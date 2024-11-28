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

const WorkJobOutOrder = () => {
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
    jwOrderDate: dayjs(),
    jwOrderNo: '',
    dcNo: '',
    routeCardNo: '',
    enquiryNo: '',
    enquiryDate: dayjs(),
    orgId: orgId,
    referenceDate: null,
    poNo: '',
    contractorName: '',
    customerName: '',
    quotationNo: '',
    currency: '',


    grossAmount: "",
    amountInWords: "",
    netAmount: '',
  });

  const [fieldErrors, setFieldErrors] = useState({

    active: true,
    date: dayjs(),
    jwOrderNo: '',
    dcNo: '',
    routeCardNo: '',
    enquiryNo: '',
    enquiryDate: dayjs(),
    orgId: orgId,
    referenceDate: null,
    poNo: '',
    contractorName: '',
    customerName: '',
    quotationNo: '',
    currency: '',


    grossAmount: '',
    amountInWords: '',
  });

  const listViewColumns = [
    { accessorKey: 'Currency', header: 'Currency', size: 140 },
    { accessorKey: 'routeCardNo', header: 'Ex.Rate', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'jwOrderNo', header: 'Document Id', size: 140 }
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
    getGeneralJournaljwOrderNo();
    getAllGeneralJournalByOrgId();
    getAccountNameFromGroup();
  }, []);

  useEffect(() => {
    const totalDebit = detailsTableData.reduce((sum, row) => sum + Number(row.revisionNo || 0), 0);
    const totalCredit = detailsTableData.reduce((sum, row) => sum + Number(row.unit || 0), 0);

    setFormData((prev) => ({
      ...prev,
      // amountInWords: totalDebit,
      // grossAmount: totalCredit
    }));
  }, [detailsTableData]);

  const getGeneralJournaljwOrderNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getGeneralJournaljwOrderNo?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        jwOrderNo: response.paramObjectsMap.generalJournaljwOrderNo,
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
          jwOrderNo: glVO.jwOrderNo || '',
          currency: glVO.currency || '',
          routeCardNo: glVO.routeCardNo || '',
          refNo: glVO.refNo || '',
          referenceDate: glVO.referenceDate ? dayjs(glVO.referenceDate, 'YYYY-MM-DD') : dayjs(),
          customerName: glVO.customerName || '',
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
          revisionNo: !value ? 'Debit Amount is Required' : ''
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
      date: dayjs(),
      jwOrderNo: '',
      dcNo: '',
      routeCardNo: '',
      enquiryNo: '',
      enquiryDate: dayjs(),
      orgId: orgId,
      referenceDate: null,
      poNo: '',
      contractorName: '',
      customerName: '',
      quotationNo: '',
      currency: '',
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      date: dayjs(),
      routeCardNo: '',
      orgId: orgId,
      referenceDate: null,
      netAmount: '',
      customerName: '',
      grossAmount: '',
      amountInWords: '',
    });
    setDetailsTableData([
      { id: 1, partNo: '', unit: '', drawingNo: '', partDescription: '', revisionNo: '', unitPrice: '', }
    ]);
    setDetailsTableErrors('');
    setEditId('');
    getGeneralJournaljwOrderNo();
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

        // Add error messages for Required fields
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !lastRow.partNo ? 'Part Number is Required' : '',
          unit: !lastRow.unit ? 'Unit is Required' : '',
          unitPrice: !lastRow.unitPrice ? 'Unit Price is Required' : '',
          drawingNo: !lastRow.drawingNo ? 'Drawing Number is Required' : '',
          // partDescription: !lastRow.partDescription ? 'Part Description is Required' : '',
          // revisionNo: !lastRow.revisionNo ? 'Revision Number is Required' : '',
          qtyOffered: !lastRow.qtyOffered ? 'Quantity Offered is Required' : '',
          basicPrice: !lastRow.basicPrice ? 'Basic Price is Required' : '',
          discount: !lastRow.discount ? 'Discount is Required' : '',
          discountAmount: !lastRow.discountAmount ? 'Discount Amount is Required' : '',
          quoteAmount: !lastRow.quoteAmount ? 'Quote Amount Amount is Required' : '',
          deliveryDate: !lastRow.deliveryDate ? 'Delivery Date is Required' : ''
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
    // if (!formData.jwOrderNo) errors.jwOrderNo = 'Quote Number is Required';
    if (!formData.dcNo) errors.dcNo = 'DC No is Required';
    if (!formData.routeCardNo) errors.routeCardNo = 'Route Card No is Required';
    if (!formData.enquiryNo) errors.enquiryNo = 'Enquiry Number is Required';
    if (!formData.referenceDate) errors.referenceDate = 'Reference Date is Required';
    if (!formData.poNo) errors.poNo = 'Po No is Required';
    if (!formData.contractorName) errors.contractorName = 'Contractor Name is Required';
    if (!formData.customerName) errors.customerName =   'Customer Name is Required';
    if (!formData.quotationNo) errors.quotationNo = 'Production Manager is Required';
    if (!formData.currency) errors.currency = 'Currency is Required';
    if (!formData.grossAmount) errors.grossAmount = 'Gross Amount is Required';
    if (!formData.amountInWords) errors.amountInWords = 'Amount in Words is Required';
    if (!formData.netAmount) errors.netAmount = 'Net Amount is Required';

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'Part No is Required';
        detailTableDataValid = false;
      }
      // if (!row.partDescription) {
      //   rowErrors.partDescription = 'Part Description is Required';
      //   detailTableDataValid = false;
      // }
      if (!formData.drawingNo) {
        errors.drawingNo = 'Drawing No is Required'; // Custom error message
        isValid = false;
      }
      // if (!row.revisionNo) {
      //   rowErrors.revisionNo = 'Revision No  is Required';
      //   detailTableDataValid = false;
      // }
      if (!row.unit) {
        rowErrors.unit = ' Unit is Required';
        detailTableDataValid = false;
      }
      if (!row.unitPrice) {
        rowErrors.unitPrice = 'Unit Price  is Required';
        detailTableDataValid = false;
      }
      if (!row.qtyOffered) {
        rowErrors.qtyOffered = 'Qty Offered is Required';
        detailTableDataValid = false;
      }
      if (!row.basicPrice) {
        rowErrors.basicPrice = 'Basic Price is Required';
        detailTableDataValid = false;
      }
      if (!row.discount) {
        rowErrors.discount = 'Discount is Required';
        detailTableDataValid = false;
      }
      if (!row.discountAmount) {
        rowErrors.discountAmount = 'DiscountAmount is Required';
        detailTableDataValid = false;
      }
      if (!row.quoteAmount) {
        rowErrors.quoteAmount = 'Quote Amount is Required';
        detailTableDataValid = false;
      }
      if (!row.deliveryDate) {
        rowErrors.deliveryDate = 'Delivery Date is Required';
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
        routeCardNo: formData.routeCardNo,
        finYear: finYear,
        orgId: orgId,
        particularsJournalDTO: GeneralJournalVO,
        referenceDate: dayjs(formData.referenceDate).format('YYYY-MM-DD'),
        refNo: formData.refNo,
        customerName: formData.customerName,
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
                    label="JW Order No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="jwOrderNo"
                    value={formData.jwOrderNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="JW Order Date"
                        value={formData.jwOrderDate}
                        onChange={(date) => handleDateChange('jwOrderDate', date)}
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
                    value={formData.dcNo ? partyList.find((c) => c.partyname === formData.dcNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'dcNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="DC No"
                        name="dcNo"
                        error={!!fieldErrors.dcNo}  // Shows error if dcNo has a value in fieldErrors
                        helperText={fieldErrors.dcNo} // Displays the error message
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
                    label="Route Card No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="routeCardNo"
                    value={formData.routeCardNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
               
           
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="poNo"
                      label="PO No"
                      // label={
                      //   <span>
                      //     Drawing Id <span className="asterisk">*</span>
                      //   </span>
                      // }
                      name="poNo"
                      size="small"
                      value={formData.poNo}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.poNo}
                      helperText={fieldErrors.poNo}
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
                    value={formData.quotationNo ? partyList.find((c) => c.partyname === formData.quotationNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'quotationNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
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
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="customerName"
                      label="Customer Name"
                      size="small"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      disabled
                      inputProps={{ maxLength: 10 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Contractor Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="contractorName"
                    value={formData.contractorName}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.contractorName}
                    helperText={fieldErrors.contractorName}
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
                                          style={{ width: '200px' }}
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
                                                partDescription: !value ? 'Sub Ledger Name is Required' : ''
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
                                                unitPrice: !value ? 'unitPrice is Required' : ''
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
                                                qtyOffered: !value ? 'qtyOffered is Required' : ''
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
                                                basicPrice: !value ? 'basicPrice is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.basicPrice ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
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
                                                discount: !value ? 'discount is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.discount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
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
                                                discountAmount: !value ? 'discountAmount is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.discountAmount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
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
                                                quoteAmount: !value ? 'quoteAmount is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.quoteAmount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
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
                                                deliveryDate: !date ? 'Delivery Date is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.deliveryDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
                                          style={{ width: '150px' }}
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
                              <span style={{ color: 'red' }}>{fieldErrors.grossAmount ? 'Total Credit Amount is Required' : ''}</span>
                            }
                            inputProps={{ maxLength: 40 }}
                          />
                        </div>
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="netAmount"
                              label="Net Amount"
                              size="small"
                              name="netAmount"
                              value={formData.netAmount}
                              multiline
                              // minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.netAmount}
                              helperText={fieldErrors.netAmount}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="Amount In Words"
                              label="Amount In Words"
                              size="small"
                              name="amountInWords"
                              value={formData.amountInWords}
                              multiline
                              // minRows={2}
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
export default WorkJobOutOrder;
