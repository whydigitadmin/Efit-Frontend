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

const Putaway = () => {
  const [listViewData, setListViewData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [putawayDocId, setPutawayDocId] = useState('');
  const [fromLocation, setFromLocation] = useState([]);
  const [rackNo, setRackNo] = useState('');

  const [formData, setFormData] = useState({
    docDate: '',
    grnNo: '',
    grnDate: '',
    supplier: '',
    vehicleNo: '',
    fromLocation: '',
    toLocation: '',
    goodsType: '',
    dcInvNo: '',
    narration: '',
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: '',
    grnNo: '',
    grnDate: '',
    supplier: '',
    vehicleNo: '',
    fromLocation: '',
    toLocation: '',
    goodsType: '',
    dcInvNo: '',
    narration: '',
    orgId: orgId
  });

  const listViewColumns = [
    { accessorKey: 'putawayDocId', header: 'Putaway ID', size: 140 },
    { accessorKey: 'docDate', header: 'Date', size: 140 },
    { accessorKey: 'grnNo', header: 'GRN No', size: 140 },
    { accessorKey: 'grnDate', header: 'GRN Date', size: 140 },
    { accessorKey: 'supplier', header: 'Supplier', size: 140 },
    { accessorKey: 'vehicleNo', header: 'vehicleNo', size: 140 },
    { accessorKey: 'fromLocation', header: 'From Location', size: 140 },
    { accessorKey: 'toLocation', header: 'To Location', size: 140 },
    { accessorKey: 'goodsType', header: 'Goods Type', size: 140 },
    { accessorKey: 'dcInvNo', header: 'DC/INV-No', size: 140 },
  ];

  const [putawayData, setPutawayData] = useState([
    {
      id: 1,
      item: '',
      description: '',
      unit: '',
      recQty: '',
      putawayQty: '',
    }
  ]);
  const [putawayErrors, setPutawayErrors] = useState([
    {
      item: '',
      description: '',
      unit: '',
      recQty: '',
      putawayQty: '',
    }
  ]);

  useEffect(() => {
    getPutAwayDocId();
    getLocationCode(orgId);
    if (orgId) {
      getRackNo(orgId, setRackNo);
    }
    getAllPutAway();
  }, [orgId]);

  const getPutAwayDocId = async () => {
    try {
      const response = await apiCalls('get', `/inventory/getPutawayDocId?orgId=${orgId}`);

      // Update state with the new docId
      setPutawayDocId(response.paramObjectsMap.putawayDocId);

      // Optionally update formData if docId is part of it
      setFormData((prevFormData) => ({
        ...prevFormData,
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getLocationCode = async (orgId) => {
    try {
      const response = await apiCalls('get', `inventory/getLocationCodeForPutaway?orgId=${orgId}`);
      if (response.status === true) {
        const locationData = response.paramObjectsMap.putawayVO
          .map(({ id, locationCode }) => ({ id, locationCode }));
        setFromLocation(locationData);
        return locationData;
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const getRackNo = async (orgId, setRackNo) => {
    try {
      const response = await apiCalls('get', `inventory/getRackNoForPutaway?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true && Array.isArray(response.paramObjectsMap.putawayVO)) {
        const rackData = response.paramObjectsMap.putawayVO.map(({ rackNo }) => ({ rackNo }));
        console.log('Rack Data:', rackData);
        setRackNo(rackData);
        return rackData;
      } else {
        console.error('API Error or unexpected response structure:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const getAllPutAway = async () => {
    try {
      const response = await apiCalls('get', `inventory/getPutawayByOrgId?orgId=${orgId}`);

      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.putawayVO.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


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

  const handleSave = async () => {
    const errors = {};

    if (!formData.putawayDocId) {
      errors.putawayDocId = 'Putaway ID is required';
    }
    if (!formData.docDate) {
      errors.docDate = 'Date is required';
    }
    if (!formData.grnNo) {
      errors.grnNo = 'GRN No is required';
    }
    if (!formData.grnDate) {
      errors.grnDate = 'GRN Date is required';
    }
    if (!formData.supplier) {
      errors.supplier = 'Supplier is required';
    }
    if (!formData.vehicleNo) {
      errors.vehicleNo = 'Vehicle No is required';
    }
    if (!formData.fromLocation) {
      errors.fromLocation = 'From Location is required';
    }
    if (!formData.toLocation) {
      errors.toLocation = 'To Location is required';
    }
    if (!formData.goodsType) {
      errors.goodsType = 'Goods Type is required';
    }
    if (!formData.dcInvNo) {
      errors.dcInvNo = 'DC/INV-No is required';
    }
    if (!formData.narration) {
      errors.narration = 'Narration is required';
    }


    setFieldErrors(errors);


    let putawayDataValid = true;
    if (!putawayData || !Array.isArray(putawayData) || putawayData.length === 0) {
      putawayDataValid = false;
      setPutawayErrors([{ general: 'PurchaseIndent is required' }]);
    } else {
      const newTableErrors = putawayData.map((row, index) => {
        const rowErrors = {};
        if (!row.item) {
          rowErrors.item = 'Item is required';
          putawayDataValid = false;
        }
        if (!row.description) {
          rowErrors.description = 'Item Decription is required';
          putawayDataValid = false;
        }
        if (!row.unit) {
          rowErrors.unit = 'Unit is required';
          putawayDataValid = false;
        }
        if (!row.recQty) {
          rowErrors.recQty = 'Rec Qty is required';
          putawayDataValid = false;
        }
        if (!row.putawayQty) {
          rowErrors.putawayQty = 'Putaway Qty is required';
          putawayDataValid = false;
        }
        if (!row.rackNo) {
          rowErrors.rackNo = 'Rack No is required';
          putawayDataValid = false;
        }

        return rowErrors;
      });
      setPutawayErrors(newTableErrors);
    }
    setFieldErrors(errors);


    if (Object.keys(errors).length === 0 && putawayDataValid) {
      setIsLoading(true);

      const encryptedPassword = encryptPassword('Wds@2022');
      const branchVo = putawayData.map((row) => ({
        branchCode: row.branchCode,
        branch: row.branch
      }));

      const saveFormData = {
        ...(editId && { id: formData.putawayDocId }),
        userName: formData.userName,
        ...(!editId && { password: encryptedPassword }),
        docDate: formData.docDate,
        grnNo: formData.grnNo,
        grnDate: formData.grnDate,
        supplier: formData.supplier,
        vehicleNo: formData.vehicleNo,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        goodsType: formData.goodsType,
        dcInvNo: formData.dcInvNo,
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
      docDate: '',
      grnNo: '',
      grnDate: '',
      supplier: '',
      vehicleNo: '',
      fromLocation: "",
      toLocation: "",
      goodsType: "",
      dcInvNo: '',
      narration: '',
      orgId: orgId
    });
    setFieldErrors({
      docDate: false,
      grnNo: false,
      grnDate: false,
      supplier: false,
      vehicleNo: false,
      fromLocation: false,
      toLocation: false,
      goodsType: false,
      dcInvNo: false,
    });
    setPutawayData([{ id: 1, item: '', description: '', unit: '', recQty: '', putawayQty: '', rackNo: '', narration: '' }]);
    setPutawayErrors('');
    setEditId('');
    getPutAwayDocId();
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(putawayData)) {
      displayRowError(putawayData);
      return;
    }
    const newRow = {
      id: Date.now(),
      item: '',
      description: '',
      unit: '',
      recQty: '',
      putawayQty: '',
      rackNo: ''
    };
    setPutawayData([...putawayData, newRow]);
    setPutawayErrors([...putawayErrors, { item: '', description: '', unit: '', recQty: '', putawayQty: '', rackNo: '', narration: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === putawayData) {
      return !lastRow.item || !lastRow.description || !lastRow.unit || !lastRow.recQty || !lastRow.putawayQty || !lastRow.rackNo;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === putawayData) {
      setPutawayErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !table[table.length - 1].item ? 'Item is required' : '',
          description: !table[table.length - 1].description ? 'Item Decription is required' : '',
          unit: !table[table.length - 1].unit ? 'Unit is required' : '',
          recQty: !table[table.length - 1].recQty ? 'Rec Qty is required' : '',
          putawayQty: !table[table.length - 1].putawayQty ? 'Putaway Qty is required' : '',
          rackNo: !table[table.length - 1].rackNo ? 'Rack No is required' : '',
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

    // Check if roleList and the selectedRole are defined before using them
    if (!roleList || value === '') {
      setPutawayData((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: null } : r))
      );
      setPutawayErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          role: !value ? 'Role is required' : ''
        };
        return newErrors;
      });
      return;
    }

    const selectedRole = roleList.find((role) => role.role === value);

    if (!selectedRole) {
      console.error('Role not found in roleList:', value);
      return;
    }

    setPutawayData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? { ...r, role: value, roleId: selectedRole.id }
          : r
      )
    );

    setPutawayErrors((prev) => {
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
                    label="Putaway ID"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="putawayDocId"
                    value={putawayDocId}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth required>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.grnNo}>
                    <InputLabel id="grnNo-label">GRN No</InputLabel>
                    <Select labelId="grnNo-label" label="grnNo" value={formData.grnNo} onChange={handleInputChange} name="grnNo" required>
                      {/* {Array.isArray(countryList) &&
                        countryList?.map((row) => (
                          <MenuItem key={row.id} value={row.grnNo}>
                            {row.grnNo}
                          </MenuItem>
                        ))} */}
                    </Select>
                    {fieldErrors.grnNo && <FormHelperText>{fieldErrors.grnNo}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="GRN Date"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="grnDate"
                    value={formData.grnDate}
                    onChange={handleInputChange}
                    error={!!fieldErrors.grnDate}
                    helperText={fieldErrors.grnDate}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Supplier"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    error={!!fieldErrors.supplier}
                    helperText={fieldErrors.supplier}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Vehicle No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.vehicleNo}
                    helperText={fieldErrors.vehicleNo}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={fromLocation}
                    getOptionLabel={(option) => option.locationCode || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={
                      formData.fromLocation
                        ? fromLocation.find((c) => c.locationCode === formData.fromLocation)
                        : null
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'fromLocation',
                          value: newValue ? newValue.locationCode : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="From Location"
                        name="fromLocation"
                        error={!!fieldErrors.fromLocation}
                        helperText={fieldErrors.fromLocation}
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
                    options={fromLocation.filter(
                      (option) => option.locationCode !== formData.fromLocation
                    )}
                    getOptionLabel={(option) => option.locationCode || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={
                      formData.toLocation
                        ? fromLocation.find((c) => c.locationCode === formData.toLocation)
                        : null
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'toLocation',
                          value: newValue ? newValue.locationCode : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="To Location"
                        name="toLocation"
                        error={!!fieldErrors.toLocation}
                        helperText={fieldErrors.toLocation}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.goodsType}>
                    <InputLabel id="goodsType">Goods Type</InputLabel>
                    <Select
                      labelId="goodsType"
                      id="goodsType"
                      label="Color Code"
                      onChange={handleInputChange}
                      name="goodsType"
                      value={formData.goodsType}
                    >
                      <MenuItem value="RAW MATERIAL">RAW MATERIAL</MenuItem>
                      <MenuItem value="TOOLS">TOOLS</MenuItem>
                    </Select>
                    {fieldErrors.goodsType && <FormHelperText>{fieldErrors.goodsType}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="DC/INV-No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="dcInvNo"
                    value={formData.dcInvNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.dcInvNo}
                    helperText={fieldErrors.dcInvNo}
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
                          <div className="col-lg-15">
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
                                      Unit
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Rec Qty
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Putaway Qty
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '400px' }}>
                                      Rack No
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {putawayData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              putawayData,
                                              setPutawayData,
                                              putawayErrors,
                                              setPutawayErrors
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
                                          className={putawayErrors[index]?.role ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Option</option>
                                          <option value="">Select Option1</option>
                                          <option value="">Select Option2</option>
                                          {/* {getAvailableRoles(row.id).map((role) => (
                                            <option key={role.id} value={role.role}>
                                              {role.role}
                                            </option>
                                          ))} */}
                                        </select>
                                        {putawayErrors[index]?.item && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {putawayErrors[index].item}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.description}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPutawayData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, description: value } : r))
                                            );
                                            setPutawayErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                description: !value ? 'Item Decreption is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={putawayErrors[index]?.description ? 'error form-control' : 'form-control'}
                                        />
                                        {putawayErrors[index]?.description && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {putawayErrors[index].description}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.unit}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPutawayData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r))
                                            );
                                            setPutawayErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unit: !value ? 'Unit is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={putawayErrors[index]?.unit ? 'error form-control' : 'form-control'}
                                        />
                                        {putawayErrors[index]?.unit && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {putawayErrors[index].unit}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.recQty}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            // Allow only numbers or an empty string for validation
                                            if (/^\d*$/.test(value)) {
                                              setPutawayData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, recQty: value } : r))
                                              );
                                              setPutawayErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  recQty: !value ? 'Rec Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={putawayErrors[index]?.recQty ? 'error form-control' : 'form-control'}
                                        />
                                        {putawayErrors[index]?.recQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {putawayErrors[index].recQty}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.putawayQty}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPutawayData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, putawayQty: value } : r))
                                              );
                                              setPutawayErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  putawayQty: !value ? 'Putaway Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={putawayErrors[index]?.putawayQty ? 'error form-control' : 'form-control'}
                                        />
                                        {putawayErrors[index]?.putawayQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {putawayErrors[index].putawayQty}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.rackNo}
                                          style={{ width: '150px' }}
                                          onChange={(e) => handleIndentChange(row, index, e)}
                                          className={putawayErrors[index]?.rackNo ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Option</option>
                                          {Array.isArray(rackNo) && rackNo.map((rack) => (
                                            <option key={rack.id} value={rack.rackNo}>
                                              {rack.rackNo}
                                            </option>
                                          ))}
                                        </select>
                                        {putawayErrors[index]?.rackNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {putawayErrors[index].rackNo}
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
                      <div className="row d-flex">
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="narration"
                              label={
                                <span>
                                  Narration <span className="asterisk"></span>
                                </span>
                              }
                              name="narration"
                              size="small"
                              value={formData.narration || ''}
                              onChange={(e) => {
                                const value = e.target.value;

                                // Update formData directly
                                setFormData((prev) => ({
                                  ...prev,
                                  narration: value,
                                }));

                                // Assuming formData is an array and you are updating a specific index
                                // Replace 'index' with the actual value or calculate it if needed
                                const currentIndex = formData.findIndex((r) => r.id === formData.id);

                                setFormData((prev) =>
                                  prev.map((r, i) =>
                                    i === currentIndex ? { ...r, row: value } : r
                                  )
                                );

                                setFieldErrors((prev) => {
                                  const newErrors = [...prev];
                                  if (currentIndex >= 0) {
                                    newErrors[currentIndex] = {
                                      ...newErrors[currentIndex],
                                      row: !value ? 'Narration is required' : '',
                                    };
                                  }
                                  return newErrors;
                                });
                              }}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.narration}
                              helperText={fieldErrors.narration}
                            />
                          </FormControl>
                        </div>
                      </div>

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
export default Putaway;
