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
import { useEffect, useState, useCallback } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const ShiftMaster = () => {
  const [listViewData, setListViewData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));

  const [formData, setFormData] = useState({
    shiftName: '',
    shiftType: '',
    shiftCode: '',
    fromHour: null,
    toHour: null,
    timing: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    shiftName: '',
    shiftType: '',
    shiftCode: '',
    fromHour: '',
    toHour: '',
    timing: ''
  });

  const listViewColumns = [
    { accessorKey: 'shiftName', header: 'Shift Name', size: 140 },
    { accessorKey: 'shiftType', header: 'Shift Type', size: 140 },
    { accessorKey: 'shiftCode', header: 'Shift Code', size: 140 }
  ];

  const [shiftMasterData, setShiftMasterData] = useState([
    {
      id: 1,
      shiftTiming: ''
    }
  ]);
  const [shiftMasterErrors, setShiftMasterErrors] = useState([
    {
      shiftTiming: ''
    }
  ]);

  useEffect(() => {
    if (!editId) {
      calculateTimings();
    }
  }, [formData.fromHour, formData.toHour, editId]);

  useEffect(() => {
    getAllShiftMaster();
  }, []);

  const calculateTimings = useCallback(() => {
    const { fromHour, toHour } = formData;

    if (!fromHour || !toHour) return;

    const fromTime = dayjs(fromHour);
    const toTime = dayjs(toHour);

    if (!fromTime.isValid() || !toTime.isValid() || toTime.isBefore(fromTime)) {
      setFormData((prev) => ({ ...prev, timing: '' }));
      setShiftMasterData([]);
      return;
    }

    const diffInHours = toTime.diff(fromTime, 'hour');
    const childTableData = [];

    for (let i = 0; i < diffInHours; i++) {
      const start = fromTime.add(i, 'hour');
      const end = start.add(1, 'hour');
      childTableData.push({
        id: i + 1,
        shiftTiming: `${start.format('hh:mm A')} - ${end.format('hh:mm A')}`
      });
    }

    setFormData((prev) => ({ ...prev, timing: `${diffInHours} hrs` }));
    setShiftMasterData(childTableData);
  }, [formData.fromHour, formData.toHour]);

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    const nameRegex = /^[A-Za-z- ]*$/;
    const allRegex = /^[a-zA-Z0-9- ]*$/;

    let errorMessage = '';

    switch (name) {
      case 'shiftName':
      case 'shiftType':
      case 'shiftCode':
        if (!nameRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'departmentCode':
        if (!allRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'fromHour':
      case 'toHour':
        if (value && !dayjs(value, 'HH:mm', true).isValid()) {
          errorMessage = 'Invalid time format (HH:mm expected)';
        }
        break;
      default:
        break;
    }
    if (errorMessage) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage
      }));
    } else {
      const transformedValue = name === 'fromHour' || name === 'toHour' ? value : typeof value === 'string' ? value.toUpperCase() : value;
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : transformedValue
      }));
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
    if (type === 'text' || type === 'textarea') {
      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement && inputElement.setSelectionRange) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  };
  const getShiftMasterById = async (row) => {
    try {
      console.log('Fetching shift data for ID:', row.original.id);
      const response = await apiCalls('get', `/efitmaster/getShiftById?id=${row.original.id}`);
      if (response.status === true) {
        setEditId(row.original.id);
        setListView(false);
        const shiftVO = response.paramObjectsMap.shiftVO[0];
        console.log('Particular Shift data:', shiftVO);

        if (shiftVO) {
          setFormData({
            shiftName: shiftVO.shiftName,
            shiftType: shiftVO.shiftType,
            shiftCode: shiftVO.shiftCode,
            fromHour: shiftVO.fromHour,
            toHour: shiftVO.toHour,
            timing: shiftVO.timing,
            active: shiftVO.active === 'Active' ? true : false
          });
          setShiftMasterData(
            shiftVO.shiftDetailsVO?.map((row) => ({
              id: row.id,
              shiftTiming: row.timingInHours
            })) || []
          );
        } else {
          console.error('No shiftVO data found in response');
        }
      } else {
        console.error('No data returned from API');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllShiftMaster = async () => {
    try {
      const response = await apiCalls('get', `/efitmaster/getShiftByOrgId?orgId=${orgId}`);

      console.log('API Response:', response);
      if (response.status === true) {
        setListViewData(response.paramObjectsMap.shiftVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      shiftName: '',
      shiftType: '',
      shiftCode: '',
      fromHour: null,
      toHour: null,
      timing: '',
      active: true
    });
    setFieldErrors({
      shiftName: '',
      shiftType: '',
      shiftCode: '',
      fromHour: '',
      toHour: '',
      timing: ''
    });
    setShiftMasterData([{ id: 1, shiftTiming: '' }]);
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
      shiftTiming: ''
    };
    setShiftMasterData([...shiftMasterData, newRow]);
    setShiftMasterErrors([...shiftMasterErrors, { shiftTiming: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;
    return !lastRow.shiftTiming;
  };

  const displayRowError = (table) => {
    setShiftMasterErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[table.length - 1] = {
        ...newErrors[table.length - 1],
        shiftTiming: !table[table.length - 1].shiftTiming ? 'Timing is required' : ''
      };
      return newErrors;
    });
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
    setListView(!listView);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSave = async () => {
    // Validation for required fields
    const errors = {};
    if (!formData.shiftName) errors.shiftName = 'Shift Name is required';
    if (!formData.shiftType) errors.shiftType = 'Shift Type is required';
    if (!formData.shiftCode) errors.shiftCode = 'Shift Code is required';
    if (!formData.fromHour) errors.fromHour = 'From hour is required';
    if (!formData.toHour) errors.toHour = 'To Hour is required';
    if (!formData.timing) errors.timing = 'Timing is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast('error', 'Please fix validation errors before saving.');
      return;
    }

    // Validate shiftMasterData
    if (!shiftMasterData || !shiftMasterData.length) {
      showToast('error', 'Shift Timing Details are required.');
      return;
    }

    const invalidTimings = shiftMasterData.filter((row) => !row.shiftTiming);
    if (invalidTimings.length) {
      showToast('error', 'All timing rows must be filled.');
      return;
    }
    const ShiftMasterVO = shiftMasterData.map((row) => ({
      ...(editId && { id: row.id }),
      timingInHours: row.shiftTiming
    }));
    const saveFormData = {
      ...(editId && { id: editId }),
      shiftName: formData.shiftName,
      shiftType: formData.shiftType,
      shiftCode: formData.shiftCode,
      fromHour: formData.fromHour,
      toHour: formData.toHour,
      timing: formData.timing,
      active: formData.active || false,
      orgId: orgId,
      createdBy: loginUserName,
      // branch,
      // branchCode,
      finYear: finYear,
      shiftDetailsDTO: ShiftMasterVO
    };

    console.log('Save Form Data:', saveFormData);
    setIsLoading(true);
    try {
      const response = await apiCalls('put', `/efitmaster/updateCreateShift`, saveFormData);
      if (response.status === true) {
        showToast('success', editId ? 'Shift Master Updated Successfully' : 'Shift Master Created Successfully');
        await getAllShiftMaster();
        handleClear();
      } else {
        showToast('error', response.paramObjectsMap?.message || 'Save failed. Please try again.');
      }
    } catch (error) {
      console.error('Save Error:', error);
      showToast('error', 'An error occurred while saving. Please try again.');
    } finally {
      setIsLoading(false);
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                      // inputProps={{ maxLength: 10 }}
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
                      // inputProps={{ maxLength: 10 }}
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
                      // inputProps={{ maxLength: 10 }}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <FormControlLabel
                      control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" defaultChecked />}
                      label="Active"
                    />
                  </div>
                  {/* <div className="col-md-3 mb-3">
                  <TimePicker
                    label="From Hour"
                    value={formData.fromHour}
                    onChange={(newValue) => handleInputChange({ target: { name: 'fromHour', value: newValue } })}
                    ampm
                    renderInput={(params) => (
                      <input
                      sx={{
                        "& .MuiInputBase-input": {
                        }
                      }}
                        {...params}
                        si
                        error={!formData.fromHour}
                        className="form-control" 
                        helperText={!formData.fromHour ? 'From hour is required' : ''}
                      />
                    )}
                  />
                </div> */}
                  {editId ? (
                    <div className="col-md-3 mb-3">
                      <TextField
                        id="outlined-textarea-zip"
                        label="From Hour"
                        variant="outlined"
                        size="small"
                        fullWidth
                        name="fromHour"
                        value={formData.fromHour}
                        disabled
                        // onChange={handleInputChange}
                        error={!!fieldErrors.fromHour}
                        helperText={fieldErrors.fromHour}
                        // inputProps={{ maxLength: 10 }}
                      />
                    </div>
                  ) : (
                    <div className="col-md-3 mb-3">
                      <TimePicker
                        label="From Hour"
                        value={formData.fromHour}
                        onChange={(newValue) => handleInputChange({ target: { name: 'fromHour', value: newValue } })}
                        ampm
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                height: '16px' // Adjust the height of the input field
                              },
                              '& .MuiInputBase-input': {
                                padding: '10px 14px', // Adjust padding for better appearance
                                fontSize: '0.9rem' // Optional: Reduce font size
                              }
                            }}
                            error={!formData.fromHour}
                            className="form-control"
                            helperText={!formData.fromHour ? 'From hour is required' : ''}
                            size="small" // Ensures the input looks smaller overall
                          />
                        )}
                      />
                    </div>
                  )}
                  {editId ? (
                    <div className="col-md-3 mb-3">
                      <TextField
                        id="outlined-textarea-zip"
                        label="To Hour"
                        variant="outlined"
                        size="small"
                        fullWidth
                        name="toHour"
                        value={formData.toHour}
                        disabled
                        // onChange={handleInputChange}
                        error={!!fieldErrors.toHour}
                        helperText={fieldErrors.toHour}
                        // inputProps={{ maxLength: 10 }}
                      />
                    </div>
                  ) : (
                    <div className="col-md-3 mb-3">
                      <TimePicker
                        label="To Hour"
                        value={formData.toHour}
                        onChange={(newValue) => handleInputChange({ target: { name: 'toHour', value: newValue } })}
                        ampm
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            error={!formData.toHour}
                            helperText={!formData.toHour ? 'To hour is required' : ''}
                          />
                        )}
                      />
                    </div>
                  )}
                  <div className="col-md-3 mb-3">
                    <TextField label="Timing" value={formData.timing || ''} size="small" disabled fullWidth />
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
                          {/* {!editId && (
                            <div className="mb-1">
                              <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                            </div>
                          )} */}
                          <div className="row mt-2">
                            <div className="col-lg-8">
                              <div className="table-responsive">
                                <table className="table table-bordered ">
                                  <thead>
                                    <tr style={{ backgroundColor: '#673AB7' }}>
                                      <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                        Action
                                      </th>
                                      <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                        S.No
                                      </th>
                                      <th className="px-3 py-2 text-white text-center" style={{ width: '300px' }}>
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
                                        <td className="text-center">{row.shiftTiming}</td>
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
              </LocalizationProvider>
            </>
          ) : (
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getShiftMasterById} />
          )}
        </div>
      </div>
    </>
  );
};
export default ShiftMaster;
