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
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

export const Uom = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    active: true,
    uomCode: '',
    uomDesc: '',
  });
  const [editId, setEditId] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    uomDesc: '',
    uomCode: '',
  });
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);

  const listViewColumns = [
    { accessorKey: 'uomCode', header: 'UOM Code', size: 140 },
    { accessorKey: 'uomDesc', header: 'UOM Description', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 },
  ];

  useEffect(() => {
    getAllUom();
  }, []);

  // List API
  const getAllUom = async () => {
    try {
      const result = await apiCalls('get', `/efitmaster/getUomByOrgId?orgId=${orgId}`);
      setListViewData(result.paramObjectsMap.uomVO.reverse());
    } catch (err) {
      console.error('Error fetching UOM data:', err);
    }
  };

  // edit API
  const getUomById = async (row) => {
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `/efitmaster/getUomById?id=${row.original.id}`);
      if (response.status === true) {
        const particularUom = response.paramObjectsMap.uomVO[0];
        setFormData({
          uomCode: particularUom.uomCode,
          uomDesc: particularUom.uomDesc,
          active: particularUom.active === 'Active' ? true : false

        });
        setListView(false);
      } else {
        console.error('API Error');
      }
    } catch (error) {
      console.error('Error fetching UOM by ID:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleClear = () => {
    setFormData({
      uomDesc: '',
      uomCode: '',
      active: true,
    });
    setFieldErrors({
      uomDesc: '',
      uomCode: '',
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.uomCode) {
      errors.uomCode = 'UOM Code is required';
    }
    if (!formData.uomDesc) {
      errors.uomDesc = 'UOM Description is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        ...(editId && { id: editId }),
        createdby: loginUserName,
        orgId: orgId,
        active: formData.active,
        uomCode: formData.uomCode,
        uomDesc: formData.uomDesc,
      };

      // save and update api
      try {
        const result = await apiCalls('put', `/efitmaster/updateCreateUom`, saveFormData);

        if (result.status === true) {
          showToast(
            'success',
            editId ? 'Unit Of Measurement Updated Successfully' : 'Unit Of Measurement Added Successfully'
          );
          handleClear();
          getAllUom();
        } else {
          showToast('error', result.paramObjectsMap.errorMessage || 'Operation failed');
        }
      } catch (err) {
        console.error('Error saving UOM:', err);
        showToast('error', 'Operation failed');
      } finally {
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
          <div className="d-flex flex-wrap justify-content-start mb-4">
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton
              title="Save"
              icon={SaveIcon}
              isLoading={isLoading}
              onClick={handleSave}
              margin="0 10px 0 10px"
            />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getUomById}
            />
          </div>
        ) : (
          <div className="row">
            <div className="col-md-3 mb-3">
              <TextField
                label="UOM Code"
                variant="outlined"
                size="small"
                fullWidth
                name="uomCode"
                value={formData.uomCode}
                onChange={handleInputChange}
                error={!!fieldErrors.uomCode}
                helperText={fieldErrors.uomCode}
              />
            </div>
            <div className="col-md-3 mb-3">
              <TextField
                label="UOM Description"
                variant="outlined"
                size="small"
                fullWidth
                name="uomDesc"
                value={formData.uomDesc}
                onChange={handleInputChange}
                error={!!fieldErrors.uomDesc}
                helperText={fieldErrors.uomDesc}
              />
            </div>
            <div className="col-md-3 mb-3">
              <FormControlLabel
                control={<Checkbox checked={formData.active}
                  name='active'
                  onChange={handleInputChange} />}
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

export default Uom;
