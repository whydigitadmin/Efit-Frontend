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
import { Approval } from '@mui/icons-material';

const SampleApproval = () => {
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
    sampleApprovalNo: '',
    sampleApprovalDate: dayjs(),
    routeCardNo: '', 
    partNo: '',
    drgNo: '',
    partName: '',
    contractorName: '',
    contractorCode: '',
    destination: '',
    dispatchedThrough: '',
    durationOfProcess: '',
    taxType: '',
    orgId: orgId,
    // Job Work Amount
    termsOfPayment: '',
    totalAmount: '',
    amountInWords: '',
    totalGrossAmt: '',
    totalTax: '',
    // Summary
    narration: '',

  });

  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    sampleApprovalNo: '',
    sampleApprovalDate: dayjs(),
    routeCardNo: '', 
    partNo: '',
    drgNo: '',
    partName: '',
    contractorName: '',
    contractorCode: '',
    destination: '',
    dispatchedThrough: '',
    durationOfProcess: '',
    taxType: '',
    orgId: orgId,
    // Job Work Amount
    termsOfPayment: '',
    totalAmount: '',
    amountInWords: '',
    totalGrossAmt: '',
    totalTax: '',
    // Summary
    narration: '',
  });

  const listViewColumns = [
    { accessorKey: 'Contractor Code', header: 'Contractor Code', size: 140 }, 
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'sampleApprovalNo', header: 'Document Id', size: 140 }
  ];

  const [workJobTableData, setWorkJobTableData] = useState([
    {
      id: 1,
      part: '',
      partDescription: '',
      process: '',
      dueOn: '',
      quantityNos: '',
      rate: '',
      grossAmount: '',
      taxCode: '',
      discount: '',
      discountAmount: '',
      netAmount: '',
      sgst: '',
      cgst: '',
      igst: '',
      taxamt: '',
      amount: '',
    }
  ]);
  const [workJobTableErrors, setworkJobTableErrors] = useState([
    {
      id: 1,
      part: '',
      partDescription: '',
      process: '',
      dueOn: '',
      quantityNos: '',
      rate: '',
      grossAmount: '',
      taxCode: '',
      discount: '',
      discountAmount: '',
      netAmount: '',
      sgst: '',
      cgst: '',
      igst: '',
      taxamt: '',
      amount: '',
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
    getGeneralJournalsampleApprovalNo();
    getAllGeneralJournalByOrgId();
    getAccountNameFromGroup();
  }, []);

  useEffect(() => {
    const totalDebit = workJobTableData.reduce((sum, row) => sum + Number(row.revisionNo || 0), 0);
    const totalCredit = workJobTableData.reduce((sum, row) => sum + Number(row.unit || 0), 0);

    setFormData((prev) => ({
      ...prev,
      // termsOfPayment: totalDebit, 
    }));
  }, [workJobTableData]);

  const getGeneralJournalsampleApprovalNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getGeneralJournalsampleApprovalNo?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        sampleApprovalNo: response.paramObjectsMap.generalJournalsampleApprovalNo,
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
          sampleApprovalNo: glVO.sampleApprovalNo || '', 
          refNo: glVO.refNo || '',
          referenceDate: glVO.referenceDate ? dayjs(glVO.referenceDate, 'YYYY-MM-DD') : dayjs(),
          contractorName: glVO.contractorName || '',
          orgId: glVO.orgId || '',
          termsOfPayment: glVO.termsOfPayment || '',
          // active: glVO.active || false,
        });
        setWorkJobTableData(
          glVO.particularsJournalVO.map((row) => ({
            id: row.id,
            part: row.part,
            unit: row.unit,
            revisionNo: row.revisionNo,
            unitPrice: row.unitPrice,
            part: row.part,
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
      setWorkJobTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, revisionNo: value, unit: value ? '0' : '' } : r)));

      setworkJobTableErrors((prev) => {
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
      setWorkJobTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, unit: value, revisionNo: value ? '0' : '' } : r)));

      setworkJobTableErrors((prev) => {
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
  
    // Handle form validation and errors
    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else { 
      setFormData({ ...formData, [name]: value });
   
      setFieldErrors({ ...fieldErrors, [name]: '' });
   
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
      sampleApprovalNo: '',
      sampleApprovalDate: dayjs(),
      routeCardNo: '', 
      partNo: '',
      drgNo: '',
      partName: '',
      contractorName: '',
      contractorCode: '',
      destination: '',
      dispatchedThrough: '',
      durationOfProcess: '',
      taxType: '',
      orgId: orgId,
      // Job Work Amount
      termsOfPayment: '',
      totalAmount: '',
      amountInWords: '',
      totalGrossAmt: '',
      totalTax: '',
      // Summary
      narration: '',
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      sampleApprovalNo: '',
      sampleApprovalDate: dayjs(),
      routeCardNo: '', 
      partNo: '',
      drgNo: '',
      partName: '',
      contractorName: '',
      contractorCode: '',
      destination: '',
      dispatchedThrough: '',
      durationOfProcess: '',
      taxType: '',
      orgId: orgId,
      // Job Work Amount
      termsOfPayment: '',
      totalAmount: '',
      amountInWords: '',
      totalGrossAmt: '',
      totalTax: '',
      // Summary
      narration: '',
    });
    setWorkJobTableData([
      {
        id: 1,
        part: '',
        partDescription: '',
        process: '',
        dueOn: '',
        quantityNos: '',
        rate: '',
        grossAmount: '',
        taxCode: '',
        discount: '',
        discountAmount: '',
        netAmount: '',
        sgst: '',
        cgst: '',
        igst: '',
        taxamt: '',
        amount: '',
      }
    ]);
    setworkJobTableErrors('');
    setEditId('');
    getGeneralJournalsampleApprovalNo();
  };


  const handleAddRow = () => {
    if (isLastRowEmpty(workJobTableData)) {
      displayRowError(workJobTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      part: '',
      unit: '',
      partDescription: '',
      revisionNo: '',
      unitPrice: '',
    };
    setWorkJobTableData([...workJobTableData, newRow]);
    setworkJobTableErrors([...workJobTableErrors, {
      part: '',
      partDescription: '',
      process: '',
      dueOn: '',
      quantityNos: '',
      rate: '',
      grossAmount: '',
      taxCode: '',
      discount: '',
      discountAmount: '',
      netAmount: '',
      sgst: '',
      cgst: '',
      igst: '',
      taxamt: '',
      amount: ''
    }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === workJobTableData) {
      return (
        !lastRow.part || !lastRow.part.trim() ||
        !lastRow.partDescription || !lastRow.partDescription.trim() ||
        !lastRow.process || !lastRow.process.trim() ||
        !lastRow.dueOn || !lastRow.dueOn.trim() ||
        !lastRow.quantityNos || !lastRow.quantityNos.trim() ||
        !lastRow.rate || !lastRow.rate.trim() ||
        !lastRow.grossAmount || !lastRow.grossAmount.trim() ||
        !lastRow.taxCode || !lastRow.taxCode.trim() ||
        !lastRow.discount || !lastRow.discount.trim() ||
        !lastRow.discountAmount || !lastRow.discountAmount.trim() ||
        !lastRow.netAmount || !lastRow.netAmount.trim() ||
        !lastRow.sgst || !lastRow.sgst.trim() ||
        !lastRow.cgst || !lastRow.cgst.trim() ||
        !lastRow.igst || !lastRow.igst.trim() ||
        !lastRow.taxamt || !lastRow.taxamt.trim() ||
        !lastRow.amount || !lastRow.amount.trim()
      );
    }

    return false;
  };

  const displayRowError = (table) => {
    if (table === workJobTableData) {
      setworkJobTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        const lastRow = table[table.length - 1];

        // Add error messages for Required fields
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          part: !lastRow.part ? 'Part is Required' : '',
          // partDescription: !lastRow.partDescription ? 'PartDescription is Required' : '',
          process: !lastRow.process ? 'Process is Required' : '',
          dueOn: !lastRow.dueOn ? 'Dueon is Required' : '',
          quantityNos: !lastRow.quantityNos ? 'Quantity Nos is Required' : '',
          rate: !lastRow.rate ? 'rate is Required' : '',
          grossAmount: !lastRow.grossAmount ? 'Gross Amount is Required' : '',
          taxCode: !lastRow.taxCode ? 'Tax Code is Required' : '',
          discount: !lastRow.discount ? 'Discount is Required' : '',
          discountAmount: !lastRow.discountAmount ? 'Discount Amount is Required' : '',
          netAmount: !lastRow.netAmount ? 'Net Amount is Required' : '',
          sgst: !lastRow.sgst ? 'SGST is Required' : '',
          cgst: !lastRow.cgst ? 'CGST is Required' : '',
          igst: !lastRow.igst ? 'IGST is Required' : '',
          taxamt: !lastRow.taxamt ? 'Taxamt is Required' : '',
          amount: !lastRow.amount ? 'Amount is Required' : '',
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
    if (!formData.sampleApprovalNo) errors.sampleApprovalNo = 'JW Order No is Required';
    if (!formData.sampleApprovalDate) errors.sampleApprovalDate = 'JW Order Date No is Required';
    if (!formData.routeCardNo) errors.routeCardNo = 'DC No No is Required'; 
    if (!formData.partNo) errors.partNo = 'PO No is Required';
    if (!formData.drgNo) errors.drgNo = 'Quotation No is Required';
    if (!formData.partName) errors.partName = 'Customer Name No is Required';
    if (!formData.contractorName) errors.contractorName = 'Contractor Name is Required';
    if (!formData.contractorCode) errors.contractorCode = 'Contractor Code No is Required';
    // if (!formData.destination) errors.destination = 'destination No is Required';
    if (!formData.dispatchedThrough) errors.dispatchedThrough = 'Dispatched Through is Required';
    if (!formData.durationOfProcess) errors.durationOfProcess = 'Duration Of Process is Required';
    if (!formData.taxType) errors.taxType = 'Tax Type is Required';
    if (!formData.termsOfPayment) errors.termsOfPayment = 'Terms Of Payment is Required';
    if (!formData.totalAmount) errors.totalAmount = 'Total Amount is Required';
    if (!formData.amountInWords) errors.amountInWords = 'Amount In Words is Required';
    if (!formData.totalGrossAmt) errors.totalGrossAmt = 'Total Gross Amt is Required';
    if (!formData.totalTax) errors.totalTax = 'Total Tax is Required';
    if (!formData.narration) errors.narration = 'Narration is Required';

    let detailTableDataValid = true;
    const newTableErrors = workJobTableData.map((row) => {
      const rowErrors = {};
      if (!formData.part) {
        errors.part = 'Part is Required';
        isValid = false;
      }
      if (!row.process) {
        rowErrors.process = ' Process is Required';
        detailTableDataValid = false;
      }
      if (!row.rate) {
        rowErrors.rate = 'Rate is Required';
        detailTableDataValid = false;
      }
      if (!row.grossAmount) {
        rowErrors.grossAmount = 'Gross Amount is Required';
        detailTableDataValid = false;
      }
      if (!row.taxCode) {
        rowErrors.taxCode = 'Tax Code is Required';
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
      if (!row.netAmount) {
        rowErrors.netAmount = 'Net Amount is Required';
        detailTableDataValid = false;
      }
      if (!row.sgst) {
        rowErrors.sgst = 'SGST is Required';
        detailTableDataValid = false;
      }
      if (!row.cgst) {
        rowErrors.cgst = 'CGST is Required';
        detailTableDataValid = false;
      }
      if (!row.igst) {
        rowErrors.igst = 'IGST is Required';
        detailTableDataValid = false;
      }
      if (!row.taxamt) {
        rowErrors.taxamt = 'Taxamt is Required';
        detailTableDataValid = false;
      }
      if (!row.amount) {
        rowErrors.amount = 'Amount is Required';
        detailTableDataValid = false;
      }


      return rowErrors;
    });
    setFieldErrors(errors);

    setworkJobTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = workJobTableData.map((row) => ({
        ...(editId && { id: row.id }),
        part: row.part,
        unit: row.unit,
        revisionNo: row.revisionNo,
        unitPrice: row.unitPrice,
        part: row.part,
        partDescription: row.partDescription
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName, 
        finYear: finYear,
        orgId: orgId,
        particularsJournalDTO: GeneralJournalVO,
        referenceDate: dayjs(formData.referenceDate).format('YYYY-MM-DD'),
        refNo: formData.refNo,
        contractorName: formData.contractorName,
        termsOfPayment: formData.termsOfPayment,
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
                    label="Sample Approval No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="sampleApprovalNo"
                    value={formData.sampleApprovalNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Sample Approval Date"
                        value={formData.sampleApprovalDate}
                        onChange={(date) => handleDateChange('sampleApprovalDate', date)}
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
                    value={formData.routeCardNo ? partyList.find((c) => c.partyname === formData.routeCardNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'routeCardNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Route Card No"
                        name="routeCardNo"
                        error={!!fieldErrors.routeCardNo}  // Shows error if routeCardNo has a value in fieldErrors
                        helperText={fieldErrors.routeCardNo} // Displays the error message
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                {/* <div className="col-md-3 mb-3">
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
                </div> */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="partNo"
                      label="Part No"
                      // label={
                      //   <span>
                      //     Drawing Id <span className="asterisk">*</span>
                      //   </span>
                      // }
                      name="partNo"
                      size="small"
                      value={formData.partNo}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.partNo}
                      helperText={fieldErrors.partNo}
                    />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Part Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="partName"
                    value={formData.partName}
                    onChange={handleInputChange}  
                    inputProps={{ maxLength: 10 }}
                    disabled
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.drgNo ? partyList.find((c) => c.partyname === formData.drgNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'drgNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="DRG No"
                        name="drgNo"
                        error={!!fieldErrors.drgNo}
                        helperText={fieldErrors.drgNo}
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
                    label="Contractor Code"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="contractorCode"
                    value={formData.contractorCode}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Destination"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.destination}
                    helperText={fieldErrors.destination}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Dispatched Through"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="dispatchedThrough"
                    value={formData.dispatchedThrough}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.dispatchedThrough}
                    helperText={fieldErrors.dispatchedThrough}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Duration of Process"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="durationOfProcess"
                    value={formData.durationOfProcess}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.durationOfProcess}
                    helperText={fieldErrors.durationOfProcess}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Tax Type"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="taxType"
                    value={formData.taxType}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.taxType}
                    helperText={fieldErrors.taxType}
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
                    <Tab value={0} label="Job Work Out Order" />
                    <Tab value={1} label="Job Work Amount" />
                    <Tab value={2} label="Summary" />
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
                                    <th className="table-header">Part</th>
                                    <th className="table-header">Part Desc</th>
                                    <th className="table-header">Process</th>
                                    <th className="table-header">Due on</th>
                                    <th className="table-header">Quantity Nos</th>
                                    <th className="table-header">Rate</th>
                                    <th className="table-header">Gross Amount</th>
                                    <th className="table-header">Tax Code</th>
                                    <th className="table-header">Discount %</th>
                                    <th className="table-header">Discount Amount</th>
                                    <th className="table-header">Net Amount</th>
                                    <th className="table-header">SGST</th>
                                    <th className="table-header">CGST</th>
                                    <th className="table-header">IGST</th>
                                    <th className="table-header">Taxamt</th>
                                    <th className="table-header">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {workJobTableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              workJobTableData,
                                              setWorkJobTableData,
                                              workJobTableErrors,
                                              setworkJobTableErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <Autocomplete
                                          disablePortal
                                          options={partyList.map((option, index) => ({ ...option, key: index }))}
                                          getOptionLabel={(option) => option.partyname || ''}
                                          sx={{ width: '100%' }}
                                          size="small"
                                          value={formData.part ? partyList.find((c) => c.partyname === formData.part) : null}
                                          onChange={(event, newValue) => {
                                            handleInputChange({
                                              target: {
                                                name: 'part',
                                                value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                              },
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Part"
                                              name="part"
                                              error={!!fieldErrors.part}  // Shows red border if there's an error
                                              helperText={fieldErrors.part}  // Shows the error message
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
                                          value={row.partDescription}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, partDescription: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partDescription: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.partDescription ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {workJobTableErrors[index]?.partDescription && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].partDescription}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.process}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, process: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                process: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.process ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.process && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].process}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.dueOn}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, dueOn: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                dueOn: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.dueOn ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {workJobTableErrors[index]?.dueOn && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].dueOn}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.quantityNos}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, quantityNos: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                quantityNos: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.quantityNos ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {workJobTableErrors[index]?.quantityNos && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].quantityNos}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.rate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, rate: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                rate: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.rate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].rate}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.grossAmount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, grossAmount: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                grossAmount: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.grossAmount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.grossAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].grossAmount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.taxCode}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, taxCode: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                taxCode: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.taxCode ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.taxCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].taxCode}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.discount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, discount: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                discount: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.discount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.discount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].discount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.discountAmount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, discountAmount: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                discountAmount: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.discountAmount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.discountAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].discountAmount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.netAmount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, netAmount: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                netAmount: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.netAmount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.netAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].netAmount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sgst}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, sgst: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sgst: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.sgst ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.sgst && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].sgst}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.cgst}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, cgst: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                cgst: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.cgst ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.cgst && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].cgst}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.igst}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, igst: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                igst: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.igst ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.igst && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].igst}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.taxamt}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, taxamt: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                taxamt: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.taxamt ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.taxamt && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].taxamt}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.amount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                amount: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.amount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].amount}
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
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="termsOfPayment"
                              label="Terms of Payment"
                              size="small"
                              name="termsOfPayment"
                              value={formData.termsOfPayment}
                              multiline
                              // minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.termsOfPayment}
                              helperText={fieldErrors.termsOfPayment}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="totalAmount"
                              label="Total Amount"
                              size="small"
                              name="totalAmount"
                              value={formData.totalAmount}
                              multiline
                              // minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.totalAmount}
                              helperText={fieldErrors.totalAmount}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="amountInWords"
                              label="Amount in Words"
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
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="totalGrossAmt"
                              label="Total Gross Amt"
                              size="small"
                              name="totalGrossAmt"
                              value={formData.totalGrossAmt}
                              multiline
                              // minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.totalGrossAmt}
                              helperText={fieldErrors.totalGrossAmt}
                            />
                          </FormControl>
                        </div>

                        <div className="col-md-3 mt-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="totalTax"
                              label="Total Tax"
                              size="small"
                              name="totalTax"
                              value={formData.totalTax}
                              multiline
                              // minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.totalTax}
                              helperText={fieldErrors.totalTax}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </>
                  )}
                  {value === 2 && (
                    <>
                      <div className="row mt-2">
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="narration"
                              label="Narration"
                              size="small"
                              name="narration"
                              value={formData.narration}
                              multiline
                              // minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
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
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getGeneralJournalById} />
          )}
        </div>
      </div>
    </>
  );
};
export default SampleApproval;
