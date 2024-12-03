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

const SettingApproval = () => {
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
  const [routeCardList, setRouteCardList] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    docDate: dayjs(),
    routeCardNo: '',
    partNo: '',
    partName: '',
    drgNo: '',
    operation: '',
    cycleTime: '',
    machineNo: '',
    machineName: '',
    sampleQty: '',
    grnClearTime: '',
    documentFormatNo: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: new Date(),
    routeCardNo: '',
    partNo: '',
    partName: '',
    drgNo: '',
    operation: '',
    cycleTime: '',
    machineNo: '',
    machineName: '',
    sampleQty: '',
    grnClearTime: '',
    documentFormatNo: ''
  });

  const listViewColumns = [
    { accessorKey: 'routeCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'machineName', header: 'Machine No', size: 140 },
    { accessorKey: 'drgNO', header: 'DRG No', size: 140 },
    { accessorKey: 'documentFormatNo', header: 'Document Format No', size: 140 }
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      characteristics: '',
      specification: '',
      methodOfInspection: '',
      lsl: '',
      usl: '',
      setter: '',
      quality: '',
      remarks: ''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      characteristics: '',
      specification: '',
      methodOfInspection: '',
      lsl: '',
      usl: '',
      setter: '',
      quality: '',
      remarks: ''
    }
  ]);

  // useEffect(() => {
  //   getGeneralJournalDocId();
  //   getAllGeneralJournalByOrgId();
  //   getAccountNameFromGroup();
  // }, []);

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
          woNo: glVO.woNo || '',
          id: glVO.id || '',
          docDate: glVO.docDate ? dayjs(glVO.docDate, 'YYYY-MM-DD') : dayjs(),
          docId: glVO.docId || '',
          customerName: glVO.customerName || '',
          customerPONo: glVO.customerPONo || '',
          quotationNo: glVO.quotationNo || '',
          currency: glVO.currency || '',
          productionMgr: glVO.productionMgr || '',
          refDate: glVO.refDate ? dayjs(glVO.refDate, 'YYYY-MM-DD') : dayjs(),
          remarks: glVO.remarks || '',
          orgId: glVO.orgId || ''
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
      routeCardNo: '',
      partNo: '',
      partName: '',
      drgNo: '',
      operation: '',
      cycleTime: '',
      machineNo: '',
      machineName: '',
      sampleQty: '',
      grnClearTime: '',
      documentFormatNo: ''
    });
    // getAllActiveCurrency(orgId);
    setFieldErrors({
      routeCardNo: '',
      partNo: '',
      partName: '',
      drgNo: '',
      operation: '',
      cycleTime: '',
      machineNo: '',
      machineName: '',
      sampleQty: '',
      grnClearTime: '',
      documentFormatNo: ''
    });
    setDetailsTableData([
      { id: 1, characteristics: '', specification: '', methodOfInspection: '', lsl: '', usl: '', setter: '', quality: '', remarks: '' }
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
      lsl: '',
      usl: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { lsl: '', usl: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return !lastRow.lsl || !lastRow.usl;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          lsl: !table[table.length - 1].lsl ? 'LSL is required' : '',
          usl: !table[table.length - 1].usl ? 'USL is required' : ''
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

    if (!formData.routeCardNo) {
      errors.routeCardNo = 'Route Card No is  required';
    }
    if (!formData.partNo) {
      errors.partNo = 'Part No is  required';
    }
    if (!formData.drgNo) {
      errors.drgNo = 'DRG No is  required';
    }
    if (!formData.machineNo) {
      errors.machineNo = 'Machine No is  required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.lsl) {
        rowErrors.lsl = 'LSL is required';
        detailTableDataValid = false;
      }

      return rowErrors;
    });

    setFieldErrors(errors);
    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        characteristics: row.characteristics,
        specification: row.specification,
        methodOfInspection: row.methodOfInspection,
        lsl: row.lsl,
        usl: row.usl,
        setter: row.setter,
        quality: row.quality,
        remarks: row.remarks
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        routeCardNo: formData.routeCardNo,
        partNo: formData.partNo,
        partName: formData.partName,
        drgNo: formData.drgNo,
        finYear: finYear,
        orgId: orgId,
        // particularsJournalDTO: GeneralJournalVO,
        operation: formData.operation,
        cycleTime: formData.cycleTime,
        machineNo: formData.machineNo,
        machineName: formData.machineName,
        sampleQty: formData.sampleQty,
        grnClearTime: formData.grnClearTime,
        documentFormatNo: formData.documentFormatNo
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
                    label="Part No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="partNo"
                    type="text"
                    value={formData.partNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.partNo ? 'Part No is required' : ''}</span>}
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
                  <Autocomplete
                    disablePortal
                    options={routeCardList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.drgNo ? routeCardList.find((c) => c.partyname === formData.drgNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'drgNo',
                          value: newValue ? newValue.partyname : ''
                        }
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
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Operation"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="operation"
                    type="text"
                    value={formData.operation}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.operation ? 'Operation is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Cycle Time (Sec)"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="cycleTime"
                    type="text"
                    value={formData.cycleTime}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.cycleTime ? 'Cycle Time (Sec) is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={routeCardList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.machineNo ? routeCardList.find((c) => c.partyname === formData.machineNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'machineNo',
                          value: newValue ? newValue.partyname : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Machine No"
                        name="machineNo"
                        error={!!fieldErrors.machineNo}
                        helperText={fieldErrors.machineNo}
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
                    label="Machine Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="machineName"
                    type="text"
                    value={formData.machineName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineName ? 'Machine Name is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Sample Qty"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="sampleQty"
                    type="text"
                    value={formData.sampleQty}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.sampleQty ? 'Sample Qty is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="GRN ClearTime"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="grnClearTime"
                    type="text"
                    value={formData.grnClearTime}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.grnClearTime ? 'GRN ClearTime is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={routeCardList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.documentFormatNo ? routeCardList.find((c) => c.partyname === formData.documentFormatNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'documentFormatNo',
                          value: newValue ? newValue.partyname : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Document Format No"
                        name="documentFormatNo"
                        error={!!fieldErrors.documentFormatNo}
                        helperText={fieldErrors.documentFormatNo}
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
                    <Tab value={0} label="Approval Details" />
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
                                    <th className="table-header">Specification</th>
                                    <th className="table-header">Method of Inspection</th>
                                    <th className="table-header">LSL</th>
                                    <th className="table-header">USL</th>
                                    <th className="table-header">Setter 1</th>
                                    <th className="table-header">Quality 1</th>
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
                                          type="text"
                                          value={row.characteristics}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, characteristics: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                characteristics: !value ? 'Characteristics is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.characteristics ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.characteristics && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].characteristics}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.specification}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, specification: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                specification: !value ? 'Specification is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.specification ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.specification && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].specification}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.methodOfInspection}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, methodOfInspection: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                methodOfInspection: !value ? 'Method of Inspection is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.methodOfInspection ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.methodOfInspection && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].methodOfInspection}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.lsl}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, lsl: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                lsl: !value ? 'LSL is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.lsl ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.lsl && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].lsl}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.usl}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, usl: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                usl: !value ? 'USL is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.usl ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.usl && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].usl}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.setter}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, setter: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                setter: !value ? 'Setter 1 is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.setter ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.setter && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].setter}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.quality}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, quality: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                quality: !value ? 'Quality 1 is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.quality ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.quality && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].quality}
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
                      <div className="row d-flex ml">
                        <div className="col-md-3 mb-3">
                          <Autocomplete
                            disablePortal
                            options={routeCardList.map((option, index) => ({ ...option, key: index }))}
                            getOptionLabel={(option) => option.partyname || ''}
                            sx={{ width: '100%' }}
                            size="small"
                            value={formData.operatorName ? routeCardList.find((c) => c.partyname === formData.operatorName) : null}
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
                        <div className="col-md-3 mb-3">
                          <Autocomplete
                            disablePortal
                            options={routeCardList.map((option, index) => ({ ...option, key: index }))}
                            getOptionLabel={(option) => option.partyname || ''}
                            sx={{ width: '100%' }}
                            size="small"
                            value={formData.setterName ? routeCardList.find((c) => c.partyname === formData.setterName) : null}
                            onChange={(event, newValue) => {
                              handleInputChange({
                                target: {
                                  name: 'setterName',
                                  value: newValue ? newValue.partyname : ''
                                }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Setter Name"
                                name="setterName"
                                error={!!fieldErrors.setterName}
                                helperText={fieldErrors.setterName}
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
                            value={formData.shiftInCharge ? routeCardList.find((c) => c.partyname === formData.shiftInCharge) : null}
                            onChange={(event, newValue) => {
                              handleInputChange({
                                target: {
                                  name: 'shiftInCharge',
                                  value: newValue ? newValue.partyname : ''
                                }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Shift In Charge"
                                name="shiftInCharge"
                                error={!!fieldErrors.shiftInCharge}
                                helperText={fieldErrors.shiftInCharge}
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
                            value={formData.qualityName ? routeCardList.find((c) => c.partyname === formData.qualityName) : null}
                            onChange={(event, newValue) => {
                              handleInputChange({
                                target: {
                                  name: 'qualityName',
                                  value: newValue ? newValue.partyname : ''
                                }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Quality Name"
                                name="qualityName"
                                error={!!fieldErrors.qualityName}
                                helperText={fieldErrors.qualityName}
                                InputProps={{
                                  ...params.InputProps,
                                  style: { height: 40 }
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="col-md-8 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="generalRemark"
                              label="General Remark"
                              size="small"
                              name="remarks"
                              value={formData.generalRemark}
                              multiline
                              minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-8">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="narration"
                              label="Narration"
                              size="small"
                              name="remarks"
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
export default SettingApproval;
