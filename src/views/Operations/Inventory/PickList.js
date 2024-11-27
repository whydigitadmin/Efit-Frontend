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

const PickList = () => {
  const [listViewData, setListViewData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
                    fullWidth
                    name="pickListId"
                    value={formData.pickListId}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.pickListId ? 'PickList ID is required' : ''}</span>}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth required>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                    <InputLabel id="customerName-label">Customer Name</InputLabel>
                    <Select labelId="customerName-label" label="customerName" value={formData.customerName} onChange={handleInputChange} name="customerName">
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.routeCardNo}>
                    <InputLabel id="routeCardNo-label">Route Card No</InputLabel>
                    <Select labelId="routeCardNo-label" label="routeCardNo" value={formData.routeCardNo} onChange={handleInputChange} name="routeCardNo">
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.routeCardNo}>
                            {row.routeCardNo}
                          </MenuItem>
                        ))} */}
                    </Select>
                    {fieldErrors.routeCardNo && <FormHelperText>{fieldErrors.routeCardNo}</FormHelperText>}
                  </FormControl>
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
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.workOrderNo ? 'Work Order No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.productionNo}>
                    <InputLabel id="productionNo-label">Item Issue to Production No</InputLabel>
                    <Select labelId="productionNo-label" label="productionNo" value={formData.productionNo} onChange={handleInputChange} name="productionNo">
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.productionNo}>
                            {row.productionNo}
                          </MenuItem>
                        ))} */}
                    </Select>
                    {fieldErrors.productionNo && <FormHelperText>{fieldErrors.productionNo}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.department}>
                    <InputLabel id="department-label">Department</InputLabel>
                    <Select labelId="department-label" label="department" value={formData.department} onChange={handleInputChange} name="department">
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.department}>
                            {row.department}
                          </MenuItem>
                        ))} */}
                    </Select>
                    {fieldErrors.department && <FormHelperText>{fieldErrors.department}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.location}>
                    <InputLabel id="location-label" required>Location</InputLabel>
                    <Select labelId="location-label" label="location" value={formData.location} onChange={handleInputChange} name="location">
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.location}>
                            {row.location}
                          </MenuItem>
                        ))} */}
                    </Select>
                    {fieldErrors.location && <FormHelperText>{fieldErrors.location}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.shift}>
                    <InputLabel id="shift-label">Shift</InputLabel>
                    <Select labelId="shift-label" label="shift" value={formData.shift} onChange={handleInputChange} name="shift">
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.shift}>
                            {row.shift}
                          </MenuItem>
                        ))} */}
                    </Select>
                    {fieldErrors.shift && <FormHelperText>{fieldErrors.shift}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.pickedBy}>
                    <InputLabel id="pickedBy-label">Pickedby</InputLabel>
                    <Select labelId="pickedBy-label" label="pickedBy" value={formData.pickedBy} onChange={handleInputChange} name="pickedBy">
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.pickedBy}>
                            {row.pickedBy}
                          </MenuItem>
                        ))} */}
                    </Select>
                    {fieldErrors.pickedBy && <FormHelperText>{fieldErrors.pickedBy}</FormHelperText>}
                  </FormControl>
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
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.fgPartName ? 'FG Part Name is required' : ''}</span>}
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
                          <div className="col-xl-16">
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
                                      Item Name
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '400px' }}>
                                      Unit
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '600px' }}>
                                      Rack No
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Rack Quantity
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Issued Quantity
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Picked Qty
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Remaining qty
                                    </th>
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
