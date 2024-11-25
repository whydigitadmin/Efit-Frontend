import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { getAllActiveBranches, getAllActiveRoles } from 'utils/CommonFunctions';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { encryptPassword } from 'views/utilities/passwordEnc';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ShiftMaster = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [listViewData, setListViewData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [dataToEdit, setDataToEdit] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [roleDataSelect, setRoleDataSelect] = useState([]);
  const [value, setValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [empList, setEmpList] = useState([]);

  const [formData, setFormData] = useState({
    shiftName: '',
    shiftType: '',
    fromHour: '',
    toHour: '',
    timing: '',
    active: true,
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    shiftName: '',
    shiftType: '',
    fromHour: '',
    toHour: '',
    timing: '',
    active: false,
    orgId: orgId
  });

  const listViewColumns = [
    { accessorKey: 'shiftName', header: 'Shift Name', size: 140 },
    { accessorKey: 'shiftType', header: 'Shift Type', size: 140 },
    { accessorKey: 'fromHour', header: 'From Hour', size: 140 },
    { accessorKey: 'toHour', header: 'To Hour', size: 140 },
    { accessorKey: 'timing', header: 'Timing', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [branchTableData, setBranchTableData] = useState([
    {
      id: 1,
      branchCode: '',
      branch: ''
    }
  ]);
  const [branchTableErrors, setBranchTableErrors] = useState([
    {
      branchCode: '',
      branch: ''
    }
  ]);
  const [roleTableData, setRoleTableData] = useState([{ id: 1, role: '', roleId: '', startDate: null, endDate: null }]);
  const [roleTableDataErrors, setRoleTableDataErrors] = useState([
    {
      role: '',
      roleId: '',
      startDate: '',
      endDate: ''
    }
  ]);

  useEffect(() => {
    getAllUsers();
    getAllBranches();
    getAllRoles();
    getAllUserCreation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    // Regex validation rules
    const nameRegex = /^[A-Za-z ]*$/;
    const numericRegex = /^[0-9]*$/;

    let errorMessage = '';

    // Validation based on input name
    switch (name) {
      case 'employeeName':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only alphabetic characters are allowed';
        }
        break;
      case 'mobile':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only numeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;

      default:
        break;
    }

    // Set error message if any
    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      // Special cases for checkboxes and other inputs
      if (name === 'active' || name === 'allIndiaAccess') {
        setFormData({ ...formData, [name]: checked });
      } else if (name === 'email') {
        setFormData({ ...formData, [name]: value.toLowerCase() });
      } else if (name === 'employeeCode') {
        // Find the selected employee from empList based on employeeCode
        const selectedEmp = empList.find((emp) => emp.employeeCode === value);
        if (selectedEmp) {
          setFormData((prevData) => ({
            ...prevData,
            shiftName: selectedEmp.shiftName,
            shiftType: selectedEmp.shiftType,
            fromHour: selectedEmp.fromHour,
            toHour: selectedEmp.toHour,
            timing: selectedEmp.timing,
          }));
        }
      } else {
        setFormData({ ...formData, [name]: value.toUpperCase() });
      }

      // Clear error message for valid input
      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Preserve the cursor position for text-based inputs
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  // Handling Select's onChange
  const handleSelectChange = (e) => {
    const value = e.target.value; // Get the selected value (employeeCode)
    console.log('Selected employeeCode value:', value);
    console.log('Full empList:', empList); // Log the entire list to verify the structure

    // Log each item in the empList to confirm the field names
    empList.forEach((emp, index) => {
      console.log(`Employee ${index}:`, emp);
    });

    // Find the selected employee from empList based on employeeCode
    const selectedEmp = empList.find((emp) => emp.employeeCode === value); // Check if 'empCode' is correct

    if (selectedEmp) {
      console.log('Selected Employee:', selectedEmp);
      setFormData((prevData) => ({
        ...prevData,
        shiftName: selectedEmp.shiftName,
        shiftType: selectedEmp.shiftType,
        fromHour: selectedEmp.fromHour,
        toHour: selectedEmp.toHour,
        timing: selectedEmp.timing,
      }));
    } else {
      console.log('No employee found with the given code:', value); // Log if no employee is found
    }
  };

  const getAllRoles = async () => {
    try {
      const branchData = await getAllActiveRoles(orgId);
      setRoleList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await apiCalls('get', `/master/getAllEmployeeByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setEmpList(response.paramObjectsMap.employeeVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllUserCreation = async () => {
    try {
      const response = await apiCalls('get', `/auth/allUsersByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.userVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getUserById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `auth/getUserById?userId=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularUser = response.paramObjectsMap.userVO;
        const foundBranch1 = branchList.find((branch) => branch.branchCode === particularUser.branchAccessibleVO.branchcode);
        console.log('THE FOUND BRANCH 1 IS:', foundBranch1);

        setFormData({
          shiftName: particularUser.shiftName,
          shiftType: particularUser.shiftType,
          fromHour: particularUser.fromHour,
          toHour: particularUser.toHour,
          timing: particularUser.timing,
          active: particularUser.active === 'Active' ? true : false
        });
        setRoleTableData(
          particularUser.roleAccessVO.map((role) => ({
            id: role.id,
            role: role.role,
            // roleId: role.roleId,
            startDate: role.startDate,
            endDate: role.endDate
          }))
        );

        const alreadySelectedBranch = particularUser.branchAccessibleVO.map((role) => {
          const foundBranch = branchList.find((branch) => branch.branchCode === role.branchcode);
          console.log(`Searching for branch with code ${role.branchcode}:`, foundBranch);
          return {
            id: role.id,
            branchCode: foundBranch ? foundBranch.branchCode : 'Not Found',
            branch: foundBranch.branch ? foundBranch.branch : 'Not Found'
          };
        });
        setBranchTableData(alreadySelectedBranch);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.shiftName) {
      errors.shiftName = 'Shift Name is required';
    }
    if (!formData.shiftType) {
      errors.shiftType = 'Shift Type is required';
    }
    if (!formData.fromHour) {
      errors.fromHour = 'From Hour is required';
    }
    if (!formData.toHour) {
      errors.toHour = 'To hour is required';
    }
    if (!formData.timing) {
      errors.timing = 'Timing is required';
    }

    let roleTableDataValid = true;
    const newTableErrors = roleTableData.map((row) => {
      const rowErrors = {};
      if (!row.role) {
        rowErrors.role = 'Role is required';
        roleTableDataValid = false;
      }
      if (!row.startDate) {
        rowErrors.startDate = 'Start Date is required';
        roleTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setRoleTableDataErrors(newTableErrors);

    let branchTableDataValid = true;
    const newTableErrors1 = branchTableData.map((row) => {
      const rowErrors = {};
      if (!row.branchCode) {
        rowErrors.branchCode = 'Branch Code is required';
        branchTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);

    setBranchTableErrors(newTableErrors1);

    if (Object.keys(errors).length === 0 && roleTableDataValid && branchTableDataValid) {
      setIsLoading(true);

      const encryptedPassword = encryptPassword('Wds@2022');
      const roleVo = roleTableData.map((row) => ({
        // ...(editId && { id: row.id }),
        role: row.role,
        roleId: row.roleId,
        startDate: dayjs(row.startDate).format('YYYY-MM-DD'),
        endDate: row.endDate ? dayjs(row.endDate).format('YYYY-MM-DD') : null
      }));
      const branchVo = branchTableData.map((row) => ({
        // ...(editId && { id: row.id }),
        branchCode: row.branchCode,
        branch: row.branch
      }));

      const saveFormData = {
        ...(editId && { id: formData.docId }),
        userName: formData.userName,
        ...(!editId && { password: encryptedPassword }),
        shiftName: formData.shiftName,
        shiftType: formData.shiftType,
        fromHour: formData.fromHour,
        toHour: formData.toHour,
        timing: formData.timing,
        active: formData.active === 'Active' ? true : false,
        orgId: orgId,
        roleAccessDTO: roleVo,
        branchAccessDTOList: branchVo
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `auth/signup`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'User Updated Successfully' : 'User created successfully');
          handleClear();
          getAllUsers();
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
      fromHour: '',
      toHour: '',
      timing: '',
      active: true,
      orgId: orgId
    });
    setFieldErrors({
      shiftName: false,
    });
    setRoleTableData([{ id: 1, role: '', roleId: '', startDate: null, endDate: null }]);
    setRoleTableDataErrors('');
    setBranchTableData([{ id: 1, branchCode: '', branch: '' }]);
    setBranchTableErrors('');
    setEditId('');
  };

  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        if (table === roleTableData) handleAddRow();
        else handleAddRow1();
      }
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(roleTableData)) {
      displayRowError(roleTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      role: '',
      roleId: '',
      startDate: '',
      endDate: ''
    };
    setRoleTableData([...roleTableData, newRow]);
    setRoleTableDataErrors([...roleTableDataErrors, { role: '', roleId: '', startDate: '', endDate: '' }]);
  };

  const handleAddRow1 = () => {
    if (isLastRowEmpty(branchTableData)) {
      displayRowError(branchTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      branchCode: '',
      branch: ''
    };
    setBranchTableData([...branchTableData, newRow]);
    setBranchTableErrors([
      ...branchTableErrors,
      {
        branchCode: ''
      }
    ]);
  };

  // const handleBulkUploadOpen = () => {
  //   setUploadOpen(true);
  // };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === roleTableData) {
      return !lastRow.role || !lastRow.startDate;
    } else if (table === branchTableData) {
      return !lastRow.branchCode;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === roleTableData) {
      setRoleTableDataErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          role: !table[table.length - 1].role ? 'Role is required' : '',
          startDate: !table[table.length - 1].startDate ? 'Start Date is required' : ''
        };
        return newErrors;
      });
    }
    if (table === branchTableData) {
      setBranchTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          branchCode: !table[table.length - 1].branchCode ? 'Branch Code is required' : ''
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

  // const getAvailableRoles = (currentRowId) => {
  //   const selectedRoles = roleTableData.filter((row) => row.id !== currentRowId).map((row) => row.role);
  //   return roleList.filter((role) => !selectedRoles.includes(role.role));
  // };
  const handleRoleChange = (row, index, event) => {
    const value = event.target.value;
    const selectedRole = roleList.find((role) => role.role === value);
    setRoleTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setRoleTableDataErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        role: !value ? 'Role is required' : ''
      };
      return newErrors;
    });
  };

  const getAvailableBranchCodes = (currentRowId) => {
    const selectedBranchCodes = branchTableData.filter((row) => row.id !== currentRowId).map((row) => row.branchCode);
    return branchList.filter((branch) => !selectedBranchCodes.includes(branch.branchCode));
  };
  const handleBranchCodeChange = (row, index, event) => {
    const value = event.target.value;
    const selectedBranch = branchList.find((branch) => branch.branchCode === value);
    setBranchTableData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, branchCode: value, branch: selectedBranch ? selectedBranch.branch : '' } : r))
    );
    setBranchTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        branchCode: !value ? 'Branch Code is required' : ''
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
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.shiftName ? 'This field is required' : ''}</span>}
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
                    required
                    name="shiftType"
                    value={formData.shiftType}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.shiftType ? 'This field is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea"
                    label="From hour"
                    variant="outlined"
                    size="small"
                    name="fromHour"
                    fullWidth
                    value={formData.fromHour}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.fromHour ? 'This field is required' : ''}</span>}
                    inputProps={{ maxLength: 15 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea"
                    label="To hour"
                    variant="outlined"
                    size="small"
                    name="toHour"
                    fullWidth
                    value={formData.toHour}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.toHour ? 'This field is required' : ''}</span>}
                    inputProps={{ maxLength: 15 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea"
                    label="Timing"
                    variant="outlined"
                    size="small"
                    name="timing"
                    fullWidth
                    value={formData.timing}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.timing ? 'This field is required' : ''}</span>}
                    inputProps={{ maxLength: 15 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.active}
                          onChange={handleInputChange}
                          name="active"
                          sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                        />
                      }
                      label="Active"
                    />
                  </FormGroup>
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
                          <ActionButton icon={CloudUploadIcon} title='Upload' />
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-9">
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
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '250px' }}>
                                      Timings (In Hour)
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {roleTableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              roleTableData,
                                              setRoleTableData,
                                              roleTableDataErrors,
                                              setRoleTableDataErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.role}
                                          onChange={(e) => handleRoleChange(row, index, e)}
                                          className={roleTableDataErrors[index]?.role ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Option</option>
                                          {/* {getAvailableRoles(row.id).map((role) => (
                                            <option key={role.id} value={role.role}>
                                              {role.role}
                                            </option>
                                          ))} */}
                                        </select>
                                        {roleTableDataErrors[index]?.role && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {roleTableDataErrors[index].role}
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
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getUserById} />
          )}
        </div>
      </div>
    </>
  );
};
export default ShiftMaster;
