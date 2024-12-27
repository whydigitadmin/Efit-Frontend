import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { encryptPassword } from 'views/utilities/passwordEnc';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { toast } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const PurchaseIndent = () => {
  const [listViewData, setListViewData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [indentTypeList, setIndentTypeList] = useState([]);
  const [indentCustomer, setIndentCustomer] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [workOrderList, setWorkOrderList] = useState([]);
  const [workOrderDetailsList, setWorkOrderDetailsList] = useState([]);
  const [itemDetailsList, setItemDetailsList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    docId: '',
    docDate: dayjs(),
    customerName: '',
    customerCode: '',
    workOrderNo: '',
    department: '',
    fgPart: '',
    fgPartDesc: '',
    fgQty: '',
    requestedBy: '',
    customerPoNo: '',
    purchaseIndentDTO1: '',
    purchaseIndentDTO2: '',
    verifiedBy: '',
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    customerName: '',
    customerCode: '',
    workOrderNo: '',
    department: '',
    fgPart: '',
    fgPartDesc: '',
    fgQty: '',
    requestedBy: '',
    customerPoNo: '',
    purchaseIndentDTO1: '',
    purchaseIndentDTO2: '',
    verifiedBy: '',
    orgId: orgId
  });

  const listViewColumns = [
    { accessorKey: 'docId', header: 'Indent No', size: 140 },
    { accessorKey: 'docDate', header: 'Date', size: 140 },
    { accessorKey: 'indentType', header: 'Indent Type', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'workOrderNo', header: 'Work Order No', size: 140 },
    { accessorKey: 'department', header: 'Department', size: 140 },
    { accessorKey: 'fgPart', header: 'FG Part', size: 140 },
    { accessorKey: 'fgPartDesc', header: 'FG Part Desc', size: 140 },
    { accessorKey: 'fgQty', header: 'FG Qty', size: 140 },
    { accessorKey: 'requestedBy', header: 'Requested By', size: 140 },
    { accessorKey: 'customerPoNo', header: 'Customer PO No', size: 140 }
  ];

  const [purchaseDetails, setPurchaseDetails] = useState([
    {
      id: 1,
      item: '',
      itemDescription: '',
      uom: '',
      indentQty: '',
      avlStock: 100, //hardcoded
      indentQty: ''
    }
  ]);
  const [purchaseDetailsErrors, setPurchaseDetailsErrors] = useState([
    {
      item: '',
      itemDescription: '',
      uom: '',
      indentQty: '',
      avlStock: '',
      indentQty: ''
    }
  ]);

  useEffect(() => {
    getpurchaseIndentDocId();
    getIndentType();
    getCustomerNameForPurchaseIndent();
    getDepartmentForPurchase();
    getRequestedByForPurchase();
    // getAllEnquiryByOrgId();
  }, []);

  const getpurchaseIndentDocId = async () => {
    try {
      const response = await apiCalls('get', `/purchase/getpurchaseIndentDocId?orgId=${orgId}`);
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.purchaseIndentDocId,
        docDate: dayjs()
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getIndentType = async () => {
    try {
      const response = await apiCalls('get', `purchase/getIndentType?orgId=${orgId}`);
      if (response.status === true) {
        setIndentTypeList(response.paramObjectsMap.indentType);
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const getDepartmentForPurchase = async () => {
    try {
      const response = await apiCalls('get', `purchase/getDepartmentForPurchase?orgId=${orgId}`);
      if (response.status === true) {
        setDepartmentList(response.paramObjectsMap.department);
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const getRequestedByForPurchase = async () => {
    try {
      const response = await apiCalls('get', `purchase/getRequestedByForPurchase?orgId=${orgId}`);
      if (response.status === true) {
        setEmployeeList(response.paramObjectsMap.RequestedBy);
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const getCustomerNameForPurchaseIndent = async () => {
    try {
      const response = await apiCalls('get', `purchase/getCustomerNameForPurchaseIndent?orgId=${orgId}`);
      if (response.status === true) {
        setIndentCustomer(response.paramObjectsMap.customerNameList);
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const getWorkOrderNoForPurchaseIndent = async (customerCode) => {
    try {
      const response = await apiCalls('get', `purchase/getWorkOrderNoForPurchaseIndent?customerCode=${customerCode}&orgId=${orgId}`);
      if (response.status === true) {
        setWorkOrderList(response.paramObjectsMap.workOrderNo);
        console.log('response.paramObjectsMap.workOrderNo', response.paramObjectsMap.workOrderNo);
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const getWorkOrderDetailsForPurchaseIndent = async (workOrderNo) => {
    try {
      const response = await apiCalls('get', `purchase/getWorkOrderDetailsForPurchaseIndent?workOrderNo=${workOrderNo}&orgId=${orgId}`);
      if (response.status === true) {
        setWorkOrderDetailsList(response.paramObjectsMap.workOrderDtls);
        console.log('response.paramObjectsMap.workOrderDtls', response.paramObjectsMap.workOrderDtls);
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };
  const getBomItemDetailsForPurchase = async (fgPart) => {
    try {
      const response = await apiCalls('get', `purchase/getBomItemDetailsForPurchase?fgPart=${fgPart}&orgId=${orgId}`);
      if (response.status === true) {
        setItemDetailsList(response.paramObjectsMap.itemDetails);
        console.log('response.paramObjectsMap.itemDetails', response.paramObjectsMap.itemDetails);
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const getPurchaseIndentById = async (row) => {
    try {
      const response = await apiCalls('get', `documentType/getPurchaseIndentById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setEditId(row.original.id);
        setListView(false);
        const purchaseIndentVO = response.paramObjectsMap?.purchaseIndentVO;
        if (Array.isArray(purchaseIndentVO) && purchaseIndentVO[0]) {
          const particularIndent = purchaseIndentVO[0];
          console.log('PURCHASE INDENT:', particularIndent);

          setFormData((prevFormData) => ({
            ...prevFormData,
            customerName: particularIndent.customerName,
            customerPoNo: particularIndent.customerPoNo || '', // Default to empty string if undefined
            department: particularIndent.department || '',
            fgPart: particularIndent.fgPart,
            fgPartDesc: particularIndent.fgPartDesc || '',
            fgQty: particularIndent.fgQty || '',
            indentType: particularIndent.indentType || '',
            requestedBy: particularIndent.requestedBy || '',
            workOrderNo: particularIndent.workOrderNo || ''
          }));
        } else {
          console.error('No purchase indent found in response:', response);
        }
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllPurchaseIndent = async () => {
    try {
      const response = await apiCalls('get', `documentType/getAllPurchaseIndentByOrgId?orgId=${orgId}`);

      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.purchaseIndentVO.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e, fieldType, index) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
    let errorMessage = '';
    const alphaNumericRegex = /^[A-Za-z0-9]*$/;

    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      if (name === 'customerName') {
        const selectedCustomer = indentCustomer.find((scr) => scr.customerName === value);

        if (selectedCustomer) {
          setFormData((prevData) => ({
            ...prevData,
            customerCode: selectedCustomer.customerCode,
            customerName: selectedCustomer.customerName
          }));
          getWorkOrderNoForPurchaseIndent(selectedCustomer.customerCode);
        }
      }
      if (name === 'workOrderNo') {
        const selectedWorkOrderNo = workOrderList.find((scr) => scr.workOrderNo === value);
        console.log('selectedWorkOrderNo', selectedWorkOrderNo);

        if (selectedWorkOrderNo) {
          getWorkOrderDetailsForPurchaseIndent(selectedWorkOrderNo.workOrderNo);
        }
      }
      // if (name === 'fgPart') {
      //   const selectedFgPart = workOrderDetailsList.find((scr) => scr.fgPart === value);
      //   console.log('selectedFgPart', selectedFgPart);

      //   if (selectedFgPart) {
      //     setFormData((prevData) => ({
      //       ...prevData,
      //       customerPoNo: selectedFgPart.customerPoNo,
      //       fgPart: selectedFgPart.fgPart,
      //       fgPartDesc: selectedFgPart.fgPartDesc,
      //       fgQty: selectedFgPart.fgQty
      //     }));
      //     getBomItemDetailsForPurchase(selectedFgPart.fgPart);
      //   }
      // }
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleClear = () => {
    setFormData({
      indentType: '',
      customerName: '',
      workOrderNo: '',
      department: '',
      fgPart: '',
      fgPartDesc: '',
      fgQty: '',
      requestedBy: '',
      customerPoNo: '',
      orgId: orgId
    });
    setFieldErrors({});
    setPurchaseDetails([
      { id: 1, item: '', itemDescription: '', uom: '', indentQty: '', avlStock: '', indentQty: '', verifiedBy: '', remarks: '' }
    ]);
    setPurchaseDetailsErrors('');
    setEditId('');
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(purchaseDetails)) {
      displayRowError(purchaseDetails);
      return;
    }
    const newRow = {
      id: Date.now(),
      item: '',
      itemDescription: '',
      uom: '',
      indentQty: '',
      avlStock: '',
      indentQty: ''
    };
    setPurchaseDetails([...purchaseDetails, newRow]);
    setPurchaseDetailsErrors([
      ...purchaseDetailsErrors,
      { item: '', itemDescription: '', uom: '', indentQty: '', avlStock: '', indentQty: '' }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === purchaseDetails) {
      return !lastRow.item || !lastRow.itemDescription || !lastRow.uom || !lastRow.indentQty || !lastRow.avlStock || !lastRow.indentQty;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === purchaseDetails) {
      setPurchaseDetailsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !table[table.length - 1].item ? 'Item is required' : '',
          indentQty: !table[table.length - 1].indentQty ? 'Require Qty is required' : '',
          indentQty: !table[table.length - 1].indentQty ? 'Indent Qty is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    // If the row exists, proceed to delete
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const handleIndentChange = (row, index, event) => {
    const updatedRows = [...purchaseDetails]; // Clone the data
    updatedRows[index].value = event.target.value; // Update the value
    setPurchaseDetails(updatedRows); // Update the state
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
    toast.success('File uploded sucessfully');
    console.log('Submit clicked');
    handleBulkUploadClose();
    // getAllData();
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.indentType) {
      errors.indentType = 'Indent Type is required';
    }
    if (!formData.customerName) {
      errors.customerName = 'Customer Name is required';
    }
    if (!formData.workOrderNo) {
      errors.workOrderNo = 'Work Order No is required';
    }
    if (!formData.department) {
      errors.department = 'Department is required';
    }

    setFieldErrors(errors);

    let indentDocumentsDataValid = true;
    if (!purchaseDetails || !Array.isArray(purchaseDetails) || purchaseDetails.length === 0) {
      indentDocumentsDataValid = false;
      setPurchaseDetailsErrors([{ general: 'PurchaseIndent is required' }]);
    } else {
      const newTableErrors = purchaseDetails.map((row, index) => {
        const rowErrors = {};
        if (!row.item) {
          rowErrors.item = 'Item is required';
          indentDocumentsDataValid = false;
        }
        if (!row.reqQty) {
          rowErrors.reqQty = 'Required QTY is required';
          indentDocumentsDataValid = false;
        }
        if (!row.indentQty) {
          rowErrors.indentQty = 'Indent QTY is required';
          indentDocumentsDataValid = false;
        }

        return rowErrors;
      });
      setPurchaseDetailsErrors(newTableErrors);
    }
    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && indentDocumentsDataValid) {
      setIsLoading(true);

      const detailsVo = purchaseDetails.map((row) => ({
        ...(editId && { id: row.id }),
        item: row.item,
        itemDescription: row.itemDescription,
        uom: row.uom,
        reqQty: parseInt(row.reqQty, 10),
        avlStock: parseInt(row.avlStock, 10),
        indentQty: parseInt(row.indentQty, 10)
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        createdBy: loginUserName,
        purchaseIndentDTO1: detailsVo,
        customerName: formData.customerName,
        customerPoNo: formData.customerPoNo,
        department: formData.department,
        fgPart: formData.fgPart,
        fgPartDesc: formData.fgPartDesc,
        verifiedBy: formData.verifiedBy,
        fgQty: parseInt(formData.fgQty, 10),
        indentType: formData.indentType,
        purchaseIndentDTO2: formData.purchaseIndentDTO2,
        requestedBy: formData.requestedBy,
        workOrderNo: formData.workOrderNo,
        orgId: orgId,
        finYear: finYear
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', 'purchase/updateCreatePurchaseIndent', saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Purchase Indent updated successfully' : 'Purchase Indent created successfully');

          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Purchase Indent creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Purchase Indent creation failed');
        setIsLoading(false);
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

          {!listView ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Indent No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    disabled
                    value={formData.docId}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Indent Date"
                        disabled
                        value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : dayjs()}
                        onChange={(date) => handleDateChange('docDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.docDate}
                        helperText={<span style={{ color: 'red' }}>{fieldErrors.docDate ? 'Date is required' : ''}</span>}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={indentTypeList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.materialType || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.materialType ? indentTypeList.find((c) => c.materialType === formData.materialType) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'materialType',
                          value: newValue ? newValue.materialType : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Indent Type"
                        name="materialType"
                        error={!!fieldErrors.materialType}
                        helperText={fieldErrors.materialType}
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
                    options={indentCustomer.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.customerName || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.customerName ? indentCustomer.find((c) => c.customerName === formData.customerName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'customerName',
                          value: newValue ? newValue.customerName : ''
                        }
                      });
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
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={workOrderList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.workOrderNo || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.workOrderNo ? workOrderList.find((c) => c.workOrderNo === formData.workOrderNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'workOrderNo',
                          value: newValue ? newValue.workOrderNo : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Work Order No"
                        name="workOrderNo"
                        error={!!fieldErrors.workOrderNo}
                        helperText={fieldErrors.workOrderNo}
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
                    options={departmentList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.departmentName || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.department ? departmentList.find((c) => c.departmentName === formData.department) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'department',
                          value: newValue ? newValue.departmentName : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Department"
                        name="department"
                        error={!!fieldErrors.department}
                        helperText={fieldErrors.department}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div>

                {/* <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="FG Part"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="fgPart"
                    value={formData.fgPart}
                    disabled
                    inputProps={{ maxLength: 40 }}
                  />
                </div> */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={workOrderDetailsList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.fgPart || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.fgPart ? workOrderDetailsList.find((c) => c.fgPart === formData.fgPart) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'fgPart',
                          value: newValue ? newValue.fgPart : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="FG Part"
                        name="fgPart"
                        error={!!fieldErrors.fgPart}
                        helperText={fieldErrors.fgPart}
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
                    id="outlined-textarea"
                    label="FG Part Desc"
                    variant="outlined"
                    size="small"
                    name="fgPartDesc"
                    fullWidth
                    value={formData.fgPartDesc}
                    disabled
                    inputProps={{ maxLength: 15 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea"
                    label="FG Qty"
                    variant="outlined"
                    size="small"
                    name="fgQty"
                    fullWidth
                    value={formData.fgQty}
                    disabled
                    inputProps={{ maxLength: 15 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={employeeList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.employeeName || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.requestedBy ? employeeList.find((c) => c.employeeName === formData.requestedBy) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'requestedBy',
                          value: newValue ? newValue.employeeName : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Requested By"
                        name="requestedBy"
                        error={!!fieldErrors.requestedBy}
                        helperText={fieldErrors.requestedBy}
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
                    id="outlined-textarea"
                    label="Customer PO No"
                    variant="outlined"
                    size="small"
                    name="customerPoNo"
                    fullWidth
                    value={formData.customerPoNo}
                    disabled
                    inputProps={{ maxLength: 15 }}
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
                    <Tab value={0} label="Purchase Details" />
                    <Tab value={1} label="Summary" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                          <ActionButton icon={CloudUploadIcon} title="Upload" onClick={handleBulkUploadOpen} />

                          {uploadOpen && (
                            <CommonBulkUpload
                              open={uploadOpen}
                              handleClose={handleBulkUploadClose}
                              title="Upload Files"
                              uploadText="Upload file"
                              downloadText="Sample File"
                              onSubmit={handleSubmit}
                              // sampleFileDownload={FirstData}
                              handleFileUpload={handleFileUpload}
                              apiUrl={`excelfileupload/excelUploadForSample`}
                              screen="PutAway"
                            />
                          )}
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Item</th>
                                    <th className="table-header">Item Description</th>
                                    <th className="table-header">UOM</th>
                                    <th className="table-header">Required Qty</th>
                                    <th className="table-header">Avl. Stock</th>
                                    <th className="table-header">Indent QTY</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {purchaseDetails.map((row, index) => {
                                    const availableItems = itemDetailsList.filter(
                                      (option) => !purchaseDetails.some((data) => data.item === option.item && data.id !== row.id)
                                    );
                                    return (
                                      <tr key={row.id}>
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                purchaseDetails,
                                                setPurchaseDetails,
                                                purchaseDetailsErrors,
                                                setPurchaseDetailsErrors
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
                                            options={availableItems.map((option, index) => ({ ...option, key: index }))}
                                            getOptionLabel={(option) => option.item || ''}
                                            sx={{ width: '100%' }}
                                            size="small"
                                            value={itemDetailsList.find((c) => c.item === row.item) || null}
                                            onChange={(event, newValue) => {
                                              const selectedItem = newValue ? newValue.item : '';
                                              const selectedItemDesc = newValue ? newValue.itemDesc : '';
                                              const selectedItemUnit = newValue ? newValue.primaryUnit : '';
                                              const selectedItemBomQty = newValue ? newValue.bomQty : '';
                                              setPurchaseDetails((prev) =>
                                                prev.map((r) =>
                                                  r.id === row.id
                                                    ? {
                                                        ...r,
                                                        item: selectedItem,
                                                        itemDescription: selectedItemDesc,
                                                        uom: selectedItemUnit,
                                                        reqQty: selectedItemBomQty
                                                      }
                                                    : r
                                                )
                                              );
                                              setPurchaseDetailsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  item: !selectedItem ? 'Item is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Item"
                                                name="item"
                                                error={!!purchaseDetailsErrors[index]?.item}
                                                helperText={purchaseDetailsErrors[index]?.item}
                                                InputProps={{
                                                  ...params.InputProps,
                                                  style: { height: 40, width: 200 }
                                                }}
                                              />
                                            )}
                                          />
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            style={{ width: '150px' }}
                                            disabled
                                            value={row.itemDescription}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setPurchaseDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, itemDescription: value } : r))
                                              );
                                              setPurchaseDetailsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  itemDescription: !value ? 'Item Description is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={
                                              purchaseDetailsErrors[index]?.itemDescription ? 'error form-control' : 'form-control'
                                            }
                                          />
                                          {purchaseDetailsErrors[index]?.itemDescription && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {purchaseDetailsErrors[index].itemDescription}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            disabled
                                            style={{ width: '150px' }}
                                            value={row.uom}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setPurchaseDetails((prev) => prev.map((r) => (r.id === row.id ? { ...r, uom: value } : r)));
                                              setPurchaseDetailsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  uom: !value ? 'UOM is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={purchaseDetailsErrors[index]?.uom ? 'error form-control' : 'form-control'}
                                          />
                                          {purchaseDetailsErrors[index]?.uom && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {purchaseDetailsErrors[index].uom}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            style={{ width: '150px' }}
                                            value={row.reqQty}
                                            onChange={(e) => {
                                              const value = e.target.value;

                                              if (/^\d*$/.test(value)) {
                                                setPurchaseDetails((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, reqQty: value } : r))
                                                );
                                                setPurchaseDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    reqQty: !value ? 'Require Qty is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={purchaseDetailsErrors[index]?.reqQty ? 'error form-control' : 'form-control'}
                                          />
                                          {purchaseDetailsErrors[index]?.reqQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {purchaseDetailsErrors[index].reqQty}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            disabled
                                            style={{ width: '150px' }}
                                            value={row.avlStock}
                                            onChange={(e) => {
                                              const value = e.target.value;

                                              // Allow only numeric values or an empty string
                                              if (/^\d*$/.test(value)) {
                                                setPurchaseDetails((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, avlStock: value } : r))
                                                );
                                                setPurchaseDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    avlStock: !value ? 'Avl Stock is required' : '' // Show error if value is empty
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={purchaseDetailsErrors[index]?.avlStock ? 'error form-control' : 'form-control'}
                                          />
                                          {purchaseDetailsErrors[index]?.avlStock && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {purchaseDetailsErrors[index].avlStock}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            style={{ width: '150px' }}
                                            value={row.indentQty}
                                            onChange={(e) => {
                                              const value = e.target.value;

                                              if (/^\d*$/.test(value)) {
                                                setPurchaseDetails((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, indentQty: value } : r))
                                                );
                                                setPurchaseDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    indentQty: !value ? 'Indent Qty is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={purchaseDetailsErrors[index]?.indentQty ? 'error form-control' : 'form-control'}
                                          />
                                          {purchaseDetailsErrors[index]?.indentQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {purchaseDetailsErrors[index].indentQty}
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
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
                      {purchaseDetails.map((row, index) => (
                        <div className="row d-flex">
                          <div className="col-md-3 mb-3">
                            <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.verifiedBy}>
                              <InputLabel id="verifiedBy">Verified By</InputLabel>
                              <Select
                                labelId="verifiedBy"
                                id="verifiedBy"
                                label="Verified By"
                                onChange={handleInputChange}
                                name="verifiedBy"
                                value={formData.verifiedBy}
                              >
                                <MenuItem value="Head Office">Head Office</MenuItem>
                                <MenuItem value="Branch">Branch</MenuItem>
                              </Select>
                              {fieldErrors.verifiedBy && <FormHelperText>{fieldErrors.verifiedBy}</FormHelperText>}
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="remarks"
                                label={
                                  <span>
                                    Remarks <span className="asterisk"></span>
                                  </span>
                                }
                                name="remarks"
                                size="small"
                                value={formData.remarks || ''} // Ensure value is a string to prevent uncontrolled component issues
                                onChange={(e) => {
                                  const value = e.target.value;

                                  // Update formData directly
                                  setFormData((prev) => ({
                                    ...prev,
                                    remarks: value
                                  }));

                                  // Update documents data if necessary
                                  setPurchaseDetails((prev) => prev.map((r) => (r.id === formData.id ? { ...r, row: value } : r)));

                                  // Update field errors
                                  setPurchaseDetailsErrors((prev) => {
                                    const newErrors = [...prev];
                                    newErrors[index] = {
                                      ...newErrors[index],
                                      row: !value ? 'File Name is required' : ''
                                    };
                                    return newErrors;
                                  });
                                }}
                                inputProps={{ maxLength: 30 }}
                                error={!!fieldErrors.remarks}
                                helperText={fieldErrors.remarks}
                              />
                            </FormControl>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getPurchaseIndentById} />
          )}
        </div>
      </div>
    </>
  );
};
export default PurchaseIndent;
