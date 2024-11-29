import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Autocomplete, TextField } from '@mui/material';
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

const ProductionPlan = () => {
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
  const [routeCardList, setRouteCardList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    customerName: '',
    docDate: dayjs(),
    docId: '',
    narration: '',
    orgId: orgId,
    part: '',
    partDesc: '',
    productionQty: '',
    productionStartDate: null,
    productionEndDate: null,
    remarks: '',
    rawMaterial: '',
    rawMaterialDesc: '',
    routeCardNo: '',
    woSoNo: '',
    woSoDate: null
  });

  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    customerName: '',
    docDate: dayjs(),
    docId: '',
    narration: '',
    orgId: orgId,
    part: '',
    partDesc: '',
    productionQty: '',
    productionStartDate: null,
    productionEndDate: null,
    remarks: '',
    rawMaterial: '',
    rawMaterialDesc: '',
    routeCardNo: '',
    woSoNo: '',
    woSoDate: null
  });

  const listViewColumns = [
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'routeCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'woSoNo', header: 'Work Order No', size: 140 },
    { accessorKey: 'woSoDate', header: 'Work Order Date', size: 140 }
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      expMinProd: '',
      expMaxProd: '',
      fromDate: '',
      qty: '',
      qtyHr: '',
      machine: '',
      process: '',
      toDate: '',
      ttInSec: '',
      totalTtInSec: '',
      ttInHr: '',
      status: ''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      expMinProd: '',
      expMaxProd: '',
      fromDate: '',
      qty: '',
      qtyHr: '',
      machine: '',
      process: '',
      toDate: '',
      ttInSec: '',
      totalTtInSec: '',
      ttInHr: '',
      status: ''
    }
  ]);

  useEffect(() => {
    getGeneralJournalDocId();
    getAllGeneralJournalByOrgId();
    getAccountNameFromGroup();
  }, []);

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
          voucherSubType: glVO.voucherSubType || '',
          id: glVO.id || '',
          docDate: glVO.docDate ? dayjs(glVO.docDate, 'YYYY-MM-DD') : dayjs(),
          docId: glVO.docId || '',
          currency: glVO.currency || '',
          exRate: glVO.exRate || '',
          refNo: glVO.refNo || '',
          refDate: glVO.refDate ? dayjs(glVO.refDate, 'YYYY-MM-DD') : dayjs(),
          remarks: glVO.remarks || '',
          orgId: glVO.orgId || '',
          totalDebitAmount: glVO.totalDebitAmount || '',
          totalCreditAmount: glVO.totalCreditAmount || ''
          // active: glVO.active || false,
        });
        setDetailsTableData(
          glVO.particularsJournalVO.map((row) => ({
            id: row.id,
            accountsName: row.accountsName,
            creditAmount: row.creditAmount,
            debitAmount: row.debitAmount,
            narration: row.narration,
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
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
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, debitAmount: value, creditAmount: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          debitAmount: !value ? 'Debit Amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleCreditChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, creditAmount: value, debitAmount: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          creditAmount: !value ? 'Credit Amount is required' : ''
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
      active: true,
      customerName: '',
      docDate: dayjs(),
      narration: '',
      orgId: orgId,
      part: '',
      part: '',
      partDesc: '',
      productionQty: '',
      productionStartDate: null,
      productionEndDate: null,
      remarks: '',
      rawMaterial: '',
      rawMaterialDesc: '',
      routeCardNo: '',
      totalCreditAmount: 0,
      totalDebitAmount: 0,
      woSoNo: '',
      woSoDate: null
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      customerName: '',
      docDate: null,
      docId: '',
      narration: '',
      orgId: orgId,
      part: '',
      part: '',
      partDesc: '',
      productionQty: '',
      productionStartDate: null,
      productionEndDate: null,
      remarks: '',
      rawMaterial: '',
      rawMaterialDesc: '',
      routeCardNo: '',
      totalCreditAmount: 0,
      totalDebitAmount: 0,
      woSoNo: '',
      woSoDate: null
    });
    setDetailsTableData([
      {
        id: 1,
        expMinProd: '',
        expMaxProd: '',
        fromDate: '',
        qty: '',
        qtyHr: '',
        process: '',
        toDate: '',
        ttInSec: '',
        totalTtInSec: '',
        ttInHr: '',
        status: ''
      }
    ]);
    setDetailsTableErrors('');
    setEditId('');
    getGeneralJournalDocId();
  };

  // const handleKeyDown = (e, row, table) => {
  //   if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
  //     e.preventDefault();
  //     if (isLastRowEmpty(table)) {
  //       displayRowError(table);
  //     } else {
  //       if (table === roleTableData) handleAddRow();
  //       // else handleAddRow1();
  //     }
  //   }
  // };

  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      expMinProd: '',
      expMaxProd: '',
      fromDate: '',
      qty: '',
      qtyHr: '',
      process: '',
      toDate: '',
      ttInSec: '',
      totalTtInSec: '',
      ttInHr: '',
      status: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([
      ...detailsTableErrors,
      {
        expMinProd: '',
        expMaxProd: '',
        fromDate: '',
        qty: '',
        qtyHr: '',
        process: '',
        toDate: '',
        ttInSec: '',
        totalTtInSec: '',
        ttInHr: '',
        status: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return (
        !lastRow.expMinProd ||
        !lastRow.expMaxProd ||
        !lastRow.fromDate ||
        !lastRow.qty ||
        !lastRow.qtyHr ||
        !lastRow.process ||
        !lastRow.toDate ||
        !lastRow.ttInSec ||
        !lastRow.totalTtInSec ||
        !lastRow.ttInHr ||
        !lastRow.status
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
          expMinProd: !table[table.length - 1].expMinProd ? 'Exp Min-Prod is required' : '',
          expMaxProd: !table[table.length - 1].expMaxProd ? 'Exp Max-Prod is required' : '',
          fromDate: !table[table.length - 1].fromDate ? 'From Date is required' : '',
          qty: !table[table.length - 1].qty ? 'Qty is required' : '',
          qtyHr: !table[table.length - 1].qtyHr ? 'Qty/Hr is required' : '',
          process: !table[table.length - 1].process ? 'Process is required' : '',
          toDate: !table[table.length - 1].toDate ? 'To Date is required' : '',
          ttInSec: !table[table.length - 1].ttInSec ? 'Time Taken In Sec is required' : '',
          totalTtInSec: !table[table.length - 1].totalTtInSec ? 'Total Time Taken In Sec is required' : '',
          ttInHr: !table[table.length - 1].ttInHr ? 'Time Taken In Hr is required' : '',
          status: !table[table.length - 1].status ? 'Status is required' : ''
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

  const handleSave = async () => {
    const errors = {};
    if (!formData.rawMaterial) {
      errors.rawMaterial = 'Raw Material is required';
    }
    if (!formData.rawMaterialDesc) {
      errors.rawMaterialDesc = 'Raw Material Desc is required';
    }
    if (!formData.routeCardNo) {
      errors.routeCardNo = 'Route Card No is required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.expMinProd) {
        rowErrors.expMinProd = 'Exp Min-Prod is required';
        detailTableDataValid = false;
      }
      if (!row.expMaxProd) {
        rowErrors.expMaxProd = 'Exp Max-Prod is required';
        detailTableDataValid = false;
      }
      if (!row.fromDate) {
        rowErrors.fromDate = 'From Date is required';
        detailTableDataValid = false;
      }
      if (!row.qty) {
        rowErrors.qty = 'Qty is required';
        detailTableDataValid = false;
      }
      if (!row.qtyHr) {
        rowErrors.qtyHr = 'Qty/Hr is required';
        detailTableDataValid = false;
      }
      if (!row.machine) {
        rowErrors.machine = 'Machine is required';
        detailTableDataValid = false;
      }
      if (!row.process) {
        rowErrors.process = 'Process is required';
        detailTableDataValid = false;
      }
      if (!row.toDate) {
        rowErrors.toDate = 'To Date is required';
        detailTableDataValid = false;
      }
      if (!row.ttInSec) {
        rowErrors.ttInSec = 'Time Taken In Sec is required';
        detailTableDataValid = false;
      }
      if (!row.totalTtInSec) {
        rowErrors.totalTtInSec = 'Total Taken In Sec is required';
        detailTableDataValid = false;
      }
      if (!row.ttInHr) {
        rowErrors.ttInHr = 'Time Taken In Hours is required';
        detailTableDataValid = false;
      }
      if (!row.status) {
        rowErrors.status = 'Status is required';
        detailTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        expMinProd: row.expMinProd,
        expMaxProd: row.expMaxProd,
        fromDate: row.fromDate,
        qty: row.qty,
        qtyHr: row.qtyHr,
        process: row.process,
        toDate: row.toDate,
        ttInSec: row.ttInSec,
        totalTtInSec: row.totalTtInSec,
        ttInHr: row.ttInHr,
        status: row.status
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        customerName: formData.customerName,
        narration: formData.narration,
        finYear: finYear,
        orgId: orgId,
        // particularsJournalDTO: GeneralJournalVO,
        part: formData.part,
        partDesc: formData.partDesc,
        productionQty: formData.productionQty,
        productionStartDate: dayjs(formData.productionStartDate).format('YYYY-MM-DD'),
        productionEndDate: dayjs(formData.productionEndDate).format('YYYY-MM-DD'),
        remarks: formData.remarks,
        rawMaterial: formData.rawMaterial,
        rawMaterialDesc: formData.rawMaterialDesc,
        routeCardNo: formData.routeCardNo,
        woSoNo: formData.woSoNo,
        woSoDate: dayjs(formData.woSoDate).format('YYYY-MM-DD')
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
                    label="Document Id"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    value={formData.docId}
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
                  <Autocomplete
                    disablePortal
                    options={routeCardList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.routeCardNo ? routeCardList.find((c) => c.partyname === formData.routeCardNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'routeCardNo',
                          value: newValue ? newValue.partyname : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Route Card No"
                        name="routeCardNo"
                        error={!!fieldErrors.routeCardNo}
                        helperText={fieldErrors.routeCardNo}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="WO/SO No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="woSoNo"
                    type="number"
                    value={formData.woSoNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.woSoNo ? 'Work Order No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Work Order Date"
                        disabled
                        value={formData.woSoDate}
                        onChange={(date) => handleDateChange('woSoDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.woSoDate && <p className="dateErrMsg">Work Order Date is required</p>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Customer Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerName ? 'Customer Name is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Part"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="part"
                    type="text"
                    value={formData.part}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.part ? 'Part is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Part Desc"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="partDesc"
                    type="text"
                    value={formData.partDesc}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.partDesc ? 'Part Desc is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Production Qty"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="productionQty"
                    type="text"
                    value={formData.productionQty}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.productionQty ? 'Production Qty is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Production Start Date"
                        disabled
                        value={formData.productionStartDate}
                        onChange={(date) => handleDateChange('productionStartDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.productionStartDate && <p className="dateErrMsg">Production Start Date is required</p>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Production End Date"
                        disabled
                        value={formData.productionEndDate}
                        onChange={(date) => handleDateChange('productionEndDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.productionEndDate && <p className="dateErrMsg">Production End Date is required</p>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={materialList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.rawMaterial ? materialList.find((c) => c.partyname === formData.rawMaterial) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'rawMaterial',
                          value: newValue ? newValue.partyname : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Raw Material"
                        name="rawMaterial"
                        error={!!fieldErrors.rawMaterial}
                        helperText={fieldErrors.rawMaterial}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Raw Material Description"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="rawMaterialDesc"
                    type="text"
                    value={formData.rawMaterialDesc}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.rawMaterialDesc ? 'Raw Material Desc is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
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
                    <Tab value={0} label="Details" />
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
                                    <th className="table-header">Process</th>
                                    <th className="table-header">Qty</th>
                                    <th className="table-header">From Date</th>
                                    <th className="table-header">To Date</th>
                                    <th className="table-header">Time Taken/Per Piece (in Secs)</th>
                                    <th className="table-header">Total Time Taken (in Secs)</th>
                                    <th className="table-header">Time Taken in hours</th>
                                    <th className="table-header">Qty/hr</th>
                                    <th className="table-header">Exp Min-Prod</th>
                                    <th className="table-header">Exp Max-Prod</th>
                                    <th className="table-header">Status</th>
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
                                          value={row.process}
                                          style={{ width: '150px' }}
                                          className={detailsTableErrors[index]?.process ? 'error form-control' : 'form-control'}
                                          onChange={(e) =>
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, process: e.target.value } : r))
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
                                        {detailsTableErrors[index]?.process && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].process}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="number"
                                          value={row.qty}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qty: !value ? 'Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.qty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].qty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="date"
                                          value={row.fromDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, fromDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                fromDate: !date ? 'From Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.fromDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
                                        />
                                        {detailsTableErrors[index]?.fromDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].fromDate}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="date"
                                          value={row.toDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, toDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                toDate: !date ? 'To Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.toDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
                                        />
                                        {detailsTableErrors[index]?.toDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].toDate}
                                          </div>
                                        )}
                                      </td>
                                      {/* <td className="border px-2 py-2">
                                        <div className="w-100">
                                          <DatePicker
                                            // selected={row.fromDate}
                                            selected={
                                              row.fromDate
                                                ? dayjs(row.fromDate, 'YYYY-MM-DD').isValid()
                                                  ? dayjs(row.fromDate, 'YYYY-MM-DD').toDate()
                                                  : null
                                                : null
                                            }
                                            className={detailsTableErrors[index]?.fromDate ? 'error form-control' : 'form-control'}
                                            onChange={(date) => {
                                              setDetailsTableData((prev) =>
                                                prev.map((r) =>
                                                  r.id === row.id
                                                    ? {
                                                        ...r,
                                                        fromDate: date,
                                                        toDate: date > r.toDate ? null : r.toDate
                                                      }
                                                    : r
                                                )
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  fromDate: !date ? 'From Date is required' : '',
                                                  toDate: date && row.toDate && date > row.toDate ? '' : newErrors[index]?.toDate
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            dateFormat="dd-MM-yyyy"
                                            minDate={new Date()}
                                          />
                                          {detailsTableErrors[index]?.fromDate && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].fromDate}
                                            </div>
                                          )}
                                        </div>
                                      </td>

                                      <td className="border px-2 py-2">
                                        <DatePicker
                                          // selected={row.toDate}
                                          selected={
                                            row.toDate
                                              ? dayjs(row.toDate, 'YYYY-MM-DD').isValid()
                                                ? dayjs(row.toDate, 'YYYY-MM-DD').toDate()
                                                : null
                                              : null
                                          }
                                          className={detailsTableErrors[index]?.toDate ? 'error form-control' : 'form-control'}
                                          onChange={(date) => {
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, toDate: date } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                toDate: !date ? 'To Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          dateFormat="dd-MM-yyyy"
                                          minDate={row.fromDate || new Date()}
                                          disabled={!row.fromDate}
                                        />
                                        {detailsTableErrors[index]?.toDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].toDate}
                                          </div>
                                        )}
                                      </td> */}
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.ttInSec}
                                          style={{ width: '222px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, ttInSec: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                ttInSec: !value ? 'Time Taken In Sec is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.ttInSec ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.ttInSec && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].ttInSec}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.totalTtInSec}
                                          style={{ width: '190px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, totalTtInSec: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                totalTtInSec: !value ? 'Total Taken In Sec is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.totalTtInSec ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.totalTtInSec && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].totalTtInSec}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.ttInHr}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, ttInHr: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                ttInHr: !value ? 'Time Taken In Hours is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.ttInHr ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.ttInHr && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].ttInHr}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.qtyHr}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, qtyHr: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qtyHr: !value ? 'Qty Hr is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.qtyHr ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.qtyHr && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].qtyHr}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.expMinProd}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, expMinProd: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                expMinProd: !value ? 'Exp Min-Prod is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.expMinProd ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.expMinProd && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].expMinProd}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.expMaxProd}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, expMaxProd: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                expMaxProd: !value ? 'Exp Max-Prod is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.expMaxProd ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.expMaxProd && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].expMaxProd}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.status}
                                          style={{ width: '150px' }}
                                          className={detailsTableErrors[index]?.status ? 'error form-control' : 'form-control'}
                                          onChange={(e) =>
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, status: e.target.value } : r))
                                            )
                                          }
                                        >
                                          <option value="">-- Select --</option>
                                          <option value="PENDING">PENDING</option>
                                          <option value="COMPLETED">COMPLETED</option>
                                        </select>
                                        {detailsTableErrors[index]?.status && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].status}
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
                        <div className="col-md-8">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="narration"
                              label="Narration"
                              size="small"
                              name="narration"
                              value={formData.narration}
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
export default ProductionPlan;
