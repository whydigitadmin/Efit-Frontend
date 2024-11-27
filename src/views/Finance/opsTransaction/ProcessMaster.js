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

const ProcessMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [editId, setEditId] = useState('');

  const [formData, setFormData] = useState({
    processId: '',
    processName: '',
    // active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    processId: '',
    processName: '',
    // active: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'processId', header: 'Process ID', size: 140 },
    { accessorKey: 'processName', header: 'Process Name', size: 140 },
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
          processId: particularCompany.processId,
          processName: particularCompany.processName,
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
      processId: '',
      processName: '',
      // active: true
    });
    setFieldErrors({
      // companyCode: '',
      processId: '',
      processName: '',
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.processId) {
      errors.processId = 'Process ID is required';
    }
    if (!formData.processName) {
      errors.processName = 'Process Name is required';
    }


    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        id: orgId,
        processId: formData.processId,
        processName: formData.processName,
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
                  label="Process ID"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="processId"
                  value={formData.processId}
                  onChange={handleInputChange}
                  error={!!fieldErrors.processId}
                  helperText={fieldErrors.processId}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Process Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="processName"
                  value={formData.processName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.processName}
                  helperText={fieldErrors.processName}
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

export default ProcessMaster;
