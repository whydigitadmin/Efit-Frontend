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

const Uom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({
    UOMCode: '',
    UOMDescription: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    UOMCode: '',
    UOMDescription: '',
    active: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'UOMCode', header: 'UOM Code', size: 140 },
    {
      accessorKey: 'UOMDescription',
      header: 'UOM Description',
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
          UOMCode: particularCompany.UOMCode,
          UOMDescription: particularCompany.UOMDescription,
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
    const UOMDescriptionRegex = /^[A-Za-z 0-9@_\-*]*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const UOMCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;

    if (name === 'UOMDescription' && !UOMDescriptionRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Only alphabetic characters and @*_- are allowed' });
    } else if (name === 'UOMCode' && !UOMCodeRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else if (name === 'companyAdminName' && !nameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else {
      let updatedValue = value;

      if (name !== 'companyAdminEmail') {
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
      UOMCode: '',
      UOMDescription: '',
      active: true
    });
    setFieldErrors({
      UOMCode: '',
      UOMDescription: '',
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.UOMCode) {
      errors.UOMCode = 'UOM  Code is required';
    }
    if (!formData.UOMDescription) {
      errors.UOMDescription = 'UOM Description is required';
    }
   
    if (!formData.companyAdminEmail) {
      errors.companyAdminEmail = 'company Admin Email ID is required';
    } else if (!emailRegex.test(formData.companyAdminEmail)) {
      errors.companyAdminEmail = 'Invalid MailID Format';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        UOMCode: formData.UOMCode,
        UOMDescription: formData.UOMDescription,
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
                <TextField
                  label="UOM Code *"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="UOMCode"
                  value={formData.UOMCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.UOMCode}
                  helperText={fieldErrors.UOMCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="UOM Description * "
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="UOMDescription"
                  value={formData.UOMDescription}
                  onChange={handleInputChange}
                  error={!!fieldErrors.UOMDescription}
                  helperText={fieldErrors.UOMDescription}
                // inputRef={UOMDescriptionRef}
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

export default Uom;
