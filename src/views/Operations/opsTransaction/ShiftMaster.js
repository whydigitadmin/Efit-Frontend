import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
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

const ShiftMaster = () => {
  const [listViewData, setListViewData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);


  const [formData, setFormData] = useState({
    shiftName: '',
    shiftType: '',
    shiftCode: '',
    fromHour: '',
    toHour: '',
    timing: '',
    active: true,
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    shiftName: '',
    shiftType: '',
    shiftCode: '',
    fromHour: '',
    toHour: '',
    timing: '',
    active: '',
    orgId: orgId
  });

  const listViewColumns = [
    { accessorKey: 'shiftName', header: 'Shift Name', size: 140 },
    { accessorKey: 'shiftType', header: 'Shift Type', size: 140 },
    { accessorKey: 'shiftCode', header: 'Shift Code', size: 140 },
    { accessorKey: 'fromHour', header: 'From Hour', size: 140 },
    { accessorKey: 'toHour', header: 'To Hour', size: 140 },
    { accessorKey: 'timing', header: 'Timing', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 },
  ];

  const [shiftMasterData, setShiftMasterData] = useState([
    {
      id: 1,
      timing: '',
    }
  ]);
  const [shiftMasterErrors, setShiftMasterErrors] = useState([
    {
      timing: '',
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

    if (!formData.shiftName) {
      errors.shiftName = 'Shift Name is required';
    }
    if (!formData.shiftType) {
      errors.shiftType = 'Shift Type is required';
    }
    if (!formData.shiftCode) {
      errors.shiftCode = 'Shift Code is required';
    }
    if (!formData.fromHour) {
      errors.fromHour = 'From hour is required';
    }
    if (!formData.toHour) {
      errors.toHour = 'To Hour is required';
    }
    if (!formData.timing) {
      errors.timing = 'Timing is required';
    }


    setFieldErrors(errors);


    let shiftMasterDataValid = true;
    if (!shiftMasterData || !Array.isArray(shiftMasterData) || shiftMasterData.length === 0) {
      shiftMasterDataValid = false;
      setShiftMasterErrors([{ general: 'PurchaseIndent is required' }]);
    } else {
      const newTableErrors = shiftMasterData.map((row, index) => {
        const rowErrors = {};
        if (!row.timing) {
          rowErrors.timing = 'Timing is required';
          shiftMasterDataValid = false;
        }

        return rowErrors;
      });
      setShiftMasterErrors(newTableErrors);
    }
    setFieldErrors(errors);


    if (Object.keys(errors).length === 0 && shiftMasterDataValid) {
      setIsLoading(true);

      const encryptedPassword = encryptPassword('Wds@2022');
      const branchVo = shiftMasterData.map((row) => ({
        branchCode: row.branchCode,
        branch: row.branch
      }));

      const saveFormData = {
        ...(editId && { id: formData.docId }),
        userName: formData.userName,
        ...(!editId && { password: encryptedPassword }),
        shiftName: formData.shiftName,
        shiftType: formData.shiftType,
        shiftCode: formData.shiftCode,
        fromHour: formData.fromHour,
        toHour: formData.toHour,
        timing: formData.timing,
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
      shiftName: '',
      shiftType: '',
      shiftCode: '',
      fromHour: '',
      toHour: '',
      timing: '',
      orgId: orgId
    });
    setFieldErrors({
      shiftName: false,
      shiftType: false,
      shiftCode: false,
      fromHour: false,
      toHour: false,
      timing: false,
    });
    setShiftMasterData([{ id: 1, timing: '' }]);
    setShiftMasterErrors('');
    setEditId('');
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(shiftMasterData)) {
      displayRowError(shiftMasterData);
      return;
    }

    const newRow = {
      id: Date.now(),
      timing: '',
    };

    setShiftMasterData([...shiftMasterData, newRow]);
    setShiftMasterErrors([...shiftMasterErrors, { timing: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    return !lastRow.timing;
  };

  const displayRowError = (table) => {
    setShiftMasterErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[table.length - 1] = {
        ...newErrors[table.length - 1],
        timing: !table[table.length - 1].timing ? 'Timing is required' : '',
      };
      return newErrors;
    });
  };


  const handleDeleteRow = (id, table, setTable, errorTable = [], setErrorTable) => {
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
    shiftMasterData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setShiftMasterErrors((prev) => {
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
                    label="Shift Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="shiftName"
                    value={formData.shiftName}
                    onChange={handleInputChange}
                    error={!!fieldErrors.shiftName}
                    helperText={fieldErrors.shiftName}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Shift Type"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="shiftType"
                    value={formData.shiftType}
                    onChange={handleInputChange}
                    error={!!fieldErrors.shiftType}
                    helperText={fieldErrors.shiftType}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Shift Code"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="shiftCode"
                    value={formData.shiftCode}
                    onChange={handleInputChange}
                    error={!!fieldErrors.shiftCode}
                    helperText={fieldErrors.shiftCode}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="From hour"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="fromHour"
                    value={formData.fromHour}
                    onChange={handleInputChange}
                    error={!!fieldErrors.fromHour}
                    helperText={fieldErrors.fromHour}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="To Hour"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="toHour"
                    value={formData.toHour}
                    onChange={handleInputChange}
                    error={!!fieldErrors.toHour}
                    helperText={fieldErrors.toHour}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Timing"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="timing"
                    value={formData.timing}
                    onChange={handleInputChange}
                    error={!!fieldErrors.timing}
                    helperText={fieldErrors.timing}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControlLabel
                    control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" defaultChecked />}
                    label="Active"
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
                    <Tab value={0} label="Shift Timing Details" />
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
                          <div className="col-lg-8">
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
                                      Timing
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {shiftMasterData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              shiftMasterData,
                                              setShiftMasterData,
                                              shiftMasterErrors,
                                              setShiftMasterErrors
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
                                          value={row.timing}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            shiftMasterData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, timing: value } : r))
                                            );
                                            setShiftMasterErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                timing: !value ? 'Timing is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={shiftMasterErrors[index]?.timing ? 'error form-control' : 'form-control'}
                                        />
                                        {shiftMasterErrors[index]?.timing && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {shiftMasterErrors[index].timing}
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
export default ShiftMaster;
