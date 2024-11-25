import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { getAllActiveCountries } from 'utils/CommonFunctions';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from './CommonListViewTable';

export const State = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    active: true,
    stateCode: '',
    stateNo: '',
    stateName: '',
    country: ''
  });
  const [editId, setEditId] = useState('');
  const [countryList, setCountryList] = useState([]);

  const theme = useTheme();
  const anchorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({
    stateCode: '',
    stateNo: '',
    stateName: '',
    country: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'stateCode', header: 'State Code', size: 140 },
    { accessorKey: 'stateNumber', header: 'State No', size: 140 },
    { accessorKey: 'stateName', header: 'State Name', size: 140 },
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllStates();

    const fetchData = async () => {
      try {
        const countryData = await getAllActiveCountries(orgId);
        setCountryList(countryData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };
    fetchData();
  }, []);

  const getAllStates = async () => {
    try {
      const result = await apiCalls('get', `commonmaster/state?orgid=${orgId}`);
      setListViewData(result.paramObjectsMap.stateVO);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getStateById = async (row) => {
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `commonmaster/state/${row.original.id}`);
      if (response.status === true) {
        const particularState = response.paramObjectsMap.stateVO;

        setFormData({
          stateCode: particularState.stateCode,
          stateNo: particularState.stateNumber,
          stateName: particularState.stateName,
          country: particularState.country,
          active: particularState.active === 'Active' ? true : false
        });
        setListView(false);
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
  //   const nameRegex = /^[A-Za-z ]*$/;
  //   const numericRegex = /^[0-9]*$/;

  //   if (name === 'stateCode' && !codeRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else if (name === 'stateCode' && value.length > 2) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Max Lenght is 2' });
  //   } else if (name === 'stateNo' && !numericRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else if (name === 'stateNo' && value.length > 3) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Max Lenght is 3' });
  //   } else if (name === 'stateName' && !nameRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else {
  //     setFormData({ ...formData, [name]: value.toUpperCase() });
  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const nameRegex = /^[A-Za-z ]*$/;
    const numericRegex = /^[0-9]*$/;

    if (name === 'stateCode' && !codeRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else if (name === 'stateCode' && value.length > 2) {
      setFieldErrors({ ...fieldErrors, [name]: 'Max Length is 2' });
    } else if (name === 'stateNo' && !numericRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else if (name === 'stateNo' && value.length > 3) {
      setFieldErrors({ ...fieldErrors, [name]: 'Max Length is 3' });
    } else if (name === 'stateName' && !nameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else {
      setFormData({ ...formData, [name]: value.toUpperCase() });
      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Update the cursor position after the input change
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  const handleClear = () => {
    setFormData({
      stateCode: '',
      stateNo: '',
      stateName: '',
      country: '',
      active: true
    });
    setFieldErrors({
      stateCode: '',
      stateNo: '',
      stateName: '',
      country: ''
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.stateCode) {
      errors.stateCode = 'State Code is required';
    }
    if (!formData.stateNo) {
      errors.stateNo = 'State No is required';
    }
    if (!formData.stateName) {
      errors.stateName = 'State Name is required';
    }
    if (!formData.country) {
      errors.country = 'Country is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        stateCode: formData.stateCode,
        stateNumber: formData.stateNo,
        stateName: formData.stateName,
        region: '',
        country: formData.country,
        orgId: orgId,
        createdBy: loginUserName
      };
      try {
        const response = await apiCalls('post', `commonmaster/state`, saveFormData);
        if (response.status === true) {
          setIsLoading(false);
          handleClear();
          getAllStates();
          showToast('success', editId ? ' State Updated Successfully' : 'State created successfully');
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'State creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'State creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleCheckboxChange = (event) => {
    setFormData({
      ...formData,
      active: event.target.checked
    });
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
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getStateById} />
          </div>
        ) : (
          <div className="row">
            <div className="col-md-3 mb-3">
              <TextField
                label="State Number"
                variant="outlined"
                size="small"
                fullWidth
                name="stateNo"
                value={formData.stateNo}
                onChange={handleInputChange}
                error={!!fieldErrors.stateNo}
                helperText={fieldErrors.stateNo}
              />
            </div>
            <div className="col-md-3 mb-3">
              <TextField
                label="State Code"
                variant="outlined"
                size="small"
                fullWidth
                name="stateCode"
                value={formData.stateCode}
                onChange={handleInputChange}
                error={!!fieldErrors.stateCode}
                helperText={fieldErrors.stateCode}
              />
            </div>
            <div className="col-md-3 mb-3">
              <TextField
                label="State Name"
                variant="outlined"
                size="small"
                fullWidth
                name="stateName"
                value={formData.stateName}
                onChange={handleInputChange}
                error={!!fieldErrors.stateName}
                helperText={fieldErrors.stateName}
              />
            </div>
            <div className="col-md-3 mb-3">
              <FormControl variant="outlined" size="small" fullWidth error={!!fieldErrors.country}>
                <InputLabel id="country-label">Country</InputLabel>
                <Select labelId="country-label" label="Country" value={formData.country} onChange={handleInputChange} name="country">
                  {countryList?.map((row) => (
                    <MenuItem key={row.id} value={row.countryName}>
                      {row.countryName}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.country && <FormHelperText>{fieldErrors.country}</FormHelperText>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControlLabel
                control={<Checkbox checked={formData.active} onChange={handleCheckboxChange} />}
                label="Active"
                labelPlacement="end"
              />
            </div>
          </div>
        )}
      </div>
      <ToastComponent />
    </>
  );
};

export default State;
