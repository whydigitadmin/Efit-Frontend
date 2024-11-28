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

const Designation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({
    designationId: '',
    designation: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    designationId: '',
    designation: '',
    active: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'designationId', header: ' Department Id', size: 140 },
    { accessorKey: 'designation', header: 'Department Code', size: 140 },
    { accessorKey: 'departmentName', header: 'Department Name', size: 140 },
    // { accessorKey: 'active', header: 'Active', size: 140 }
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
          gstSlab: particularCompany.gstSlab,
          gstPercentage: particularCompany.gstPercentage,
          designationId: particularCompany.employeeName,
          designation: particularCompany.designation,
          active: particularCompany.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Create a copy of the current fieldErrors state
    const newFieldErrors = { ...fieldErrors };

    // Validation for designation field
    if (name === 'designation') {
      if (value.trim() === '') {
        newFieldErrors[name] = 'Designation is Required';
      } else {
        newFieldErrors[name] = ''; // Clear error if valid
      }
    } 
    if (name === 'active') { 
    }

    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Update the fieldErrors state
    setFieldErrors(newFieldErrors);
  };
  




  const handleClear = () => {
    setFormData({
      designationId: '',
      designation: '', 
      active: true
    });
    setFieldErrors({
      designationId: '',
      designation: '', 
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};

    // if (!formData.designationId) {
    //   errors.designationId = 'Department Id is Required';
    // }
    if (!formData.designation) {
      errors.designation = 'Designation is Required';
    } 


    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        orgId: orgId

      };
      console.log('DATA TO SAVE IS:', saveData);

      try {
        const method = editId ? 'put' : 'post';
        const url = editId ? 'commonmaster/updateCompany' : 'commonmaster/company';

        const response = await apiCalls(method, url, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' Company Updated Successfully' : 'Company created successfully');

          handleClear();
          getAllCompanies();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Company creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Company creation failed');

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
                <TextField id="designation"
                  label="Designation Id"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="designationId"
                  value={formData.designationId}
                  error={!!fieldErrors.designationId}
                  helperText={fieldErrors.designationId}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Designation"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  error={!!fieldErrors.designation}
                  helperText={fieldErrors.designation}
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

export default Designation; 