import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
// import { getAllActiveBranches, getAllActiveRoles } from 'utils/CommonFunctions';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { encryptPassword } from 'views/utilities/passwordEnc';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { toast } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';

const DetailsToBank = () => {
  const [listViewData, setListViewData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [partyList, setPartyList] = useState([]);
  const [listView, setListView] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [file, setFile] = useState('');

  const [formData, setFormData] = useState({
    docId: '',
    docDate: '',
    invoiceDate: '',
    invoiceNo: '',
    narration: '',
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    docId: '',
    docDate: '',
    invoiceDate: '',
    invoiceNo: '',
    narration: '',
    orgId: orgId
  });

  const listViewColumns = [
    { accessorKey: 'docId', header: 'DOC ID', size: 140 },
    { accessorKey: 'docDate', header: 'DocDate', size: 140 },
    { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 140 },
    { accessorKey: 'invoiceNo', header: 'Invoice No', size: 140 }
  ];

  const [submissionBankData, setSubmissionBankData] = useState([
    {
      id: 1,
      documentName: '',
      status: '',
      attachment: ''
    }
  ]);
  const [submissionBankErrors, setSubmissionBankErrors] = useState([
    {
      documentName: '',
      status: '',
      attachment: ''
    }
  ]);

  const [bankSummaryData, setBankSummaryData] = useState([
    {
      id: 1,
      narration: ''
    }
  ]);
  const [bankSummaryErrors, setBankSummaryErrors] = useState([
    {
      narration: ''
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    if (name === 'indentNo' || name === 'customerPONo') {
      if (!/^\d*$/.test(value)) {
        return;
      }
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    }

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    }

    setFieldErrors({ ...fieldErrors, [name]: '' });

    if (type === 'text' || type === 'textarea') {
      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement && inputElement.setSelectionRange) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };


  // const getAllRoles = async () => {
  //   try {
  //     const branchData = await getAllActiveRoles(orgId);
  //     setRoleList(branchData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };
  // const getAllBranches = async () => {
  //   try {
  //     const branchData = await getAllActiveBranches(orgId);
  //     setBranchList(branchData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };

  // const getAllUsers = async () => {
  //   try {
  //     const response = await apiCalls('get', `/master/getAllEmployeeByOrgId?orgId=${orgId}`);
  //     console.log('API Response:', response);

  //     if (response.status === true) {
  //       setEmpList(response.paramObjectsMap.employeeVO);
  //     } else {
  //       console.error('API Error:', response);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // const getAllUserCreation = async () => {
  //   try {
  //     const response = await apiCalls('get', `/auth/allUsersByOrgId?orgId=${orgId}`);
  //     console.log('API Response:', response);

  //     if (response.status === true) {
  //       setListViewData(response.paramObjectsMap.userVO);
  //     } else {
  //       console.error('API Error:', response);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.invoiceDate) {
      errors.invoiceDate = 'Invoice Date is required';
    }
    if (!formData.invoiceNo) {
      errors.invoiceNo = 'Invoice No is required';
    }
    if (!formData.narration) {
      errors.narration = 'Narration is required';
    }

    setFieldErrors(errors);

    let submissionBankDataValid = true;
    if (!submissionBankData || !Array.isArray(submissionBankData) || submissionBankData.length === 0) {
      submissionBankDataValid = false;
      setSubmissionBankErrors([{ general: 'PurchaseIndent is required' }]);
    } else {
      const newTableErrors = submissionBankData.map((row, index) => {
        const rowErrors = {};

        if (!row.documentName) {
          rowErrors.documentName = 'Document Name is required';
          submissionBankDataValid = false;
        }
        if (!row.status) {
          rowErrors.status = 'Status is required';
          submissionBankDataValid = false;
        }
        if (!row.attachment) {
          rowErrors.attachment = 'Attachment is required';
          submissionBankDataValid = false;
        }

        return rowErrors;
      });
      setSubmissionBankErrors(newTableErrors);
    }

    let bankSummaryDataValid = true;

    if (!bankSummaryData || !Array.isArray(bankSummaryData) || bankSummaryData.length === 0) {
      bankSummaryDataValid = false;
      setBankSummaryErrors([{ general: 'PurchaseIndent is required' }]);
    } else {
      const newTableErrors = bankSummaryData.map((row) => {
        const rowErrors = {};
        if (!row.narration || row.narration.trim() === '') {
          rowErrors.narration = 'Narration is required';
          bankSummaryDataValid = false;
        }
        return rowErrors;
      });

      setBankSummaryErrors(newTableErrors);
    }

    setFieldErrors(errors);


    if (Object.keys(errors).length === 0 && submissionBankDataValid) {
      setIsLoading(true);

      const encryptedPassword = encryptPassword('Wds@2022');
      const branchVo = submissionBankData.map((row) => ({
        branchCode: row.branchCode,
        branch: row.branch
      }));

      const saveFormData = {
        ...(editId && { id: formData.docId }),
        userName: formData.userName,
        ...(!editId && { password: encryptedPassword }),
        docId: formData.docId,
        docDate: formData.docDate,
        invoiceDate: formData.invoiceDate,
        invoiceNo: formData.invoiceNo,
        orgId: orgId,
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `auth/signup`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'User Updated Successfully' : 'User created successfully');
          handleClear();
          // getAllUsers();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'User creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'User creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleClear = () => {
    setFormData({
      // docId: '',
      // docDate: '',
      invoiceNo: '',
      orgId: orgId
    });
    setFieldErrors({
      docId: false,
      docDate: false,
    });
    setSubmissionBankData([{ id: 1, documentName: '', status: '', attachment: '' }]);
    setBankSummaryData([{ narration: '' }])
    setSubmissionBankErrors('');
    setBankSummaryErrors('');
    setEditId('');
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(submissionBankData)) {
      displayRowError(submissionBankData);
      return;
    }
    const newRow = {
      id: Date.now(),
      documentName: '',
      status: '',
      attachment: ''
    };
    setSubmissionBankData([...submissionBankData, newRow]);
    setSubmissionBankErrors([...submissionBankErrors, { documentName: '', status: '', attachment: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === submissionBankData) {
      return !lastRow.documentName || !lastRow.status || !lastRow.attachment;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === submissionBankData) {
      setSubmissionBankErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          documentName: !table[table.length - 1].documentName ? 'Document Name is required' : '',
          status: !table[table.length - 1].status ? 'Status is required' : '',
          attachment: !table[table.length - 1].attachment ? 'Attachment is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable = [], setErrorTable) => {
    // Ensure `table` and `errorTable` are arrays
    if (!Array.isArray(table) || !Array.isArray(errorTable)) {
      console.error("Invalid table or errorTable format. Both must be arrays.");
      return;
    }

    const rowIndex = table.findIndex((row) => row.id === id);

    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };


  const handleIndentChange = (row, index, event) => {
    const value = event.target.value;
    const selectedRole = roleList.find((role) => role.role === value);
    setSubmissionBankData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setBankSummaryData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setSubmissionBankErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        role: !value ? 'Role is required' : ''
      };
      return newErrors;
    });
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBulkUploadOpen = () => {
    setUploadOpen(true);
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false);
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    toast.success("File uploded sucessfully")
    console.log('Submit clicked');
    handleBulkUploadClose();
    // getAllData();
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>

          {!listView ? (
            <>
              <div className="row d-flex ml">

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Docid"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="docId"
                    value={formData.docId}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.docId ? 'DOC Id is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Docdate"
                        disabled
                        value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('docDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.docDate}
                        helperText={fieldErrors.docDate ? fieldErrors.docDate : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Invoice Date"
                        value={formData.invoiceDate ? dayjs(formData.invoiceDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('invoiceDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.invoiceDate}
                        helperText={fieldErrors.invoiceDate ? fieldErrors.invoiceDate : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Invoice No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.invoiceNo}
                    helperText={fieldErrors.invoiceNo}
                  />
                </div>

              </div>

              <div className="row mt-2">
                <Box sx={{ width: '100%' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value={0} label="Submission to Bank Details" />
                    <Tab value={1} label="Summary" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>

                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                          <ActionButton icon={CloudUploadIcon} title='Upload' onClick={handleBulkUploadOpen} />

                          {uploadOpen && (
                            <CommonBulkUpload
                              open={uploadOpen}
                              handleClose={handleBulkUploadClose}
                              title="Upload Files"
                              uploadText="Upload file"
                              downloadText="Sample File"
                              onSubmit={handleSubmit}
                              // sampleFileDownload={FirstData}
                              handleFileUpload={handleFileUpload}
                              apiUrl={`excelfileupload/excelUploadForSample`}
                              screen="PutAway"
                            />
                          )}
                        </div>

                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Document Name</th>
                                    <th className="table-header">Status</th>
                                    <th className="table-header">Atachments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {submissionBankData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="col-md-1 border px-2 py-2 text-center">
                                        <ActionButton
                                          className=" mb-2"
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              submissionBankData,
                                              setSubmissionBankData,
                                              submissionBankErrors,
                                              setSubmissionBankErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          // style={{ width: '0px' }}
                                          value={row.documentName}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setSubmissionBankData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, documentName: value } : r))
                                            );
                                            setSubmissionBankErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                documentName: !value ? 'Document Name is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={submissionBankErrors[index]?.documentName ? 'error form-control' : 'form-control'}
                                        />
                                        {submissionBankErrors[index]?.documentName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {submissionBankErrors[index].documentName}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2 ">
                                        <select
                                          value={row.status}
                                          style={{ width: '200px', textAlign: 'center' }}
                                          className={submissionBankErrors[index]?.status ? 'error form-control' : 'form-control'}
                                          onChange={(e) =>
                                            setSubmissionBankData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, status: e.target.value } : r))
                                            )
                                          }
                                        >
                                          <option value="">-- Select --</option>
                                          <option value="">Submitted</option>
                                          <option value="">Pending</option>
                                          {bankDetails.map((item) => (
                                            <option key={item.id} value={item.status}>
                                              {item.status}
                                            </option>
                                          ))}
                                        </select>
                                        {submissionBankErrors[index]?.status && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {submissionBankErrors[index].status}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input type="file" onChange={handleFileChange} />
                                      </td>

                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {value === 1 && (
                    <>
                      {bankSummaryData.map((row, index) => (
                        <div className="row d-flex">

                          <div className="col-md-3 mb-3">
                            <TextField
                              id="outlined-textarea-zip"
                              label="Narration"
                              variant="outlined"
                              size="small"
                              fullWidth
                              name="narration"
                              value={formData.narration}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 10 }}
                              error={!!fieldErrors.narration}
                              helperText={fieldErrors.narration}
                            />
                          </div>

                        </div>
                      ))}
                    </>
                  )}
                </Box>
              </div>

            </>
          ) : (
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
            // toEdit={getUserById} 
            />
          )}
        </div>
      </div>
    </>
  );
};
export default DetailsToBank;
