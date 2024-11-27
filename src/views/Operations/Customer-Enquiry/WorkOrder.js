import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
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
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
// import { getAllActiveCurrency } from 'utils/CommonFunctions';

const WorkOrder = () => {
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
  const [formData, setFormData] = useState({
    active: true,
    woNo: '',
    docDate: dayjs(),
    customerName: '',
    customerPONo:'',
    quotationNo:'',
    currency: '',
    productionMgr:'',
    orgId: orgId,
    refDate: null,
    refNo: '',
    remarks: '',
    totalCreditAmount: 0,
    totalDebitAmount: 0,
    voucherSubType: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    woNo: '',
    docDate: new Date(),
    customerName: '',
    customerPONo:'',
    quotationNo:'',
    currency:'',
    productionMgr:'',
    orgId: orgId,
    refDate: null,
    refNo: '',
    remarks: '',
    suppRefNo: '',
    totalCreditAmount: 0,
    totalDebitAmount: 0
  });

  const listViewColumns = [
    { accessorKey: 'woNo', header: 'WO No', size: 140 },
    { accessorKey: 'docdate', header: 'Docdate', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'customerPONo', header: 'customer PO No', size: 140 },
    { accessorKey: 'quotationNo', header: 'Quotation No', size: 140 },
    { accessorKey: 'currency', header: 'currency', size: 140 },
    { accessorKey: 'currency', header: 'Customer Due Date', size: 140 },
    { accessorKey: 'currency', header: 'Vap Due  Date', size: 140 },
    { accessorKey: 'productionMgr', header: 'production Mgr', size: 140 },


  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      partNo: '',
      partName: '',
      drawingNo: '',
      revisionNo: '',
      UOM: '',
      ordQty: '',
      freeQty: '',
      availableStockQty: '',
      requiredQty: ''

    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      partNo: '',
      partName: '',
      drawingNo: '',
      revisionNo: '',
      UOM: '',
      ordQty: '',
      freeQty: '',
      availableStockQty: '',
      requiredQty: ''
    }
  ]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const currencyData = await getAllActiveCurrency(orgId);
  //       setCurrencies(currencyData);
  //       console.log('currency', currencyData);
  //     } catch (error) {
  //       console.error('Error fetching country data:', error);
  //     }
  //   };

  //   fetchData();
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
      docDate: dayjs(),
      exRate: '',
      customerName:'',
      customerPONo:'',
      quotationNo:'',
      currency:'',
      productionMgr:'',
      orgId: orgId,
      refDate: null,
    });
    // getAllActiveCurrency(orgId);
    setFieldErrors({
      woNo: '',
      docDate: null,
      exRate: '',
      customerName:'',
      customerPONo:'',
      quotationNo:'',
      currency:'',
      productionMgr:'',
      orgId: orgId,
      refDate: '',
      refNo: '',
      remarks: '',
      voucherSubType: ''
    });
    setDetailsTableData([
      { id: 1, accountsName: '', subLedgerCode: '', debitAmount: '', creditAmount: '', narration: '', subledgerName: '' }
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
      accountsName: '',
      subLedgerCode: '',
      debitAmount: '',
      creditAmount: '',
      narration: '',
      subledgerName: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { partNo: '', partName: '', drawingNo: '', revisionNo: '', UOM: '', ordQty: '', freeQty: '', availableStockQty: '', requiredQty: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return (
        !lastRow.partNo ||
        !lastRow.partName ||
        !lastRow.drawingNo ||
        !lastRow.revisionNo ||
        !lastRow.uom ||
        !lastRow.ordQty ||
        !lastRow.freeQty ||
        !lastRow.availableStockQty ||
        !lastRow.requiredQty 
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
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          partName: !table[table.length - 1].partName ? 'Part Name is required' : '',
          drawingNo: !table[table.length - 1].drawingNo ? 'Drawing No is required' : '',
          revisionNo: !table[table.length - 1].revisionNo ? 'Revision No is required' : '',
          uom: !table[table.length - 1].uom ? 'UOM No is required' : '',
          ordQty: !table[table.length - 1].ordQty ? 'Ord Qty is required' : '',
          freeQty: !table[table.length - 1].freeQty ? 'Free Qty is required' : '',
          availableStockQty: !table[table.length - 1].availableStockQty ? 'Available Stock Qty is required' : '',
          requiredQty: !table[table.length - 1].requiredQty ? 'Required Qty is required' : '',
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

    if (!formData.customerName) {
      errors.customerName = 'Customer Name is  required';
    }
    if (!formData.customerPONo) {
      errors.customerPONo = 'Customer PO No is  required';
    }
    if (!formData.quotationNo) {
      errors.quotationNo = ' Quotation No is  required';
    }
    if (!formData.currency) {
      errors.currency = ' currency is  required';
    }
    if (!formData.productionMgr) {
      errors.productionMgr = ' production Mgr is  required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.partNo ) {
        rowErrors.partNo  = 'part No is required';
        detailTableDataValid = false;
      }
      if (!row.partName ) {
        rowErrors.partName  = 'part Name is required';
        detailTableDataValid = false;
      }
      if (!row.drawingNo ) {
        rowErrors.drawingNo  = 'Drawing No is required';
        detailTableDataValid = false;
      }
      if (!row.revisionNo) {
        rowErrors.revisionNo = 'RevisionNo is required';
        detailTableDataValid = false;
      }
      if (!row.uom) {
        rowErrors.uom = 'UOM is required';
        detailTableDataValid = false;
      }
      if (!row.ordQty) {
        rowErrors.ordQty = 'Ord Qty is required';
        detailTableDataValid = false;
      }
      if (!row.freeQty) {
        rowErrors.freeQty = 'Free Qty is required';
        detailTableDataValid = false;
      }
      if (!row.availableStockQty) {
        rowErrors.availableStockQty = 'Available Stock Qty is required';
        detailTableDataValid = false;
      }
      if (!row.requiredQty) {
        rowErrors.requiredQty = 'Required Qty is required';
        detailTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        accountsName: row.accountsName,
        creditAmount: row.creditAmount,
        debitAmount: row.debitAmount,
        narration: row.narration,
        subLedgerCode: row.subLedgerCode,
        subledgerName: row.subledgerName
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        currency: formData.currency,
        exRate: formData.exRate,
        finYear: finYear,
        orgId: orgId,
        particularsJournalDTO: GeneralJournalVO,
        refDate: dayjs(formData.refDate).format('YYYY-MM-DD'),
        refNo: formData.refNo,
        remarks: formData.remarks,
        totalCreditAmount: formData.totalCreditAmount,
        totalDebitAmount: formData.totalDebitAmount,
        voucherSubType: formData.voucherSubType
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
                {/* WO No. */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="WO No."
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="woNo"
                    value={formData.woNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                {/* Docdate */}
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
                {/* Customer Name */}
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                    <InputLabel id="demo-simple-select-label">
                      {
                        <span>
                          Customer Name <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Customer Name"
                      onChange={handleInputChange}
                      name="customerName"
                      value={formData.customerName}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.customerName}>
                          {item.customerName}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.customerName && <FormHelperText style={{ color: 'red' }}>customer Name is required</FormHelperText>}
                  </FormControl>
                </div>
               {/* Customer PO No */}
               <div className="col-md-3 mb-3">
                  <TextField
                    label="Customer PO No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerPONo"
                    value={formData.customerPONo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.customerPONo}
                    helperText={fieldErrors.customerPONo}
                  // inputRef={UOMDescriptionRef}
                  />
               </div>
                {/* Quotation No */}
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                    <InputLabel id="demo-simple-select-label">
                      {
                        <span>
                          Quotation No 
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Quotation No"
                      onChange={handleInputChange}
                      name="quotationNo"
                      value={formData.quotationNo}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.quotationNo}>
                          {item.quotationNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.quotationNo && <FormHelperText style={{ color: 'red' }}>Quotation No is required</FormHelperText>}
                  </FormControl>
                </div>
                {/* Currency */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Currency"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    error={!!fieldErrors.currency}
                    helperText={fieldErrors.currency}
                  // inputRef={UOMDescriptionRef}
                  />
               </div>
                
                {/* Customer Due Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Customer Due Date"
                        value={formData.customerDueDate}
                        onChange={(date) => handleDateChange('customerDueDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.customerDueDate && <p className="dateErrMsg"> is required</p>}
                  </FormControl>
                </div>
                {/* Vap Due Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Vap Due Date"
                        value={formData.refDate}
                        onChange={(date) => handleDateChange('refDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.refDate && <p className="dateErrMsg">Ref Date is required</p>}
                  </FormControl>
                </div>
                {/* Production Mgr */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Production Mgr"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="productionMgr"
                    value={formData.productionMgr}
                    onChange={handleInputChange}
                    error={!!fieldErrors.productionMgr}
                    helperText={fieldErrors.productionMgr}
                  // inputRef={UOMDescriptionRef}
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
                    <Tab value={0} label="Item Particulars" />
                    <Tab value={1} label="Terms and Conditions" />
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
                                    <th className="table-header">Part no</th>
                                    <th className="table-header">Part name</th>
                                    <th className="table-header">Drawing No</th>
                                    <th className="table-header">Revision No</th>
                                    <th className="table-header">UOM</th>
                                    <th className="table-header">Ord Qty</th>
                                    <th className="table-header">Free Qty</th>
                                    <th className="table-header">Available Stock Qty</th>
                                    <th className="table-header">Required Qty</th>
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
                                          value={row.partNo}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, partNo: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partNo: !value ? 'Part No is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.partNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].partNo}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.partName}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, partName: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partName: !value ? 'part Name is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.partName ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.partName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].partName}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.drawingNo}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, drawingNo: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                drawingNo: !value ? 'drawing No is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.drawingNo ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.drawingNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].drawingNo}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.revisionNo}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, revisionNo: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                revisionNo: !value ? 'Revision No is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.revisionNo ? 'error form-control' : 'form-control'}
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
                                          value={row.uom}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, uom: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                uom: !value ? 'uom is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.uom ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.uom && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].uom}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.ordQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, ordQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                ordQty: !value ? 'ordQty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.ordQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.ordQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].ordQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.freeQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, freeQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                freeQty: !value ? 'Free Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.freeQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.freeQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].freeQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.availableStockQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, availableStockQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                availableStockQty: !value ? 'Available Stock Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.availableStockQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.availableStockQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].availableStockQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.requiredQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, requiredQty: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                requiredQty: !value ? 'Required Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.requiredQty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.requiredQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].requiredQty}
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
                                    <th className="table-header">Template</th>
                                    <th className="table-header">Description</th>
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
                                          value={row.accountsName}
                                          className={detailsTableErrors[index]?.accountsName ? 'error form-control' : 'form-control'}
                                          onChange={(e) =>
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, accountsName: e.target.value } : r))
                                            )
                                          }
                                        >
                                          <option value="">-- Select --</option>
                                          <option value="Payment Terms">Payment Terms</option>
                                          <option value="Delivery Terms">Delivery Terms</option>
                                        </select>
                                        {detailsTableErrors[index]?.accountsName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].accountsName}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.narration}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, narration: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                narration: !value ? 'Narration is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.narration ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.narration && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].narration}
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
                  {value === 2 && (
                    <>
                      <div className="row d-flex mt-2">
                        <div className="col-md-8">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="Narration"
                              label="Customer Special Requirement"
                              size="small"
                              name="remarks"
                              value={formData.remarks}
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
export default WorkOrder;
