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

const PickList = () => {
  const [listViewData, setListViewData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [partyList, setPartyList] = useState([]);
  const [listView, setListView] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    pickListId: '',
    pickListDate: '',
    customerName: '',
    routeCardNo: '',
    workOrderNo: '',
    productionNo: '',
    department: '',
    location: '',
    shift: '',
    pickedBy: '',
    fgPartName: '',
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    pickListId: '',
    pickListDate: '',
    customerName: '',
    routeCardNo: '',
    workOrderNo: '',
    productionNo: '',
    department: '',
    location: '',
    shift: '',
    pickedBy: '',
    fgPartName: '',
    orgId: orgId
  });

  const listViewColumns = [
    { accessorKey: 'pickListId', header: 'PickList Id', size: 140 },
    { accessorKey: 'pickListDate', header: 'Date', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'routeCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'workOrderNo', header: 'Work Order No', size: 140 },
    { accessorKey: 'productionNo', header: 'Production No', size: 140 },
    { accessorKey: 'department', header: 'Department', size: 140 },
    { accessorKey: 'location', header: 'Location', size: 140 },
    { accessorKey: 'shift', header: 'Shift', size: 140 },
    { accessorKey: 'pickedBy', header: 'Pickedby', size: 140 },
    { accessorKey: 'fgPartName', header: 'FG Part Name', size: 140 },
  ];

  const [pickListData, setPickListData] = useState([
    {
      id: 1,
      item: '',
      itemName: '',
      unit: '',
      rackNo: '',
      rackQuantity: '',
      issuedQuantity: '',
      pickedQty: '',
      remainingQty: '',
    }
  ]);
  const [pickListErrors, setPickListErrors] = useState([
    {
      item: '',
      itemName: '',
      unit: '',
      rackNo: '',
      rackQuantity: '',
      issuedQuantity: '',
      pickedQty: '',
      remainingQty: '',
    }
  ]);

  const [SummaryData, setSummaryData] = useState([
    {
      id: 1,
      remarks: ''
    }
  ]);
  const [SummaryErrors, setSummaryErrors] = useState([
    {
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

    if (!formData.pickListId) {
      errors.pickListId = 'PickList Id is required';
    }
    if (!formData.pickListDate) {
      errors.pickListDate = 'Date is required';
    }
    if (!formData.customerName) {
      errors.customerName = 'Customer Name is required';
    }
    if (!formData.routeCardNo) {
      errors.routeCardNo = 'Route Card No is required';
    }
    if (!formData.workOrderNo) {
      errors.workOrderNo = 'Work Order No is required';
    }
    if (!formData.productionNo) {
      errors.productionNo = 'Item Issue to Production No is required';
    }
    if (!formData.department) {
      errors.department = 'Department is required';
    }
    if (!formData.location) {
      errors.location = 'Location is required';
    }
    if (!formData.shift) {
      errors.shift = 'Shift is required';
    }
    if (!formData.pickedBy) {
      errors.pickedBy = 'Pickedby is required';
    }
    if (!formData.fgPartName) {
      errors.fgPartName = 'FG Part Name is required';
    }
    if (!formData.remarks) {
      errors.remarks = 'Remarks is required';
    }

    setFieldErrors(errors);

    let pickListDataValid = true;
    if (!pickListData || !Array.isArray(pickListData) || pickListData.length === 0) {
      pickListDataValid = false;
      setPickListErrors([{ general: 'PurchaseIndent is required' }]);
    } else {
      const newTableErrors = pickListData.map((row, index) => {
        const rowErrors = {};
        if (!row.item) {
          rowErrors.item = 'Item is required';
          pickListDataValid = false;
        }
        if (!row.itemName) {
          rowErrors.itemName = 'Item Name is required';
          pickListDataValid = false;
        }
        if (!row.unit) {
          rowErrors.unit = 'Unit is required';
          pickListDataValid = false;
        }
        if (!row.rackNo) {
          rowErrors.rackNo = 'Rack No is required';
          pickListDataValid = false;
        }
        if (!row.rackQuantity) {
          rowErrors.rackQuantity = 'Rack Quantity is required';
          pickListDataValid = false;
        }
        if (!row.issuedQuantity) {
          rowErrors.issuedQuantity = 'Issued Quantity is required';
          pickListDataValid = false;
        }
        if (!row.pickedQty) {
          rowErrors.pickedQty = 'Picked Qty is required';
          pickListDataValid = false;
        }
        if (!row.remainingQty) {
          rowErrors.remainingQty = 'Remaining Qty is required';
          pickListDataValid = false;
        }

        return rowErrors;
      });
      setPickListErrors(newTableErrors);
    }
    setFieldErrors(errors);


    if (Object.keys(errors).length === 0 && pickListDataValid) {
      setIsLoading(true);

      const encryptedPassword = encryptPassword('Wds@2022');
      const branchVo = pickListData.map((row) => ({
        branchCode: row.branchCode,
        branch: row.branch
      }));

      const saveFormData = {
        ...(editId && { id: formData.docId }),
        userName: formData.userName,
        ...(!editId && { password: encryptedPassword }),
        pickListId: formData.pickListId,
        pickListDate: formData.pickListDate,
        customerName: formData.customerName,
        routeCardNo: formData.routeCardNo,
        workOrderNo: formData.workOrderNo,
        productionNo: formData.productionNo,
        department: formData.department,
        location: formData.location,
        shift: formData.shift,
        pickedBy: formData.pickedBy,
        fgPartName: formData.fgPartName,
        orgId: orgId,
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
      pickListId: '',
      pickListDate: '',
      customerName: '',
      routeCardNo: '',
      workOrderNo: '',
      productionNo: '',
      department: "",
      location: "",
      shift: "",
      pickedBy: '',
      fgPartName: '',
      orgId: orgId
    });
    setFieldErrors({
      pickListId: false,
      pickListDate: false,
      customerName: false,
      routeCardNo: false,
      workOrderNo: false,
      productionNo: false,
      department: false,
      location: false,
      shift: false,
      pickedBy: false,
      fgPartName: false,
    });
    setPickListData([{ id: 1, item: '', itemName: '', unit: '', rackNo: '', rackQuantity: '', issuedQuantity: '', pickedQty: '', remainingQty: '', remarks: '' }]);
    setSummaryData([{ remarks: '' }])
    setPickListErrors('');
    setSummaryErrors('');
    setEditId('');
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(pickListData)) {
      displayRowError(pickListData);
      return;
    }
    const newRow = {
      id: Date.now(),
      item: '',
      itemName: '',
      unit: '',
      rackNo: '',
      rackQuantity: '',
      issuedQuantity: '',
      pickedQty: '',
      remainingQty: ''
    };
    setPickListData([...pickListData, newRow]);
    setPickListErrors([...pickListErrors, { item: '', itemName: '', unit: '', rackNo: '', rackQuantity: '', issuedQuantity: '', pickedQty: '', remainingQty: '', remarks: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === pickListData) {
      return !lastRow.item || !lastRow.itemName || !lastRow.unit || !lastRow.rackNo || !lastRow.rackQuantity || !lastRow.issuedQuantity || !lastRow.pickedQty || !lastRow.remainingQty;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === pickListData) {
      setPickListErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !table[table.length - 1].item ? 'Item is required' : '',
          itemName: !table[table.length - 1].itemName ? 'Item Name is required' : '',
          unit: !table[table.length - 1].unit ? 'Unit is required' : '',
          rackNo: !table[table.length - 1].rackNo ? 'Reck No is required' : '',
          rackQuantity: !table[table.length - 1].rackQuantity ? 'Rack Quantity is required' : '',
          issuedQuantity: !table[table.length - 1].issuedQuantity ? 'Issued Quantity is required' : '',
          pickedQty: !table[table.length - 1].pickedQty ? 'Picked Qty is required' : '',
          remainingQty: !table[table.length - 1].remainingQty ? 'Remaining Qty is required' : '',
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable = [], setErrorTable) => {
    // Ensure `table` and `errorTable` are arrays
    if (!Array.isArray(table) || !Array.isArray(errorTable)) {
      console.error("Invalid table or errorTable format. Both must be arrays.");
      return;
    }

    const rowIndex = table.findIndex((row) => row.id === id);

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
    setPickListData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setSummaryData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setPickListErrors((prev) => {
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
                    label="PickList ID"
                    variant="outlined"
                    size="small"
                    required
                    disabled
                    fullWidth
                    name="pickListId"
                    value={formData.pickListId}
                    onChange={handleInputChange}
                    // helperText={<span style={{ color: 'red' }}>{fieldErrors.pickListId ? 'PickList ID is required' : ''}</span>}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth required>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
                        disabled
                        value={formData.pickListDate ? dayjs(formData.pickListDate, 'YYYY-MM-DD') : dayjs()} // Default to current date
                        onChange={(date) => handleDateChange('pickListDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.pickListDate}
                        helperText={<span style={{ color: 'red' }}>{fieldErrors.pickListDate ? 'Date is required' : ''}</span>}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.customerName ? partyList.find((c) => c.partyname === formData.customerName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'customerName',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer Name"
                        name="customerName"
                        error={!!fieldErrors.customerName}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.customerName} // Displays the error message
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

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Work Order No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="workOrderNo"
                    value={formData.workOrderNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.workOrderNo}
                    helperText={fieldErrors.workOrderNo}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.productionNo ? partyList.find((c) => c.partyname === formData.productionNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'productionNo',
                          value: newValue ? newValue.partyname : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Item Issue to Production No"
                        name="productionNo"
                        error={!!fieldErrors.productionNo}
                        helperText={fieldErrors.productionNo}
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
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.department ? partyList.find((c) => c.partyname === formData.department) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'department',
                          value: newValue ? newValue.partyname : '',
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
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.location ? partyList.find((c) => c.partyname === formData.location) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'location',
                          value: newValue ? newValue.partyname : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Location"
                        name="location"
                        error={!!fieldErrors.location}
                        helperText={fieldErrors.location}
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
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.shift ? partyList.find((c) => c.partyname === formData.shift) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'shift',
                          value: newValue ? newValue.partyname : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Shift"
                        name="shift"
                        error={!!fieldErrors.shift}
                        helperText={fieldErrors.shift}
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
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.pickedBy ? partyList.find((c) => c.partyname === formData.pickedBy) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'pickedBy',
                          value: newValue ? newValue.partyname : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Pickedby"
                        name="pickedBy"
                        error={!!fieldErrors.pickedBy}
                        helperText={fieldErrors.pickedBy}
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
                    label="FG Part Name"
                    variant="outlined"
                    size="small"
                    required
                    fullWidth
                    name="fgPartName"
                    value={formData.fgPartName}
                    onChange={handleInputChange}
                    error={!!fieldErrors.fgPartName}
                    helperText={fieldErrors.fgPartName}
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
                    <Tab value={0} label="Putaway Details" />
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
                          <div className="col-xl-12">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Item</th>
                                    <th className="table-header">Item Name</th>
                                    <th className="table-header">Unit</th>
                                    <th className="table-header">Rack No</th>
                                    <th className="table-header">Rack Quantity</th>
                                    <th className="table-header">Issued Quantity</th>
                                    <th className="table-header">Picked Qty</th>
                                    <th className="table-header">Remaining qty</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {pickListData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              pickListData,
                                              setPickListData,
                                              pickListErrors,
                                              setPickListErrors
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
                                          style={{ width: '150px' }}
                                          onChange={(e) => handleIndentChange(row, index, e)}
                                          className={pickListErrors[index]?.role ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Option</option>
                                          {/* {getAvailableRoles(row.id).map((role) => (
                                            <option key={role.id} value={role.role}>
                                              {role.role}
                                            </option>
                                          ))} */}
                                        </select>
                                        {pickListErrors[index]?.item && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {pickListErrors[index].item}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.itemName}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPickListData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, itemName: value } : r))
                                            );
                                            setPickListErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemName: !value ? 'Item Name is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={pickListErrors[index]?.itemName ? 'error form-control' : 'form-control'}
                                        />
                                        {pickListErrors[index]?.itemName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {pickListErrors[index].itemName}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          disabled
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.unit}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPickListData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r))
                                            );
                                            setPickListErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unit: !value ? 'Unit is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={pickListErrors[index]?.unit ? 'error form-control' : 'form-control'}
                                        />
                                        {pickListErrors[index]?.unit && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {pickListErrors[index].unit}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.rackNo}
                                          style={{ width: '150px' }}
                                          onChange={(e) => handleIndentChange(row, index, e)}
                                          className={pickListErrors[index]?.role ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Option</option>
                                          {/* {getAvailableRoles(row.id).map((role) => (
                                            <option key={role.id} value={role.role}>
                                              {role.role}
                                            </option>
                                          ))} */}
                                        </select>
                                        {pickListErrors[index]?.rackNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {pickListErrors[index].rackNo}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.rackQuantity}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            // Allow only numbers or an empty string for validation
                                            if (/^\d*$/.test(value)) {
                                              setPickListData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, rackQuantity: value } : r))
                                              );
                                              setPickListErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  rackQuantity: !value ? 'Rec Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={pickListErrors[index]?.rackQuantity ? 'error form-control' : 'form-control'}
                                        />
                                        {pickListErrors[index]?.rackQuantity && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {pickListErrors[index].rackQuantity}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.issuedQuantity}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            // Allow only numeric values or an empty string
                                            if (/^\d*$/.test(value)) {
                                              setPickListData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, issuedQuantity: value } : r))
                                              );
                                              setPickListErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  issuedQuantity: !value ? 'Putaway Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={pickListErrors[index]?.issuedQuantity ? 'error form-control' : 'form-control'}
                                        />
                                        {pickListErrors[index]?.issuedQuantity && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {pickListErrors[index].issuedQuantity}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.pickedQty}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPickListData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, pickedQty: value } : r))
                                              );
                                              setPickListErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  pickedQty: !value ? 'Picked Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={pickListErrors[index]?.pickedQty ? 'error form-control' : 'form-control'}
                                        />
                                        {pickListErrors[index]?.pickedQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {pickListErrors[index].pickedQty}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.remainingQty}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPickListData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, remainingQty: value } : r))
                                              );
                                              setPickListErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  remainingQty: !value ? 'Remaining Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={pickListErrors[index]?.remainingQty ? 'error form-control' : 'form-control'}
                                        />
                                        {pickListErrors[index]?.remainingQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {pickListErrors[index].remainingQty}
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
                      {SummaryData.map((row, index) => (
                        <div className="row d-flex">

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
                                  setSummaryData((prev) =>
                                    prev.map((r) =>
                                      r.id === formData.id ? { ...r, row: value } : r
                                    )
                                  );

                                  // Update field errors
                                  setSummaryErrors((prev) => {
                                    const newErrors = [...prev];
                                    newErrors[index] = {
                                      ...newErrors[index],
                                      row: !value ? 'Remarks is required' : '',
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
export default PickList;
