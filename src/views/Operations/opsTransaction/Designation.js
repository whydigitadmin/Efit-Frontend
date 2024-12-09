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
  const [designationId, setDesignationId] = useState('');
  const [formData, setFormData] = useState({
    designation: '',
    active: true,
  });

  const [fieldErrors, setFieldErrors] = useState({
    designation: '',
    active: true,
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'docid', header: 'Designation Id', size: 140 },
    { accessorKey: 'designation', header: 'Designation', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getDesignationByOrgId();
    getDesignationId();
  }, []);
  const getDesignationByOrgId = async () => {
    try {
      const response = await apiCalls('get', `/efitmaster/getDesignationByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.designationVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getDesignationById = async (row) => {
    console.log('THE SELECTED COMPANY ID IS:', row.original.id);
    setEditId(row.original.id);

    try {
      const response = await apiCalls('get', `efitmaster/getDesignationById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);

        const designa = response.paramObjectsMap.designationVO[0];
        console.log('THE PARTICULAR DESIGNATION DETAILS ARE:', designa);

        setFormData({
          // docId: designa.docid,
          designation: designa.designation,
          active: designa.active === 'Active',
          createdBy: loginUserName
        });
        setDesignationId(designa.docid)
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getDesignationId = async () => {
    try {
      const response = await apiCalls('get', `/efitmaster/getDesignationDocId?orgId=${orgId}`);
      setDesignationId(response.paramObjectsMap.getDesignationDocId)
    } catch (error) {
      console.error('Error fetching DesignationId:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    const nameRegex = /^[A-Za-z- ]*$/;
    let errorMessage = '';
  
    switch (name) {
      case 'designation':
        if (!nameRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
        break;
    }
  
    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value.toUpperCase(),
      }));
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
    // Preserve cursor position for text inputs
    if (type === 'text' || type === 'textarea') {
      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement && inputElement.setSelectionRange) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  };
  const handleClear = () => {
    setFormData({
      designation: '',
      active: true,
    });
    setFieldErrors({
      designation: '',
    });
    getDesignationId();
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.designation) {
      errors.designation = 'Designation is Required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        orgId: orgId,
        createdBy: loginUserName,
        designation: formData.designation
      };
      console.log('DATA TO SAVE IS:', saveData);

      try {
        const response = await apiCalls('put', '/efitmaster/updateCreateDesignation', saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Designation updated successfully' : 'Designation created successfully');
          getDesignationByOrgId();
          getDesignationId()
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Designation value creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Designation value creation failed');
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
              toEdit={getDesignationById}
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
                  value={designationId}
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