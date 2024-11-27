import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
// import { getAllActiveBranches, getAllActiveRoles } from 'utils/CommonFunctions';
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
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    indentNo: '',
    purchaseIndentDate: '',
    indentType: '',
    customerName: '',
    workOrderNo: '',
    department: '',
    fgPart: '',
    fgPartDesc: '',
    fgQty: '',
    requestedBy: '',
    customerPONo: '',
    verifiedBy: '',
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    indentNo: '',
    purchaseIndentDate: '',
    indentType: '',
    customerName: '',
    workOrderNo: '',
    department: '',
    fgPart: '',
    fgPartDesc: '',
    fgQty: '',
    requestedBy: '',
    customerPONo: '',
    verifiedBy: '',
    orgId: orgId
  });

  const listViewColumns = [
    { accessorKey: 'indentNo', header: 'Indent No', size: 140 },
    { accessorKey: 'purchaseIndentDate', header: 'Date', size: 140 },
    { accessorKey: 'indentType', header: 'Indent Type', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'workOrderNo', header: 'Work Order No', size: 140 },
    { accessorKey: 'department', header: 'Department', size: 140 },
    { accessorKey: 'fgPart', header: 'FG Part', size: 140 },
    { accessorKey: 'fgPartDesc', header: 'FG Part Desc', size: 140 },
    { accessorKey: 'fgQty', header: 'FG Qty', size: 140 },
    { accessorKey: 'requestedBy', header: 'Requested By', size: 140 },
    { accessorKey: 'customerPONo', header: 'Customer PO No', size: 140 }
  ];

  const [indentDocumentsData, setIndentDocumentsData] = useState([
    {
      id: 1,
      item: '',
      description: '',
      uom: '',
      qty: '',
      avlStock: '',
      indentQty: '',
      verifiedBy: '',
      remarks: ''
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
      verifiedBy: '',
      remarks: ''
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    if (name === 'indentNo' || name === 'customerPONo') {
      if (!/^\d*$/.test(value)) {
        return;
      }
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    }

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


  // const getAllRoles = async () => {
  //   try {
  //     const branchData = await getAllActiveRoles(orgId);
  //     setRoleList(branchData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };
  // const getAllBranches = async () => {
  //   try {
  //     const branchData = await getAllActiveBranches(orgId);
  //     setBranchList(branchData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };

  // const getAllUsers = async () => {
  //   try {
  //     const response = await apiCalls('get', `/master/getAllEmployeeByOrgId?orgId=${orgId}`);
  //     console.log('API Response:', response);

  //     if (response.status === true) {
  //       setEmpList(response.paramObjectsMap.employeeVO);
  //     } else {
  //       console.error('API Error:', response);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // const getAllUserCreation = async () => {
  //   try {
  //     const response = await apiCalls('get', `/auth/allUsersByOrgId?orgId=${orgId}`);
  //     console.log('API Response:', response);

  //     if (response.status === true) {
  //       setListViewData(response.paramObjectsMap.userVO);
  //     } else {
  //       console.error('API Error:', response);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };


  const handleSave = async () => {
    const errors = {};

    if (!formData.indentNo) {
      errors.indentNo = 'Indent No is required';
    }
    if (!formData.purchaseIndentDate) {
      errors.purchaseIndentDate = 'Date is required';
    }
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
    if (!formData.customerPONo) {
      errors.customerPONo = 'Customer PO No is required';
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
        if (!row.item) {
          rowErrors.item = 'Item is required';
          indentDocumentsDataValid = false;
        }
        if (!row.description) {
          rowErrors.description = 'Decription is required';
          indentDocumentsDataValid = false;
        }
        if (!row.uom) {
          rowErrors.uom = 'UOM is required';
          indentDocumentsDataValid = false;
        }
        if (!row.qty) {
          rowErrors.qty = 'Required QTY is required';
          indentDocumentsDataValid = false;
        }
        if (!row.avlStock) {
          rowErrors.avlStock = 'Avl Stock is required';
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

      const encryptedPassword = encryptPassword('Wds@2022');
      const branchVo = indentDocumentsData.map((row) => ({
        branchCode: row.branchCode,
        branch: row.branch
      }));

      const saveFormData = {
        ...(editId && { id: formData.docId }),
        userName: formData.userName,
        ...(!editId && { password: encryptedPassword }),
        indentNo: formData.indentNo,
        purchaseIndentDate: formData.purchaseIndentDate,
        indentType: formData.indentType,
        customerName: formData.customerName,
        workOrderNo: formData.workOrderNo,
        department: formData.department,
        fgPart: formData.fgPart,
        fgPartDesc: formData.fgPartDesc,
        fgQty: formData.fgQty,
        requestedBy: formData.requestedBy,
        customerPONo: formData.customerPONo,
        orgId: orgId,
        branchAccessDTOList: branchVo
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `auth/signup`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'User Updated Successfully' : 'User created successfully');
          handleClear();
          // getAllUsers();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'User creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'User creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleClear = () => {
    setFormData({
      indentNo: '',
      purchaseIndentDate: '',
      indentType: '',
      customerName: "",
      workOrderNo: "",
      department: "",
      fgPart: '',
      fgPartDesc: '',
      fgQty: '',
      requestedBy: '',
      customerPONo: '',
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
          description: !table[table.length - 1].description ? 'Item Description is required' : '',
          uom: !table[table.length - 1].uom ? 'UOM is required' : '',
          qty: !table[table.length - 1].qty ? 'Require Qty is required' : '',
          avlStock: !table[table.length - 1].avlStock ? 'Avl Stock is required' : '',
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

  const handleIndentChange = (row, index, event) => {
    const value = event.target.value;
    const selectedRole = roleList.find((role) => role.role === value);
    setIndentDocumentsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setIndentDocumentsErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        role: !value ? 'Role is required' : ''
      };
      return newErrors;
    });
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
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.indentNo ? 'Indent No is required' : ''}</span>}
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.indentType}>
                    <InputLabel id="indentType-label" required>Indent Type</InputLabel>
                    <Select labelId="indentType-label" label="indentType" value={formData.indentType} onChange={handleInputChange} name="indentType" required>
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.indentType}>
                            {row.indentType}
                          </MenuItem>
                        ))} */}
                    </Select>
                    {fieldErrors.indentType && <FormHelperText>{fieldErrors.indentType}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                    <InputLabel id="country-label">Customer Name</InputLabel>
                    <Select labelId="country-label" label="customerName" value={formData.customerName} onChange={handleInputChange} name="customerName">
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.customerName}>
                            {row.customerName}
                          </MenuItem>
                        ))} */}
                    </Select>
                    {fieldErrors.customerName && <FormHelperText>{fieldErrors.customerName}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.workOrderNo}>
                    <InputLabel id="country-label">Work Order No</InputLabel>
                    <Select labelId="country-label" label="workOrderNo" value={formData.workOrderNo} onChange={handleInputChange} name="workOrderNo">
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.workOrderNo}>
                            {row.workOrderNo}
                          </MenuItem>
                        ))} */}
                    </Select>
                    {fieldErrors.workOrderNo && <FormHelperText>{fieldErrors.workOrderNo}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.department}>
                    <InputLabel id="country-label">Department</InputLabel>
                    <Select labelId="country-label" label="department" value={formData.department} onChange={handleInputChange} name="department">
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.department}>
                            {row.department}
                          </MenuItem> */}
                      {/* ))} */}
                    </Select>
                    {fieldErrors.department && <FormHelperText>{fieldErrors.department}</FormHelperText>}
                  </FormControl>
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
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.fgPart ? 'FG Part is required' : ''}</span>}
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
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.fgPartDesc ? 'FG Part Desc is required' : ''}</span>}
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
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.fgQty ? 'FG Qty is required' : ''}</span>}
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
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.requestedBy ? 'Requested By is required' : ''}</span>}
                    inputProps={{ maxLength: 15 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea"
                    label="Customer PO No"
                    variant="outlined"
                    size="small"
                    name="customerPONo"
                    fullWidth
                    value={formData.customerPONo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerPONo ? 'Customer PO No is required' : ''}</span>}
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
                          <div className="col-lg-11">
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
                                    <th className="px-4 py-2 text-white text-center" style={{ width: '700px' }} >
                                      Item
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '400px' }}>
                                      Item Description
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      UOM
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Required Qty
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Avl. Stock
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Indent QTY
                                    </th>
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
                                          value={row.item}
                                          onChange={(e) => handleIndentChange(row, index, e)}
                                          className={indentDocumentsErrors[index]?.role ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Option</option>
                                          {/* {getAvailableRoles(row.id).map((role) => (
                                            <option key={role.id} value={role.role}>
                                              {role.role}
                                            </option>
                                          ))} */}
                                        </select>
                                        {indentDocumentsErrors[index]?.item && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {indentDocumentsErrors[index].item}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
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
                                          value={row.qty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setIndentDocumentsData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r))
                                            );
                                            setIndentDocumentsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qty: !value ? 'Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
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
                                          value={row.avlStock}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setIndentDocumentsData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, avlStock: value } : r))
                                            );
                                            setIndentDocumentsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                avlStock: !value ? 'Avl Stock is required' : ''
                                              };
                                              return newErrors;
                                            });
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
                                          value={row.indentQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
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
            // toEdit={getUserById} 
            />
          )}
        </div>
      </div>
    </>
  );
};
export default PurchaseIndent;
