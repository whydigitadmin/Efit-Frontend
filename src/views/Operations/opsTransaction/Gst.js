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

const Gst = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({
    gstSlab: '',
    gstPercentage: '',
    igstPercentage: '',
    cgstPercentage: '',
    sgstPercentage: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    gstSlab: '',
    gstPercentage: '',
    igstPercentage: '',
    cgstPercentage: '',
    sgstPercentage: '',
    active: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'gstSlab', header: 'GST Slab', size: 140 },
    { accessorKey: 'gstPercentage', header: 'GST Percentage', size: 140 },
    { accessorKey: 'igstPercentage', header: 'IGST Percentage', size: 140 },
    { accessorKey: 'cgstPercentage', header: 'CGST Percentage', size: 140 },
    { accessorKey: 'sgstPercentage', header: 'SGST Percentage', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllGstByOrgId();
  }, []);
  const getAllGstByOrgId = async () => {
    try {
      const response = await apiCalls('get', `/efitmaster/getAllGstByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.gstVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // 
  const getGstById = async (row) => {
    console.log('THE SELECTED COMPANY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `/efitmaster/getGstById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const Gst = response.paramObjectsMap.gstVO[0];
        console.log('THE PARTICULAR COMPANY DETAILS ARE:', Gst);

        setFormData({
          gstSlab: Gst.gstSlab,
          gstPercentage: parseInt(Gst.gstPercentage),
          igstPercentage: parseInt(Gst.igstPercentage),
          cgstPercentage: parseInt(Gst.cgstPercentage),
          sgstPercentage: parseInt(Gst.sgstPercentage),
          active: Gst.active === 'Active',
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

    if (name !== 'active' && name !== 'gstSlab' && isNaN(value)) {
      return;
    }

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (value === '') {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'This field is Required.',
      }));
    } else {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };


  const handleClear = () => {
    setFormData({
      gstSlab: '',
      gstPercentage: '',
      igstPercentage: '',
      cgstPercentage: '',
      sgstPercentage: '',
      active: true
    });
    setFieldErrors({
      gstSlab: '',
      gstPercentage: '',
      igstPercentage: '',
      cgstPercentage: '',
      sgstPercentage: ''
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.gstSlab) {
      errors.gstSlab = 'GST Slab is Required';
    }
    if (!formData.gstPercentage) {
      errors.gstPercentage = 'GST Percentage is Required';
    }
    if (!formData.igstPercentage) {
      errors.igstPercentage = 'IGST Percentage is Required';
    }
    if (!formData.cgstPercentage) {
      errors.cgstPercentage = 'CGST Percentage is Required';
    }
    if (!formData.sgstPercentage) {
      errors.sgstPercentage = 'SGST Percentage is Required';
    }


    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        createdBy: loginUserName,
        orgId: parseInt(orgId),
        gstSlab: formData.gstSlab,
        cgstPercentage: parseInt(formData.cgstPercentage),
        gstPercentage: parseInt(formData.gstPercentage),
        igstPercentage: parseInt(formData.igstPercentage),
        sgstPercentage: parseInt(formData.sgstPercentage),
      };
      console.log('DATA TO SAVE IS:', saveData);

      try {
        const response = await apiCalls('put', `/efitmaster/createUpdateGst`, saveData);
        if (response.status === true) {
          showToast('success', editId ? 'GST Updated Successfully' : 'GST created successfully');
          getAllGstByOrgId();
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'GST creation failed');
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
              toEdit={getGstById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="GST Slab"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="gstSlab"
                  value={formData.gstSlab}
                  onChange={handleInputChange}
                  error={!!fieldErrors.gstSlab}
                  helperText={fieldErrors.gstSlab}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="GST Percentage"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="gstPercentage"
                  value={formData.gstPercentage}
                  onChange={handleInputChange}
                  error={!!fieldErrors.gstPercentage}
                  helperText={fieldErrors.gstPercentage}
                // inputRef={gstPercentageRef}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="IGST Percentage"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="igstPercentage"
                  value={formData.igstPercentage}
                  onChange={handleInputChange}
                  error={!!fieldErrors.igstPercentage}
                  helperText={fieldErrors.igstPercentage}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="CGST Percentage"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="cgstPercentage"
                  value={formData.cgstPercentage}
                  onChange={handleInputChange}
                  error={!!fieldErrors.cgstPercentage}
                  helperText={fieldErrors.cgstPercentage}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="SGST Percentage"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="sgstPercentage"
                  value={formData.sgstPercentage}
                  onChange={handleInputChange}
                  error={!!fieldErrors.sgstPercentage}
                  helperText={fieldErrors.sgstPercentage}
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

export default Gst;
