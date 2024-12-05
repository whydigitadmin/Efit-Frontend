import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const RackMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({
    rackLocation: '',
    rackNo: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    rackLocation: '',
    rackNo: '',
    active: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'rackLocation', header: ' Rack Location', size: 140 },
    { accessorKey: 'rackNo', header: 'Rack No', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getRackMasterByOrgId();
  }, []);
  const getRackMasterByOrgId = async () => {
    try {
      const response = await apiCalls('get', `/efitmaster/getRackMasterByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.rackMasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getRackMasterById = async (row) => {
    console.log('THE SELECTED getRackMasterById ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `efitmaster/getRackMasterById/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCompany = response.paramObjectsMap.rackMasterVO[0];
        console.log('THE PARTICULAR getRackMasterById DETAILS ARE:', particularCompany);

        setFormData({
          rackLocation: particularCompany.rackLocation,
          rackNo: particularCompany.rackNo,
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
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue.toUpperCase() });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleClear = () => {
    setFormData({
      rackLocation: '',
      rackNo: '',
      active: true
    });
    setFieldErrors({
      rackLocation: '',
      rackNo: ''
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.rackLocation) {
      errors.rackLocation = 'Rack Location is Required';
    }
    if (!formData.rackNo) {
      errors.rackNo = 'Rack No is Required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        createdBy: loginUserName,
        orgId: orgId,
        rackLocation: formData.rackLocation,
        rackNo: formData.rackNo
      };
      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `efitmaster/updateCreateRackMaster`, saveFormData);
        if (response.status === true) {
          setIsLoading(false);
          handleClear();
          showToast('success', editId ? ' Rack Master Updated Successfully' : 'Rack Master created successfully');
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Rack Master creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Rack Master creation failed');
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
              blockEdit={true}
              toEdit={getRackMasterById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.rackLocation}>
                  <InputLabel id="rackLocation">
                    {
                      <span>
                        Rack Location <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="rackLocation"
                    id="rackLocation"
                    label="Rack Location"
                    onChange={handleInputChange}
                    name="rackLocation"
                    value={formData.rackLocation}
                  >
                    <MenuItem value="--Select--">--Select--</MenuItem>
                    <MenuItem value="RAW MATERIAL">RAW MATERIAL</MenuItem>
                    <MenuItem value="FG/SFG">FG/SFG</MenuItem>
                    <MenuItem value="Assembly">Assembly</MenuItem>
                  </Select>
                  {fieldErrors.rackLocation && <FormHelperText style={{ color: 'red' }}>Rack Location is required</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Rack No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="rackNo"
                  value={formData.rackNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.rackNo}
                  helperText={fieldErrors.rackNo}
                />
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

export default RackMaster;
