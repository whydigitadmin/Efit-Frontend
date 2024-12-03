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

const SubContractorInvoice = () => {
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
    jobOrderNo: '',
    partNo: '',
    partName: '',
    drgNo: '',
    routeCardNo: '',
    subContractorCode: '',
    subContractorAddress: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: new Date(),
    jobOrderNo: '',
    partNo: '',
    partName: '',
    drgNo: '',
    routeCardNo: '',
    subContractorCode: '',
    subContractorAddress: ''
  });

  const listViewColumns = [
    { accessorKey: 'JobOrderNo', header: 'Job Order No', size: 140 },
    { accessorKey: 'RouteCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'SubContractorCode', header: 'Sub Contractor Code', size: 140 },
    { accessorKey: 'Delivery Note Date', header: 'Delivery Note Date', size: 140 }
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      partNo: '',
      partDesc: '',
      process: '',
      quantityNos: '',
      rate: '',
      amount: '',
      cgst: '',
      sgst: '',
      landedAmount: ''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      partNo: '',
      partDesc: '',
      process: '',
      quantityNos: '',
      rate: '',
      amount: '',
      cgst: '',
      sgst: '',
      landedAmount: ''
    }
  ]);

  const [termsTable, setTermsTable] = useState([
    {
      id: 1,
      terms: '',
      description: ''
    }
  ]);
  const [termsTableErrors, setTermsTableErrors] = useState([
    {
      terms: '',
      description: ''
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
      jobOrderNo: '',
      dcNo: '',
      deliveryNoteDate: '',
      currency: '',
      dispatchedThrough: '',
      orgId: orgId,
      routeCardNo: '',
      subContractorCode: '',
      subContractorAddress: ''
    });
    // getAllActiveCurrency(orgId);
    setFieldErrors({
      jobOrderNo: '',
      dcNo: '',
      deliveryNoteDate: '',
      currency: '',
      dispatchedThrough: '',
      orgId: orgId,
      routeCardNo: '',
      subContractorCode: '',
      subContractorAddress: ''
    });
    setDetailsTableData([
      { id: 1, partNo: '', partDesc: '', process: '', quantityNos: '', rate: '', amount: '', cgst: '', sgst: '', landedAmount: '' }
    ]);
    setTermsTable([
      {
        terms: '',
        description: ''
      }
    ]);
    setDetailsTableErrors('');
    setTermsTableErrors('');
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
      partNo: '',
      process: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { partNo: '', process: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return !lastRow.partNo || !lastRow.process;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          process: !table[table.length - 1].process ? 'Process is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleTermAddRow = () => {
    if (isTermsLastRowEmpty(termsTable)) {
      displayTermsRowError(termsTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      terms: '',
      description: ''
    };
    setTermsTable([...termsTable, newRow]);
    setTermsTableErrors([...termsTableErrors, { terms: '', description: '' }]);
  };

  const isTermsLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === termsTable) {
      return !lastRow.terms || !lastRow.description;
    }
    return false;
  };

  const displayTermsRowError = (table) => {
    if (table === termsTable) {
      setTermsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          terms: !table[table.length - 1].terms ? 'Terms is required' : '',
          description: !table[table.length - 1].description ? 'Description is required' : ''
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

    if (!formData.jobOrderNo) {
      errors.jobOrderNo = 'Job Order No is  required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'Part No is required';
        detailTableDataValid = false;
      }
      if (!row.process) {
        rowErrors.process = 'Process is required';
        detailTableDataValid = false;
      }

      return rowErrors;
    });

    setDetailsTableErrors(newTableErrors);
    let termsTableDataValid = true;
    const termsTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.terms) {
        rowErrors.terms = 'Terms is required';
        termsTableDataValid = false;
      }
      if (!row.description) {
        rowErrors.description = 'Description is required';
        termsTableDataValid = false;
      }

      return rowErrors;
    });

    setTermsTableErrors(termsTableErrors);
    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && detailTableDataValid && termsTableDataValid) {
      const GeneralJournalVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        partNo: row.partNo,
        partDesc: row.partDesc,
        process: row.process,
        quantityNos: row.quantityNos,
        rate: row.rate,
        amount: row.amount,
        cgst: row.cgst,
        sgst: row.sgst,
        landedAmount: row.landedAmount
      }));
      const termsVO = termsTable.map((row) => ({
        ...(editId && { id: row.id }),
        terms: row.terms,
        description: row.description
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        dcNo: formData.dcNo,
        deliveryNoteDate: formData.deliveryNoteDate,
        dispatchedThrough: formData.dispatchedThrough,
        jobOrderNo: formData.jobOrderNo,
        finYear: finYear,
        orgId: orgId,
        // particularsJournalDTO: GeneralJournalVO,
        routeCardNo: formData.routeCardNo,
        subContractorCode: formData.subContractorCode,
        subContractorAddress: formData.subContractorAddress
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
                    value={formData.jobOrderNo ? routeCardList.find((c) => c.partyname === formData.jobOrderNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'jobOrderNo',
                          value: newValue ? newValue.partyname : ''
                        }
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
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="DCNO"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="dcNo"
                    type="text"
                    value={formData.dcNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.dcNo ? 'DCNO is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Delivery Note Date"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="deliveryNoteDate"
                    type="text"
                    value={formData.deliveryNoteDate}
                    onChange={handleInputChange}
                    helperText={
                      <span style={{ color: 'red' }}>{fieldErrors.deliveryNoteDate ? 'Delivery Note Date is required' : ''}</span>
                    }
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Dispatched Through"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="dispatchedThrough"
                    type="text"
                    value={formData.dispatchedThrough}
                    onChange={handleInputChange}
                    helperText={
                      <span style={{ color: 'red' }}>{fieldErrors.dispatchedThrough ? 'Dispatched Through is required' : ''}</span>
                    }
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Route Card No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="routeCardNo"
                    type="text"
                    value={formData.routeCardNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.routeCardNo ? 'Route Card No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Sub Contractor Code"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="subContractorCode"
                    type="text"
                    value={formData.subContractorCode}
                    onChange={handleInputChange}
                    helperText={
                      <span style={{ color: 'red' }}>{fieldErrors.subContractorCode ? 'Sub Contractor Code is required' : ''}</span>
                    }
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Sub Contractor Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="subContractorAddress"
                    type="text"
                    value={formData.subContractorAddress}
                    onChange={handleInputChange}
                    helperText={
                      <span style={{ color: 'red' }}>{fieldErrors.subContractorAddress ? 'Sub Contractor Address is required' : ''}</span>
                    }
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
                    <Tab value={0} label="Tax Invoice Details" />
                    <Tab value={1} label="Payment Details" />
                    <Tab value={2} label="Terms and Conditions" />
                    <Tab value={3} label="Summary" />
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
                                    <th className="table-header">Part Desc</th>
                                    <th className="table-header">Process</th>
                                    <th className="table-header">Quantity Nos</th>
                                    <th className="table-header">Rate</th>
                                    <th className="table-header">Amount</th>
                                    <th className="table-header">CGST</th>
                                    <th className="table-header">SGST</th>
                                    <th className="table-header">Landed Amount</th>
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
                                          value={row.partDesc}
                                          style={{ width: '150px' }}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, partDesc: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partDesc: !value ? 'Part Desc is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.partDesc && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].partDesc}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.process}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, process: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                process: !value ? 'Process is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.process ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.process && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].process}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.quantityNos}
                                          style={{ width: '150px' }}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, quantityNos: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                quantityNos: !value ? 'Quantity Nos is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.quantityNos ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.quantityNos && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].quantityNos}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.rate}
                                          disabled
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, rate: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                rate: !value ? 'Rate is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.rate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].rate}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.amount}
                                          disabled
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                amount: !value ? 'Amount is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.amount ? 'error form-control' : 'form-control'}
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
                                          value={row.cgst}
                                          disabled
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, cgst: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                cgst: !value ? 'CGST is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.cgst ? 'error form-control' : 'form-control'}
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
                                          value={row.sgst}
                                          disabled
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, sgst: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sgst: !value ? 'SGST is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.sgst ? 'error form-control' : 'form-control'}
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
                                          value={row.landedAmount}
                                          disabled
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, landedAmount: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                landedAmount: !value ? 'Landed Amount is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.landedAmount ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.landedAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].landedAmount}
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
                          <TextField
                            id="outlined-textarea-zip"
                            label="Gross Amount"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="grossAmount"
                            type="text"
                            value={formData.grossAmount}
                            onChange={handleInputChange}
                            helperText={<span style={{ color: 'red' }}>{fieldErrors.grossAmount ? 'Gross Amount is required' : ''}</span>}
                            inputProps={{ maxLength: 40 }}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <TextField
                            id="outlined-textarea-zip"
                            label="Total Tax Amount"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="totalTaxAmount"
                            type="text"
                            value={formData.totalTaxAmount}
                            onChange={handleInputChange}
                            helperText={
                              <span style={{ color: 'red' }}>{fieldErrors.totalTaxAmount ? 'Total Tax Amount is required' : ''}</span>
                            }
                            inputProps={{ maxLength: 40 }}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <TextField
                            id="outlined-textarea-zip"
                            label="Net Amount"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="netAmount"
                            type="text"
                            value={formData.netAmount}
                            onChange={handleInputChange}
                            helperText={<span style={{ color: 'red' }}>{fieldErrors.netAmount ? 'Net Amount is required' : ''}</span>}
                            inputProps={{ maxLength: 40 }}
                          />
                        </div>
                        <div className="col-md-8 mb-3">
                          <TextField
                            id="outlined-textarea-zip"
                            label="Amount in Words"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="amountInWords"
                            type="text"
                            value={formData.amountInWords}
                            onChange={handleInputChange}
                            helperText={
                              <span style={{ color: 'red' }}>{fieldErrors.amountInWords ? 'Amount in Words is required' : ''}</span>
                            }
                            inputProps={{ maxLength: 40 }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {value === 2 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleTermAddRow} />
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Terms</th>
                                    <th className="table-header">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {termsTable.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(row.id, termsTable, setTermsTable, termsTableErrors, setTermsTableErrors)
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.terms}
                                          className={termsTableErrors[index]?.terms ? 'error form-control' : 'form-control'}
                                          onChange={(e) =>
                                            setTermsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, terms: e.target.value } : r))
                                            )
                                          }
                                        >
                                          <option value="">-- Select --</option>
                                          <option value="Terms of Payment">Terms of Payment</option>
                                          <option value="Terms of Delivery">Terms of Delivery</option>
                                        </select>
                                        {termsTableErrors[index]?.terms && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {termsTableErrors[index].terms}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.description}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setTermsTable((prev) => prev.map((r) => (r.id === row.id ? { ...r, description: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                description: !value ? 'Description is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={termsTableErrors[index]?.description ? 'error form-control' : 'form-control'}
                                        />
                                        {termsTableErrors[index]?.description && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {termsTableErrors[index].description}
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
                  {value === 3 && (
                    <>
                      <div className="row d-flex mt-2">
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
export default SubContractorInvoice;
