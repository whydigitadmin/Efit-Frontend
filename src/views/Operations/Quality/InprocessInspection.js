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

function InprocessInspection() {
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
  const [docId, setDocId] = useState('');
  const [partyList, setPartyList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    inprocessInspectionNo: '',
    routeCardNo: '',
    workOrderNo: '',
    partNo: '',
    partName: '',
    materialDrawingNo: '',
    customer: '',
    inspectionDate: dayjs(),
    lotQty: '',
    drawingNo: '',
    receivedQty: '',
    sampleQty: '',
    documentFormatNo: '',
    orgId: orgId,
  });


  const [fieldErrors, setFieldErrors] = useState({
    inprocessInspectionNo: '',
    routeCardNo: '',
    workOrderNo: '',
    partNo: '',
    partName: '',
    materialDrawingNo: '',
    customer: '',
    inspectionDate: new Date(),
    lotQty: '',
    drawingNo: '',
    receivedQty: '',
    sampleQty: '',
    documentFormatNo: '',
    orgId: orgId,
  });

  const listViewColumns = [
    { accessorKey: 'inprocessInspectionNo', header: 'Inprocess Inspection No *', size: 140 },
    { accessorKey: 'routeCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'workOrderNo', header: 'Work Order No', size: 140 },
    { accessorKey: 'partNo', header: 'Part No', size: 140 },
    { accessorKey: 'partName', header: 'Part Name', size: 140 },
    { accessorKey: 'materialDrawingNo', header: 'Material / Drawing No', size: 140 },
    { accessorKey: 'customer', header: 'Customer', size: 140 },
    { accessorKey: 'inspectionDate', header: 'inspectionDate', size: 140 },
    { accessorKey: 'lotQty', header: 'Lot Qty', size: 140 },
    { accessorKey: 'drawingNo', header: 'Drawing No', size: 140 },
    { accessorKey: 'receivedQty', header: 'Received Qty', size: 140 },
    { accessorKey: 'sampleQty', header: 'Sample Qty', size: 140 },
    { accessorKey: 'documentFormatNo', header: 'Document Format No', size: 140 },
  ];

  const [quotationDetails, setQuotationDetails] = useState([
    {
      id: 1,
      characteristics: '',
      methodofInspection: '',
      specification: '',
      lSL: '',
      uSL: '',
      sample1: '',
      discount: '',
      discountPrice: '',
      quoteAmount: ''
    }
  ]);
  const [quotationDetailsTableErrors, setQuotationDetailsTableErrors] = useState([
    {
      id: 1,
      characteristics: '',
      methodofInspection: '',
      specification: '',
      lSL: '',
      uSL: '',
      sample1: '',
      remarks: '',
      discountPrice: '',
      quoteAmount: ''
    }
  ]);
  const [attachmentData, setAttachmentData] = useState([
    {
      id: 1,
      characterstics: '',
      methodofinspection: '',
      specification: '',
      observation: '',
      remarks1: ''

    }
  ]);
  const [attachmentTableErrors, setAttachmentTableErrors] = useState([
    {
      characterstics: '',
      methodofinspection: '',
      specification: '',
      observation: '',
      remarks1: ''



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

  const handleFileChange = (event) => {
    attachmentData.attachments(event.target.files[0]);
  };

  const handleSaveSelectedRows = async () => { }
  const handleSelectAll = () => { }
  const getMachineMasterById = () => { }
  useEffect(() => {

    // getAdjustmentJournalDocId();
    // getAllAdjustmentJournalByOrgId();
    // getAllAccountName();
  }, []);

  const handleClear = () => {
    setFormData({
      routeCardNo: '',
      workOrderNo: '',
      partNo: '',
      partName: '',
      materialDrawingNo: '',
      customer: '',
      inspectionDate: dayjs(),
      lotQty: '',
      drawingNo: '',
      receivedQty: '',
      sampleQty: '',
      documentFormatNo: ''
    });
    setFieldErrors({
      inprocessInspectionNo: '',
      routeCardNo: '',
      workOrderNo: '',
      partNo: '',
      partName: '',
      materialDrawingNo: '',
      customer: '',
      inspectionDate: null,
      lotQty: '',
      exRate: '',
      drawingNo: '',
      receivedQty: '',
      sampleQty: '',
      routeCardNo: '',
      documentFormatNo: ''
    });
    setQuotationDetails([
      {
        id: 1,
        characteristics: '',
        methodofInspection: '',
        specification: '',
        lSL: '',
        uSL: '',
        sample1: '',
        remarks: '',
        discountPrice: '',
        quoteAmount: ''
      }
    ]);
    setQuotationDetailsTableErrors('');
    setAttachmentData([
      {
        id: 1,
        characterstics: '',
        methodofinspection: '',
        specification: '',
        observation: '',


      }
    ]);
    setAttachmentTableErrors('');
    setEditId('');
    getAdjustmentJournalDocId();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let inputValue = type === 'checkbox' ? checked : value;

    const numberFields = ['billExRate', 'billNo', 'creditAmt', 'lotQty', 'receivedQty', 'sampleQty', 'debitAmt', 'yearEndExRate'];

    if (numberFields.includes(name)) {
      const numericRegex = /^[0-9]*$/;

      if (!numericRegex.test(inputValue)) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: 'Only numbers are allowed',
        }));
        return;
      }
    }

    // Update form data and clear error
    setFormData((prev) => ({ ...prev, [name]: inputValue }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRowQuotation = () => {
    if (isLastRowEmptyQuotation(quotationDetails)) {
      displayRowErrorQuotation(quotationDetails);
      return;
    }
    const newRow = {
      id: Date.now(),
      characteristics: '',
      methodofInspection: '',
      specification: '',
      lSL: '',
      uSL: '',
      sample1: '',
      remarks: '',
      discountPrice: '',
      quoteAmount: ''
    };
    setQuotationDetails([...quotationDetails, newRow]);
    setQuotationDetailsTableErrors([
      ...quotationDetailsTableErrors,
      {
        characteristics: '',
        methodofInspection: '',
        specification: '',
        lSL: '',
        uSL: '',
        sample1: '',
        remarks: '',
        discountPrice: '',
        quoteAmount: ''
      }
    ]);
  };

  const isLastRowEmptyQuotation = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === quotationDetails) {
      return (
        !lastRow.characteristics ||
        !lastRow.methodofInspection ||
        !lastRow.specification ||
        !lastRow.lSL ||
        !lastRow.uSL ||
        !lastRow.sample1 ||
        !lastRow.remarks
      );
    }
    return false;
  };

  const displayRowErrorQuotation = (table) => {
    if (table === quotationDetails) {
      setQuotationDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          characteristics: !table[table.length - 1].characteristics ? 'characteristics is required' : '',
          methodofInspection: !table[table.length - 1].methodofInspection ? 'Method of Inspection is required' : '', capacity: !table[table.length - 1].capacity ? 'capacity is required' : '',
          specification: !table[table.length - 1].specification ? 'Specification is required' : '',
          uSL: !table[table.length - 1].uSL ? 'USL is required' : '',
          lSL: !table[table.length - 1].lSL ? 'LSL is required' : '',
          sample1: !table[table.length - 1].sample1 ? 'Sample 1 is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleAddRowAttachment = () => {
    if (isLastRowEmptyAttachment(attachmentData)) {
      displayRowErrorAttachment(attachmentData);
      return;
    }
    const newRow = {
      id: Date.now(),
      characterstics: '',
      methodofinspection: '',
      specification: '',
      observation: '',
      remarks1: ''



    };
    setAttachmentData([...attachmentData, newRow]);
    setAttachmentTableErrors([
      ...attachmentTableErrors,
      {
        characterstics: '',
        methodofinspection: '',
        specification: '',
        observation: '',
        remarks1: ''



      }
    ]);
  };

  const isLastRowEmptyAttachment = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === attachmentData) {
      return (
        !lastRow.characterstics ||
        !lastRow.methodofinspection ||
        !lastRow.specification ||
        !lastRow.observation ||
        !lastRow.remarks1


      );
    }
    return false;
  };

  const displayRowErrorAttachment = (table) => {
    if (table === attachmentData) {
      setAttachmentTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          characterstics: !table[table.length - 1].characterstics ? 'Characterstics is required' : '',
          methodofinspection: !table[table.length - 1].methodofinspection ? 'Method of Inspection is required' : '',
          specification: !table[table.length - 1].specification ? 'Specification is required' : '',
          observation: !table[table.length - 1].observation ? 'Observation is required' : '',
          remarks1: !table[table.length - 1].remarks1 ? 'Remarks1 is required' : '',



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
      errors.routeCardNo = ' Route Card No is  required';
    }
    if (!formData.materialDrawingNo) {
      errors.materialDrawingNo = 'Material / Drawing No is  required';
    }
    if (!formData.lotQty) {
      errors.lotQty = 'Lot Qty is  required';
    }
    if (!formData.drawingNo) {
      errors.drawingNo = 'Drawing No is  required';
    }
    if (!formData.receivedQty) {
      errors.receivedQty = ' Received Qty is  required';
    }
    if (!formData.sampleQty) {
      errors.sampleQty = ' Sample Qty is  required';
    }

    if (!formData.contactName) {
      errors.contactName = ' Contact Name is  required';
    }

    if (!formData.documentFormatNo) {
      errors.documentFormatNo = 'Document Format No is  required';
    }


    let quotationTableDataValid = true;
    const newQuotationTableErrors = quotationDetails.map((row) => {
      const rowErrors = {};
      if (!row.characteristics) {
        rowErrors.characteristics = 'Characteristics is required';
        quotationTableDataValid = false;
      }
      if (!row.methodofInspection) {
        rowErrors.methodofInspection = 'Method of Inspection is required';
        quotationTableDataValid = false;
      }
      if (!row.specification) {
        rowErrors.specification = 'Specification is required';
        quotationTableDataValid = false;
      }
      if (!row.lSL) {
        rowErrors.lSL = 'LSL is required';
        quotationTableDataValid = false;
      }
      if (!row.uSL) {
        rowErrors.uSL = 'USL  is required';
        quotationTableDataValid = false;
      }
      if (!row.sample1) {
        rowErrors.sample1 = 'Sample 1 is required';
        quotationTableDataValid = false;
      }
      if (!row.remarks) {
        rowErrors.remarks = 'Remarks is required';
        quotationTableDataValid = false;
      }
      return rowErrors;
    });
    let detailTableDataValid2 = true;
    const newAttachmentTableErrors = quotationDetails.map((row) => {
      const rowErrors = {};
      if (!row.characterstics) {
        rowErrors.characterstics = 'Characterstics is required';
        detailTableDataValid2 = false;
      }
      if (!row.methodofinspection) {
        rowErrors.methodofinspection = 'Method of Inspection is required';
        detailTableDataValid2 = false;
      }
      if (!row.specification) {
        rowErrors.specification = 'Specification is required';
        detailTableDataValid2 = false;
      }
      if (!row.observation) {
        rowErrors.observation = 'Observation is required';
        detailTableDataValid2 = false;
      }
      if (!row.remarks1) {
        rowErrors.remarks1 = 'Remarks1 is required';
        detailTableDataValid2 = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);
    setQuotationDetailsTableErrors(newQuotationTableErrors);
    setAttachmentTableErrors(newAttachmentTableErrors);

    if (Object.keys(errors).length === 0 && (detailTableDataValid2 && quotationTableDataValid)) {
      const AdjustmentVO = quotationDetails.map((row) => ({
        ...(editId && { id: row.id }),
        accountsName: row.accountName,
        creditAmount: parseInt(row.creditAmount),
        debitAmount: parseInt(row.debitAmount),
        debitBase: parseInt(row.debitBase),
        creditBase: parseInt(row.creditBase),
        subLedgerCode: row.subLedgerCode,
        subledgerName: row.subledgerName
      }));
      const AdjustmentJournalVO = attachmentData.map((row) => ({
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
          showToast('success', editId ? 'In Process Inspection Updated Successfully' : 'In Process Inspection Created successfully');
          getAllAdjustmentJournalByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'In Process Inspection creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'In Process Inspection creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };
  const getAdjustmentJournalDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getAdjustmentJournalDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setDocId(response.paramObjectsMap.adjustmentJournalDocId);
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
        setDocId(adVO.docId);
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
        setQuotationDetails(
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
                {/* Inprocess Inspection No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Inprocess Inspection No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="inprocessInspectionNo"
                    value={formData.inprocessInspectionNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                {/* Route Card No */}
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
                        error={!!fieldErrors.routeCardNo}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.routeCardNo} // Displays the error message
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                {/* Work Order No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Work Order No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="workOrderNo"
                    value={formData.workOrderNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.workOrderNo}
                    helperText={fieldErrors.workOrderNo}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* Part No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Part No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="partNo"
                    value={formData.partNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.partNo}
                    helperText={fieldErrors.partNo}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* Part Name */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Part Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="partName"
                    value={formData.partName}
                    onChange={handleInputChange}
                    error={!!fieldErrors.partName}
                    helperText={fieldErrors.partName}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* Material / Drawing No */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.materialDrawingNo ? partyList.find((c) => c.partyname === formData.materialDrawingNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'materialDrawingNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Material / Drawing No"
                        name="materialDrawingNo"
                        error={!!fieldErrors.materialDrawingNo}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.materialDrawingNo} // Displays the error message
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                {/* Customer */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Customer"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    error={!!fieldErrors.customer}
                    helperText={fieldErrors.customer}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* Inspection Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Inspection Date"
                        value={formData.inspectionDate}
                        onChange={(date) => handleDateChange('inspectionDate', date)}
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                {/* Lot Qty */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="lotQty"
                    label="Lot Qty"
                    name="lotQty"
                    variant="outlined"
                    size="small"
                    value={formData.lotQty}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    inputProps={{
                      inputMode: "numeric", // Helps restrict to numbers in mobile browsers
                      pattern: "[0-9]*" // HTML validation for numeric input
                    }}
                    error={!!fieldErrors.lotQty}
                    helperText={fieldErrors.lotQty || ''}
                  />
                </div>
                {/* Drawing No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Drawing No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="drawingNo"
                    value={formData.drawingNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.drawingNo}
                    helperText={fieldErrors.drawingNo}
                  // inputRef={processDescriptionRef}
                  />
                </div>
                {/* Received Qty */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="receivedQty"
                    label="Received Qty"
                    name="receivedQty"
                    variant="outlined"
                    size="small"
                    value={formData.receivedQty}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    inputProps={{
                      inputMode: "numeric", // Helps restrict to numbers in mobile browsers
                      pattern: "[0-9]*" // HTML validation for numeric input
                    }}
                    error={!!fieldErrors.receivedQty}
                    helperText={fieldErrors.receivedQty || ''}
                  />
                </div>
                {/* Sample Qty */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="sampleQty"
                    label="Sample Qty"
                    name="sampleQty"
                    variant="outlined"
                    size="small"
                    value={formData.sampleQty}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    inputProps={{
                      inputMode: "numeric", // Helps restrict to numbers in mobile browsers
                      pattern: "[0-9]*" // HTML validation for numeric input
                    }}
                    error={!!fieldErrors.sampleQty}
                    helperText={fieldErrors.sampleQty || ''}
                  />
                </div>
                {/* Document Format No */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.documentFormatNo ? partyList.find((c) => c.partyname === formData.documentFormatNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'documentFormatNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Document Format No"
                        name="documentFormatNo"
                        error={!!fieldErrors.documentFormatNo}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.documentFormatNo} // Displays the error message
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
                    <Tab value={0} label="Inspection Details" />
                    <Tab value={1} label="Appearance Inspection" />
                    <Tab value={2} label="Summary" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowQuotation} />
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
                                      <th className="table-header px-2 py-2 text-white text-center" style={{ width: '10px' }}>Action</th>
                                      <th className="table-header px-2 py-2 text-white text-center" style={{ width: '50px' }}>S.No</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Characteristics</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Method of Inspection</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Specification</th>
                                      <th className="table-header px-2 py-2 text-white text-center">LSL</th>
                                      <th className="table-header px-2 py-2 text-white text-center">USL</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Sample 1</th>
                                      <th className="table-header px-2 py-2 text-white text-center">2</th>
                                      <th className="table-header px-2 py-2 text-white text-center">3</th>
                                      <th className="table-header px-2 py-2 text-white text-center">4</th>
                                      <th className="table-header px-2 py-2 text-white text-center">5</th>
                                      <th className="table-header px-2 py-2 text-white text-center">6</th>
                                      <th className="table-header px-2 py-2 text-white text-center">7</th>
                                      <th className="table-header px-2 py-2 text-white text-center">8</th>
                                      <th className="table-header px-2 py-2 text-white text-center">remarks</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {quotationDetails.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="col-md-1 border px-2 py-2 text-center">
                                          <ActionButton
                                            className=" mb-2"
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                quotationDetails,
                                                setQuotationDetails,
                                                quotationDetailsTableErrors,
                                                setQuotationDetailsTableErrors
                                              )
                                            }
                                          />
                                        </td>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.characteristics}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, characteristics: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  characteristics: !value ? 'Characteristics is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.characteristics ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.characteristics && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].characteristics}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.methodofInspection}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, methodofInspection: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  methodofInspection: !value ? 'Method of Inspection is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.methodofInspection ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.methodofInspection && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].methodofInspection}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.specification}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, specification: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  specification: !value ? 'specification is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.specification ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.specification && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].specification}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.lSL}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, lSL: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  lSL: !value ? 'LSL is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.lSL ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.lSL && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].lSL}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.uSL}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, uSL: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  uSL: !value ? 'USL is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.uSL ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.uSL && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].uSL}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.sample1}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sample1: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sample1: !value ? 'Sample 1 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.sample1 ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.sample1 && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].sample1}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.sample2}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sample2: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sample1: !value ? 'Sample 2 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.sample2 ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.sample2 && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].sample2}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.sample2}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sample2: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sample1: !value ? 'Sample 2 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.sample2 ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.sample2 && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].sample2}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.sample2}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sample2: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sample1: !value ? 'Sample 2 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.sample2 ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.sample2 && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].sample2}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.sample2}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sample2: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sample1: !value ? 'Sample 2 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.sample2 ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.sample2 && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].sample2}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.sample2}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sample2: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sample1: !value ? 'Sample 2 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.sample2 ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.sample2 && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].sample2}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.sample2}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sample2: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sample1: !value ? 'Sample 2 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.sample2 ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.sample2 && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].sample2}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.sample2}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sample2: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sample1: !value ? 'Sample 2 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.sample2 ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.sample2 && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].sample2}
                                            </div>
                                          )}
                                        </td>

                                        {/* Remarks */}
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.remarks}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  remarks: !value ? 'Remarks is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.remarks && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].remarks}
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
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowAttachment} />
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                      Characterstics
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '100px' }}>
                                      Method of inspection
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '100px' }}>
                                      Specification
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '100px' }}>
                                      Observation
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '100px' }}>
                                      Remarks1
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {attachmentData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              attachmentData,
                                              setAttachmentData,
                                              attachmentTableErrors,
                                              setAttachmentTableErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.characterstics}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setAttachmentData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, characterstics: value } : r))
                                            );
                                            setAttachmentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                characterstics: !value ? 'Characterstics is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={attachmentTableErrors[index]?.characterstics ? 'error form-control' : 'form-control'}
                                        />
                                        {attachmentTableErrors[index]?.characterstics && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {attachmentTableErrors[index].characterstics}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2" onClick={handleBulkUploadOpen}>
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.methodofinspection}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setAttachmentData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, methodofinspection: value } : r))
                                            );
                                            setAttachmentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                methodofinspection: !value ? 'Method of inspection is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={attachmentTableErrors[index]?.methodofinspection ? 'error form-control' : 'form-control'}
                                        />
                                        {attachmentTableErrors[index]?.methodofinspection && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {attachmentTableErrors[index].methodofinspection}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2" onClick={handleBulkUploadOpen}>
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.specification}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setAttachmentData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, specification: value } : r))
                                            );
                                            setAttachmentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                specification: !value ? 'Specification is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={attachmentTableErrors[index]?.specification ? 'error form-control' : 'form-control'}
                                        />
                                        {attachmentTableErrors[index]?.specification && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {attachmentTableErrors[index].specification}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2" onClick={handleBulkUploadOpen}>
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.observation}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setAttachmentData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, observation: value } : r))
                                            );
                                            setAttachmentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                observation: !value ? 'Observation is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={attachmentTableErrors[index]?.observation ? 'error form-control' : 'form-control'}
                                        />
                                        {attachmentTableErrors[index]?.observation && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {attachmentTableErrors[index].observation}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2" onClick={handleBulkUploadOpen}>
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.remarks1}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setAttachmentData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, remarks1: value } : r))
                                            );
                                            setAttachmentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                remarks1: !value ? 'Remarks1 is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={attachmentTableErrors[index]?.remarks1 ? 'error form-control' : 'form-control'}
                                        />
                                        {attachmentTableErrors[index]?.remarks1 && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {attachmentTableErrors[index].remarks1}
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
                      <div className="row d-flex ml">
                        <div className="row mt-2">
                          <>
                            <div className="row">
                              {/* Checked by */}
                              <div className="col-md-3 mb-3">
                                <Autocomplete
                                  disablePortal
                                  options={partyList.map((option, index) => ({ ...option, key: index }))}
                                  getOptionLabel={(option) => option.partyname || ''}
                                  sx={{ width: '100%' }}
                                  size="small"
                                  value={formData.checkedby ? partyList.find((c) => c.partyname === formData.checkedby) : null}
                                  onChange={(event, newValue) => {
                                    handleInputChange({
                                      target: {
                                        name: 'checkedby',
                                        value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                      },
                                    });
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Checked by"
                                      name="checkedby"
                                      error={!!fieldErrors.checkedby}  // Shows error if supplierName has a value in fieldErrors
                                      helperText={fieldErrors.checkedby} // Displays the error message
                                      InputProps={{
                                        ...params.InputProps,
                                        style: { height: 40 },
                                      }}
                                    />
                                  )}
                                />
                              </div>
                              {/* Approved by */}
                              <div className="col-md-3 mb-3">
                                <Autocomplete
                                  disablePortal
                                  options={partyList.map((option, index) => ({ ...option, key: index }))}
                                  getOptionLabel={(option) => option.partyname || ''}
                                  sx={{ width: '100%' }}
                                  size="small"
                                  value={formData.approvedby ? partyList.find((c) => c.partyname === formData.approvedby) : null}
                                  onChange={(event, newValue) => {
                                    handleInputChange({
                                      target: {
                                        name: 'approvedby',
                                        value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                      },
                                    });
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Approved by"
                                      name="approvedby"
                                      error={!!fieldErrors.approvedby}  // Shows error if supplierName has a value in fieldErrors
                                      helperText={fieldErrors.approvedby} // Displays the error message
                                      InputProps={{
                                        ...params.InputProps,
                                        style: { height: 40 },
                                      }}
                                    />
                                  )}
                                />
                              </div>

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
                          <Checkbox checked={selectAll} onChange={handleSelectAll} sx={{
                            color: 'white', // Unchecked color
                            '&.Mui-checked': {
                              color: 'white' // Checked color
                            }
                          }} />
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
                      {quotationDetails.map((row, index) => (
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

  )
};

export default InprocessInspection;
