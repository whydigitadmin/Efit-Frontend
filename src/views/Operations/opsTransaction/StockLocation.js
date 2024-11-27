import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { encryptPassword } from 'views/utilities/encryptPassword';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';




const StockLocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({
    locationCode: '',
    locationName: '',
    company: '',
    branch: '',
    startDate: '',
    closedDate: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    locationCode: '',
    locationName: '',
    company: '',
    branch: '',
    startDate: '',
    closedDate: '',
    active: ''
  });

  const countryList = [
    { id: 1, name: 'United States' },
    { id: 2, name: 'Canada' },
    { id: 3, name: 'United Kingdom' },
    // Add more countries as needed
  ];


  const branchList = [
    { id: 1, name: 'United States' },
    { id: 2, name: 'Canada' },
    { id: 3, name: 'United Kingdom' },
    // Add more countries as needed
  ];

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };


  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'LocationCode', header: 'Location Code', size: 140 },
    {
      accessorKey: 'locationName',
      header: 'Location Name',
      size: 140
    },
    {
      accessorKey: 'company',
      header: 'Company',
      size: 140
    },
    {
      accessorKey: 'branch',
      header: 'Branch',
      size: 140
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      size: 140
    },
    {
      accessorKey: 'closedDate',
      header: 'Closed Date',
      size: 140
    },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllCompanies();
  }, []);
  const getAllCompanies = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.companyVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getCompanyById = async (row) => {
    console.log('THE SELECTED COMPANY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `commonmaster/company/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCompany = response.paramObjectsMap.companyVO[0];
        console.log('THE PARTICULAR COMPANY DETAILS ARE:', particularCompany);

        setFormData({
          locationCode: particularCompany.locationCode,
          locationName: particularCompany.locationName,
          company: particularCompany.company,
          branch: particularCompany.branch,
          startDate: particularCompany.startDate,
          closedDate: particularCompany.closedDate,
          active: particularCompany.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    const nameRegex = /^[A-Za-z ]*$/;
    const locationNameRegex = /^[A-Za-z 0-9@_\-*]*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const locationCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;

    if (name === 'locationName' && !locationNameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Only alphabetic characters and @*_- are allowed' });
    } else if (name === 'locationCode' && !locationCodeRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else if (name === 'company' && !nameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else {
      let updatedValue = value;

      if (name !== 'branch') {
        updatedValue = value.toUpperCase();
      }

      if (type === 'checkbox') {
        setFormData({ ...formData, [name]: checked });
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: updatedValue
        }));
      }

      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Update the cursor position after the input change only for text inputs
      if (type === 'text' || type === 'email' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }, 0);
      }
    }
  };

  const handleClear = () => {
    setFormData({
      locationCode: '',
      locationName: '',
      company: '',
      branch: '',
      startDate: '',
      closedDate: '',
      active: true
    });
    setFieldErrors({
      locationCode: '',
      locationName: '',
      company: '',
      branch: '',
      startDate: '',
      closedDate: ''
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.locationCode) {
      errors.locationCode = 'Location Code is required';
    }
    if (!formData.locationName) {
      errors.locationName = 'Location Name is required';
    }
    if (!formData.company) {
      errors.company = 'company is required';
    }
    if (!formData.branch) {
      errors.branch = 'Branch  is required';
    }
    if (!formData.startDate) {
      errors.startDate = 'start Date  is required';
    }
    if (!formData.closedDate) {
      errors.closedDate = 'Closed Date  is required';
    }
    else if (!emailRegex.test(formData.branch)) {
      errors.branch = 'Invalid MailID Format';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        locationCode: formData.locationCode,
        locationName: formData.locationName,
        company: formData.company,
        branch: formData.branch,
        startDate: formData.startDate,
        closedDate: formData.closedDate,
        orgId: orgId
      };
      console.log('DATA TO SAVE IS:', saveData);

      try {
        const method = editId ? 'put' : 'post';
        const url = editId ? 'commonmaster/updateCompany' : 'commonmaster/company';

        const response = await apiCalls(method, url, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' Stock Location Updated Successfully' : 'Stock Location created successfully');

          handleClear();
          getAllCompanies();
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

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
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
                  label="Location Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="locationCode"
                  value={formData.locationCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.locationCode}
                  helperText={fieldErrors.locationCode}
                // inputRef={locationNameRef}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Location Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.locationName}
                  helperText={fieldErrors.locationName}
                // inputRef={locationNameRef}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.company}>
                  <InputLabel id="country-label" required>Company</InputLabel>
                  <Select labelId="country-label" label="company" value={formData.company} onChange={handleInputChange} name="company">
                    {Array.isArray(countryList) &&
                      countryList?.map((row) => (
                        <MenuItem key={row.id} value={row.company}>
                          {row.company}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.company && <FormHelperText>{fieldErrors.company}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branch}>
                  <InputLabel id="country-label" required>Branch</InputLabel>
                  <Select labelId="country-label" label="branch" value={formData.branch} onChange={handleInputChange} name="branch">
                    {Array.isArray(branchList) &&
                      branchList?.map((row) => (
                        <MenuItem key={row.id} value={row.branch}>
                          {row.branch}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.branch && <FormHelperText>{fieldErrors.branch}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      // size="small"
                      value={formData.startDate ? dayjs(formData.startDate, 'YYYY-MM-DD') : null}
                      onChange={(startDate) => handleDateChange('startDate', startDate)}
                      slotProps={{
                        textField: { size: "small", clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.startDate}
                      helperText={fieldErrors.startDate}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="closed Date"
                      // size="small"
                      value={formData.closedDate ? dayjs(formData.closedDate, 'YYYY-MM-DD') : null}
                      onChange={(closedDate) => handleDateChange('closedDate', closedDate)}
                      slotProps={{
                        textField: { size: "small", clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.closedDate}
                      helperText={fieldErrors.closedDate}
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
