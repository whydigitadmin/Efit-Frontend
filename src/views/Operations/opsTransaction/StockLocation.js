import React, { useState, useRef, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
// import CommonListViewTable from '../basicMaster/CommonListViewTable';
import { ToastContainer, toast } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';
import { update } from 'immutable';
import api from 'api';


export const StockLocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [companyName, setCompanyName] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [formData, setFormData] = useState({
    locationCode: '',
    locationName: '',
    company: '',
    branch: '',
    startDate: null,
    closedDate: null,
    active: true
  });

  const theme = useTheme();
  const anchorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({
    locationCode: '',
    locationName: '',
    company: '',
    branch: '',
    startDate: '',
    closedDate: ''
  });
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllBranches();
    getAllStockLocation();
    getCompanyName();
  }, []);


  // companyName API
  const getCompanyName = async () => {
    try {
      const response = await apiCalls('get', `machinemaster/getCompanyForStockLocation?orgId=${orgId}`);

      // Update state with the new docId
      setCompanyName(response.paramObjectsMap.companyVO[0].companyName);

      // Optionally update formData if docId is part of it
      setFormData((prevFormData) => ({
        ...prevFormData,
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value, checked, type, selectionStart, selectionEnd } = e.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const nameRegex = /^[A-Za-z ]*$/;

    let errorMessage = '';

    // Validation for locationCode
    if (name === 'locationCode' && !codeRegex.test(value)) {
      errorMessage = 'Invalid Format';
    }
    // Validation for locationName
    else if (name === 'locationName' && !nameRegex.test(value)) {
      errorMessage = 'Invalid Format';
    }

    // Set or clear error messages
    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

      if (name === 'branch') {
        // Handle branch selection
        const selectedBranch = branchList.find((br) => br.branch === value);
        if (selectedBranch) {
          setFormData((prevData) => ({
            ...prevData,
            branch: value,
            branchCode: selectedBranch.branchCode
          }));
        } else {
          // Optionally handle cases where the branch is not found
          setFormData((prevData) => ({
            ...prevData,
            branch: value,
            branchCode: ''
          }));
        }
      } else if (type === 'checkbox') {
        // Handle checkbox inputs
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
      } else if (type === 'text' || type === 'textarea') {
        // Handle text-based inputs: convert to uppercase and maintain cursor
        const upperCaseValue = value.toUpperCase();
        setFormData((prevData) => ({ ...prevData, [name]: upperCaseValue }));

        // Maintain cursor position
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      } else {
        // Handle other input types (e.g., select, radio) without transformation
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleClear = () => {
    setFormData({
      locationCode: '',
      locationName: '',
      branch: '',
      startDate: null,
      closedDate: null,
      active: true
    });
    setFieldErrors({
      locationCode: '',
      locationName: '',
      branch: '',
      startDate: '',
      closedDate: ''
    });
    setEditId('');
    getCompanyName();
  };


  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  // List API
  const getAllStockLocation = async () => {
    try {
      const response = await apiCalls('get', `/machinemaster/getAllStockLocationByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.stockLocationVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // edit API
  const getAllStockLocationById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `machinemaster/getAllStockLocationById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularEmp = response.paramObjectsMap.stockLocationVO;
        const selectedBranch = branchList.find((br) => br.branch === particularEmp.branch);
        console.log('THE SELECTED BRANCH IS:', selectedBranch);

        setCompanyName(particularEmp.company);
        setFormData({
          locationCode: particularEmp.locationCode,
          locationName: particularEmp.locationName,
          company: companyName,
          branch: particularEmp.branch,
          startDate: particularEmp.startDate,
          closedDate: particularEmp.closedDate,

          active: particularEmp.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.locationCode) {
      errors.locationCode = 'Location Code is required';
    }
    if (!formData.locationName) {
      errors.locationName = 'Location Name is required';
    }
    if (!formData.branch) {
      errors.branch = 'Branch is required';
    }
    if (!formData.startDate) {
      errors.startDate = 'Start Date is required';
    }
    if (!formData.closedDate) {
      errors.closedDate = 'Closed Date is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        ...(editId && { id: editId }),
        createdby: loginUserName,
        orgId: orgId,
        active: true,
        locationCode: formData.locationCode,
        locationName: formData.locationName,
        company: companyName,
        branch: formData.branch,
        startDate: formData.startDate,
        closedDate: formData.closedDate,
      };

      // save and update api
      try {
        const response = await apiCalls('put', `machinemaster/updateCreateStockLocation`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Stock Location Updated Successfully' : 'Stock Location created successfully');
          handleClear();
          getAllStockLocation();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Stock Location creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Stock Location creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const listViewColumns = [
    { accessorKey: 'locationCode', header: 'Location Code', size: 140 },
    { accessorKey: 'locationName', header: 'Location Name', size: 140 },
    { accessorKey: 'branch', header: 'Branch', size: 140 },
    { accessorKey: 'company', header: 'Company', size: 140 },
    { accessorKey: 'startDate', header: 'Start Date', size: 140 },
    { accessorKey: 'closedDate', header: 'Closed Date', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  return (
    <>
      <div>{/* <ToastContainer /> */}</div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getAllStockLocationById} />
          </div>
        ) : (
          <>
            <div className="row">
              {/* Location Code */}
              <div className="col-md-3 mb-3">
                <TextField
                  label="Location Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="locationCode"
                  value={formData.locationCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.locationCode}
                  helperText={fieldErrors.locationCode}
                />
              </div>
              {/* Location Name */}
              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Location Name <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.locationName}
                  helperText={fieldErrors.locationName}
                />
              </div>
              {/* Company */}
              <div className="col-md-3 mb-3">
                <TextField
                  label="Company Name"
                  variant="outlined"
                  disabled
                  size="small"
                  fullWidth
                  name="companyName"
                  value={companyName}
                  onChange={handleInputChange}
                />
              </div>
              {/* Branch */}
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branch}>
                  <InputLabel id="branch-label">
                    {
                      <span>
                        Branch <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select labelId="branch-label" label="Branch" value={formData.branch} onChange={handleInputChange} name="branch">
                    {branchList?.map((row) => (
                      <MenuItem key={row.id} value={row.branch}>
                        {row.branch}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.branch && <FormHelperText>{fieldErrors.branch}</FormHelperText>}
                </FormControl>
              </div>
              {/* Start Date */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={
                        <span>
                          Start Date<span className="asterisk">*</span>
                        </span>
                      }
                      value={formData.startDate ? dayjs(formData.startDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('startDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.startDate}
                      helperText={fieldErrors.startDate && 'Required'}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              {/* Closed Date */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={
                        <span>
                          Closed Date<span className="asterisk">*</span>
                        </span>
                      }
                      value={formData.closedDate ? dayjs(formData.closedDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('closedDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.closedDate}
                      helperText={fieldErrors.closedDate && 'Required'}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                  label="Active"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default StockLocation;
