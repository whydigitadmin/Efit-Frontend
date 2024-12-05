import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const ProcessMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [docId, setDocId] = useState('');
  const [editId, setEditId] = useState('');

  const [formData, setFormData] = useState({
    processName: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    processName: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Process ID', size: 140 },
    { accessorKey: 'processName', header: 'Process Name', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getProcessMasterDocId();
    getAllProcessMaster();
  }, []);

  const getProcessMasterDocId = async () => {
    try {
      const response = await apiCalls('get', `/efitmaster/getProcessMasterDocId?orgId=${orgId}`);

      // Update state with the new docId
      setDocId(response.paramObjectsMap.processMasterDocId);

      // Optionally update formData if docId is part of it
      setFormData((prevFormData) => ({
        ...prevFormData,
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    let error = '';

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
    }
  };

  const getProcessMasterById = async (row) => {
    try {
      const response = await apiCalls('get', `efitmaster/getProcessMasterById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setEditId(row.original.id)
        setListView(false);
        const particularProcess = response.paramObjectsMap.processMasterVO[0];
        console.log('PROCESS MASTER IS:', particularProcess);

        // Update both docId and formData synchronously
        setDocId(particularProcess.docId);
        setFormData((prevFormData) => ({
          ...prevFormData,
          orgId: particularProcess.orgId,
          processName: particularProcess.processName,
        }));
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllProcessMaster = async () => {
    try {
      const response = await apiCalls('get', `efitmaster/getAllProcessMasterByOrgId?orgId=${orgId}`);

      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.processMasterVO.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      processName: ''
    });
    setFieldErrors({
      processName: '',
    });
    setEditId('');
    getProcessMasterDocId();
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.processName) {
      errors.processName = 'Process Name is required';
    }


    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        ...(editId && { id: editId }),
        orgId: orgId,
        docDate: formData.docDate,
        processName: formData.processName,
        createdBy: loginUserName,
        updatedBy: loginUserName,
        cancelRemarks: formData.cancelRemarks,
        screenCode: formData.screenCode,
        screenName: formData.screenName,
        commonDate: formData.commonDate,
        active: formData.active,
        cancel: formData.cancel,
        message: formData.message
      };
      console.log('THE SAVE FORM DATA IS:', saveFormData);

      try {
        const response = await apiCalls('put', `efitmaster/createUpdateProcessMaster`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);

          showToast('success', ' Process Master updated Successfully');
          handleClear();
          setIsLoading(false);
          getAllProcessMaster();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Process Master updation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Process Master updation failed');

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
              toEdit={getProcessMasterById}
            />
          </div>
        ) : (
          <>
            <div className="row">

              <div className="col-md-3 mb-3">
                <TextField
                  label="Process ID"
                  variant="outlined"
                  disabled
                  size="small"
                  fullWidth
                  name="docId"
                  value={docId}
                  onChange={handleInputChange}
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
