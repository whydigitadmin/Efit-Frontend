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

const ToolsIssue = () => {
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
    calibrationID: '',
    calibrationDate: dayjs(),
    issuePartyName: '',
    issuePartyAddress: '',
    orgId: orgId,
    // Summary 
    totalQuantity: '',
    remarks: '',
    createdBy: '',
    narration: '',

  });

  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    calibrationID: '',
    calibrationDate: dayjs(),
    issuePartyName: '',
    issuePartyAddress: '',
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
    createdBy: '',
    remarks: '',
    narration: '',
    totalQuantity: '',

  });

  const listViewColumns = [
    { accessorKey: 'Contractor Code', header: 'Contractor Code', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'calibrationID', header: 'Document Id', size: 140 }
  ];

  const [workJobTableData, setWorkJobTableData] = useState([
    {
      id: 1,
      instrumentId: '',
      instrumentName: '',
      instrumentDescription: '',
      issueQuantity: '',
      unit: '',
    }
  ]);
  const [workJobTableErrors, setworkJobTableErrors] = useState([
    {
      id: 1,
      instrumentId: '',
      instrumentName: '',
      instrumentDescription: '',
      issueQuantity: '',
      unit: '',
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
    getGeneralJournalcalibrationID();
    getAllGeneralJournalByOrgId();
    getAccountNameFromGroup();
  }, []);

  useEffect(() => {
    const totalDebit = workJobTableData.reduce((sum, row) => sum + Number(row.revisionNo || 0), 0);
    const totalCredit = workJobTableData.reduce((sum, row) => sum + Number(row.unit || 0), 0);

    setFormData((prev) => ({
      ...prev,
      // createdBy: totalDebit, 
    }));
  }, [workJobTableData]);

  const getGeneralJournalcalibrationID = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getGeneralJournalcalibrationID?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        calibrationID: response.paramObjectsMap.generalJournalcalibrationID,
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
          calibrationID: glVO.calibrationID || '',
          refNo: glVO.refNo || '',
          referenceDate: glVO.referenceDate ? dayjs(glVO.referenceDate, 'YYYY-MM-DD') : dayjs(),
          contractorName: glVO.contractorName || '',
          orgId: glVO.orgId || '',
          createdBy: glVO.createdBy || '',
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
      // calibrationID: '',
      // calibrationDate: dayjs(),
      issuePartyName: '',
      issuePartyAddress: '',
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
      totalQuantity: '',
      remarks: '',
      createdBy: '',
      narration: '',
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      // calibrationID: '',
      // calibrationDate: dayjs(),
      issuePartyName: '',
      issuePartyAddress: '',
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
      createdBy: '',
      remarks: '',
      narration: '',
      totalQuantity: '',

    });
    setWorkJobTableData([
      {
        id: 1,
        instrumentId: '',
        instrumentName: '',
        instrumentDescription: '',
        issueQuantity: '',
        unit: '',

      }
    ]);
    setworkJobTableErrors('');
    setEditId('');
    getGeneralJournalcalibrationID();
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
      instrumentDescription: '',
      issueQuantity: '',
      unit: '', 
    }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === workJobTableData) {
      return (
        !lastRow.instrumentId || !lastRow.instrumentId.trim() ||
        !lastRow.instrumentName || !lastRow.instrumentName.trim() ||
        !lastRow.instrumentDescription || !lastRow.instrumentDescription.trim() ||
        !lastRow.issueQuantity || !lastRow.issueQuantity.trim() ||
        !lastRow.unit || !lastRow.unit.trim() ||
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
          instrumentId: !lastRow.part ? 'Instrument Id is Required' : '',
          instrumentName: !lastRow.instrumentName ? 'Instrument Name is Required' : '',
          instrumentDescription: !lastRow.instrumentDescription ? 'Instrument Description is Required' : '',
          issueQuantity: !lastRow.issueQuantity ? 'Issue Quantity is Required' : '',
          unit: !lastRow.unit ? 'Unit is Required' : '', 
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
    if (!formData.issuePartyName) errors.issuePartyName = 'Issue Party Name is Required';
    if (!formData.issuePartyAddress) errors.issuePartyAddress = 'Issue Party Address is Required';
    if (!formData.totalQuantity) errors.totalQuantity = 'Total Quantity is Required'; 
    if (!formData.remarks) errors.remarks = 'Remarks is Required';
    if (!formData.createdBy) errors.createdBy = 'Created By is Required';
    if (!formData.narration) errors.narration = 'Narration is Required';

    let detailTableDataValid = true;
    const newTableErrors = workJobTableData.map((row) => {
      const rowErrors = {};
      if (!formData.instrumentId) {
        errors.instrumentId = 'Instrument ID is required';
      }
      if (!row.instrumentName) {
        rowErrors.instrumentName = 'Instrument Name is Required';
        detailTableDataValid = false;
      }
      if (!row.instrumentDescription) {
        rowErrors.instrumentDescription = 'Instrument Description is Required';
        detailTableDataValid = false;
      }
      if (!row.issueQuantity) {
        rowErrors.issueQuantity = 'Issue Quantity is Required';
        detailTableDataValid = false;
      }
      if (!row.unit) {
        rowErrors.unit = 'Unit is Required';
        detailTableDataValid = false;
      }



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
        createdBy: formData.createdBy,
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
                    label="Calibration ID"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="calibrationID"
                    value={formData.calibrationID}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Calibration Date"
                        value={formData.calibrationDate}
                        onChange={(date) => handleDateChange('calibrationDate', date)}
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
                    value={formData.issuePartyName ? partyList.find((c) => c.partyname === formData.issuePartyName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'issuePartyName',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Issue Party Name"
                        name="issuePartyName"
                        error={!!fieldErrors.issuePartyName}  // Shows error if issuePartyName has a value in fieldErrors
                        helperText={fieldErrors.issuePartyName} // Displays the error message
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
                      id="issuePartyAddress"
                      label="Issue Party Address"
                      // label={
                      //   <span>
                      //     Drawing Id <span className="asterisk">*</span>
                      //   </span>
                      // }
                      name="issuePartyAddress"
                      size="small"
                      value={formData.issuePartyAddress}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.issuePartyAddress}
                      helperText={fieldErrors.issuePartyAddress}
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
                    <Tab value={0} label="Issue Details" />
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
                                    <th className="table-header">Instrument Description</th>
                                    <th className="table-header">Issue Quantity</th>
                                    <th className="table-header">Unit</th>
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
                                                value: newValue ? newValue.partyname : '',
                                              },
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Instrument ID"
                                              name="instrumentId"
                                              error={!!fieldErrors.instrumentId}
                                              helperText={fieldErrors.instrumentId}
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
                                        />
                                        {workJobTableErrors[index]?.instrumentName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].instrumentName}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.instrumentDescription}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, instrumentDescription: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                instrumentDescription: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.instrumentDescription ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.instrumentDescription && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].instrumentDescription}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.issueQuantity}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, issueQuantity: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                issueQuantity: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.issueQuantity ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.issueQuantity && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].issueQuantity}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.unit}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setWorkJobTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r))
                                            );
                                            setworkJobTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unit: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={workJobTableErrors[index]?.unit ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {workJobTableErrors[index]?.unit && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {workJobTableErrors[index].unit}
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
                      <div className='row d-flex'>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="totalQuantity"
                              label="Total Quantity"
                              size="small"
                              name="totalQuantity"
                              value={formData.totalQuantity}
                              multiline
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.totalQuantity}
                              helperText={fieldErrors.totalQuantity}
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
                            value={formData.remarks ? partyList.find((c) => c.partyname === formData.remarks) : null}
                            onChange={(event, newValue) => {
                              handleInputChange({
                                target: {
                                  name: 'remarks',
                                  value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                },
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Remarks"
                                name="remarks"
                                error={!!fieldErrors.remarks}
                                helperText={fieldErrors.remarks}
                                InputProps={{
                                  ...params.InputProps,
                                  style: { height: 40 },
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="row d-flex">
                        <div className="col-md-3 mb-3">
                          <Autocomplete
                            disablePortal
                            options={partyList.map((option, index) => ({ ...option, key: index }))}
                            getOptionLabel={(option) => option.partyname || ''}
                            sx={{ width: '100%' }}
                            size="small"
                            value={formData.createdBy ? partyList.find((c) => c.partyname === formData.createdBy) : null}
                            onChange={(event, newValue) => {
                              handleInputChange({
                                target: {
                                  name: 'createdBy',
                                  value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                },
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Created By"
                                name="createdBy"
                                error={!!fieldErrors.createdBy}
                                helperText={fieldErrors.createdBy}
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
                              id="narration"
                              label="Narration"
                              size="small"
                              name="narration"
                              value={formData.narration}
                              multiline
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
export default ToolsIssue;
