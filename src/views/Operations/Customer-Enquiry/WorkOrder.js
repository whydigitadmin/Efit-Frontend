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

function WorkOrder() {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [customerNameData, setCustomerNameData] = useState([]);
  const [item, setItem] = useState([]);
  const [allAccountName, setAllAccountName] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [partyList, setPartyList] = useState([]);
  const [quotationList, setQuotationList] = useState([]);
  const [partNoList, setPartNoList] = useState([]); 
  const [docId, setDocId] = useState('');

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    woNo:'',
    docDate: dayjs(),
    customerName: '',
    customerPoNo: '',
    customerCode: '',
    customerId: '',
    quotationNo: '',
    currency: '',
    customerDueDate: dayjs(),
    vapDueDate: dayjs(),
    productionManager: '',
    // 2nd table
    customerSpecialRequirement: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    woNo:'',
    docDate: dayjs(),
    customerName: '',
    customerPoNo: '',
    customerCode: '',
    quotationNo: '',
    currency: '',
    customerDueDate: dayjs(),
    vapDueDate: dayjs(),
    productionManager: '',
    // 2nd table
    customerSpecialRequirement: ''
  });

  const listViewColumns = [
    { accessorKey: 'docId', header: 'Document ID', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'customerPoNo', header: 'Customer PO No', size: 140 },
    { quotationNo: 'quotationNo', header: 'Quotation No', size: 140 },
    { currency: 'currency', header: 'Currency', size: 140 },
    { currency: 'customerDueDate', header: 'Customer Due Date', size: 140 },
    { currency: 'vapDueDate', header: 'Vap Due Date', size: 140 },
    { currency: 'productionManager', header: 'Production Mgr', size: 140 },
  ];
  const [companyList, setCustomerList] = useState([]);
  const [fillGridData, setFillGridData] = useState([]);

  const [itemParticularsData, setItemParticularsData] = useState([
    {
      id: 1,
      partNo: '',
      partName: '',
      drawingNo: '',
      revisionNo: '',
      uom: '',
      ordQty: '',
      freeQty: '',
      availableStockQty: '',
      requiredQty: ''
    }
  ]);
  const [itemParticularsErrors, setItemParticularsErrors] = useState([
    {
      id: 1,
      partNo: '',
      partName: '',
      drawingNo: '',
      revisionNo: '',
      uom: '',
      ordQty: '',
      freeQty: '',
      availableStockQty: '',
      requiredQty: ''
    }
  ]);
  const [termsandConditionsData, setTermsandConditionsData] = useState([
    {
      id: 1,
      template: '',
      description: ''
    }
  ]);
  const [termsandConditionsErrors, setTermsandConditionsErrors] = useState([
    {
      id: 1,
      template: '',
      description: ''
    }
  ]);

  const getAvailablePartNos = (currentRowId) => {

    const selectedPartNos = termsandConditionsData
      .filter((row) => row.id !== currentRowId)
      .map((row) => row.partCode);

    return partNoList.filter((part) => !selectedPartNos.includes(part.partCode));
  };
  const handleSaveSelectedRows = async () => { }
  const handleSelectAll = () => { }
  const getMachineMasterById = () => { }





  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      customerName: '',
      customerPoNo: '',
      quotationNo: '',
      currency: '',
      productionManager: '',
      customerDueDate: dayjs(),
      vapDueDate: dayjs(),
      // 2nd table
      customerSpecialRequirement: ''
    });
    // getWorkOrderDocId();
    setFieldErrors({
      customerName: '',
      customerPoNo: '',
      quotationNo: '',
      currency: '',
      productionManager: '',
      customerDueDate: dayjs(),
      vapDueDate: dayjs(),
      // 2nd table
      customerSpecialRequirement: ''
    });
    setItemParticularsData([
      {
        id: 1,
        partNo: '',
        partName: '',
        drawingNo: '',
        revisionNo: '',
        uom: '',
        ordQty: '',
        freeQty: '',
        availableStockQty: '',
        requiredQty: ''
      }
    ]);
    setItemParticularsErrors('');
    setTermsandConditionsData([
      {
        id: 1,
        template: '',
        description: ''
      }
    ]);
    setTermsandConditionsErrors('');
    setEditId('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let errorMessage = '';

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      setFormData({ ...formData, [name]: value });
      setFieldErrors({ ...fieldErrors, [name]: '' });
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

  const handleAddRowQuotation = () => {
    if (isLastRowEmptyQuotation(itemParticularsData)) {
      displayRowErrorQuotation(itemParticularsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      partNo: '',
      partName: '',
      drawingNo: '',
      revisionNo: '',
      uom: '',
      ordQty: '',
      freeQty: '',
      availableStockQty: '',
      requiredQty: ''
    };
    setItemParticularsData([...itemParticularsData, newRow]);
    setItemParticularsErrors([
      ...itemParticularsErrors,
      {
        partNo: '',
        partName: '',
        drawingNo: '',
        revisionNo: '',
        uom: '',
        ordQty: '',
        freeQty: '',
        availableStockQty: '',
        requiredQty: ''
      }
    ]);
  };

  const isLastRowEmptyQuotation = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === itemParticularsData) {
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

  const displayRowErrorQuotation = (table) => {
    if (table === itemParticularsData) {
      setItemParticularsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          partName: !table[table.length - 1].partName ? 'Part name is required' : '',
          capacity: !table[table.length - 1].capacity ? 'capacity is required' : '',
          drawingNo: !table[table.length - 1].drawingNo ? 'Drawing No is required' : '',
          revisionNo: !table[table.length - 1].revisionNo ? 'Revision No is required' : '',
          uom: !table[table.length - 1].uom ? 'UOM is required' : '',
          ordQty: !table[table.length - 1].ordQty ? 'Ord Qty is required' : '',
          freeQty: !table[table.length - 1].freeQty ? ' Free Qty is required' : '',
          availableStockQty: !table[table.length - 1].availableStockQty ? 'Available Stock Qty is required' : '',
          requiredQty: !table[table.length - 1].requiredQty ? 'Required Qty is required' : '',

        };
        return newErrors;
      });
    }
  };

  const handleAddRowAttachment = () => {
    if (isLastRowEmptyAttachment(termsandConditionsData)) {
      displayRowErrorAttachment(termsandConditionsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      template: '',
      description: ''
    };
    setTermsandConditionsData([...termsandConditionsData, newRow]);
    setTermsandConditionsErrors([
      ...termsandConditionsErrors,
      {
        template: '',
        description: ''
      }
    ]);
  };

  const isLastRowEmptyAttachment = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === termsandConditionsData) {
      return (
        !lastRow.template ||
        !lastRow.description
      );
    }
    return false;
  };

  const displayRowErrorAttachment = (table) => {
    if (table === termsandConditionsData) {
      setTermsandConditionsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          template: !table[table.length - 1].template ? 'Template is required' : '',
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

  // Customer Name
  useEffect(() => {
    getCustomerNameAndCode();
  }, [])
  const getCustomerNameAndCode = async () => {
    try {
      const result = await apiCalls('get', `/customerenquiry/getCustomerNameAndCode?orgId=${orgId}`);
      setPartyList(result.paramObjectsMap.partymasterVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };
  // QuotationNumber
  const getQuotationNumber = async (customerName) => {
    try {
      const result = await apiCalls('get', `/customerenquiry/getQuotationNumber?customerId=${customerName}&orgId=${orgId}`);
      setQuotationList(result.paramObjectsMap.quotationVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };
  // PartNo
  const getWorkOrderPartNo = async (customerId, quotationNo) => {
    try {
      const result = await apiCalls('get', `/customerenquiry/getWorkOrderPartNo?customerId=${customerId}&docId=${quotationNo}&orgId=${orgId}`);
      console.log("Customer ID:", customerId);
      setPartNoList(result.paramObjectsMap.quotationVO || []);
    } catch (err) {
      console.log('error', err);
    }
  }; 
  useEffect(() => {
    getWorkOrderDocId();
  },[])
  const getWorkOrderDocId = async () => {
    try {
      const response = await apiCalls('get', `/customerenquiry/getWorkOrderDocId?orgId=${orgId}`);
      setDocId(response.paramObjectsMap.workOrderDocId)
    } catch (error) {
      console.error('Error fetching departmentDocId:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.customerName) {
      errors.customerName = 'Customer Name is required';
    }
    if (!formData.customerPoNo) {
      errors.customerPoNo = 'Customer Po No  is required';
    }
    if (!formData.quotationNo) {
      errors.quotationNo = 'Quotation No is required';
    }
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }  
    if (!formData.productionManager) {
      errors.productionManager = 'Production Mgr  is required';
    }
 
    if (!formData.customerSpecialRequirement) {
      errors.customerSpecialRequirement = 'Customer Special Requirement is required';
    } 

    let quotationTableDataValid = true;
    const newQuotationTableErrors = itemParticularsData.map((row) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'Part No is required';
        quotationTableDataValid = false;
      }
      if (!row.partName) {
        rowErrors.partName = 'Part name is required';
        quotationTableDataValid = false;
      }
      if (!row.drawingNo) {
        rowErrors.drawingNo = 'Drawing No is required';
        quotationTableDataValid = false;
      }
      if (!row.revisionNo) {
        rowErrors.revisionNo = 'Revision No  is required';
        quotationTableDataValid = false;
      }
      if (!row.uom) {
        rowErrors.uom = 'UOM is required';
        quotationTableDataValid = false;
      }
      if (!row.ordQty) {
        rowErrors.ordQty = 'Ord Qty is required';
        quotationTableDataValid = false;
      }
      if (!row.freeQty) {
        rowErrors.freeQty = 'Free Qty is required';
        quotationTableDataValid = false;
      }
      if (!row.availableStockQty) {
        rowErrors.availableStockQty = 'Available Stock Qty is required';
        quotationTableDataValid = false;
      }
      if (!row.requiredQty) {
        rowErrors.requiredQty = 'Required Qty Qty is required';
        quotationTableDataValid = false;
      }
      return rowErrors;
    });

    let detailTableDataValid2 = true;
    const newAttachmentTableErrors = itemParticularsData.map((row) => {
      const rowErrors = {};
      if (!row.template) {
        rowErrors.template = 'Template Name is required';
        detailTableDataValid2 = false;
      }
      if (!row.description) {
        rowErrors.description = 'Description is required';
        detailTableDataValid2 = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);
    setItemParticularsErrors(newQuotationTableErrors);
    setTermsandConditionsErrors(newAttachmentTableErrors);

    if (Object.keys(errors).length === 0 && (detailTableDataValid2 && quotationTableDataValid)) {
      const itemParticularsVO = itemParticularsData.map((row) => ({
        ...(editId && { id: row.id }),  
        //creditBase: parseInt(row.creditBase),

          availableStockQty: parseInt(row.availableStockQty),
          drawingNo: row.drawingNo,
          freeQty: parseInt(row.freeQty),
          ordQty: parseInt(row.ordQty),
          partName: row.partName,
          partNo: row.partNo,
          revisionNo: row.revisionNo,
          uom: row.uom,
      }));
      const termsAndConditionsVO = termsandConditionsData.map((row) => ({
        ...(editId && { id: row.id }),
        template: row.template,
        description: row.description,
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        createdBy: loginUserName,
        currency: formData.currency,
        customerCode: formData.customerCode,
        customerDueDate: dayjs(formData.customerDueDate).format('YYYY-MM-DD'),
        customerName: formData.customerName,
        customerPoNo: formData.customerPoNo,
        customerSpecialRequirement: formData.customerSpecialRequirement,
        orgId: parseInt(formData.orgId),
        productionMgr: formData.productionManager,
        quotationNo: formData.quotationNo,
        vapDueDate: dayjs(formData.vapDueDate).format('YYYY-MM-DD'),
        // Table
        itemParticularsDTO: itemParticularsVO,
        termsAndConditionsDTO: termsAndConditionsVO,
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/customerenquiry/createUpdateWorkOrder`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Work Order Updated Successfully' : 'Work Order Created successfully');
          // getAllAdjustmentJournalByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Work Order creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Work Order creation failed');
      }
    }else {
      setFieldErrors(errors);
    }
  };



  const getAllAdjustmentJournalById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    // try {
    //   const result = await apiCalls('get', `/transaction/getAdjustmentJournalById?id=${row.original.id}`);

    //   if (result) {
    //     const adVO = result.paramObjectsMap.adjustmentJournalVO[0];
    //     setEditId(row.original.id);
    //     setDocId(adVO.docId);
    //     setFormData({
    //       docDate: adVO.docDate ? dayjs(adVO.docDate, 'YYYY-MM-DD') : dayjs(),
    //       customerName: adVO.customerName,
    //       customerPoNo: adVO.customerPoNo,
    //       quotationNo: adVO.quotationNo,
    //       currency: adVO.currency,
    //       customerDueDate: adVO.customerDueDate ? dayjs(adVO.customerDueDate, 'YYYY-MM-DD') : dayjs(),
    //       vapDueDate: adVO.vapDueDate ? dayjs(adVO.vapDueDate, 'YYYY-MM-DD') : dayjs(),
    //       productionManager: adVO.productionManager,
    //       orgId: adVO.orgId,
    //     });
    //     setItemParticularsData(
    //       adVO.accountParticularsVO.map((row) => ({
    //         id: row.id,
    //         accountName: row.accountsName,
    //         creditAmount: row.creditAmount,
    //         debitAmount: row.debitAmount,
    //         debitBase: row.debitBase,
    //         creditBase: row.creditBase,
    //         subLedgerCode: row.subLedgerCode,
    //         subledgerName: row.subledgerName
    //       }))
    //     );

    //     console.log('DataToEdit', adVO);
    //   } else {
    //     // Handle erro
    //   }
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
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
                {/* WO No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="woNo"
                    label="WO No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="woNo"
                    value={docId}
                    disabled
                  />
                </div>
                {/* Docdate */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="WO No"
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
                  <Autocomplete
                    disablePortal
                    options={partyList}
                    getOptionLabel={(option) => option?.customer || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={partyList.find((c) => c.customer === formData.customerName) || null}
                    onChange={(event, newValue) => {
                      console.log("Selected Value:", newValue);

                      if (newValue) {
                        setFormData({
                          ...formData,
                          currency: newValue.currency,
                          customerName: newValue.customer,
                          customerCode: newValue.customerCode,
                        });
                        getQuotationNumber(newValue.customerCode);
                      } else {
                        setFormData({
                          ...formData,
                          currency: '',
                          customerName: '',
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer Name"
                        name="customerName"
                        error={!!fieldErrors.customerName}
                        helperText={fieldErrors.customerName}
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
                    id="customerPoNo"
                    label='Customer Po No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerPoNo"
                    value={formData.customerPoNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerPoNo ? fieldErrors.customerPoNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.customerPoNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="customerCode"
                    label='Customer Code'
                    variant="outlined"
                    disabled
                    size="small"
                    fullWidth
                    name="customerCode"
                    value={formData.customerCode}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerCode ? fieldErrors.customerCode : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.customerCode}
                  />
                </div>
                {/* Quotation No */}
                <div className="col-md-3 mb-3">
                  {quotationList && (
                    <Autocomplete
                      disablePortal
                      options={quotationList.map((option, index) => ({ ...option, key: index }))}
                      getOptionLabel={(option) => option.quotationNo || ''}
                      sx={{ width: '100%' }}
                      size="small"
                      value={quotationList.find((qu) => qu.quotationNo === formData.quotationNo) || null}
                      onChange={(event, newValue) => {
                        console.log("Selected Quotation:", newValue);
                        if (newValue) {
                          setFormData({
                            ...formData,
                            quotationNo: newValue.quotationNo,
                          });
                          getWorkOrderPartNo(formData.customerCode, newValue.quotationNo);
                        } else {
                          setFormData({
                            ...formData,
                            quotationNo: '',
                          });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Quotation No"
                          name="quotationNo"
                          error={!!fieldErrors.quotationNo}
                          helperText={fieldErrors.quotationNo}
                          InputProps={{
                            ...params.InputProps,
                            style: { height: 40 },
                          }}
                        />
                      )}
                    />
                  )}
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
                    disabled
                  />
                </div>
                {/* Customer Due Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Customer Due Date"
                        value={formData.customerDueDate ? dayjs(formData.customerDueDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('customerDueDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.customerDueDate}
                        helperText={fieldErrors.customerDueDate ? fieldErrors.customerDueDate : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                {/* Vap Due Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label={
                          <span>
                            Vap Due Date <span className="asterisk">*</span>
                          </span>
                        }
                        value={formData.vapDueDate ? dayjs(formData.vapDueDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('vapDueDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.vapDueDate}
                        helperText={fieldErrors.validTill ? fieldErrors.vapDueDate : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                {/* Production Mgr */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="ProductionManager"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="productionManager"
                    value={formData.productionManager}
                    onChange={handleInputChange}
                    error={!!fieldErrors.productionManager}
                    helperText={fieldErrors.productionManager}
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
                                      <th className="table-header px-2 py-2 text-white text-center">Part No</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Part name</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Drawing No</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Revision No</th>
                                      <th className="table-header px-2 py-2 text-white text-center">
                                        {
                                          <span>
                                            UOM <span className="asterisk">*</span>
                                          </span>
                                        }
                                      </th>
                                      <th className="table-header px-2 py-2 text-white text-center">
                                        {
                                          <span>
                                            Ord Qty <span className="asterisk">*</span>
                                          </span>
                                        }
                                      </th>
                                      <th className="table-header px-2 py-2 text-white text-center">Free Qty</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Available Stock Qty</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Required Qty</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {itemParticularsData.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="col-md-1 border px-2 py-2 text-center">
                                          <ActionButton
                                            className=" mb-2"
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                itemParticularsData,
                                                setItemParticularsData,
                                                itemParticularsErrors,
                                                setItemParticularsErrors
                                              )
                                            }
                                          />
                                        </td>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>
                                        <td className="border px-2 py-2">
                                          <select
                                            value={row.partNo || ""}
                                            style={{ width: "150px" }}
                                            className={
                                              itemParticularsErrors[index]?.partNo ? "error form-control" : "form-control"
                                            }
                                            onChange={(e) => {
                                              const selectedPartNo = e.target.value;

                                              // Find details for the selected part
                                              const selectedPartDetails = partNoList.find(
                                                (item) => item.partCode === selectedPartNo
                                              );

                                              // Update partNo and related fields
                                              setItemParticularsData((prev) =>
                                                prev.map((r, i) =>
                                                  i === index
                                                    ? {
                                                      ...r,
                                                      partNo: selectedPartDetails?.partCode || "",
                                                      partName: selectedPartDetails?.partDescription || "",
                                                      drawingNo: selectedPartDetails?.drawingNo || "",
                                                      uom: selectedPartDetails?.uom || "",
                                                      ordQty: selectedPartDetails?.orderQty || "",
                                                      revisionNo: selectedPartDetails?.revisionNo || "",
                                                      qtyOffered: selectedPartDetails?.qtyOffered || "",
                                                      productionManager: selectedPartDetails?.productionManager || "",
                                                    }
                                                    : r
                                                )
                                              );

                                              // Update validation errors
                                              setItemParticularsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  partNo: !selectedPartNo ? "Part No is required" : "",
                                                };
                                                return newErrors;
                                              });
                                            }}
                                          >
                                            <option value="">-- Select --</option>
                                            {getAvailablePartNos(row.id).map((item) => (
                                              <option key={item.id} value={item.partCode}>
                                                {item.partCode}
                                              </option>
                                            ))}
                                          </select>
                                          {itemParticularsErrors[index]?.partNo && (
                                            <div className="mt-2" style={{ color: "red", fontSize: "12px" }}>
                                              {itemParticularsErrors[index].partNo}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.partName}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemParticularsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, partName: value } : r))
                                              );
                                              setItemParticularsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  partName: !value ? 'Part name is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemParticularsErrors[index]?.partName ? 'error form-control' : 'form-control'}
                                          />
                                          {itemParticularsErrors[index]?.partName && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemParticularsErrors[index].partName}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.drawingNo}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemParticularsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, drawingNo: value } : r))
                                              );
                                              setItemParticularsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  drawingNo: !value ? 'Drawing No is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemParticularsErrors[index]?.drawingNo ? 'error form-control' : 'form-control'}
                                          />
                                          {itemParticularsErrors[index]?.drawingNo && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemParticularsErrors[index].drawingNo}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.revisionNo}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemParticularsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, revisionNo: value } : r))
                                              );
                                              setItemParticularsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  revisionNo: !value ? 'Revision No is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemParticularsErrors[index]?.revisionNo ? 'error form-control' : 'form-control'}
                                          />
                                          {itemParticularsErrors[index]?.revisionNo && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemParticularsErrors[index].revisionNo}
                                            </div>
                                          )}
                                        </td><td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.uom}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemParticularsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, uom: value } : r))
                                              );
                                              setItemParticularsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  uom: !value ? 'UOM is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemParticularsErrors[index]?.uom ? 'error form-control' : 'form-control'}
                                          />
                                          {itemParticularsErrors[index]?.uom && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemParticularsErrors[index].uom}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.ordQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemParticularsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, ordQty: value } : r))
                                              );
                                              setItemParticularsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  ordQty: !value ? 'Ord Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemParticularsErrors[index]?.ordQty ? 'error form-control' : 'form-control'}
                                          />
                                          {itemParticularsErrors[index]?.ordQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemParticularsErrors[index].ordQty}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.freeQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemParticularsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, freeQty: value } : r))
                                              );
                                              setItemParticularsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  freeQty: !value ? 'Free Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemParticularsErrors[index]?.freeQty ? 'error form-control' : 'form-control'}
                                          />
                                          {itemParticularsErrors[index]?.freeQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemParticularsErrors[index].freeQty}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.availableStockQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemParticularsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, availableStockQty: value } : r))
                                              );
                                              setItemParticularsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  availableStockQty: !value ? 'Available Stock Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemParticularsErrors[index]?.availableStockQty ? 'error form-control' : 'form-control'}
                                          />
                                          {itemParticularsErrors[index]?.availableStockQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemParticularsErrors[index].availableStockQty}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.requiredQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemParticularsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, requiredQty: value } : r))
                                              );
                                              setItemParticularsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  requiredQty: !value ? 'Available Stock Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemParticularsErrors[index]?.requiredQty ? 'error form-control' : 'form-control'}
                                          />
                                          {itemParticularsErrors[index]?.requiredQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemParticularsErrors[index].requiredQty}
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
                          <div className="col-lg-7">
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
                                      Template
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                      Description
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {termsandConditionsData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              termsandConditionsData,
                                              setTermsandConditionsData,
                                              termsandConditionsErrors,
                                              setTermsandConditionsErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <FormControl fullWidth size="small">
                                          <InputLabel id="template">Template</InputLabel>
                                          <Select
                                            labelId="template"
                                            id="template"
                                            label="Template"
                                            onChange={handleInputChange}
                                            name="template"
                                            value={formData.template}
                                          >
                                            <MenuItem value="INTRA">---</MenuItem>
                                            <MenuItem value="INTRA">INTRA</MenuItem>
                                            <MenuItem value="INTER">INTER</MenuItem>
                                          </Select>
                                          {fieldErrors.template && <FormHelperText style={{ color: 'red' }}>{fieldErrors.template}</FormHelperText>}
                                        </FormControl>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.description}
                                          className="form-control"
                                          onChange = {(e) => {
                                            const value = e.target.value;
                                            setTermsandConditionsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, description: value } : r))
                                            );
                                            setTermsandConditionsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                    ...newErrors[index],
                                                    description: !value ? 'Description is required' : ''
                                                };
                                                return newErrors;
                                            });
                                        }}
                                          style={{ width: "150px" }} 
                                        />
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
                              <div className="col-md-12 mb-3">
                                <TextField
                                  label="Customer Special Requirement"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="customerSpecialRequirement"
                                  value={formData.customerSpecialRequirement}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.customerSpecialRequirement}
                                  helperText={fieldErrors.customerSpecialRequirement}
                                  multiline
                                  rows={4} // Adjust the number of rows as needed
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
        </Dialog>
      </div>
    </>

  )
};

export default WorkOrder;
