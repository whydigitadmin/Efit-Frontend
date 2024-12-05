import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormHelperText, Autocomplete } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const MeasuringInstrument = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [docId, setDocId] = useState('');
  const [itemName, setItemName] = useState([]);
  const [editId, setEditId] = useState('');

  const [formData, setFormData] = useState([
    {
      item: '',
      ranges: '',
      leastCount: '',
      colorCode: '',
      instrumentCode: '',
      calibrationFrequence: '',
      remarks: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    item: '',
    ranges: '',
    leastCount: '',
    colorCode: '',
    instrumentCode: '',
    calibrationFrequence: '',
    remarks: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Measuring Instrument ID', size: 140 },
    { accessorKey: 'instrumentName', header: 'Instrument Name', size: 140 },
    { accessorKey: 'ranges', header: 'Range', size: 140 },
    { accessorKey: 'leastCount', header: 'Least Count', size: 140 },
    { accessorKey: 'colourCode', header: 'Color Code', size: 140 },
    { accessorKey: 'instrumentCode', header: 'Instrument Code', size: 140 },
    { accessorKey: 'calibrationFrequence', header: 'Calibration Frequence', size: 140 },
    { accessorKey: 'remarks', header: 'Remarks', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getMeasuringInstrumentDocId();
    getAllMeasuringInstrument();
    getAllInstrumentName(orgId);
  }, []);

  const getAllInstrumentName = async (orgId) => {
    try {
      const response = await apiCalls('get', `efitmaster/getInstrumentNameFromItemMaster?orgId=${orgId}`);
      if (response.status === true) {
        const instrumentData = response.paramObjectsMap.measuringInstrumentVO.map(({ id, item }) => ({ id, item }));
        setItemName(instrumentData);
        return instrumentData;
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const getMeasuringInstrumentDocId = async () => {
    try {
      const response = await apiCalls('get', `/efitmaster/getMeasuringInstrumentsDocId?orgId=${orgId}`);
      setDocId(response.paramObjectsMap.MeasuringInstrumentsDocId);
      setFormData((prevFormData) => ({
        ...prevFormData
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    const nameRegex = /^[A-Za-z]*$/;
    const allRegex = /^[a-zA-Z0-9-]*$/;
    const numRegex = /^[0-9.]*$/;

    let errorMessage = '';

    switch (name) {
      // case 'item':
      //   if (!allRegex.test(value)) {
      //     errorMessage = 'Invalid Format';
      //   }
      //   break;
      case 'ranges':
        if (!numRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'leastCount':
        if (!numRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'instrumentCode':
        if (!allRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'calibrationFrequence':
        if (!numRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      // Set field errors if validation fails
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      // Update formData and clear field errors
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'text' || type === 'textarea' ? value.toUpperCase() : value
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

  const getMeasuringInstrumentId = async (row) => {
    try {
      const response = await apiCalls('get', `efitmaster/getMeasuringInstrumentById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setEditId(row.original.id);
        setListView(false);
        const particularInstrument = response.paramObjectsMap.measuringInstrumentsVO[0];
        console.log('PARTICULAR Instrument IS:', particularInstrument);

        setDocId(particularInstrument.docId);
        setFormData((prevFormData) => ({
          ...prevFormData,
          orgId: particularInstrument.orgId,
          item: particularInstrument.instrumentName,
          ranges: particularInstrument.ranges,
          leastCount: particularInstrument.leastCount,
          colorCode: particularInstrument.colourCode,
          instrumentCode: particularInstrument.instrumentCode,
          calibrationFrequence: particularInstrument.calibrationFrequence,
          remarks: particularInstrument.remarks
        }));
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllMeasuringInstrument = async () => {
    try {
      const response = await apiCalls('get', `efitmaster/getMeasuringInstrumentByOrgId?orgId=${orgId}`);

      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.measuringInstrumentsVO.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      item: '',
      ranges: '',
      leastCount: '',
      colorCode: '',
      instrumentCode: '',
      calibrationFrequence: '',
      remarks: ''
    });
    setFieldErrors({
      item: '',
      ranges: '',
      leastCount: '',
      colorCode: '',
      instrumentCode: '',
      calibrationFrequence: '',
      remarks: ''
    });
    setEditId('');
    getMeasuringInstrumentDocId();
  };

  const handleSave = async () => {
    const errors = {};

    // Validation
    if (!formData.item) {
      errors.item = 'Instrument Name is required';
    }
    if (!formData.ranges) {
      errors.ranges = 'Range is required';
    }
    if (!formData.leastCount) {
      errors.leastCount = 'Least Count is required';
    }
    if (!formData.colorCode) {
      errors.colorCode = 'Color Code is required';
    }
    if (!formData.instrumentCode) {
      errors.instrumentCode = 'Instrument Code is required';
    }
    if (!formData.calibrationFrequence) {
      errors.calibrationFrequence = 'Calibration Frequency is required';
    }
    if (!formData.remarks) {
      errors.remarks = 'Remarks are required';
    }

    // Check for errors
    if (Object.keys(errors).length > 0) {
      console.log('Validation Errors:', errors);
      setFieldErrors(errors);
      return;
    }

    // Prepare data for API
    const saveFormData = {
      ...(editId && { id: editId }),
      orgId: orgId,
      createdBy: loginUserName,
      docId: formData.docId,
      instrumentName: formData.item,
      ranges: parseFloat(formData.ranges),
      leastCount: parseFloat(formData.leastCount),
      colourCode: formData.colorCode,
      instrumentCode: formData.instrumentCode,
      calibrationFrequence: parseFloat(formData.calibrationFrequence),
      remarks: formData.remarks
    };

    console.log('Save Form Data:', saveFormData);

    // API Call
    setIsLoading(true);
    try {
      const response = await apiCalls('put', 'efitmaster/updateCreateMeasuringInstruments', saveFormData);

      if (response.status === true) {
        showToast('success', 'Measuring Instrument updated successfully');
        setFormData({});
        handleClear();
        setFieldErrors({});
        getAllMeasuringInstrument();
      } else {
        const errorMessage = response.paramObjectsMap?.errorMessage || 'An unknown error occurred.';
        showToast('error', errorMessage);
      }
    } catch (error) {
      if (error.response) {
        // API responded with a status code outside 2xx range
        console.error('Error response:', error.response);
        showToast('error', `Error ${error.response.status}: ${error.response.data || 'Bad Request'}`);
      } else {
        // No response received or other errors
        console.error('API Error:', error);
        showToast('error', 'Failed to update Measuring Instrument.');
      }
    } finally {
      setIsLoading(false);
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
            <ActionButton
              title="Save"
              icon={SaveIcon}
              isLoading={isLoading}
              onClick={handleSave}
              margin="0 10px 0 10px"
              disabled={isLoading}
            />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              // editCallback={editEmployee}
              blockEdit={true} // DISAPLE THE MODAL IF TRUE
              toEdit={getMeasuringInstrumentId}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Measuring Instrument ID"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="docId"
                  value={docId}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Instrument Code"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="instrumentCode"
                  value={formData.instrumentCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.instrumentCode}
                  helperText={fieldErrors.instrumentCode}
                />
              </div>

              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={itemName}
                  getOptionLabel={(option) => option.item || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.item ? itemName.find((c) => c.item === formData.item) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'item',
                        value: newValue ? newValue.item : ''
                      }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Instrument Name"
                      name="item"
                      error={!!fieldErrors.item}
                      helperText={fieldErrors.item}
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                    />
                  )}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Range"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="ranges"
                  value={formData.ranges}
                  onChange={handleInputChange}
                  error={!!fieldErrors.ranges}
                  helperText={fieldErrors.ranges}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Least Count"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="leastCount"
                  value={formData.leastCount}
                  onChange={handleInputChange}
                  error={!!fieldErrors.leastCount}
                  helperText={fieldErrors.leastCount}
                />
              </div>

              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.colorCode}>
                  <InputLabel id="colorCode">Color Code</InputLabel>
                  <Select
                    labelId="colourCode"
                    id="colourCode"
                    label="Color Code"
                    onChange={handleInputChange}
                    name="colourCode"
                    value={formData.colourCode}
                  >
                    <MenuItem value="YELLOW">YELLOW</MenuItem>
                    <MenuItem value="GREEN">GREEN</MenuItem>
                  </Select>
                  {fieldErrors.colourCode && <FormHelperText>{fieldErrors.colourCode}</FormHelperText>}
                </FormControl>
              </div> */}
              <div className="col-md-3 mb-3">
                <TextField
                  label="Color Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="colorCode"
                  value={formData.colorCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.colorCode}
                  helperText={fieldErrors.colorCode}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Calibration Frequence"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="calibrationFrequence"
                  value={formData.calibrationFrequence}
                  onChange={handleInputChange}
                  error={!!fieldErrors.calibrationFrequence}
                  helperText={fieldErrors.calibrationFrequence}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Remarks"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  name="remarks"
                  value={formData.remarks}
                  maxLength={6}
                  onChange={handleInputChange}
                  error={!!fieldErrors.remarks}
                  helperText={fieldErrors.remarks}
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

export default MeasuringInstrument;
