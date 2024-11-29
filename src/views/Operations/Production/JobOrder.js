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

const JobOrder = () => {
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
    customerPoNo: '',
    cycleTimeInSec: '',
    docDate: dayjs(),
    docId: '',
    narration: '',
    normsHr: '',
    orgId: orgId,
    operationName: '',
    operatorName: '',
    partName: '',
    partNo: '',
    productionQty: '',
    remarks: '',
    routeCardNo: '',
    supplier: '',
    shift: '',
    status: '',
    woSoNo: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    customerName: '',
    customerPoNo: '',
    cycleTimeInSec: '',
    docId: '',
    narration: '',
    normsHr: '',
    operationName: '',
    operatorName: '',
    partName: '',
    partNo: '',
    productionQty: '',
    remarks: '',
    routeCardNo: '',
    supplier: '',
    shift: '',
    status: '',
    woSoNo: ''
  });

  const listViewColumns = [
    { accessorKey: 'shift', header: 'Shift', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'routeCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'woSoNo', header: 'Work Order No', size: 140 }
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      cumulativeTotal: '',
      hourProduction: '',
      idleTime: '',
      reject: '',
      remarks: '',
      rework: '',
      timeInHrs: '',
      unit: ''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      cumulativeTotal: '',
      hourProduction: '',
      idleTime: '',
      reject: '',
      remarks: '',
      rework: '',
      timeInHrs: '',
      unit: ''
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
      customerPoNo: '',
      cycleTimeInSec: '',
      docDate: dayjs(),
      docId: '',
      narration: '',
      normsHr: '',
      orgId: orgId,
      operationName: '',
      operatorName: '',
      partName: '',
      partNo: '',
      productionQty: '',
      remarks: '',
      routeCardNo: '',
      supplier: '',
      shift: '',
      status: '',
      woSoNo: ''
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      customerName: '',
      customerPoNo: '',
      cycleTimeInSec: '',
      docId: '',
      narration: '',
      normsHr: '',
      operationName: '',
      operatorName: '',
      partName: '',
      partNo: '',
      productionQty: '',
      remarks: '',
      routeCardNo: '',
      supplier: '',
      shift: '',
      status: '',
      woSoNo: ''
    });
    setDetailsTableData([
      {
        id: 1,
        cumulativeTotal: '',
        hourProduction: '',
        idleTime: '',
        reject: '',
        remarks: '',
        rework: '',
        timeInHrs: '',
        unit: ''
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
      cumulativeTotal: '',
      hourProduction: '',
      idleTime: '',
      reject: '',
      remarks: '',
      rework: '',
      timeInHrs: '',
      unit: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([
      ...detailsTableErrors,
      {
        cumulativeTotal: '',
        hourProduction: '',
        idleTime: '',
        reject: '',
        remarks: '',
        rework: '',
        timeInHrs: '',
        unit: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return (
        !lastRow.cumulativeTotal ||
        !lastRow.hourProduction ||
        !lastRow.idleTime ||
        !lastRow.reject ||
        !lastRow.remarks ||
        !lastRow.rework ||
        !lastRow.timeInHrs
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
          cumulativeTotal: !table[table.length - 1].cumulativeTotal ? 'Cumulative Total is required' : '',
          hourProduction: !table[table.length - 1].hourProduction ? 'Hour Production is required' : '',
          idleTime: !table[table.length - 1].idleTime ? 'Idle Time is required' : '',
          reject: !table[table.length - 1].reject ? 'Reject is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : '',
          rework: !table[table.length - 1].rework ? 'Rework is required' : '',
          timeInHrs: !table[table.length - 1].timeInHrs ? 'Time In Hrs is required' : ''
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
    if (!formData.shift) {
      errors.shift = 'Shift is required';
    }
    if (!formData.routeCardNo) {
      errors.routeCardNo = 'Route Card No is required';
    }
    if (!formData.operationName) {
      errors.operationName = 'Operation Name is required';
    }
    if (!formData.cycleTimeInSec) {
      errors.cycleTimeInSec = 'Cycle Time In Sec is required';
    }
    if (!formData.normsHr) {
      errors.normsHr = 'Norms/Hr is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    if (!formData.operatorName) {
      errors.operatorName = 'Operator Name is required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.cumulativeTotal) {
        rowErrors.cumulativeTotal = 'Cumulative Total is required';
        detailTableDataValid = false;
      }
      if (!row.hourProduction) {
        rowErrors.hourProduction = 'Hour Production is required';
        detailTableDataValid = false;
      }
      if (!row.idleTime) {
        rowErrors.idleTime = 'Idle Time is required';
        detailTableDataValid = false;
      }
      if (!row.reject) {
        rowErrors.reject = 'Reject is required';
        detailTableDataValid = false;
      }
      if (!row.rework) {
        rowErrors.rework = 'Rework is required';
        detailTableDataValid = false;
      }
      if (!row.timeInHrs) {
        rowErrors.timeInHrs = 'Time In Hrs is required';
        detailTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        cumulativeTotal: row.cumulativeTotal,
        hourProduction: row.hourProduction,
        idleTime: row.idleTime,
        reject: row.reject,
        remarks: row.remarks,
        rework: row.rework,
        timeInHrs: row.timeInHrs,
        unit: row.unit
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        customerName: formData.customerName,
        customerPoNo: formData.customerPoNo,
        finYear: finYear,
        narration: formData.narration,
        normsHr: formData.normsHr,
        orgId: orgId,
        // particularsJournalDTO: GeneralJournalVO,
        operationName: formData.operationName,
        operatorName: formData.operatorName,
        partName: formData.partName,
        partNo: formData.partNo,
        productionQty: formData.productionQty,
        remarks: formData.remarks,
        routeCardNo: formData.routeCardNo,
        supplier: formData.supplier,
        shift: formData.shift,
        status: formData.status,
        woSoNo: formData.woSoNo
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
                    value={formData.shift ? routeCardList.find((c) => c.partyname === formData.shift) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'shift',
                          value: newValue ? newValue.partyname : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Shift"
                        name="shift"
                        error={!!fieldErrors.shift}
                        helperText={fieldErrors.shift}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
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
                    label="Customer PO No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="customerPoNo"
                    type="text"
                    value={formData.customerPoNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerPoNo ? 'Customer Po No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Supplier"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="supplier"
                    type="text"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.supplier ? 'Supplier is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Part Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="partName"
                    type="text"
                    value={formData.partName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.partName ? 'Part Name is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Part No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="partNo"
                    type="text"
                    value={formData.partNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.partNo ? 'Part Desc is required' : ''}</span>}
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
                  <Autocomplete
                    disablePortal
                    options={materialList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.operationName ? materialList.find((c) => c.partyname === formData.operationName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'operationName',
                          value: newValue ? newValue.partyname : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Operation Name"
                        name="operationName"
                        error={!!fieldErrors.operationName}
                        helperText={fieldErrors.operationName}
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
                    label="Cycle Time in Secs"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="cycleTimeInSec"
                    type="text"
                    value={formData.cycleTimeInSec}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.cycleTimeInSec ? 'Cycle Time In Sec is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Norms / HR"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="normsHr"
                    type="text"
                    value={formData.normsHr}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.normsHr ? 'Norms/Hr is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.status}>
                    <InputLabel id="status">Status</InputLabel>
                    <Select labelId="status" label="Status" name="status" value={formData.status} onChange={handleInputChange}>
                      <MenuItem value="PENDING">PENDING</MenuItem>
                      <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                    </Select>
                    {fieldErrors.status && <FormHelperText>{fieldErrors.status}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={materialList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.operatorName ? materialList.find((c) => c.partyname === formData.operatorName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'operatorName',
                          value: newValue ? newValue.partyname : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Operator Name"
                        name="operatorName"
                        error={!!fieldErrors.operatorName}
                        helperText={fieldErrors.operatorName}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
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
                    <Tab value={0} label="Job Order Details" />
                    <Tab value={1} label="Job Order Summary" />
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
                                    <th className="table-header">Time in Hours</th>
                                    <th className="table-header">Unit</th>
                                    <th className="table-header">Hour Production</th>
                                    <th className="table-header">Rework</th>
                                    <th className="table-header">Reject</th>
                                    <th className="table-header">Idle Time</th>
                                    <th className="table-header">Cumulative Total</th>
                                    <th className="table-header">Remarks</th>
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
                                        <input
                                          type="number"
                                          value={row.timeInHrs}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, timeInHrs: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                timeInHrs: !value ? 'Time In Hrs is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.timeInHrs ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.timeInHrs && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].timeInHrs}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="number"
                                          value={row.unit}
                                          style={{ width: '150px' }}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unit: !value ? 'Unit is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.unit ? 'error form-control' : 'form-control'}
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
                                          value={row.hourProduction}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, hourProduction: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                hourProduction: !value ? 'Hour Production is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.hourProduction ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.hourProduction && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].hourProduction}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.rework}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, rework: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                rework: !value ? 'Rework is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.rework ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.rework && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].rework}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.reject}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, reject: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                reject: !value ? 'Reject is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.reject ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.reject && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].reject}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.idleTime}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, idleTime: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                idleTime: !value ? 'Idle Time is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.idleTime ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.idleTime && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].idleTime}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.cumulativeTotal}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, cumulativeTotal: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                cumulativeTotal: !value ? 'Cumulative Total is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.cumulativeTotal ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.cumulativeTotal && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].cumulativeTotal}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.remarks}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                remarks: !value ? 'Remarks is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.remarks && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].remarks}
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
export default JobOrder;
