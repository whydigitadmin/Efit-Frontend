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

const ToolsReceived = () => {
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
    calibrationReceivedId: '',
    calibrationReceivedDate: dayjs(),
    issueNo: '',
    issueDate: '',
    receivedFrom: '',
   
    orgId: orgId,
    // Summary  
    remarks: '',
    narration: '', 
    receivedBy: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    calibrationReceivedId: '',
    calibrationReceivedDate: dayjs(),
    issueNo: '',
    issueDate: '',
    receivedFrom: '',
   
    orgId: orgId,
    // Summary  
    remarks: '',
    narration: '', 
    receivedBy: ''
  });

  const listViewColumns = [
    { accessorKey: 'Contractor Code', header: 'Contractor Code', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'calibrationReceivedId', header: 'Document Id', size: 140 }
  ];

  const [workJobTableData, setWorkJobTableData] = useState([
    {
      id: 1,
      instrumentId: '',
      instrumentName: '',
      calibrateDate: '',
      dueDate: '',
      frequencyForCalibration: '',
      issuedQty: '',
      status: '',
      calibrationCertificate: '',
    }
  ]);
  const [workJobTableErrors, setworkJobTableErrors] = useState([
    {
      id: 1,
      instrumentId: '',
      instrumentName: '',
      calibrateDate: '',
      dueDate: '',
      frequencyForCalibration: '',
      issuedQty: '',
      status: '',
      calibrationCertificate: '',
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
    getGeneralJournalcalibrationReceivedId();
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

  const getGeneralJournalcalibrationReceivedId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getGeneralJournalcalibrationReceivedId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        calibrationReceivedId: response.paramObjectsMap.generalJournalcalibrationReceivedId,
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
          calibrationReceivedId: glVO.calibrationReceivedId || '',
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
            instrumentId: row.instrumentId,
            instrumentName: row.instrumentName
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
      // calibrationReceivedId: '',
      // calibrationReceivedDate: dayjs(),
      issueNo: '',
      issueDate: '',
      // receivedFrom: '',
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
      remarks: '',
      receivedBy: ''
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      // calibrationReceivedId: '',
      // calibrationReceivedDate: dayjs(),
      issueNo: '',
      issueDate: '',
      // receivedFrom: '',
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
      remarks: '',
      receivedBy: ''
    });
    setWorkJobTableData([
      {
        id: 1,
        instrumentId: '',
        instrumentName: '',
        calibrateDate: '',
        dueDate: '',
        frequencyForCalibration: '',
        issuedQty: '',
        status: '',
        calibrationCertificate: '',
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
    getGeneralJournalcalibrationReceivedId();
  };


  const handleAddRow = () => {
    if (isLastRowEmpty(workJobTableData)) {
      displayRowError(workJobTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      instrumentId: '',
      unit: '',
      instrumentName: '',
      revisionNo: '',
      unitPrice: '',
    };
    setWorkJobTableData([...workJobTableData, newRow]);
    setworkJobTableErrors([...workJobTableErrors, {
      instrumentId: '',
      instrumentName: '',
      calibrateDate: '',
      dueDate: '',
      frequencyForCalibration: '',
      issuedQty: '',
      status: '',
      calibrationCertificate: '',
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
        !lastRow.instrumentId || !lastRow.instrumentId.trim() ||
        !lastRow.instrumentName || !lastRow.instrumentName.trim() ||
        !lastRow.calibrateDate || !lastRow.calibrateDate.trim() ||
        !lastRow.dueDate || !lastRow.dueDate.trim() ||
        !lastRow.frequencyForCalibration || !lastRow.frequencyForCalibration.trim() ||
        !lastRow.issuedQty || !lastRow.issuedQty.trim() ||
        !lastRow.status || !lastRow.status.trim() ||
        !lastRow.calibrationCertificate || !lastRow.calibrationCertificate.trim() ||
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
          instrumentId: !lastRow.part ? 'instrumentId is Required' : '',
          instrumentName: !lastRow.instrumentName ? 'instrumentName is Required' : '',
          calibrateDate: !lastRow.calibrateDate ? 'calibrateDate is Required' : '',
          dueDate: !lastRow.dueDate ? 'dueDate is Required' : '',
          frequencyForCalibration: !lastRow.frequencyForCalibration ? 'Quantity Nos is Required' : '',
          issuedQty: !lastRow.issuedQty ? 'issuedQty is Required' : '',
          status: !lastRow.status ? 'Gross Amount is Required' : '',
          calibrationCertificate: !lastRow.calibrationCertificate ? 'Tax Code is Required' : '',
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
    if (!formData.issueNo) errors.issueNo = 'Route Card No is Required';
    if (!formData.issueDate) errors.issueDate = 'Part No is Required';
    if (!formData.receivedFrom) errors.receivedFrom = 'Part Name is Required';
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
    if (!formData.remarks) errors.remarks = 'General Remarks is Required';
    if (!formData.receivedBy) errors.receivedBy = 'Quality Name is Required';

    let detailTableDataValid = true;
    const newTableErrors = workJobTableData.map((row) => {
      const rowErrors = {};
      if (!row.instrumentId) { rowErrors.instrumentId = 'instrumentId is Required'; detailTableDataValid = false; }
      if (!row.instrumentName) { rowErrors.instrumentName = 'Method Of Inspection is Required'; detailTableDataValid = false; }
      if (!row.calibrateDate) { rowErrors.calibrateDate = 'calibrateDate is Required'; detailTableDataValid = false; }
      if (!row.dueDate) { rowErrors.dueDate = 'dueDate is Required'; detailTableDataValid = false; }
      if (!row.frequencyForCalibration) { rowErrors.frequencyForCalibration = 'frequencyForCalibration is Required'; detailTableDataValid = false; }
      if (!row.issuedQty) { rowErrors.issuedQty = 'Sample 1 is Required'; detailTableDataValid = false; }
      if (!row.status) { rowErrors.status = 'Sample 2 is Required'; detailTableDataValid = false; }
      if (!row.calibrationCertificate) { rowErrors.calibrationCertificate = 'Sample 3 is Required'; detailTableDataValid = false; }
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
        instrumentId: row.instrumentId,
        instrumentName: row.instrumentName
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
                    label="Calibration Received ID"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="calibrationReceivedId"
                    value={formData.calibrationReceivedId}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Calibration Received Date"
                        value={formData.calibrationReceivedDate}
                        onChange={(date) => handleDateChange('calibrationReceivedDate', date)}
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
                    value={formData.issueNo ? partyList.find((c) => c.partyname === formData.issueNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'issueNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Issue No"
                        name="issueNo"
                        error={!!fieldErrors.issueNo}  // Shows error if issueNo has a value in fieldErrors
                        helperText={fieldErrors.issueNo} // Displays the error message
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
                      id="issueDate"
                      label="Issue Date"
                      // label={
                      //   <span>
                      //     Drawing Id <span className="asterisk">*</span>
                      //   </span>
                      // }
                      name="issueDate"
                      size="small"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.issueDate}
                      helperText={fieldErrors.issueDate}
                      disabled
                    />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Received From"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="receivedFrom"
                    value={formData.receivedFrom}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                    disabled
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
                    <Tab value={0} label="Received from Calibration Details" />
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
                                    <th className="table-header">Instrument ID</th>
                                    <th className="table-header">Instrument Name</th>
                                    <th className="table-header">Calibrate Date</th>
                                    <th className="table-header">Due Date</th>
                                    <th className="table-header">Frequency for Calibration</th>
                                    <th className="table-header">Issued Qty</th>
                                    <th className="table-header">Status</th>
                                    <th className="table-header">Calibration Certificate</th>
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
                                          value={formData.instrumentId ? partyList.find((c) => c.partyname === formData.instrumentId) : null}
                                          onChange={(event, newValue) => {
                                            handleInputChange({
                                              target: {
                                                name: 'instrumentId',
                                                value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                              },
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="instrumentId"
                                              name="instrumentId"
                                              error={!!fieldErrors.instrumentId}  // Shows error if instrumentId has a value in fieldErrors
                                              helperText={fieldErrors.instrumentId} // Displays the error message
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 40, width: 200 }
                                              }}
                                            />
                                          )}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.instrumentName}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, instrumentName: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                instrumentName: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.instrumentName ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {workJobTableErrors[index]?.instrumentName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].instrumentName}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2" style={{ width: '200px' }}>
                                        <FormControl fullWidth variant="filled" size="small">
                                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                              label="calibrateDate"
                                              value={formData.calibrateDate}
                                              onChange={(date) => handleDateChange('calibrateDate', date)}
                                              disabled
                                              slotProps={{
                                                textField: { size: 'small', clearable: true }
                                              }}
                                              format="DD-MM-YYYY"
                                            />
                                          </LocalizationProvider>
                                        </FormControl>
                                      </td>
                                      <td className="border px-2 py-2" style={{ width: '200px' }}>
                                        <FormControl fullWidth variant="filled" size="small">
                                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                              label="dueDate"
                                              value={formData.dueDate}
                                              onChange={(date) => handleDateChange('dueDate', date)}
                                              disabled
                                              slotProps={{
                                                textField: { size: 'small', clearable: true }
                                              }}
                                              format="DD-MM-YYYY"
                                            />
                                          </LocalizationProvider>
                                        </FormControl>
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.frequencyForCalibration}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, frequencyForCalibration: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                frequencyForCalibration: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.frequencyForCalibration ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.frequencyForCalibration && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].frequencyForCalibration}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.issuedQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, issuedQty: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                issuedQty: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.issuedQty ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.issuedQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].issuedQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.status}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, status: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                status: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.status ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.status && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].status}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.calibrationCertificate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, calibrationCertificate: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                calibrationCertificate: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.calibrationCertificate ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.calibrationCertificate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].calibrationCertificate}
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
                              id="remarks"
                              label="Remarks"
                              size="small"
                              name="remarks"
                              value={formData.remarks}
                              multiline
                              // minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.remarks}
                              helperText={fieldErrors.remarks}
                            />
                          </FormControl>
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


                        <div className="col-md-3 mb-3">
                          <Autocomplete
                            disablePortal
                            options={partyList.map((option, index) => ({ ...option, key: index }))}
                            getOptionLabel={(option) => option.partyname || ''}
                            sx={{ width: '100%' }}
                            size="small"
                            value={formData.receivedBy ? partyList.find((c) => c.partyname === formData.receivedBy) : null}
                            onChange={(event, newValue) => {
                              handleInputChange({
                                target: {
                                  name: 'receivedBy',
                                  value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                },
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Received By"
                                name="receivedBy"
                                error={!!fieldErrors.receivedBy}  // Shows error if receivedBy has a value in fieldErrors
                                helperText={fieldErrors.receivedBy} // Displays the error message
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
export default ToolsReceived;
