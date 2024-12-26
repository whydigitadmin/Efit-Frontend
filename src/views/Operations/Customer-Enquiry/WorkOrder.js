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
    woNo: '',
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
    woNo: '',
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
    { accessorKey: 'quotationNo', header: 'Quotation No', size: 140 },
    { accessorKey: 'currency', header: 'Currency', size: 140 },
  ];


  useEffect(() => {
    getAllQuotationByOrgId();
  }, []);
  const getAllQuotationByOrgId = async () => {
    try {
      const response = await apiCalls('get', `/customerenquiry/getAllWorkOrderByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.workOrderVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      customerName: '',
      customerPoNo: '',
      customerCode: '',
      quotationNo: '',
      currency: '',
      productionManager: '',
      customerDueDate: dayjs(),
      vapDueDate: dayjs(),
      // 2nd table
      customerSpecialRequirement: ''
    });
    getWorkOrderDocId();
    setFieldErrors({
      customerName: '',
      customerPoNo: '',
      quotationNo: '',
      currency: '',
      customerCode: '',
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
  }, [])
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

    // Validating main form fields
    if (!formData.customerName) errors.customerName = 'Customer Name is required';
    if (!formData.customerPoNo) errors.customerPoNo = 'Customer PO No is required';
    if (!formData.quotationNo) errors.quotationNo = 'Quotation No is required';
    if (!formData.currency) errors.currency = 'Currency is required';
    if (!formData.productionManager) errors.productionManager = 'Production Manager is required';
    if (!formData.customerSpecialRequirement) errors.customerSpecialRequirement = 'Customer Special Requirement is required';

    // Validating Item Particulars Table
    let quotationTableDataValid = true;
    const newQuotationTableErrors = itemParticularsData.map((row) => {
      const rowErrors = {};
      if (!row.partNo) rowErrors.partNo = 'Part No is required';
      if (!row.partName) rowErrors.partName = 'Part Name is required';
      if (!row.drawingNo) rowErrors.drawingNo = 'Drawing No is required';
      if (!row.revisionNo) rowErrors.revisionNo = 'Revision No is required';
      if (!row.uom) rowErrors.uom = 'UOM is required';
      if (!row.ordQty) rowErrors.ordQty = 'Ord Qty is required';
      if (!row.freeQty) rowErrors.freeQty = 'Free Qty is required';
      if (!row.availableStockQty) rowErrors.availableStockQty = 'Available Stock Qty is required';

      if (Object.keys(rowErrors).length > 0) quotationTableDataValid = false;
      return rowErrors;
    });

    // Validating Terms and Conditions Table
    let detailTableDataValid2 = true;
    const newAttachmentTableErrors = termsandConditionsData.map((row) => {
      const rowErrors = {};
      if (!row.template) rowErrors.template = 'Template is required';
      if (!row.description) rowErrors.description = 'Description is required';

      if (Object.keys(rowErrors).length > 0) detailTableDataValid2 = false;
      return rowErrors;
    });

    // Setting errors to state
    setFieldErrors(errors);
    setItemParticularsErrors(newQuotationTableErrors);
    setTermsandConditionsErrors(newAttachmentTableErrors);

    // Proceed if all validations pass
    if (Object.keys(errors).length === 0 && quotationTableDataValid && detailTableDataValid2) {
      const itemParticularsDTO = itemParticularsData.map((row) => ({
        availableStockQty: parseInt(row.availableStockQty, 10),
        drawingNo: row.drawingNo,
        freeQty: parseInt(row.freeQty, 10),
        ordQty: parseInt(row.ordQty, 10),
        partName: row.partName,
        partNo: row.partNo,
        revisionNo: row.revisionNo,
        uom: row.uom,
      }));

      const termsAndConditionsDTO = termsandConditionsData.map((row) => ({
        description: row.description,
        template: row.template,
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active ?? true,  
        createdBy: loginUserName,
        currency: formData.currency,
        customerCode: formData.customerCode,
        customerDueDate: dayjs(formData.customerDueDate).format('YYYY-MM-DD'),
        customerName: formData.customerName,
        customerPoNo: formData.customerPoNo,
        customerSpecialRequirement: formData.customerSpecialRequirement,
        itemParticularsDTO,
        orgId: orgId,
        productionMgr: formData.productionManager,
        quotationNo: formData.quotationNo,
        termsAndConditionsDTO,
        vapDueDate: dayjs(formData.vapDueDate).format('YYYY-MM-DD'),
      };

      try {
        const response = await apiCalls('put', `/customerenquiry/createUpdateWorkOrder`, saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'Work Order Updated Successfully' : 'Work Order Created Successfully');
          handleClear(); // Clear the form after success
          getAllQuotationByOrgId();
        } else {
          showToast('error', response.paramObjectsMap?.message || 'Work Order creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Work Order creation failed');
      }
    }
  };




  const getWorkOrderById = async (row) => {
    console.log('Row selected:', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/customerenquiry/getWorkOrderById?id=${row.original.id}`);

      if (result && result.status && result.paramObjectsMap?.workOrderVO?.length) {
        const WorOde = result.paramObjectsMap.workOrderVO[0];

        console.log('DataToEdit', WorOde);

        setEditId(WorOde.id);
        setDocId(WorOde.docId);
        getQuotationNumber(WorOde.customerCode);
        getWorkOrderPartNo(WorOde.customerCode, WorOde.quotationNo);
        setFormData({
          active: WorOde.active === "Active",
          docDate: WorOde.docDate ? dayjs(WorOde.docDate, 'YYYY-MM-DD') : dayjs(),
          customerName: WorOde.customerName,
          customerCode: WorOde.customerCode,
          customerPoNo: WorOde.customerPoNo,
          quotationNo: WorOde.quotationNo,
          currency: WorOde.currency,
          customerDueDate: WorOde.customerDueDate ? dayjs(WorOde.customerDueDate, 'YYYY-MM-DD') : dayjs(),
          vapDueDate: WorOde.vapDueDate ? dayjs(WorOde.vapDueDate, 'YYYY-MM-DD') : dayjs(),
          productionManager: WorOde.productionMgr,
          customerSpecialRequirement: WorOde.customerSpecialRequirement,
          orgId: WorOde.orgId,
          createdBy: WorOde.createdBy,
        });


        setItemParticularsData(
          WorOde.itemParticularsVO?.map((row) => ({
            partNo: row.partNo,
            partName: row.partName,
            drawingNo: parseInt(row.drawingNo, 10) || 0,
            revisionNo: row.revisionNo,
            uom: row.uom,
            ordQty: parseInt(row.ordQty, 10) || 0,
            freeQty: parseInt(row.freeQty, 10) || 0,
            availableStockQty: parseInt(row.availableStockQty, 10) || 0,
            requiredQty: parseInt(row.requiredQty, 10) || 0,
          })) || []
        );

        setTermsandConditionsData(
          WorOde.termsAndConditionsVO?.map((row) => ({
            template: row.template,
            description: row.description,
          })) || []
        );
      } else {
        console.error('No data found for the selected ID');
        showToast('error', 'No data found for the selected ID');
      }
    }
    catch (error) {
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
                          // productionmanager: newValue.productionManager,
                        });
                        getQuotationNumber(newValue.customerCode);
                      } else {
                        setFormData({
                          ...formData,
                          currency: '',
                          customerName: '',
                          // productionManager: '',
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
                            productionManager: newValue.productionmanager,
                          });
                          getWorkOrderPartNo(formData.customerCode, newValue.quotationNo);
                        } else {
                          setFormData({
                            ...formData,
                            quotationNo: '',
                            productionManager: '',
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
                    <Tab value={0} label="Item Particulars" />
                    <Tab value={1} label="Terms and Conditions" />
                    <Tab value={2} label="Summary" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row mt-2">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowQuotation} />
                        </div>
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
                                    {/* <td className="border px-2 py-2">
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
                                    </td> */}

                                    <td>
                                      <Autocomplete
                                        disablePortal
                                        options={partNoList.map((option, index) => ({ ...option, key: index }))}
                                        getOptionLabel={(option) => option.partCode || ''}
                                        sx={{ width: '100%' }}
                                        size="small"
                                        value={
                                          itemParticularsData[index]?.partNo
                                            ? partNoList.find((c) => c.partCode === itemParticularsData[index].partNo)
                                            : null
                                        }
                                        onChange={(event, newValue) => {
                                          const selectedPartDetails = newValue;

                                          // Update the selected part details in the item particulars data
                                          setItemParticularsData((prev) =>
                                            prev.map((row, i) =>
                                              i === index
                                                ? {
                                                  ...row,
                                                  partNo: selectedPartDetails?.partCode || '',
                                                  partName: selectedPartDetails?.partDescription || '',
                                                  drawingNo: selectedPartDetails?.drawingNo || '',
                                                  revisionNo: selectedPartDetails?.revisionNo || '',
                                                  uom: selectedPartDetails?.uom || '',
                                                  ordQty: selectedPartDetails?.orderQty || '',
                                                  freeQty: '', // Assuming freeQty to be user-input; adjust as per logic
                                                  availableStockQty: '', // Assuming it's dynamic; fetch if needed
                                                  requiredQty: '', // Assuming requiredQty is user-input
                                                }
                                                : row
                                            )
                                          );

                                          // Update validation errors for partNo
                                          setItemParticularsErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              partNo: !selectedPartDetails?.partCode ? 'Part No is required' : '',
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Part No"
                                            name="partNo"
                                            error={!!itemParticularsErrors[index]?.partNo}
                                            helperText={itemParticularsErrors[index]?.partNo}
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
                                            prev.map((r) =>
                                              r.id === row.id
                                                ? { ...r, ordQty: value, requiredQty: (parseFloat(value || 0) + parseFloat(r.freeQty || 0) - parseFloat(r.availableStockQty || 0)).toFixed(2) }
                                                : r
                                            )
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
                                            prev.map((r) =>
                                              r.id === row.id
                                                ? { ...r, freeQty: value, requiredQty: (parseFloat(r.ordQty || 0) + parseFloat(value || 0) - parseFloat(r.availableStockQty || 0)).toFixed(2) }
                                                : r
                                            )
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
                                            prev.map((r) =>
                                              r.id === row.id
                                                ? { ...r, availableStockQty: value, requiredQty: (parseFloat(r.ordQty || 0) + parseFloat(r.freeQty || 0) - parseFloat(value || 0)).toFixed(2) }
                                                : r
                                            )
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
                                        readOnly
                                        className="form-control"
                                      />
                                    </td>

                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
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
                                        <FormControl fullWidth size="small" error={!!termsandConditionsErrors[index]?.template}>
                                          <InputLabel id={`template-label-${index}`}>Template</InputLabel>
                                          <Select
                                            labelId={`template-label-${index}`}
                                            id={`template-${index}`}
                                            label="Template"
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setTermsandConditionsData((prev) =>
                                                prev.map((r, i) => (i === index ? { ...r, template: value } : r))
                                              );
                                              setTermsandConditionsErrors((prev) =>
                                                prev.map((r, i) =>
                                                  i === index
                                                    ? { ...r, template: value ? '' : 'Template is required' }
                                                    : r
                                                )
                                              );
                                            }}
                                            value={termsandConditionsData[index]?.template || ''} // Ensure the correct value
                                          >
                                            <MenuItem value="">---</MenuItem>
                                            <MenuItem value="INTRA">INTRA</MenuItem>
                                            <MenuItem value="INTER">INTER</MenuItem>
                                          </Select>
                                          {termsandConditionsErrors[index]?.template && (
                                            <FormHelperText>{termsandConditionsErrors[index].template}</FormHelperText>
                                          )}
                                        </FormControl>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={termsandConditionsData[index]?.description || ''}
                                          className="form-control"
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setTermsandConditionsData((prev) =>
                                              prev.map((r, i) => (i === index ? { ...r, description: value } : r))
                                            );
                                            setTermsandConditionsErrors((prev) =>
                                              prev.map((r, i) =>
                                                i === index
                                                  ? { ...r, description: value ? '' : 'Description is required' }
                                                  : r
                                              )
                                            );
                                          }}
                                          style={{ width: "150px" }}
                                        />
                                        {termsandConditionsErrors[index]?.description && (
                                          <div style={{ color: 'red' }}>{termsandConditionsErrors[index].description}</div>
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

            <div className="mt-4">
              <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getWorkOrderById} />
            </div>
          )}


        </div>
      </div>
    </>

  )
};

export default WorkOrder;
