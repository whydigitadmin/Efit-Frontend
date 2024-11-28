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

const DailyPatrolInspection = () => {
  const [listViewData, setListViewData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [partyList, setPartyList] = useState([]);
  const [listView, setListView] = useState(false);
  const [lstView, setLstView] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    dpiNo: '',
    dpiDate: '',
    routeCardNo: '',
    partNo: '',
    partName: '',
    drgNo: '',
    shift: '',
    machineNo: '',
    machineName: '',
    time: '',
    jobOrderNo: '',
    documentFormatNo: '',
    scIssueNo: '',
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    dpiNo: '',
    dpiDate: '',
    routeCardNo: '',
    partNo: '',
    partName: '',
    drgNo: '',
    shift: '',
    machineNo: '',
    machineName: '',
    time: '',
    jobOrderNo: '',
    documentFormatNo: '',
    scIssueNo: '',
    orgId: orgId
  });

  const listViewColumns = [
    { accessorKey: 'dpiNo', header: 'DPI No', size: 140 },
    { accessorKey: 'dpiDate', header: 'DPI Date', size: 140 },
    { accessorKey: 'routeCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'partNo', header: 'Part No', size: 140 },
    { accessorKey: 'partName', header: 'Part Name', size: 140 },
    { accessorKey: 'drgNo', header: 'DRG No', size: 140 },
    { accessorKey: 'shift', header: 'Shift', size: 140 },
    { accessorKey: 'machineNo', header: 'Machine No', size: 140 },
    { accessorKey: 'machineName', header: 'Machine Name', size: 140 },
    { accessorKey: 'time', header: 'Time', size: 140 },
    { accessorKey: 'jobOrderNo', header: 'Job Order No', size: 140 },
    { accessorKey: 'documentFormatNo', header: 'Document Format No', size: 140 },
    { accessorKey: 'scIssueNo', header: 'SC Issue No', size: 140 },
  ];

  const [patrolInspectionData, setPatrolInspectionData] = useState([
    {
      id: 1,
      characteristic: '',
      methodOfInspetion: '',
      specification: '',
      lsl: '',
      usl: '',
      sampleOne: '',
      sampleTwo: '',
      sampleThree: '',
      sampleFour: '',
      sampleFive: '',
      sampleSix: '',
      sampleSeven: '',
      sampleEight: '',
      sampleNine: '',
      sampleTen: '',
      status: '',
      remarks: '',
      quotationAmount: '',
      deliveryDate: '',
    }
  ]);
  const [patrolInspectionErrors, setPatrolInspectionErrors] = useState([
    {
      characteristic: '',
      methodOfInspetion: '',
      specification: '',
      lsl: '',
      usl: '',
      sampleOne: '',
      sampleTwo: '',
      sampleThree: '',
      sampleFour: '',
      sampleFive: '',
      sampleSix: '',
      sampleSeven: '',
      sampleEight: '',
      sampleNine: '',
      sampleTen: '',
      status: '',
      remarks: ''
    }
  ]);

  const [inspectionFinalData, setInspectionFinalData] = useState([
    {
      id: 1,
      remarks: '',
      inspectionBy: '',
      incharge: '',
      narration: ''
    }
  ]);
  const [quotationTaxErrors, setQuotationTaxErrors] = useState([
    {
      remarks: '',
      inspectionBy: '',
      incharge: '',
      narration: ''
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

    if (!formData.dpiNo) {
      errors.dpiNo = 'DPI No is required';
    }
    if (!formData.dpiDate) {
      errors.dpiDate = 'DPI Date is required';
    }
    if (!formData.routeCardNo) {
      errors.routeCardNo = 'Route Card No is required';
    }
    if (!formData.partNo) {
      errors.partNo = 'Part No is required';
    }
    if (!formData.partName) {
      errors.partName = 'Part Name is required';
    }
    if (!formData.drgNo) {
      errors.drgNo = 'DRG No is required';
    }
    if (!formData.shift) {
      errors.shift = 'Shft is required';
    }
    if (!formData.machineNo) {
      errors.machineNo = 'Machine No is required';
    }
    if (!formData.machineName) {
      errors.machineName = 'Machine Name is required';
    }
    if (!formData.time) {
      errors.time = 'Time is required';
    }
    if (!formData.jobOrderNo) {
      errors.jobOrderNo = 'Job Order No is required';
    }
    if (!formData.documentFormatNo) {
      errors.documentFormatNo = 'Document Format No is required';
    }
    if (!formData.scIssueNo) {
      errors.scIssueNo = 'SC Issue No is required';
    }

    setFieldErrors(errors);

    let patrolInspectionDataValid = true;
    let inspectionFinalDataValid = true;
    if (!patrolInspectionData || !Array.isArray(patrolInspectionData) || patrolInspectionData.length === 0) {
      patrolInspectionDataValid = false;
      setPatrolInspectionErrors([{ general: 'PurchaseIndent is required' }]);
    } else {
      const newTableErrors = patrolInspectionData.map((row, index) => {
        const rowErrors = {};
        if (!row.characteristic) {
          rowErrors.characteristic = 'Characteristic is required';
          patrolInspectionDataValid = false;
        }
        if (!row.methodOfInspetion) {
          rowErrors.methodOfInspetion = 'Method Of Inspetion is required';
          patrolInspectionDataValid = false;
        }
        if (!row.specification) {
          rowErrors.specification = 'Specification is required';
          patrolInspectionDataValid = false;
        }
        if (!row.lsl) {
          rowErrors.lsl = 'LSL is required';
          patrolInspectionDataValid = false;
        }
        if (!row.usl) {
          rowErrors.usl = 'USL is required';
          patrolInspectionDataValid = false;
        }
        if (!row.sampleOne) {
          rowErrors.sampleOne = 'Sample 1 is required';
          patrolInspectionDataValid = false;
        }
        if (!row.sampleTwo) {
          rowErrors.sampleTwo = 'Sample 2 is required';
          patrolInspectionDataValid = false;
        }
        if (!row.sampleThree) {
          rowErrors.sampleThree = 'Sample 3 is required';
          patrolInspectionDataValid = false;
        }
        if (!row.sampleFour) {
          rowErrors.sampleFour = 'Sample 4 is required';
          patrolInspectionDataValid = false;
        }
        if (!row.sampleFive) {
          rowErrors.sampleFive = 'Sample 5 is required';
          patrolInspectionDataValid = false;
        }
        if (!row.sampleSix) {
          rowErrors.sampleSix = 'Sample 6 is required';
          patrolInspectionDataValid = false;
        }
        if (!row.sampleSeven) {
          rowErrors.sampleSeven = 'Sample 7 is required';
          patrolInspectionDataValid = false;
        }
        if (!row.sampleEight) {
          rowErrors.sampleEight = 'Sample 8 is required';
          patrolInspectionDataValid = false;
        }
        if (!row.sampleNine) {
          rowErrors.sampleNine = 'Sample 9 is required';
          patrolInspectionDataValid = false;
        }
        if (!row.sampleTen) {
          rowErrors.sampleTen = 'Sample 10 is required';
          patrolInspectionDataValid = false;
        }
        if (!row.status) {
          rowErrors.status = 'Discount Amount is required';
          patrolInspectionDataValid = false;
        }
        if (!row.remarks) {
          rowErrors.remarks = 'remarks is required';
          patrolInspectionDataValid = false;
        }

        return rowErrors;
      });
      setPatrolInspectionErrors(newTableErrors);
    }
    setFieldErrors(errors);


    if (Object.keys(errors).length === 0 && patrolInspectionDataValid) {
      setIsLoading(true);

      const encryptedPassword = encryptPassword('Wds@2022');
      const branchVo = patrolInspectionData.map((row) => ({
        branchCode: row.branchCode,
        branch: row.branch
      }));

      const saveFormData = {
        ...(editId && { id: formData.docId }),
        userName: formData.userName,
        ...(!editId && { password: encryptedPassword }),
        dpiNo: formData.dpiNo,
        dpiDate: formData.dpiDate,
        routeCardNo: formData.routeCardNo,
        partNo: formData.partNo,
        partName: formData.partName,
        drgNo: formData.drgNo,
        shift: formData.shift,
        machineNo: formData.machineNo,
        machineName: formData.machineName,
        time: formData.time,
        jobOrderNo: formData.jobOrderNo,
        documentFormatNo: formData.documentFormatNo,
        scIssueNo: formData.scIssueNo,
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
      dpiNo: '',
      dpiDate: '',
      routeCardNo: '',
      partNo: '',
      partName: '',
      drgNo: '',
      shift: "",
      machineNo: "",
      machineName: "",
      time: "",
      jobOrderNo: '',
      documentFormatNo: '',
      scIssueNo: '',
      orgId: orgId
    });
    setFieldErrors({
      dpiNo: false,
      dpiDate: false,
      routeCardNo: false,
      partNo: false,
      partName: false,
      drgNo: false,
      shift: false,
      machineNo: false,
      machineName: false,
      time: false,
      jobOrderNo: false,
      documentFormatNo: false,
      scIssueNo: false,
    });
    setPatrolInspectionData([{ id: 1, characteristic: '', methodOfInspetion: '', specification: '', lsl: '', usl: '', sampleOne: '', sampleTwo: '', sampleThree: '', sampleFour: '', sampleFive: '', sampleSix: '', sampleSeven: '', sampleEight: '', sampleNine: '', sampleTen: '', status: '', remarks: '' }]);
    setInspectionFinalData([{ remarks: '', inspectionBy: '', incharge: '', narration: '' }])
    setPatrolInspectionErrors('');
    setQuotationTaxErrors('');
    setEditId('');
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(patrolInspectionData)) {
      displayRowError(patrolInspectionData);
      return;
    }
    const newRow = {
      id: Date.now(),
      characteristic: '',
      methodOfInspetion: '',
      specification: '',
      lsl: '',
      usl: '',
      sampleOne: '',
      sampleTwo: '',
      sampleThree: '',
      sampleFour: '',
      sampleFive: '',
      sampleSix: '',
      sampleSeven: '',
      sampleEight: '',
      sampleNine: '',
      sampleTen: '',
      status: '',
      remarks: ''
    };
    setPatrolInspectionData([...patrolInspectionData, newRow]);
    setPatrolInspectionErrors([...patrolInspectionErrors, { characteristic: '', methodOfInspetion: '', specification: '', lsl: '', usl: '', sampleOne: '', sampleTwo: '', sampleThree: '', sampleFour: '', sampleFive: '', sampleSix: '', sampleSeven: '', sampleEight: '', sampleNine: '', sampleTen: '', status: '', remarks: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === patrolInspectionData) {
      return !lastRow.characteristic || !lastRow.methodOfInspetion || !lastRow.specification || !lastRow.lsl || !lastRow.usl || !lastRow.amount || !lastRow.discount || !lastRow.status || !lastRow.remarks || !lastRow.quotationAmount || !lastRow.tax;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === patrolInspectionData) {
      setPatrolInspectionErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          characteristic: !table[table.length - 1].characteristic ? 'Characteristic is required' : '',
          methodOfInspetion: !table[table.length - 1].methodOfInspetion ? 'Method of Inspetion is required' : '',
          specification: !table[table.length - 1].specification ? 'Specification is required' : '',
          lsl: !table[table.length - 1].lsl ? 'LSL is required' : '',
          usl: !table[table.length - 1].usl ? 'USL is required' : '',
          sampleOne: !table[table.length - 1].sampleOne ? 'Sample 1 is required' : '',
          status: !table[table.length - 1].status ? 'Status is required' : '',
          remarks: !table[table.length - 1].remarks ? 'remarks is required' : '',
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
    setPatrolInspectionData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setInspectionFinalData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setPatrolInspectionErrors((prev) => {
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
                    label="DPI No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="dpiNo"
                    value={formData.dpiNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.dpiNo ? 'DPI No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth required>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="DPI Date"
                        disabled
                        value={formData.dpiDate ? dayjs(formData.dpiDate, 'YYYY-MM-DD') : dayjs()} // Default to current date
                        onChange={(date) => handleDateChange('dpiDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.dpiDate}
                        helperText={<span style={{ color: 'red' }}>{fieldErrors.dpiDate ? 'Date is required' : ''}</span>}
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
                    label="Part No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="partNo"
                    value={formData.partNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.partNo ? 'Part No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Part Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="partName"
                    value={formData.partName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.partName ? 'Part Name is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="DRG No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="drgNo"
                    value={formData.drgNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.drgNo ? 'Sub Contractor Name is required' : ''}</span>}
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
                    value={formData.shift ? partyList.find((c) => c.partyname === formData.shift) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'shift',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Shift"
                        name="shift"
                        error={!!fieldErrors.shift}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.shift} // Displays the error message
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
                    value={formData.machineNo ? partyList.find((c) => c.partyname === formData.machineNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'machineNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Machine No"
                        name="machineNo"
                        error={!!fieldErrors.machineNo}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.shimachineNoft} // Displays the error message
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
                    label="Machine Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineName"
                    value={formData.machineName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineName ? 'Machine Name is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Time"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.time ? 'Time is required' : ''}</span>}
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
                    value={formData.jobOrderNo ? partyList.find((c) => c.partyname === formData.jobOrderNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'jobOrderNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Job Order no"
                        name="jobOrderNo"
                        error={!!fieldErrors.jobOrderNo}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.jobOrderNo} // Displays the error message
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
                    label="Document Format No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="documentFormatNo"
                    value={formData.documentFormatNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.documentFormatNo ? 'Document Format No is required' : ''}</span>}
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
                    <Tab value={0} label="Daily Patrol Inspection Details" />
                    <Tab value={1} label="Daily Patrol Inspection Final" />
                    <Tab value={2} label="Summary" />
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
                                    <th className="table-header">Characteristic</th>
                                    <th className="table-header">Method of Inspetion</th>
                                    <th className="table-header">Specification</th>
                                    <th className="table-header">LSL</th>
                                    <th className="table-header">USL</th>
                                    <th className="table-header">Sample 1</th>
                                    <th className="table-header">Sample 2</th>
                                    <th className="table-header">Sample 3</th>
                                    <th className="table-header">Sample 4</th>
                                    <th className="table-header">Sample 5</th>
                                    <th className="table-header">Sample 6</th>
                                    <th className="table-header">Sample 7</th>
                                    <th className="table-header">Sample 8</th>
                                    <th className="table-header">Sample 9</th>
                                    <th className="table-header">Sample 10</th>
                                    <th className="table-header">Status</th>
                                    <th className="table-header">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {patrolInspectionData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="col-md-1 border px-2 py-2 text-center">
                                        <ActionButton
                                          className=" mb-2"
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              patrolInspectionData,
                                              setPatrolInspectionData,
                                              patrolInspectionErrors,
                                              setPatrolInspectionErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.characteristic}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPatrolInspectionData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, characteristic: value } : r))
                                            );
                                            setPatrolInspectionErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                characteristic: !value ? 'Characteristic is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={patrolInspectionErrors[index]?.characteristic ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.characteristic && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].characteristic}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          disabled
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.methodOfInspetion}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPatrolInspectionData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, methodOfInspetion: value } : r))
                                            );
                                            setPatrolInspectionErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                methodOfInspetion: !value ? 'Method of Inspetion is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={patrolInspectionErrors[index]?.methodOfInspetion ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.methodOfInspetion && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].methodOfInspetion}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          disabled
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.specification}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setPatrolInspectionData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, specification: value } : r))
                                            );
                                            setPatrolInspectionErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                specification: !value ? 'Specification is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={patrolInspectionErrors[index]?.specification ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.specification && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].specification}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.lsl}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            // Allow only numbers or an empty string for validation
                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, lsl: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  lsl: !value ? 'LSL is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.lsl ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.lsl && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].lsl}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.usl}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            // Allow only numeric values or an empty string
                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, usl: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  usl: !value ? 'Putaway Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.usl ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.usl && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].usl}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.sampleOne}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sampleOne: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sampleOne: !value ? 'Sample 1 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.sampleOne ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.sampleOne && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].sampleOne}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.sampleTwo}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sampleTwo: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sampleTwo: !value ? 'Sample 2 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.sampleTwo ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.sampleTwo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].sampleTwo}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.sampleThree}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sampleThree: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sampleThree: !value ? 'Sample 3 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.sampleThree ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.sampleThree && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].sampleThree}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.sampleFour}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sampleFour: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sampleFour: !value ? 'Sample 4 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.sampleFour ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.sampleFour && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].sampleFour}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.sampleFive}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sampleFive: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sampleFive: !value ? 'Sample 5 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.sampleFive ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.sampleFive && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].sampleFive}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.sampleSix}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sampleSix: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sampleSix: !value ? 'Sample 6 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.sampleSix ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.sampleSix && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].sampleSix}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.sampleSeven}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sampleSeven: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sampleSeven: !value ? 'Sample 7 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.sampleSeven ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.sampleSeven && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].sampleSeven}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.sampleEight}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sampleEight: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sampleEight: !value ? 'Sample 8 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.sampleEight ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.sampleEight && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].sampleEight}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.sampleNine}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sampleNine: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sampleNine: !value ? 'Sample 9 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.sampleNine ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.sampleNine && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].sampleNine}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.sampleTen}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sampleTen: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sampleTen: !value ? 'Sample 10 is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.sampleTen ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.sampleTen && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].sampleTen}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.status}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, status: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  status: !value ? 'Status is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.remainingQty ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.status && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].status}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.remarks}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setPatrolInspectionData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                              );
                                              setPatrolInspectionErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  remarks: !value ? 'Remarks is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={patrolInspectionErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                        />
                                        {patrolInspectionErrors[index]?.remarks && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {patrolInspectionErrors[index].remarks}
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
                      {inspectionFinalData.map((row, index) => (
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
                                  setInspectionFinalData((prev) =>
                                    prev.map((r) =>
                                      r.id === formData.id ? { ...r, row: value } : r
                                    )
                                  );

                                  // Update field errors
                                  setQuotationTaxErrors((prev) => {
                                    const newErrors = [...prev];
                                    newErrors[index] = {
                                      ...newErrors[index],
                                      row: !value ? 'Gross Amount is required' : '',
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

                          <div className="col-md-3 mb-3">
                            <Autocomplete
                              disablePortal
                              options={partyList.map((option, index) => ({ ...option, key: index }))}
                              getOptionLabel={(option) => option.partyname || ''}
                              sx={{ width: '100%' }}
                              size="small"
                              value={formData.inspectionBy ? partyList.find((c) => c.partyname === formData.inspectionBy) : null}
                              onChange={(event, newValue) => {
                                handleInputChange({
                                  target: {
                                    name: 'inspectionBy',
                                    value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                  },
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Inspection By"
                                  name="inspectionBy"
                                  error={!!fieldErrors.inspectionBy}  // Shows error if supplierName has a value in fieldErrors
                                  helperText={fieldErrors.inspectionBy} // Displays the error message
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
                              value={formData.incharge ? partyList.find((c) => c.partyname === formData.incharge) : null}
                              onChange={(event, newValue) => {
                                handleInputChange({
                                  target: {
                                    name: 'incharge',
                                    value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                  },
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Incharge"
                                  name="incharge"
                                  error={!!fieldErrors.incharge}  // Shows error if supplierName has a value in fieldErrors
                                  helperText={fieldErrors.incharge} // Displays the error message
                                  InputProps={{
                                    ...params.InputProps,
                                    style: { height: 40 },
                                  }}
                                />
                              )}
                            />
                          </div>

                        </div>
                      ))}
                    </>
                  )}

                  {value === 2 && (
                    <>
                      {inspectionFinalData.map((row, index) => (
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
                                value={formData.narration || ''} // Ensure value is a string to prevent uncontrolled component issues
                                onChange={(e) => {
                                  const value = e.target.value;

                                  // Update formData directly
                                  setFormData((prev) => ({
                                    ...prev,
                                    narration: value,
                                  }));

                                  // Update documents data if necessary
                                  setInspectionFinalData((prev) =>
                                    prev.map((r) =>
                                      r.id === formData.id ? { ...r, row: value } : r
                                    )
                                  );

                                  // Update field errors
                                  setQuotationTaxErrors((prev) => {
                                    const newErrors = [...prev];
                                    newErrors[index] = {
                                      ...newErrors[index],
                                      row: !value ? 'Gross Amount is required' : '',
                                    };
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
export default DailyPatrolInspection;
