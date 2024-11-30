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
  const [roleList, setRoleList] = useState([]);
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
    partName: '',
    drgNo: '',
    operation: '',
    cycleTime: '',
    machineNo: '',
    machineName: '',
    jobOrderNo: '',
    shift: '',
    shiftDate: dayjs(),
    shiftTime: '',
    sampleQuantity: '',
    docFormatNo: '',
    orgId: orgId,
    // Summary
    operatorName: '',
    shiftIncharge: '',
    narration: '',
    generalRemarks: '',
    qualityName: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    sampleApprovalNo: '',
    sampleApprovalDate: dayjs(),
    routeCardNo: '',
    partNo: '',
    partName: '',
    drgNo: '',
    operation: '',
    cycleTime: '',
    machineNo: '',
    machineName: '',
    jobOrderNo: '',
    shift: '',
    shiftDate: dayjs(),
    shiftTime: '',
    sampleQuantity: '',
    docFormatNo: '',
    orgId: orgId,
    // Summary
    operatorName: '',
    shiftIncharge: '',
    narration: '',
    generalRemarks: '',
    qualityName: ''
  });

  const listViewColumns = [
    { accessorKey: 'Contractor Code', header: 'Contractor Code', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'sampleApprovalNo', header: 'Document Id', size: 140 }
  ];

  const [workJobTableData, setWorkJobTableData] = useState([
    {
      id: 1,
      characteristics: '',
      methodOfInspection: '',
      specification: '',
      lsl: '',
      usl: '',
      sample1: '',
      sample2: '',
      sample3: '',
      sample4: '',
      sample5: '',
      operater1: '',
      operater2: '',
      operater3: '',
      operater4: '',
      operater5: '',
      status: '',
    }
  ]);
  const [workJobTableErrors, setworkJobTableErrors] = useState([
    {
      id: 1,
      characteristics: '',
      methodOfInspection: '',
      specification: '',
      lsl: '',
      usl: '',
      sample1: '',
      sample2: '',
      sample3: '',
      sample4: '',
      sample5: '',
      operater1: '',
      operater2: '',
      operater3: '',
      operater4: '',
      operater5: '',
      status: '',
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
      // operatorName: totalDebit, 
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
          operatorName: glVO.operatorName || '',
          // active: glVO.active || false,
        });
        setWorkJobTableData(
          glVO.particularsJournalVO.map((row) => ({
            id: row.id,
            characteristics: row.characteristics,
            methodOfInspection: row.methodOfInspection
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
      // sampleApprovalNo: '',
      // sampleApprovalDate: dayjs(),
      routeCardNo: '',
      partNo: '',
      // partName: '',
      drgNo: '',
      operation: '',
      // cycleTime: '',
      machineNo: '',
      machineName: '',
      jobOrderNo: '',
      shift: '',
      shiftDate: dayjs(),
      shiftTime: '',
      sampleQuantity: '',
      docFormatNo: '',
      orgId: orgId,
      // Summary
      operatorName: '',
      shiftIncharge: '',
      narration: '',
      generalRemarks: '',
      qualityName: ''
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
        // sampleApprovalNo: '',
      // sampleApprovalDate: dayjs(),
      routeCardNo: '',
      partNo: '',
      // partName: '',
      drgNo: '',
      operation: '',
      // cycleTime: '',
      machineNo: '',
      machineName: '',
      jobOrderNo: '',
      shift: '',
      shiftDate: dayjs(),
      shiftTime: '',
      sampleQuantity: '',
      docFormatNo: '',
      orgId: orgId,
      // Summary
      operatorName: '',
      shiftIncharge: '',
      narration: '',
      generalRemarks: '',
      qualityName: ''
    });
    setWorkJobTableData([
      {
        id: 1,
        characteristics: '',
        methodOfInspection: '',
        specification: '',
        lsl: '',
        usl: '',
        sample1: '',
        sample2: '',
        sample3: '',
        sample4: '',
        sample5: '',
        operater1: '',
        operater2: '',
        operater3: '',
        operater4: '',
        operater5: '',
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
      characteristics: '',
      unit: '',
      methodOfInspection: '',
      revisionNo: '',
      unitPrice: '',
    };
    setWorkJobTableData([...workJobTableData, newRow]);
    setworkJobTableErrors([...workJobTableErrors, {
      characteristics: '',
      methodOfInspection: '',
      specification: '',
      lsl: '',
      usl: '',
      sample1: '',
      sample2: '',
      sample3: '',
      sample4: '',
      sample5: '',
      operater1: '',
      operater2: '',
      operater3: '',
      operater4: '',
      operater5: '',
      amount: ''
    }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === workJobTableData) {
      return (
        !lastRow.characteristics || !lastRow.characteristics.trim() ||
        !lastRow.methodOfInspection || !lastRow.methodOfInspection.trim() ||
        !lastRow.specification || !lastRow.specification.trim() ||
        !lastRow.lsl || !lastRow.lsl.trim() ||
        !lastRow.usl || !lastRow.usl.trim() ||
        !lastRow.sample1 || !lastRow.sample1.trim() ||
        !lastRow.sample2 || !lastRow.sample2.trim() ||
        !lastRow.sample3 || !lastRow.sample3.trim() ||
        !lastRow.sample4 || !lastRow.sample4.trim() ||
        !lastRow.sample5 || !lastRow.sample5.trim() ||
        !lastRow.operater1 || !lastRow.operater1.trim() ||
        !lastRow.operater2 || !lastRow.operater2.trim() ||
        !lastRow.operater3 || !lastRow.operater3.trim() ||
        !lastRow.operater4 || !lastRow.operater4.trim() ||
        !lastRow.operater5 || !lastRow.operater5.trim() ||
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
          characteristics: !lastRow.part ? 'characteristics is Required' : '',
          methodOfInspection: !lastRow.methodOfInspection ? 'methodOfInspection is Required' : '',
          specification: !lastRow.specification ? 'specification is Required' : '',
          lsl: !lastRow.lsl ? 'lsl is Required' : '',
          usl: !lastRow.usl ? 'Quantity Nos is Required' : '',
          sample1: !lastRow.sample1 ? 'sample1 is Required' : '',
          sample2: !lastRow.sample2 ? 'Gross Amount is Required' : '',
          sample3: !lastRow.sample3 ? 'Tax Code is Required' : '',
          sample4: !lastRow.sample4 ? 'sample4 is Required' : '',
          sample5: !lastRow.sample5 ? 'Sample 5 is Required' : '',
          operater1: !lastRow.operater1 ? 'Net Amount is Required' : '',
          operater2: !lastRow.operater2 ? 'operater2 is Required' : '',
          operater3: !lastRow.operater3 ? 'operater3 is Required' : '',
          operater4: !lastRow.operater4 ? 'operater4 is Required' : '',
          operater5: !lastRow.operater5 ? 'operater5 is Required' : '',
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
  const handleIndentChange = (row, index, event) => {
    const value = event.target.value;
    const selectedRole = roleList.find((role) => role.role === value);
    setWorkJobTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setworkJobTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        role: !value ? 'Role is required' : ''
      };
      return newErrors;
    });
  };
  const handleSave = async () => {
    const errors = {};
    let isValid = true;
    if (!formData.routeCardNo) errors.routeCardNo = 'Route Card No is Required';
    if (!formData.partNo) errors.partNo = 'Part No is Required';
    if (!formData.partName) errors.partName = 'Part Name is Required';
    if (!formData.drgNo) errors.drgNo = 'Drg No is Required';
    if (!formData.operation) errors.operation = 'Operation is Required';
    // if (!formData.cycleTime) errors.cycleTime = 'cycleTime is Required';
    if (!formData.machineNo) errors.machineNo = 'MachineNo is Required';
    // if (!formData.machineName) errors.machineName = 'machineName is Required';
    if (!formData.jobOrderNo) errors.jobOrderNo = 'JobOrderNo is Required';
    if (!formData.shift) errors.shift = 'Shift is Required';
    if (!formData.shiftDate) errors.shiftDate = 'Shift Date is Required';
    if (!formData.shiftTime) errors.shiftTime = 'Shift Time is Required';
    if (!formData.sampleQuantity) errors.sampleQuantity = 'Sample Quantity is Required';
    if (!formData.docFormatNo) errors.docFormatNo = 'Doc Format No is Required';
    if (!formData.operatorName) errors.operatorName = 'Operator Name is Required';
    if (!formData.shiftIncharge) errors.shiftIncharge = 'Shift Incharge is Required';
    if (!formData.narration) errors.narration = 'Narration is Required';
    if (!formData.generalRemarks) errors.generalRemarks = 'General Remarks is Required';
    if (!formData.qualityName) errors.qualityName = 'Quality Name is Required';

    let detailTableDataValid = true;
    const newTableErrors = workJobTableData.map((row) => {
      const rowErrors = {};
      if (!row.characteristics) { rowErrors.characteristics = 'Characteristics is Required'; detailTableDataValid = false; }
      if (!row.methodOfInspection) { rowErrors.methodOfInspection = 'Method Of Inspection is Required'; detailTableDataValid = false; }
      if (!row.specification) { rowErrors.specification = 'Specification is Required'; detailTableDataValid = false; }
      if (!row.lsl) { rowErrors.lsl = 'LSL is Required'; detailTableDataValid = false; }
      if (!row.usl) { rowErrors.usl = 'USL is Required'; detailTableDataValid = false; }
      if (!row.sample1) { rowErrors.sample1 = 'Sample 1 is Required'; detailTableDataValid = false; }
      if (!row.sample2) { rowErrors.sample2 = 'Sample 2 is Required'; detailTableDataValid = false; }
      if (!row.sample3) { rowErrors.sample3 = 'Sample 3 is Required'; detailTableDataValid = false; }
      if (!row.sample4) { rowErrors.sample4 = 'Sample 4 is Required'; detailTableDataValid = false; }
      if (!row.sample5) { rowErrors.sample5 = 'Sample 5 is Required'; detailTableDataValid = false; }
      if (!row.operater1) { rowErrors.operater1 = 'Operater1 is Required'; detailTableDataValid = false; }
      if (!row.operater2) { rowErrors.operater2 = 'Operater2 is Required'; detailTableDataValid = false; }
      if (!row.operater3) { rowErrors.operater3 = 'Operater3 is Required'; detailTableDataValid = false; }
      if (!row.operater4) { rowErrors.operater4 = 'Operater4 is Required'; detailTableDataValid = false; }
      if (!row.operater5) { rowErrors.operater5 = 'Operater5 is Required'; detailTableDataValid = false; }
      if (!row.status) { rowErrors.status = 'Status is Required'; detailTableDataValid = false; }


      return rowErrors;
    });
    setFieldErrors(errors);

    setworkJobTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = workJobTableData.map((row) => ({
        ...(editId && { id: row.id }),
        characteristics: row.characteristics,
        methodOfInspection: row.methodOfInspection
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
        operatorName: formData.operatorName,
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.Operation}>
                    <InputLabel id="Operation">Operation</InputLabel>
                    <Select
                      labelId="Operation"
                      id="Operation"
                      label="Material Group"
                      onChange={handleInputChange}
                      name="Operation"
                      value={formData.Operation}
                    >
                      <MenuItem value="Head Office">Head Office</MenuItem>
                      <MenuItem value="Branch">Branch</MenuItem>
                    </Select>
                    {fieldErrors.Operation && <FormHelperText>{fieldErrors.Operation}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Cycle Time"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="cycleTime"
                    value={formData.cycleTime}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.cycleTime}
                    helperText={fieldErrors.cycleTime}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.machineNo ? partyList.find((c) => c.partyname === formData.machineNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'machineNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Machine No"
                        name="machineNo"
                        error={!!fieldErrors.machineNo}  // Shows error if routeCardNo has a value in fieldErrors
                        helperText={fieldErrors.machineNo} // Displays the error message
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
                    label="Machine Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineName"
                    value={formData.machineName}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.machineName}
                    helperText={fieldErrors.machineName}
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
                        label="Job Order No"
                        name="jobOrderNo"
                        error={!!fieldErrors.jobOrderNo}
                        helperText={fieldErrors.jobOrderNo}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.shift ? partyList.find((c) => c.partyname === formData.shift) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'shift',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
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
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Shift Date"
                        value={formData.shiftDate}
                        onChange={(date) => handleDateChange('shiftDate', date)}
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
                  <TextField
                    id="outlined-textarea-zip"
                    label="Shift Time"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="shiftTime"
                    value={formData.shiftTime}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.shiftTime}
                    helperText={fieldErrors.shiftTime}

                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Sample Quantity"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="sampleQuantity"
                    value={formData.sampleQuantity}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.sampleQuantity}
                    helperText={fieldErrors.sampleQuantity}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.docFormatNo ? partyList.find((c) => c.partyname === formData.docFormatNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'docFormatNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Doc Format No"
                        name="docFormatNo"
                        error={!!fieldErrors.docFormatNo}
                        helperText={fieldErrors.docFormatNo}
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
                    <Tab value={0} label="Sample Approval Detail" />
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
                                    <th className="table-header">Characteristics</th>
                                    <th className="table-header">Method of Inspection</th>
                                    <th className="table-header">Specification</th>
                                    <th className="table-header">LSL</th>
                                    <th className="table-header">USL</th>
                                    <th className="table-header">Sample 1</th>
                                    <th className="table-header">Sample 2</th>
                                    <th className="table-header">Sample 3</th>
                                    <th className="table-header">Sample 4</th>
                                    <th className="table-header">Sample 5</th>
                                    <th className="table-header">oper ater 1</th>
                                    <th className="table-header">operater 2</th>
                                    <th className="table-header">operater 3</th>
                                    <th className="table-header">operater 4</th>
                                    <th className="table-header">operater 5</th>
                                    <th className="table-header">Status</th>
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
                                        <input
                                          type="text"
                                          value={row.characteristics}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, characteristics: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                characteristics: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.characteristics ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.characteristics && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].characteristics}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.methodOfInspection}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, methodOfInspection: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                methodOfInspection: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.methodOfInspection ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.methodOfInspection && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].methodOfInspection}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.specification}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, specification: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                specification: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.specification ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.specification && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].specification}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.lsl}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, lsl: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                lsl: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.lsl ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.lsl && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].lsl}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.usl}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, usl: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                usl: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.usl ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.usl && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].usl}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sample1}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, sample1: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sample1: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.sample1 ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.sample1 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].sample1}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sample2}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, sample2: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sample2: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.sample2 ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.sample2 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].sample2}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sample3}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, sample3: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sample3: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.sample3 ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.sample3 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].sample3}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sample4}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, sample4: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sample4: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.sample4 ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.sample4 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].sample4}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sample5}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, sample5: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sample5: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.sample5 ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.sample5 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].sample5}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.operater1}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, operater1: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                operater1: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.operater1 ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.operater1 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].operater1}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.operater2}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, operater2: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                operater2: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.operater2 ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.operater2 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].operater2}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.operater3}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, operater3: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                operater3: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.operater3 ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.operater3 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].operater3}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.operater4}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, operater4: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                operater4: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.operater4 ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.operater4 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].operater4}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.operater5}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, operater5: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                operater5: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.operater5 ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.operater5 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].operater5}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.status}
                                          style={{ width: '150px' }}
                                          onChange={(e) => handleIndentChange(row, index, e)}
                                          className={workJobTableErrors[index]?.role ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Option</option>
                                          {/* {getAvailableRoles(row.id).map((role) => (
                                            <option key={role.id} value={role.role}>
                                              {role.role}
                                            </option>
                                          ))} */}
                                        </select>
                                        {workJobTableErrors[index]?.status && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].status}
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
                          <Autocomplete
                            disablePortal
                            options={partyList.map((option, index) => ({ ...option, key: index }))}
                            getOptionLabel={(option) => option.partyname || ''}
                            sx={{ width: '100%' }}
                            size="small"
                            value={formData.operatorName ? partyList.find((c) => c.partyname === formData.operatorName) : null}
                            onChange={(event, newValue) => {
                              handleInputChange({
                                target: {
                                  name: 'operatorName',
                                  value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                },
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Operator Name"
                                name="operatorName"
                                error={!!fieldErrors.operatorName}  // Shows error if operatorName has a value in fieldErrors
                                helperText={fieldErrors.operatorName} // Displays the error message
                                InputProps={{
                                  ...params.InputProps,
                                  style: { height: 40 },
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <Autocomplete
                            disablePortal
                            options={partyList.map((option, index) => ({ ...option, key: index }))}
                            getOptionLabel={(option) => option.partyname || ''}
                            sx={{ width: '100%' }}
                            size="small"
                            value={formData.shiftIncharge ? partyList.find((c) => c.partyname === formData.shiftIncharge) : null}
                            onChange={(event, newValue) => {
                              handleInputChange({
                                target: {
                                  name: 'shiftIncharge',
                                  value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                },
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Shift Incharge"
                                name="shiftIncharge"
                                error={!!fieldErrors.shiftIncharge}  // Shows error if shiftIncharge has a value in fieldErrors
                                helperText={fieldErrors.shiftIncharge} // Displays the error message
                                InputProps={{
                                  ...params.InputProps,
                                  style: { height: 40 },
                                }}
                              />
                            )}
                          />
                        </div>
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
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="generalRemarks"
                              label="General Remarks"
                              size="small"
                              name="generalRemarks"
                              value={formData.generalRemarks}
                              multiline
                              // minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.generalRemarks}
                              helperText={fieldErrors.generalRemarks}
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
                            value={formData.qualityName ? partyList.find((c) => c.partyname === formData.qualityName) : null}
                            onChange={(event, newValue) => {
                              handleInputChange({
                                target: {
                                  name: 'qualityName',
                                  value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                },
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Quality Name"
                                name="qualityName"
                                error={!!fieldErrors.qualityName}  // Shows error if qualityName has a value in fieldErrors
                                helperText={fieldErrors.qualityName} // Displays the error message
                                InputProps={{
                                  ...params.InputProps,
                                  style: { height: 40 },
                                }}
                              />
                            )}
                          />
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
