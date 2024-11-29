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

function ReceiveSubContractor () {
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
  const [allPartName, setAllPartName] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    docDate: dayjs(),
    routeCardNo:'',
    issueNo:'',
    issueDate:'',
    jobWorkOutOrderNo:'',
    dcNo:'',
    department:'',
    contractorId:'',
    contractName:'',
    invoiceNo:'',
    testCertificate:'',
    // 2nd table
    narration:''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: dayjs(),
    routeCardNo:'',
    issueNo:'',
    issueDate:'',
    jobWorkOutOrderNo:'',
    dcNo:'',
    department:'',
    contractorId:'',
    contractName:'',
    invoiceNo:'',
    testCertificate:'',
    // 2nd table
    narration:''
  });

  const listViewColumns = [
    { accessorKey: 'routeCardNo', header: 'Route Card Number', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 },
    { accessorKey: 'docNo', header: 'Document No', size: 140 }
  ];

  const [rscGRNDetailsTable, setrscGRNDetailsTable] = useState([
    {
      id: 1,
      partName:'',
      partDesc:'',
      remarks:'',
      receivedQuantity:'',
      issueQuantity:'',
      pendingQuantity:''
    }
  ]);
  const [rscGRNDetailsTableErrors, setRSCGRNDetailsTableErrors] = useState([
    {
      id: 1,
      partName:'',
      partDesc:'',
      remarks:'',
      receivedQuantity:'',
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
    
    // getAdjustmentJournaldocNO();
    // getAllAdjustmentJournalByOrgId();
    // getAllAccountName();
  }, []);

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
    routeCardNo:'',
    issueNo:'',
    issueDate:'',
    jobWorkOutOrderNo:'',
    dcNo:'',
    department:'',
    contractorId:'',
    contractName:'',
    invoiceNo:'',
    testCertificate:'',
    // 2nd table
    narration:''
    });
    setFieldErrors({
      docDate: dayjs(),
    routeCardNo:'',
    issueNo:'',
    issueDate:'',
    jobWorkOutOrderNo:'',
    dcNo:'',
    department:'',
    contractorId:'',
    contractName:'',
    invoiceNo:'',
    testCertificate:'',
    // 2nd table
    narration:''
    });
    setrscGRNDetailsTable([
      { id: 1,
        partName:'',
        partDesc:'',
        remarks:'',
        receivedQuantity:'',
        issueQuantity:'',
        pendingQuantity:''
      }
    ]);
    setRSCGRNDetailsTableErrors('');
    setEditId('');
    getAdjustmentJournaldocNO();
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
    if (isLastRowEmptyItem(rscGRNDetailsTable)) {
      displayRowErrorItem(rscGRNDetailsTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      partName:'',
        partDesc:'',
        remarks:'',
        receivedQuantity:'',
        issueQuantity:'',
        pendingQuantity:''
    };
    setrscGRNDetailsTable([...rscGRNDetailsTable, newRow]);
    setRSCGRNDetailsTableErrors([
      ...rscGRNDetailsTableErrors,
      { 
        partName:'',
        partDesc:'',
        unit:'',
        holdQuantity:'',
        remarks:'',
        receivedQuantity:'',
        issueQuantity:'',
        pendingQuantity:''
    }
    ]);
  };

  const isLastRowEmptyItem = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === rscGRNDetailsTable) {
      return (
        !lastRow.partName ||
        !lastRow.partDesc ||
        !lastRow.remarks ||
        !lastRow.receivedQuantity ||
        !lastRow.issueQuantity ||
        !lastRow.pendingQuantity
      );
    }
    return false;
  };

  const displayRowErrorItem = (table) => {
    if (table === rscGRNDetailsTable) {
      setRSCGRNDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partName: !table[table.length - 1].partName ? 'Part Name is required' : '',
          partDesc: !table[table.length - 1].partDesc ? 'Part Desc is required' : '', 
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : '',
          receivedQuantity: !table[table.length - 1].receivedQuantity ? 'Received Qty is required' : '',
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
    if (!formData.narration) {
      errors.narration = 'Narration is required';
    }
    if (!formData.issueNo) {
      errors.issueNo = 'Issue No is required';
    }
    if (!formData.issueDate) {
      errors.issueDate = 'Issue Date is required';
    }
    if (!formData.jobWorkOutOrderNo ) {
      errors.jobWorkOutOrderNo = 'Job Work Out Order No is required';
    }
    if (!formData.dcNo) {
      errors.dcNo = 'DC No is required';
    }
    if (!formData.department) {
      errors.department = 'Department is required';
    }
    if (!formData.contractorId) {
      errors.contractorId = 'Contractor Id is required';
    }
    if (!formData.contractName) {
      errors.contractName = 'Contract Name is required';
    }
    if (!formData.invoiceNo) {
      errors.invoiceNo = 'Invoice No is required';
    }
    if (!formData.testCertificate) {
      errors.testCertificate = 'Test Certificate is required';
    }

    let rscGRNDetails = true;
    const newrscGRNDetailsTableErrors = rscGRNDetailsTable.map((row) => {
      const rowErrors = {};
      if (!row.partName) {
        rowErrors.partName = 'Part Name  is required';
        rscGRNDetails = false;
      }
      if (!row.partDesc) {
        rowErrors.partDesc = 'part Desc is required';
        rscGRNDetails = false;
      }
      if (!row.remarks) {
        rowErrors.remarks = 'Remarks is required';
        rscGRNDetails = false;
      }
      if (!row.receivedQuantity) {
        rowErrors.receivedQuantity = 'Received Quantity is required';
        rscGRNDetails = false;
      }
      if (!row.issueQuantity) {
        rowErrors.issueQuantity = 'Issue Quantity is required';
        rscGRNDetails = false;
      }
      if (!row.pendingQuantity) {
        rowErrors.pendingQuantity = 'Pending Quantity is required';
        rscGRNDetails = false;
      }
      
      return rowErrors;
    });
    setFieldErrors(errors);
    setRSCGRNDetailsTableErrors(newrscGRNDetailsTableErrors);

    if (Object.keys(errors).length === 0 && (rscGRNDetails) ) {
          const AdjustmentVO = rscGRNDetailsTable.map((row) => ({
            ...(editId && { id: row.id }),
            accountsName: row.accountName,
            creditAmount: parseInt(row.creditAmount),
            debitAmount: parseInt(row.debitAmount),
            debitBase: parseInt(row.debitBase),
            creditBase: parseInt(row.creditBase),
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
      }));
      
      const saveFormData = {
        ...(editId && { id: editId }),
        // branch: branch,
        //       branchCode: branchCode,
        //       createdBy: loginUserName,
        //       finYear: finYear,
        //       orgId: orgId,
        //       accountParticularsDTO: AdjustmentJournalVO,
        //       adjustmentType: formData.adjustmentType,
        //       currency: formData.currency,
        //       exRate: parseInt(formData.exRate),
        //       refDate: dayjs(formData.refDate).format('YYYY-MM-DD'),
        //       refNo: formData.refNo,
        //       suppRefDate: dayjs(formData.suppRefDate).format('YYYY-MM-DD'),
        //       suppRefNo: formData.suppRefNo,
        //       remarks: formData.remarks
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
              const response = await apiCalls('put', `transaction/updateCreateAdjustmentJournal`, saveFormData);
              if (response.status === true) {
                console.log('Response:', response);
                showToast('success', editId ? 'Adjustment Journal Updated Successfully' : 'Adjustment Journal Created successfully');
                getAllAdjustmentJournalByOrgId();
                handleClear();
              } else {
                showToast('error', response.paramObjectsMap.message || 'Adjustment Journal creation failed');
              }
            } catch (error) {
              console.error('Error:', error);
              showToast('error', 'Adjustment Journal creation failed');
            }
    } else {
      setFieldErrors(errors);
    }
  };
  const getAllItem = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getOperationNameFromGroup?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllPartName(response.paramObjectsMap.generalJournalVO);
        console.log('Account Name', response.paramObjectsMap.generalJournalVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAdjustmentJournaldocNO = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getAdjustmentJournaldocNO?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setDocNo(response.paramObjectsMap.adjustmentJournaldocNO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllAdjustmentJournalByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllAdjustmentJournalByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.adjustmentJournalVO || []);
      // showForm(true);
      console.log('adjustmentJournalVO', result);
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
        setrscGRNDetailsTable(
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.issueNo}>
                    <InputLabel id="issueNo">
                      {
                        <span>
                          Issue No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="issueNo"
                      id="issueNo"
                      label="issueNo"
                      onChange={handleInputChange}
                      name="issueNo"
                      value={formData.issueNo}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.issueNo}>
                          {item.issueNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.issueNo && <FormHelperText style={{ color: 'red' }}>Issue No is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Issue Date"
                      value={formData.issueDate ? dayjs(formData.issueDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('issueDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.issueDate}
                      helperText={fieldErrors.issueDate ? fieldErrors.issueDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.jobWorkOutOrderNo}>
                    <InputLabel id="jobWorkOutOrderNo">
                      {
                        <span>
                          Job Work Out Order No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="jobWorkOutOrderNo"
                      id="jobWorkOutOrderNo"
                      label="jobWorkOutOrderNo"
                      onChange={handleInputChange}
                      name="jobWorkOutOrderNo"
                      value={formData.jobWorkOutOrderNo}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.jobWorkOutOrderNo}>
                          {item.jobWorkOutOrderNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.jobWorkOutOrderNo && <FormHelperText style={{ color: 'red' }}>Job Work Out Order No is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="dcNo"
                    label= 'DC No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="dcNo"
                    value={formData.dcNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.dcNo ? fieldErrors.dcNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.dcNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="department"
                    label= 'Department'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.department ? fieldErrors.department : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.department}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="contractorId"
                    label= 'Contractor Id'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="contractorId"
                    value={formData.contractorId}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.contractorId ? fieldErrors.contractorId : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.contractorId}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="contractName"
                    label= 'Contract Name'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="contractName"
                    value={formData.contractName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.contractName ? fieldErrors.contractName : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.contractName}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="invoiceNo"
                    label= 'Invoice No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.invoiceNo ? fieldErrors.invoiceNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.invoiceNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.testCertificate}>
                    <InputLabel id="testCertificate">
                      {
                        <span>
                          Test Certificate <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="testCertificate"
                      id="testCertificate"
                      label="testCertificate"
                      onChange={handleInputChange}
                      name="testCertificate"
                      value={formData.testCertificate}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.testCertificate}>
                          {item.testCertificate}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.testCertificate && <FormHelperText style={{ color: 'red' }}>Test Certificate is required</FormHelperText>}
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
                    <Tab value={0} label="RSC GRN Details" />
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
                                        <th className="table-header px-2 py-2 text-white text-center">Part Name</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Part Description</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Received Qty</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Issue Qty</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Pending Qty</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Remarks</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rscGRNDetailsTable.map((row, index) => (
                                        <tr key={row.id}>
                                          <td className="col-md-1 border px-2 py-2 text-center">
                                            <ActionButton
                                            className=" mb-2"
                                              title="Delete"
                                              icon={DeleteIcon}
                                              onClick={() =>
                                                handleDeleteRow(
                                                  row.id,
                                                  rscGRNDetailsTable,
                                                  setrscGRNDetailsTable,
                                                  rscGRNDetailsTableErrors,
                                                  setRSCGRNDetailsTableErrors
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
                                              options={allPartName}
                                              getOptionLabel={(option) => option.partName || ''}
                                              groupBy={(option) => (option.partName ? option.partName[0].toUpperCase() : '')}
                                              value={row.partName ? allPartName.find((a) => a.partName === row.partName) : null}
                                              onChange={(event, newValue) => {
                                                const value = newValue ? newValue.partName : '';
                                                setrscGRNDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, partName: value } : r))
                                                );
                                                setRSCGRNDetailsTableErrors((prevErrors) =>
                                                  prevErrors.map((err, idx) => (idx === index ? { ...err, partName: '' } : err))
                                                );
                                              }}
                                              size="small"
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  label="Part Name"
                                                  variant="outlined"
                                                  error={!!rscGRNDetailsTableErrors[index]?.partName}
                                                  helperText={rscGRNDetailsTableErrors[index]?.partName}
                                                />
                                              )}
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.partDesc}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setrscGRNDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, partDesc: value } : r))
                                                );
                                                setRSCGRNDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    partDesc: !value ? 'Part Desc is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={rscGRNDetailsTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                            />
                                            {rscGRNDetailsTableErrors[index]?.partDesc && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {rscGRNDetailsTableErrors[index].partDesc}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.receivedQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setrscGRNDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, receivedQuantity: value } : r))
                                                );
                                                setRSCGRNDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    receivedQuantity: !value ? 'Received Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={rscGRNDetailsTableErrors[index]?.receivedQuantity ? 'error form-control' : 'form-control'}
                                            />
                                            {rscGRNDetailsTableErrors[index]?.receivedQuantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {rscGRNDetailsTableErrors[index].receivedQuantity}
                                              </div>
                                            )}
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.issueQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setrscGRNDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, issueQuantity: value } : r))
                                                );
                                                setRSCGRNDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    issueQuantity: !value ? 'Issue Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={rscGRNDetailsTableErrors[index]?.issueQuantity ? 'error form-control' : 'form-control'}
                                            />
                                            {rscGRNDetailsTableErrors[index]?.issueQuantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {rscGRNDetailsTableErrors[index].issueQuantity}
                                              </div>
                                            )}
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.pendingQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setrscGRNDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, pendingQuantity: value } : r))
                                                );
                                                setRSCGRNDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    pendingQuantity: !value ? 'Pending Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={rscGRNDetailsTableErrors[index]?.pendingQuantity ? 'error form-control' : 'form-control'}
                                            />
                                            {rscGRNDetailsTableErrors[index]?.pendingQuantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {rscGRNDetailsTableErrors[index].pendingQuantity}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.remarks}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setrscGRNDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                                );
                                                setRSCGRNDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    remarks: !value ? 'Remarks is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={rscGRNDetailsTableErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                            />
                                            {rscGRNDetailsTableErrors[index]?.remarks && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {rscGRNDetailsTableErrors[index].remarks}
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
                                label="Narration"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="narration"
                                value={formData.narration}
                                onChange={handleInputChange}
                                error={!!fieldErrors.narration}
                                helperText={fieldErrors.narration}
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
                            {rscGRNDetailsTable.map((row, index) => (
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

export default ReceiveSubContractor;
