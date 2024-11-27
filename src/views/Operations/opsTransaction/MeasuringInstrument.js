import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
// import CommonListViewTable from '../basicMaster/CommonListViewTable';
import axios from 'axios';
import { useRef, useState, useMemo, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import { getAllActiveCitiesByState, getAllActiveCountries, getAllActiveStatesByCountry } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const MeasuringInstrument = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [editId, setEditId] = useState('');

  const [formData, setFormData] = useState({
    measuringInstrumentID: '',
    instrumentName: '',
    range: '',
    leastCount: '',
    colorCode: '',
    instrumentCode: '',
    calibrationFrequence: '',
    remarks: '',
    // active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    measuringInstrumentID: '',
    instrumentName: '',
    range: '',
    leastCount: '',
    colorCode: '',
    instrumentCode: '',
    calibrationFrequence: '',
    remarks: '',
    // active: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'measuringInstrumentID', header: 'Measuring Instrument ID', size: 140 },
    { accessorKey: 'instrumentName', header: 'Instrument Name', size: 140 },
    { accessorKey: 'range', header: 'Range', size: 140 },
    { accessorKey: 'leastCount', header: 'Least Count', size: 140 },
    { accessorKey: 'colorCode', header: 'Color Code', size: 140 },
    { accessorKey: 'instrumentCode', header: 'Instrument Code', size: 140 },
    { accessorKey: 'calibrationFrequence', header: 'Calibration Frequence', size: 140 },
    { accessorKey: 'remarks', header: 'Remarks', size: 140 },
    // { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);
  useEffect(() => {
    getCompanyDetails();
    // getCompany();
    getAllCountries();
    if (formData.country) {
      getAllStates();
    }
    if (formData.state) {
      getAllCities();
    }
  }, [formData.country, formData.state]);

  const getAllCountries = async () => {
    try {
      const countryData = await getAllActiveCountries(orgId);
      setCountryList(countryData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllStates = async () => {
    try {
      const stateData = await getAllActiveStatesByCountry(formData.country, orgId);
      setStateList(stateData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllCities = async () => {
    try {
      const cityData = await getAllActiveCitiesByState(formData.state, orgId);
      setCityList(cityData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    // Regular expressions for validation
    const nameRegex = /^[A-Za-z ]*$/; // Allows only alphabetic characters and spaces
    const numericRegex = /^[0-9]*$/; // Allows only numeric characters
    const alphanumericRegex = /^[A-Za-z0-9]*$/; // Allows only alphanumeric characters

    let error = '';

    // Validation logic
    if (name === 'range') {
      if (!nameRegex.test(value)) {
        error = 'Only alphabetic characters are allowed';
      }
    } else if (name === 'pincode') {
      if (!numericRegex.test(value)) {
        error = 'Only numeric characters are allowed';
      } else if (value.length > 6) {
        error = 'Only 6 digits are allowed';
      }
    } else if (name === 'gst') {
      if (!alphanumericRegex.test(value)) {
        error = 'Special characters are not allowed';
      } else if (value.length > 15) {
        error = 'Only 15 characters are allowed';
      }
    }

    // Handle errors if validation fails
    if (error) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error
      }));
    } else {
      // Clear previous error if input is valid
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));

      // Update the form data
      let updatedValue = value;

      if (name !== 'active') {
        updatedValue = value.toUpperCase();
      }

      if (type === 'checkbox') {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: checked
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: updatedValue
        }));
      }

      if (type === 'text' || type === 'textarea' || type === 'email') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  const getCompanyById = async (row) => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCompany = response.paramObjectsMap.companyVO[0];
        console.log('PARTICULAR COMPANY IS:', particularCompany);

        setFormData({
          measuringInstrumentID: particularCompany.measuringInstrumentID,
          instrumentName: particularCompany.instrumentName,
          range: particularCompany.range,
          leastCount: particularCompany.leastCount,
          colorCode: particularCompany.colorCode,
          instrumentCode: particularCompany.instrumentCode,
          calibrationFrequence: particularCompany.calibrationFrequence,
          remarks: particularCompany.remarks,
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        const particularCompany = response.paramObjectsMap.companyVO[0];
        setListViewData(response.paramObjectsMap.companyVO);
        console.log('THE LISTVIEW COMPANY IS:', particularCompany);

        setFormData({ ...formData, companyCode: particularCompany.companyCode, companyName: particularCompany.companyName });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      measuringInstrumentID: '',
      range: '',
      leastCount: '',
      colorCode: '',
      instrumentCode: '',
      calibrationFrequence: '',
      remarks: '',
      // active: true
    });
    setFieldErrors({
      // companyCode: '',
      measuringInstrumentID: '',
      range: '',
      leastCount: '',
      colorCode: '',
      instrumentCode: '',
      calibrationFrequence: '',
      remarks: '',
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};


    if (!formData.instrumentName) {
      errors.instrumentName = 'Instrument Name is required';
    }
    if (!formData.range) {
      errors.range = 'Range is required';
    }
    if (!formData.leastCount) {
      errors.leastCount = 'Least Count is required';
    }
    if (!formData.colorCode) {
      errors.colorCode = 'Color Code is required';
    }
    if (!formData.instrumentCode) {
      errors.instrumentCode = 'Instrument Code is required';
    }
    if (!formData.calibrationFrequence) {
      errors.calibrationFrequence = 'Calibration Frequence is required';
    }
    if (!formData.remarks) {
      errors.remarks = 'remarks is required';
    }
    if (!formData.measuringInstrumentID) {
      errors.measuringInstrumentID = 'Measuring Instrument ID is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        id: orgId,
        measuringInstrumentID: formData.measuringInstrumentID,
        instrumentName: formData.instrumentName,
        range: formData.range,
        leastCount: formData.leastCount,
        colorCode: formData.colorCode,
        instrumentCode: formData.instrumentCode,
        calibrationFrequence: formData.calibrationFrequence,
        remarks: formData.remarks,
        // active: formData.active,
        // updatedBy: loginUserName
      };
      console.log('THE SAVE FORM DATA IS:', saveFormData);

      try {
        const response = await apiCalls('put', `commonmaster/updateCompany`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);

          showToast('success', ' Company updated Successfully');
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Company updation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Company updation failed');

        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    console.log('LIST VIEW DATAS ARE:', listViewData);

    setListView(!listView);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              // editCallback={editEmployee}
              blockEdit={true} // DISAPLE THE MODAL IF TRUE
              toEdit={getCompanyById}
            />
          </div>
        ) : (
          <>
            <div className="row">

              <div className="col-md-3 mb-3">
                <TextField
                  label="Measuring Instrument ID"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="measuringInstrumentID"
                  value={formData.measuringInstrumentID}
                  onChange={handleInputChange}
                  error={!!fieldErrors.measuringInstrumentID}
                  helperText={fieldErrors.measuringInstrumentID}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Instrument Code"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="instrumentCode"
                  value={formData.instrumentCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.instrumentCode}
                  helperText={fieldErrors.instrumentCode}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.instrumentName}>
                  <InputLabel id="country-label" required>Instrument Name</InputLabel>
                  <Select labelId="country-label" label="instrumentName" value={formData.instrumentName} onChange={handleInputChange} name="instrumentName">
                    {Array.isArray(countryList) &&
                      countryList?.map((row) => (
                        <MenuItem key={row.id} value={row.instrumentName}>
                          {row.instrumentName}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.instrumentName && <FormHelperText>{fieldErrors.instrumentName}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Range"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="range"
                  value={formData.range}
                  onChange={handleInputChange}
                  error={!!fieldErrors.range}
                  helperText={fieldErrors.range}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Least Count"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="leastCount"
                  value={formData.leastCount}
                  onChange={handleInputChange}
                  error={!!fieldErrors.leastCount}
                  helperText={fieldErrors.leastCount}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.colorCode}>
                  <InputLabel id="country-label">Color Code</InputLabel>
                  <Select labelId="country-label" label="colorCode" value={formData.colorCode} onChange={handleInputChange} name="colorCode">
                    {Array.isArray(countryList) &&
                      countryList?.map((row) => (
                        <MenuItem key={row.id} value={row.colorCode}>
                          {row.colorCode}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.colorCode && <FormHelperText>{fieldErrors.colorCode}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Calibration Frequence"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="calibrationFrequence"
                  value={formData.calibrationFrequence}
                  onChange={handleInputChange}
                  error={!!fieldErrors.calibrationFrequence}
                  helperText={fieldErrors.calibrationFrequence}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Remarks"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  name="remarks"
                  value={formData.remarks}
                  maxLength={6}
                  onChange={handleInputChange}
                  error={!!fieldErrors.remarks}
                  helperText={fieldErrors.remarks}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <ToastComponent />
    </>
  );
};

export default MeasuringInstrument;
