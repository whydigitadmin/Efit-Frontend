import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputLabel, Autocomplete, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import Draggable from 'react-draggable';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import Paper from '@mui/material/Paper';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import Checkbox from '@mui/material/Checkbox';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import sampleFile from '../../../assets/sample-files/sample_data_buyerorder.xls';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function ItemIssueToProduction () {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [allAccountName, setAllAccountName] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [docNo, setDocNo] = useState('');
  const [allItemName, setAllItemName] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    docDate: dayjs(),
    routeCardNo:'',
    workOrder:'',
    sfgItemId:'',
    sfgItemDescription:'',
    fgQuantity:'',
    fromLocation:'',
    // 2nd table
    remarks:'',
    preparedBy:''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: dayjs(),
    routeCardNo:'',
    workOrder:'',
    sfgItemId:'',
    sfgItemDescription:'',
    fgQuantity:'',
    fromLocation:'',
    // 2nd table
    remarks:'',
    preparedBy:''
  });

  const listViewColumns = [
    { accessorKey: 'routeCardNo', header: 'Route Card Number', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 },
    { accessorKey: 'docId', header: 'Document No', size: 140 }
  ];

  const [itemIssueToProduction, setItemIssueToProduction] = useState([
    {
      id: 1,
      item:'',
      itemDesc:'',
      unit:'',
      holdQuantity:'',
      availableQuantity:'',
      requiredQuantity:'',
      issueQuantity:'',
      pendingQuantity:''
    }
  ]);
  const [itemIssueToProductionTableErrors, setItemIssueToProductionTableErrors] = useState([
    {
      id: 1,
      item:'',
      itemDesc:'',
      unit:'',
      holdQuantity:'',
      availableQuantity:'',
      requiredQuantity:'',
      issueQuantity:'',
      pendingQuantity:''
    }
  ]);
 
  // const [file, setFile] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveSelectedRows = async () => {}
  const handleSelectAll = () => {}
  const getMachineMasterById = () => {}
  useEffect(() => {
    getItemIssueToProductiondocNo();
    getAllItemIssueToProductionByOrgId();
    // getAllAccountName();
  }, []);

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
    routeCardNo:'',
    workOrder:'',
    sfgItemId:'',
    sfgItemDescription:'',
    fgQuantity:'',
    fromLocation:'',
    // 2nd table
    remarks:'',
    preparedBy:''
    });
    setFieldErrors({
      docDate: dayjs(),
    routeCardNo:'',
    workOrder:'',
    sfgItemId:'',
    sfgItemDescription:'',
    fgQuantity:'',
    fromLocation:'',
    // 2nd table
    remarks:'',
    preparedBy:''
    });
    setItemIssueToProduction([
      { id: 1,
        item:'',
        itemDesc:'',
        unit:'',
        holdQuantity:'',
        availableQuantity:'',
        requiredQuantity:'',
        issueQuantity:'',
        pendingQuantity:''
      }
    ]);
    setItemIssueToProductionTableErrors('');
    setEditId('');
    getItemIssueToProductiondocNo();
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';

    
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    if (!errorMessage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === 'text' || type === 'textarea' ? value.toUpperCase() : value
      }));

      // Preserve cursor position for text inputs
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
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRowItem = () => {
    if (isLastRowEmptyItem(itemIssueToProduction)) {
      displayRowErrorItem(itemIssueToProduction);
      return;
    }
    const newRow = {
      id: Date.now(),
      item:'',
        itemDesc:'',
        unit:'',
        holdQuantity:'',
        availableQuantity:'',
        requiredQuantity:'',
        issueQuantity:'',
        pendingQuantity:''
    };
    setItemIssueToProduction([...itemIssueToProduction, newRow]);
    setItemIssueToProductionTableErrors([
      ...itemIssueToProductionTableErrors,
      { 
        item:'',
        itemDesc:'',
        unit:'',
        holdQuantity:'',
        availableQuantity:'',
        requiredQuantity:'',
        issueQuantity:'',
        pendingQuantity:''
    }
    ]);
  };

  const isLastRowEmptyItem = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === itemIssueToProduction) {
      return (
        !lastRow.item ||
        !lastRow.itemDesc ||
        !lastRow.unit ||
        !lastRow.holdQuantity ||
        !lastRow.availableQuantity ||
        !lastRow.requiredQuantity ||
        !lastRow.issueQuantity ||
        !lastRow.pendingQuantity
      );
    }
    return false;
  };

  const displayRowErrorItem = (table) => {
    if (table === itemIssueToProduction) {
      setItemIssueToProductionTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !table[table.length - 1].item ? 'Item Name is required' : '',
          itemDesc: !table[table.length - 1].itemDesc ? 'Item Desc is required' : '', 
          unit: !table[table.length - 1].unit ? 'Unit is required' : '',
          holdQuantity: !table[table.length - 1].holdQuantity ? 'Hold Qty is required' : '',
          availableQuantity: !table[table.length - 1].availableQuantity ? 'Available Qty is required' : '',
          requiredQuantity: !table[table.length - 1].requiredQuantity ? 'Required Qty is required' : '',
          issueQuantity: !table[table.length - 1].issueQuantity ? 'Issue Qty is required' : '',
          pendingQuantity: !table[table.length - 1].pendingQuantity ? 'Pending Qty is required' : ''
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

  const handleSave = async () => {
    const errors = {};
    if (!formData.routeCardNo) {
      errors.routeCardNo = 'Route Card No is required';
    }
    if (!formData.workOrder) {
      errors.workOrder = 'Work Order is required';
    }
    if (!formData.sfgItemId) {
      errors.sfgItemId = 'SFG Item Id is required';
    }
    if (!formData.sfgItemDescription ) {
      errors.sfgItemDescription = 'SFG Item Description  is required';
    }
    if (!formData.fgQuantity) {
      errors.fgQuantity = 'FG Quantity is required';
    }
    if (!formData.fromLocation) {
      errors.fromLocation = 'From Location is required';
    }
    if (!formData.remarks) {
      errors.remarks = 'Remarks is required';
    }
    if (!formData.preparedBy) {
      errors.preparedBy = 'Prepared By is required';
    }

    let productionDetailsTableDataValid = true;
    const newitemIssueToProductionTableErrors = itemIssueToProduction.map((row) => {
      const rowErrors = {};
      if (!row.item) {
        rowErrors.item = 'Item  is required';
        productionDetailsTableDataValid = false;
      }
      if (!row.itemDesc) {
        rowErrors.itemDesc = 'Item Desc is required';
        productionDetailsTableDataValid = false;
      }
      if (!row.unit) {
        rowErrors.unit = 'Unit is required';
        productionDetailsTableDataValid = false;
      }
      if (!row.holdQuantity) {
        rowErrors.holdQuantity = 'Hold Qty is required';
        productionDetailsTableDataValid = false;
      }
      if (!row.availableQuantity) {
        rowErrors.availableQuantity = 'Available Qty is required';
        productionDetailsTableDataValid = false;
      }
      if (!row.requiredQuantity) {
        rowErrors.requiredQuantity = 'Required Qty is required';
        productionDetailsTableDataValid = false;
      }
      if (!row.issueQuantity) {
        rowErrors.issueQuantity = 'Issue Qty is required';
        productionDetailsTableDataValid = false;
      }
      if (!row.pendingQuantity) {
        rowErrors.pendingQuantity = 'Pending Qty is required';
        productionDetailsTableDataValid = false;
      }
      
      return rowErrors;
    });
    setFieldErrors(errors);
    setItemIssueToProductionTableErrors(newitemIssueToProductionTableErrors);

    if (Object.keys(errors).length === 0 && (productionDetailsTableDataValid) ) {
          const ItemIssueToProductionVO = itemIssueToProduction.map((row) => ({
            ...(editId && { id: row.id }),
            unit: row.unit,
            avgQty: parseInt(row.availableQuantity),
            holdQty: parseInt(row.holdQuantity),
            issueQty: parseInt(row.issueQuantity),
            pendingQty: parseInt(row.pendingQuantity),
            reqQty: parseInt(row.requiredQuantity),
            item: row.item,
            itemDesc: row.itemDesc
      }));
      
      const saveFormData = {
        ...(editId && { id: editId }),
        branch: branch,
              branchCode: branchCode,
              createdBy: loginUserName,
              finYear: finYear,
              orgId: orgId,
              itemIssueToProductionDetailsDTO: ItemIssueToProductionVO,
              fgItemDesc: formData.fgItemDesc,
              fgItemId: formData.sfgItemId,
              fgQty: parseInt(formData.fgQty),
              fromLocation: formData.fromLocation,
              preparedBy: formData.preparedBy,
              remarks: formData.remarks,
              routeCardNo: formData.routeCardNo,
              workorder: formData.workOrder
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
              const response = await apiCalls('put', `/inventory/updateCreateItemIssToProd`, saveFormData);
              if (response.status === true) {
                console.log('Response:', response);
                showToast('success', editId ? 'Item Issue to Production Updated Successfully' : 'Item Issue to Production Created successfully');
                getAllItemIssueToProductionByOrgId();
                handleClear();
              } else {
                showToast('error', response.paramObjectsMap.message || 'Item Issue to Production creation failed');
              }
            } catch (error) {
              console.error('Error:', error);
              showToast('error', 'Item Issue to Production creation failed');
            }
            } else {
              setFieldErrors(errors);
            }
  }
  const getAllItem = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getOperationNameFromGroup?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllItemName(response.paramObjectsMap.generalJournalVO);
        console.log('Account Name', response.paramObjectsMap.generalJournalVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getItemIssueToProductiondocNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/inventory/getItemIssueToProductionDocId?orgId=${orgId}`
      );
      setDocNo(response.paramObjectsMap.ItemIssueToProductionDocId);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllItemIssueToProductionByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/inventory/getItemIssToProdByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.itemIssueToProductionVO || []);
      // showForm(true);
      console.log('ItemIssueToProductionVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllAdjustmentJournalById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getAdjustmentJournalById?id=${row.original.id}`);

      if (result) {
        const adVO = result.paramObjectsMap.adjustmentJournalVO[0];
        setEditId(row.original.id);
        setDocNo(adVO.docNO);
        setFormData({
          // docDate: adVO.docDate ? dayjs(adVO.docDate, 'YYYY-MM-DD') : dayjs(),
          // adjustmentType: adVO.adjustmentType,
          // currency: adVO.currency,
          // exRate: adVO.exRate,
          // refNo: adVO.refNo,
          // refDate: adVO.refDate ? dayjs(adVO.refDate, 'YYYY-MM-DD') : dayjs(),
          // suppRefNo: adVO.suppRefNo,
          // suppRefDate: adVO.suppRefDate ? dayjs(adVO.refDate, 'YYYY-MM-DD') : dayjs(),
          // remarks: adVO.remarks,
          // orgId: adVO.orgId,
          // totalDebitAmount: adVO.totalDebitAmount,
          // totalCreditAmount: adVO.totalCreditAmount
        });
        setItemIssueToProduction(
          adVO.accountParticularsVO.map((row) => ({
            id: row.id,
            accountName: row.accountsName,
            creditAmount: row.creditAmount,
            debitAmount: row.debitAmount,
            debitBase: row.debitBase,
            creditBase: row.creditBase,
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
          }))
        );

        console.log('DataToEdit', adVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBulkUploadOpen = () => {
    setUploadOpen(true); 
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false); 
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
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
                    id="docNo"
                    label="Document No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docNo"
                    value={docNo}
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.routeCardNo}>
                    <InputLabel id="routeCardNo">
                      {
                        <span>
                          Route Card No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="routeCardNo"
                      id="routeCardNo"
                      label="routeCardNo"
                      onChange={handleInputChange}
                      name="routeCardNo"
                      value={formData.routeCardNo}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.routeCardNo}>
                          {item.routeCardNo}
                        </MenuItem>
                      ))}
                      
                    </Select>
                    {fieldErrors.routeCardNo && <FormHelperText style={{ color: 'red' }}>Route Card No is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="workOrder"
                    label= 'Work Order'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="workOrder"
                    value={formData.workOrder}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.workOrder ? fieldErrors.workOrder : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.workOrder}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="sfgItemId"
                    label= 'FG / SFG Item Id'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="sfgItemId"
                    value={formData.sfgItemId}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.sfgItemId ? fieldErrors.sfgItemId : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.sfgItemId}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="sfgItemDescription"
                    label= 'FG / SFG Item Description'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="sfgItemDescription"
                    value={formData.sfgItemDescription}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.sfgItemDescription ? fieldErrors.sfgItemDescription : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.sfgItemDescription}
                  />
                </div><div className="col-md-3 mb-3">
                  <TextField
                    id="fgQuantity"
                    label= 'FG Qty'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="fgQuantity"
                    value={formData.fgQuantity}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.fgQuantity ? fieldErrors.fgQuantity : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.fgQuantity}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.fromLocation}>
                    <InputLabel id="fromLocation">
                      {
                        <span>
                          From Location <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="fromLocation"
                      id="fromLocation"
                      label="fromLocation"
                      onChange={handleInputChange}
                      name="fromLocation"
                      value={formData.fromLocation}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.fromLocation}>
                          {item.fromLocation}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.fromLocation && <FormHelperText style={{ color: 'red' }}>From Location is required</FormHelperText>}
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
                    <Tab value={0} label="Item Issue to Production Details" />
                    <Tab value={1} label="Summary" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowItem} />
                          <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
                        </div>
                        {uploadOpen && (
                          <CommonBulkUpload
                            open={uploadOpen}
                            handleClose={handleBulkUploadClose}
                            title="Upload Files"
                            uploadText="Upload file"
                            downloadText="Sample File"
                            onSubmit={handleSubmit}
                            sampleFileDownload={sampleFile}
                            handleFileUpload={handleFileUpload}
                            // apiUrl={`buyerOrder/ExcelUploadForBuyerOrder?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
                            screen="Machine Master"
                          ></CommonBulkUpload>
                        )}
                        {listView ? (
                          <div className="mt-4">
                            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getMachineMasterById} />
                          </div>
                          ) : (
                            <div className="row mt-2">
                              <div className="col-lg-12">
                                <div className="table-responsive">
                                  <table className="table table-bordered ">
                                    <thead>
                                      <tr style={{ backgroundColor: '#673AB7' }}>
                                      {/* <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th> */}
                                        <th className="table-header px-2 py-2 text-white text-center"style={{ width: '10px' }}>Action</th>
                                        <th className="table-header px-2 py-2 text-white text-center"style={{ width: '50px' }}>S.No</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Item</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Item Description</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Unit</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Hold Quantity</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Available Qty</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Required Qty</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Issue Qty</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Pending Qty</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {itemIssueToProduction.map((row, index) => (
                                        <tr key={row.id}>
                                          <td className="col-md-1 border px-2 py-2 text-center">
                                            <ActionButton
                                            className=" mb-2"
                                              title="Delete"
                                              icon={DeleteIcon}
                                              onClick={() =>
                                                handleDeleteRow(
                                                  row.id,
                                                  itemIssueToProduction,
                                                  setItemIssueToProduction,
                                                  itemIssueToProductionTableErrors,
                                                  setItemIssueToProductionTableErrors
                                                )
                                              }
                                            />
                                          </td>
                                          <td className="text-center">
                                            <div className="pt-2">{index + 1}</div>
                                          </td>
                                          <td className="border px-2 py-2">
                                            <Autocomplete
                                            style={{ width: '150px' }}
                                              options={allItemName}
                                              getOptionLabel={(option) => option.item || ''}
                                              groupBy={(option) => (option.item ? option.item[0].toUpperCase() : '')}
                                              value={row.item ? allItemName.find((a) => a.item === row.item) : null}
                                              onChange={(event, newValue) => {
                                                const value = newValue ? newValue.item : '';
                                                setItemIssueToProduction((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, item: value } : r))
                                                );
                                                setItemIssueToProductionTableErrors((prevErrors) =>
                                                  prevErrors.map((err, idx) => (idx === index ? { ...err, item: '' } : err))
                                                );
                                              }}
                                              size="small"
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  label="Item"
                                                  variant="outlined"
                                                  error={!!itemIssueToProductionTableErrors[index]?.item}
                                                  helperText={itemIssueToProductionTableErrors[index]?.item}
                                                />
                                              )}
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.itemDesc}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setItemIssueToProduction((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, itemDesc: value } : r))
                                                );
                                                setItemIssueToProductionTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    itemDesc: !value ? 'Item Desc is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={itemIssueToProductionTableErrors[index]?.itemDesc ? 'error form-control' : 'form-control'}
                                            />
                                            {itemIssueToProductionTableErrors[index]?.itemDesc && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {itemIssueToProductionTableErrors[index].itemDesc}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.unit}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setItemIssueToProduction((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r))
                                                );
                                                setItemIssueToProductionTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    unit: !value ? 'Unit is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={itemIssueToProductionTableErrors[index]?.unit ? 'error form-control' : 'form-control'}
                                            />
                                            {itemIssueToProductionTableErrors[index]?.unit && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {itemIssueToProductionTableErrors[index].unit}
                                              </div>
                                            )}
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.holdQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setItemIssueToProduction((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, holdQuantity: value } : r))
                                                );
                                                setItemIssueToProductionTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    holdQuantity: !value ? 'Hold Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={itemIssueToProductionTableErrors[index]?.holdQuantity ? 'error form-control' : 'form-control'}
                                            />
                                            {itemIssueToProductionTableErrors[index]?.holdQuantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {itemIssueToProductionTableErrors[index].holdQuantity}
                                              </div>
                                            )}
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.availableQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setItemIssueToProduction((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, availableQuantity: value } : r))
                                                );
                                                setItemIssueToProductionTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    availableQuantity: !value ? 'Available Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={itemIssueToProductionTableErrors[index]?.availableQuantity ? 'error form-control' : 'form-control'}
                                            />
                                            {itemIssueToProductionTableErrors[index]?.availableQuantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {itemIssueToProductionTableErrors[index].availableQuantity}
                                              </div>
                                            )}
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.requiredQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setItemIssueToProduction((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, requiredQuantity: value } : r))
                                                );
                                                setItemIssueToProductionTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    requiredQuantity: !value ? 'Required Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={itemIssueToProductionTableErrors[index]?.requiredQuantity ? 'error form-control' : 'form-control'}
                                            />
                                            {itemIssueToProductionTableErrors[index]?.requiredQuantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {itemIssueToProductionTableErrors[index].requiredQuantity}
                                              </div>
                                            )}
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.issueQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setItemIssueToProduction((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, issueQuantity: value } : r))
                                                );
                                                setItemIssueToProductionTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    issueQuantity: !value ? 'Issue Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={itemIssueToProductionTableErrors[index]?.issueQuantity ? 'error form-control' : 'form-control'}
                                            />
                                            {itemIssueToProductionTableErrors[index]?.issueQuantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {itemIssueToProductionTableErrors[index].issueQuantity}
                                              </div>
                                            )}
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.pendingQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setItemIssueToProduction((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, pendingQuantity: value } : r))
                                                );
                                                setItemIssueToProductionTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    pendingQuantity: !value ? 'Pending Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={itemIssueToProductionTableErrors[index]?.pendingQuantity ? 'error form-control' : 'form-control'}
                                            />
                                            {itemIssueToProductionTableErrors[index]?.pendingQuantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {itemIssueToProductionTableErrors[index].pendingQuantity}
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
                          )}
                      </div>
                    </>
                  )}
                  {value === 1 && (
                  <>
                  <div className="row d-flex ml">
                        <div className="row mt-2">
                        <>
                          <div className="row">
                          
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Remarks"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleInputChange}
                                error={!!fieldErrors.remarks}
                                helperText={fieldErrors.remarks}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Prepared BY"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="preparedBy"
                                value={formData.preparedBy}
                                onChange={handleInputChange}
                                error={!!fieldErrors.preparedBy}
                                helperText={fieldErrors.preparedBy}
                              />
                            </div>
                          </div>
                        </>
                        </div>
                      </div>
                  </>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllAdjustmentJournalById} />
          )}
        </div>
        <Dialog
                open={modalOpen}
                maxWidth={'md'}
                fullWidth={true}
                onClose={handleCloseModal}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
              >
                <DialogTitle textAlign="center" style={{ cursor: 'move' }} id="draggable-dialog-title">
                  <h6>Grid Details</h6>
                </DialogTitle>
                <DialogContent className="pb-0">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr style={{ backgroundColor: '#673AB7' }}>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                <Checkbox checked={selectAll} onChange={handleSelectAll}  sx={{
                                  color: 'white', // Unchecked color
                                  '&.Mui-checked': {
                                    color: 'white' // Checked color
                                  }}} />
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                S.No
                              </th>
                              <th className="px-2 py-2 text-white text-center">Part No *</th>
                              <th className="px-2 py-2 text-white text-center">Part Desc</th>
                              <th className="px-2 py-2 text-white text-center">SKU</th>
                              <th className="px-2 py-2 text-white text-center">Batch No</th>
                              {/* <th className="px-2 py-2 text-white text-center">Qty *</th> */}
                              <th className="px-2 py-2 text-white text-center">Avl. Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemIssueToProduction.map((row, index) => (
                              <tr key={index}>
                                <td className="border p-0 text-center">
                                  <Checkbox
                                    checked={selectedRows.includes(index)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));
                                      
                                    }}
                                  />
                                </td>
                                <td className="text-center p-0">
                                  <div style={{ paddingTop: 12 }}>{index + 1}</div>
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.partNo}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.partDesc}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.sku}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.batchNo}
                                </td>
                                {/* <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.qty}
                                </td> */}
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.availQty}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }} className="pt-0">
                  <Button onClick={handleCloseModal}>Cancel</Button>
                  <Button color="secondary" onClick={handleSaveSelectedRows} variant="contained">
                    Proceed
                  </Button>
                </DialogActions>
              </Dialog>
      </div>
    </>
  
)};

export default ItemIssueToProduction;
