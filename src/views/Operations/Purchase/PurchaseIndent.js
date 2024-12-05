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
  const [typeName, setTypeName] = useState([]);
  const [indentCustomer, setIndentCustomer] = useState([]);
  const [indentDepartment, setIndentDepartment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    indentNo: '',
    purchaseIndentDate: '',
    customerName: '',
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
    indentNo: '',
    purchaseIndentDate: '',
    customerName: '',
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
    { accessorKey: 'indentNo', header: 'Indent No', size: 140 },
    { accessorKey: 'purchaseIndentDate', header: 'Date', size: 140 },
    { accessorKey: 'itemType', header: 'Indent Type', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'workOrderNo', header: 'Work Order No', size: 140 },
    { accessorKey: 'department', header: 'Department', size: 140 },
    { accessorKey: 'fgPart', header: 'FG Part', size: 140 },
    { accessorKey: 'fgPartDesc', header: 'FG Part Desc', size: 140 },
    { accessorKey: 'fgQty', header: 'FG Qty', size: 140 },
    { accessorKey: 'requestedBy', header: 'Requested By', size: 140 },
    { accessorKey: 'customerPoNo', header: 'Customer PO No', size: 140 }
  ];

  const [indentDocumentsData, setIndentDocumentsData] = useState([
    {
      id: 1,
      item: '',
      description: 'Description',
      uom: 'Description',
      qty: '',
      avlStock: 2,
      indentQty: '',

    }
  ]);
  const [indentDocumentsErrors, setIndentDocumentsErrors] = useState([
    {
      item: '',
      description: '',
      uom: '',
      qty: '',
      avlStock: '',
      indentQty: '',
    }
  ]);

  useEffect(() => {
    getIndendType();
    getAllPurchaseIndent();
    getCustomerName(orgId);
    getIndentDepartment();
  }, []);

  const getIndendType = async () => {
    try {
      const response = await apiCalls('get', `documentType/getIndentType`);
      if (response.status === true) {
        const indentTypeData = response.paramObjectsMap.indentType
          .map(({ id, itemType }) => ({ id, itemType }));
        setTypeName(indentTypeData);
        return indentTypeData;
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const getCustomerName = async (orgId) => {
    try {
      const response = await apiCalls('get', `documentType/getCustomerNameForPurchaseIndent?orgId=${orgId}`);
      if (response.status === true) {
        const indentCustomerData = response.paramObjectsMap.customerNameList
          .map(({ id, customerName }) => ({ id, customerName }));
        setIndentCustomer(indentCustomerData);
        return indentCustomerData;
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const getIndentDepartment = async () => {
    try {
      const response = await apiCalls('get', `documentType/getDepartmentForPurchase`);
      if (response.status === true) {
        const indentDepartmentData = response.paramObjectsMap.department
          .map(({ id, department }) => ({ id, department }));
        setIndentCustomer(indentDepartmentData);
        return indentDepartmentData;
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
        setEditId(row.original.id)
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
            workOrderNo: particularIndent.workOrderNo || '',
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

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Update only the specific field
    }));

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    }

    setFieldErrors({ ...fieldErrors, [name]: '' });

    if (type === 'text' || type === 'textarea') {
      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement && inputElement.setSelectionRange) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.indentNo) {
      errors.indentNo = 'Indent No is required';
    }
    // if (!formData.purchaseIndentDate) {
    //   errors.purchaseIndentDate = 'Date is required';
    // }
    if (!formData.itemType) {
      errors.itemType = 'Indent Type is required';
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
    if (!formData.fgPart) {
      errors.fgPart = 'FG Part is required';
    }
    if (!formData.fgPartDesc) {
      errors.fgPartDesc = 'FG Part Desc is required';
    }
    if (!formData.fgQty) {
      errors.fgQty = 'FG Qty is required';
    }
    if (!formData.requestedBy) {
      errors.requestedBy = 'Requested By is required';
    }
    if (!formData.customerPoNo) {
      errors.customerPoNo = 'Customer PO No is required';
    }
    if (!formData.verifiedBy) {
      errors.verifiedBy = 'Verified By is required';
    }
    if (!formData.remarks) {
      errors.remarks = 'Remarks is required';
    }

    setFieldErrors(errors);


    let indentDocumentsDataValid = true;
    if (!indentDocumentsData || !Array.isArray(indentDocumentsData) || indentDocumentsData.length === 0) {
      indentDocumentsDataValid = false;
      setIndentDocumentsErrors([{ general: 'PurchaseIndent is required' }]);
    } else {
      const newTableErrors = indentDocumentsData.map((row, index) => {
        const rowErrors = {};
        // if (!row.item) {
        //   rowErrors.item = 'Item is required';
        //   indentDocumentsDataValid = false;
        // }
        if (!row.qty) {
          rowErrors.qty = 'Required QTY is required';
          indentDocumentsDataValid = false;
        }
        if (!row.indentQty) {
          rowErrors.indentQty = 'Indent QTY is required';
          indentDocumentsDataValid = false;
        }

        return rowErrors;
      });
      setIndentDocumentsErrors(newTableErrors);
    }
    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && indentDocumentsDataValid) {
      setIsLoading(true);

      const detailsVo = indentDocumentsData.map((row) => ({
        ...(editId && { id: row.id }),
        item: row.item,
        itemDescription: row.description,
        uom: row.uom,
        reqQty: parseInt(row.qty, 10),
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
        finYear: finYear,
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', 'documentType/updateCreatePurchaseIndent', saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'List of values updated successfully' : 'Material Type values created successfully');

          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Material Type value creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Material Type value creation failed');
        setIsLoading(false);
      }
    }

    else {
      setFieldErrors(errors);
    }
  };







  const handleClear = () => {
    setFormData({
      indentNo: '',
      purchaseIndentDate: '',
      itemType: '',
      customerName: "",
      workOrderNo: "",
      department: "",
      fgPart: '',
      fgPartDesc: '',
      fgQty: '',
      requestedBy: '',
      customerPoNo: '',
      orgId: orgId
    });
    setFieldErrors({
      indentNo: false,
    });
    setIndentDocumentsData([{ id: 1, item: '', description: '', uom: '', qty: '', avlStock: '', indentQty: '', verifiedBy: '', remarks: '' }]);
    setIndentDocumentsErrors('');
    setEditId('');
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(indentDocumentsData)) {
      displayRowError(indentDocumentsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      item: '',
      description: '',
      uom: '',
      qty: '',
      avlStock: '',
      indentQty: ''
    };
    setIndentDocumentsData([...indentDocumentsData, newRow]);
    setIndentDocumentsErrors([...indentDocumentsErrors, { item: '', description: '', uom: '', qty: '', avlStock: '', indentQty: '', verifiedBy: '', remarks: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === indentDocumentsData) {
      return !lastRow.item || !lastRow.description || !lastRow.uom || !lastRow.qty || !lastRow.avlStock || !lastRow.indentQty || !lastRow.verifiedBy || !lastRow.remarks;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === indentDocumentsData) {
      setIndentDocumentsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !table[table.length - 1].item ? 'Item is required' : '',
          qty: !table[table.length - 1].qty ? 'Require Qty is required' : '',
          indentQty: !table[table.length - 1].indentQty ? 'Indent Qty is required' : '',
          verifiedBy: !table[table.length - 1].verifiedBy ? 'VerifiedBy is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : '',
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

  // const handleIndentChange = (row, index, event) => {
  //   const value = event.target.value;
  //   const selectedRole = roleList.find((role) => role.role === value);
  //   setIndentDocumentsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
  //   setIndentDocumentsErrors((prev) => {
  //     const newErrors = [...prev];
  //     newErrors[index] = {
  //       ...newErrors[index],
  //       role: !value ? 'Role is required' : ''
  //     };
  //     return newErrors;
  //   });
  // };
  const handleIndentChange = (row, index, event) => {
    const updatedRows = [...indentDocumentsData]; // Clone the data
    updatedRows[index].value = event.target.value; // Update the value
    setIndentDocumentsData(updatedRows); // Update the state
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
    toast.success("File uploded sucessfully")
    console.log('Submit clicked');
    handleBulkUploadClose();
    // getAllData();
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
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
                    required
                    name="indentNo"
                    value={formData.indentNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.indentNo}
                    helperText={fieldErrors.indentNo}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth required>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
                        value={formData.purchaseIndentDate ? dayjs(formData.purchaseIndentDate, 'YYYY-MM-DD') : dayjs()} // Default to current date
                        onChange={(date) => handleDateChange('purchaseIndentDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.purchaseIndentDate}
                        helperText={<span style={{ color: 'red' }}>{fieldErrors.purchaseIndentDate ? 'Date is required' : ''}</span>}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={typeName}
                    getOptionLabel={(option) => option.itemType || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={typeName.find((option) => option.itemType === formData.itemType) || null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'itemType',
                          value: newValue ? newValue.itemType : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Indent Type"
                        name="itemType"
                        error={!!fieldErrors.itemType}
                        helperText={fieldErrors.itemType}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>


                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={indentCustomer}
                    getOptionLabel={(option) => option.customerName || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={
                      formData.customerName
                        ? indentCustomer.find((c) => c.customerName === formData.customerName) || null
                        : null
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'customerName',
                          value: newValue ? newValue.customerName : '',
                        },
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
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.workOrderNo}>
                    <InputLabel id="work-order-label">Work Order No</InputLabel>
                    <Select
                      labelId="work-order-label"
                      label="Work Order No"
                      value={formData.workOrderNo || ''}
                      onChange={(e) => {
                        handleInputChange({
                          target: {
                            name: 'workOrderNo',
                            value: e.target.value,
                          },
                        });
                      }}
                      name="workOrderNo"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {/* Manual selection options */}
                      <MenuItem value="WorkOrder1">Work Order 1</MenuItem>
                      <MenuItem value="WorkOrder2">Work Order 2</MenuItem>
                      <MenuItem value="ManualOption1">Manual Option 1</MenuItem>
                      <MenuItem value="ManualOption2">Manual Option 2</MenuItem>
                    </Select>
                    {fieldErrors.workOrderNo && <FormHelperText>{fieldErrors.workOrderNo}</FormHelperText>}
                  </FormControl>
                </div>


                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={[
                      ...indentDepartment, // Existing options
                      { department: 'Manual Option 1' }, // Manual selection 1
                      { department: 'Manual Option 2' }, // Manual selection 2
                    ]}
                    getOptionLabel={(option) => option.department || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={
                      formData.department
                        ? indentDepartment.find((c) => c.department === formData.department) ||
                        { department: formData.department }
                        : null
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'department',
                          value: newValue?.department || '',
                        },
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
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>


                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="FG Part"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="fgPart"
                    value={formData.fgPart}
                    onChange={handleInputChange}
                    error={!!fieldErrors.fgPart}
                    helperText={fieldErrors.fgPart}
                    inputProps={{ maxLength: 40 }}
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
                    onChange={handleInputChange}
                    error={!!fieldErrors.fgPartDesc}
                    helperText={fieldErrors.fgPartDesc}
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
                    onChange={handleInputChange}
                    error={!!fieldErrors.fgQty}
                    helperText={fieldErrors.fgQty}
                    inputProps={{ maxLength: 15 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea"
                    label="Requested By"
                    variant="outlined"
                    size="small"
                    name="requestedBy"
                    fullWidth
                    value={formData.requestedBy}
                    onChange={handleInputChange}
                    error={!!fieldErrors.requestedBy}
                    helperText={fieldErrors.requestedBy}
                    inputProps={{ maxLength: 15 }}
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
                    onChange={handleInputChange}
                    error={!!fieldErrors.customerPoNo}
                    helperText={fieldErrors.customerPoNo}
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
                          <ActionButton icon={CloudUploadIcon} title='Upload' onClick={handleBulkUploadOpen} />

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
                                  {indentDocumentsData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              indentDocumentsData,
                                              setIndentDocumentsData,
                                              indentDocumentsErrors,
                                              setIndentDocumentsErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row?.value || ''}
                                          style={{ width: '150px' }}
                                          onChange={(e) => handleIndentChange(row, index, e)}
                                          className={`form-control ${indentDocumentsErrors?.[index]?.item ? 'error' : ''}`}
                                        >
                                          <option value="">Select Option</option>
                                          <option value="Select Option1">Select Option1</option>
                                          <option value="Select Option2">Select Option2</option>
                                        </select>
                                        {indentDocumentsErrors?.[index]?.item && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {indentDocumentsErrors[index].item}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          disabled
                                          value={row.description}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setIndentDocumentsData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, description: value } : r))
                                            );
                                            setIndentDocumentsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                description: !value ? 'Item Decreption is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={indentDocumentsErrors[index]?.description ? 'error form-control' : 'form-control'}
                                        />
                                        {indentDocumentsErrors[index]?.description && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {indentDocumentsErrors[index].description}
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
                                            setIndentDocumentsData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, uom: value } : r))
                                            );
                                            setIndentDocumentsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                uom: !value ? 'UOM is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={indentDocumentsErrors[index]?.uom ? 'error form-control' : 'form-control'}
                                        />
                                        {indentDocumentsErrors[index]?.uom && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {indentDocumentsErrors[index].uom}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.qty}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setIndentDocumentsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r))
                                              );
                                              setIndentDocumentsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  qty: !value ? 'Qty is required' : '',
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={indentDocumentsErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                        />
                                        {indentDocumentsErrors[index]?.qty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {indentDocumentsErrors[index].qty}
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
                                              setIndentDocumentsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, avlStock: value } : r))
                                              );
                                              setIndentDocumentsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  avlStock: !value ? 'Avl Stock is required' : '', // Show error if value is empty
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={indentDocumentsErrors[index]?.avlStock ? 'error form-control' : 'form-control'}
                                        />
                                        {indentDocumentsErrors[index]?.avlStock && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {indentDocumentsErrors[index].avlStock}
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
                                              setIndentDocumentsData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, indentQty: value } : r))
                                              );
                                              setIndentDocumentsErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  indentQty: !value ? 'Indent Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={indentDocumentsErrors[index]?.indentQty ? 'error form-control' : 'form-control'}
                                        />
                                        {indentDocumentsErrors[index]?.indentQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {indentDocumentsErrors[index].indentQty}
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
                      {indentDocumentsData.map((row, index) => (
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
                                    remarks: value,
                                  }));

                                  // Update documents data if necessary
                                  setIndentDocumentsData((prev) =>
                                    prev.map((r) =>
                                      r.id === formData.id ? { ...r, row: value } : r
                                    )
                                  );

                                  // Update field errors
                                  setIndentDocumentsErrors((prev) => {
                                    const newErrors = [...prev];
                                    newErrors[index] = {
                                      ...newErrors[index],
                                      row: !value ? 'File Name is required' : '',
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
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getPurchaseIndentById}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default PurchaseIndent;
