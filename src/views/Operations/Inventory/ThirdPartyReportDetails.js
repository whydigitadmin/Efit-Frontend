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
import { Autocomplete, Button, TextField } from '@mui/material';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import { FaCloudUploadAlt } from 'react-icons/fa';
const VisuallyHiddenInput = ({ ...props }) => <input type="file" style={{ display: 'none' }} {...props} />;

const ThirdPartyReportDetails = () => {
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
  const [drawingNoList, setDrawingNoList] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    docDate: dayjs(),
    grnNo: '',
    partNo: '',
    partName: '',
    drgNo: '',
    routeCardNo: '',
    subContractorCode: '',
    subContractorAddress: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: new Date(),
    grnNo: '',
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
                    label="Inspection No"
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
                        label="Inspection Date"
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
                    value={formData.grnNo ? routeCardList.find((c) => c.partyname === formData.grnNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'grnNo',
                          value: newValue ? newValue.partyname : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="GRN No"
                        name="grnNo"
                        error={!!fieldErrors.grnNo}
                        helperText={fieldErrors.grnNo}
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
                    label="Work Order No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="workOrderNo"
                    type="text"
                    value={formData.workOrderNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.workOrderNo ? 'Work Order No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="PO No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="poNo"
                    type="text"
                    value={formData.poNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.poNo ? 'PO No is required' : ''}</span>}
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
                    label="Supplier Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="supplierName"
                    type="text"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.supplierName ? 'Supplier Name is required' : ''}</span>}
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
                    value={formData.thirdPartyDetails ? routeCardList.find((c) => c.partyname === formData.thirdPartyDetails) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'thirdPartyDetails',
                          value: newValue ? newValue.partyname : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Third Party Details"
                        name="thirdPartyDetails"
                        error={!!fieldErrors.thirdPartyDetails}
                        helperText={fieldErrors.thirdPartyDetails}
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
                    label="Third Party Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="thirdPartyAddress"
                    type="text"
                    value={formData.thirdPartyAddress}
                    onChange={handleInputChange}
                    helperText={
                      <span style={{ color: 'red' }}>{fieldErrors.thirdPartyAddress ? 'Third Party Address is required' : ''}</span>
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
                    <Tab value={0} label="Third party Inspections Details" />
                    <Tab value={1} label="Third party Inspections Attach" />
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
                                    <th className="table-header">Item Id</th>
                                    <th className="table-header">Item Particular</th>
                                    <th className="table-header">Inspection Type</th>
                                    <th className="table-header">Certificate No</th>
                                    <th className="table-header">Status</th>
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
                                        <Autocomplete
                                          disablePortal
                                          options={drawingNoList.map((option, index) => ({ ...option, key: index }))}
                                          getOptionLabel={(option) => option.partNo || ''}
                                          sx={{ width: '100%' }}
                                          size="small"
                                          value={drawingNoList.find((c) => c.partNo === row.itemId) || null}
                                          onChange={(event, newValue) => {
                                            const selectedItemId = newValue ? newValue.itemId : '';
                                            setDetailsTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      itemId: selectedItemId
                                                    }
                                                  : r
                                              )
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemId: !selectedItemId ? 'Item Id is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Item Id"
                                              name="itemId"
                                              error={!!termsTableErrors[index]?.itemId}
                                              helperText={termsTableErrors[index]?.itemId}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 40, width: 150 }
                                              }}
                                            />
                                          )}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.itemParticular}
                                          style={{ width: '150px' }}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, itemParticular: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemParticular: !value ? 'Item Particular is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.itemParticular ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.itemParticular && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].itemParticular}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.inspectionType}
                                          style={{ width: '150px' }}
                                          className={detailsTableErrors[index]?.inspectionType ? 'error form-control' : 'form-control'}
                                          onChange={(e) =>
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, inspectionType: e.target.value } : r))
                                            )
                                          }
                                        >
                                          <option value="">-- Select --</option>
                                          <option value="Material Composition Inspection">Material Composition Inspection</option>
                                        </select>
                                        {detailsTableErrors[index]?.inspectionType && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].inspectionType}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.certificateNo}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, certificateNo: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                certificateNo: !value ? 'Certificate No is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.certificateNo ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.certificateNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].certificateNo}
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
                                          <option value="REJECTED">REJECTED</option>
                                          <option value="PENDING">PENDING</option>
                                          <option value="COMPLETED">COMPLETED</option>
                                        </select>
                                        {detailsTableErrors[index]?.status && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].status}
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
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleTermAddRow} />
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-6">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Item Id</th>
                                    <th className="table-header">Attachment</th>
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
                                        <Autocomplete
                                          disablePortal
                                          options={drawingNoList.map((option, index) => ({ ...option, key: index }))}
                                          getOptionLabel={(option) => option.partNo || ''}
                                          sx={{ width: '100%' }}
                                          size="small"
                                          value={drawingNoList.find((c) => c.partNo === row.itemId) || null}
                                          onChange={(event, newValue) => {
                                            const selectedItemId = newValue ? newValue.partNo : '';
                                            setTermsTable((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      itemId: selectedItemId
                                                    }
                                                  : r
                                              )
                                            );
                                            setTermsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemId: !selectedItemId ? 'Item Id is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Item Id"
                                              name="itemId"
                                              error={!!termsTableErrors[index]?.itemId}
                                              helperText={termsTableErrors[index]?.itemId}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 40, width: 150 }
                                              }}
                                            />
                                          )}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <div className="d-flex justify-content-center mb-2">
                                          <Button
                                            component="label"
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<FaCloudUploadAlt />}
                                            style={{ textTransform: 'none', padding: '6px 12px' }}
                                          >
                                            Upload File
                                            <VisuallyHiddenInput />
                                          </Button>
                                          {/* <input
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
                                          )}*/}
                                        </div>
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
export default ThirdPartyReportDetails;
