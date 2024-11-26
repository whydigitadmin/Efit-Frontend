import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputLabel, Autocomplete, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import Draggable from 'react-draggable';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import Paper from '@mui/material/Paper';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import Checkbox from '@mui/material/Checkbox';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import sampleFile from '../../../assets/sample-files/sample_data_buyerorder.xls';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const MachineMaster = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [allAccountName, setAllAccountName] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [docId, setDocId] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    docDate: dayjs(),
    department:'',
    type:'',
    machineNo:'',
    machineName:'',
    calibrationRequired:'',
    location:'',
    processNo:'',
    machineCategory:'',
    section:'',
    model:'',
    serialNo:'',
    status:'',
    manufacturedBy:'',
    madeIn:'',
    purchasedFrom:'',
    modeOfPurchase:'',
    machineIncharge:'',
    machineUsedFor:'',
    pmCheckListNo:'',
    remarks:'',
    //3rd Tab
    instrumentName:''
    // imgAttachement:''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: dayjs(),
    department:'',
    type:'',
    machineNo:'',
    machineName:'',
    calibrationRequired:'',
    location:'',
    processNo:'',
    machinecategory:'',
    section:'',
    model:'',
    serialNo:'',
    status:'',
    manufacturedBy:'',
    madeIn:'',
    purchasedFrom:'',
    modeOfPurchase:'',
    machineIncharge:'',
    machineUsedFor:'',
    pmCheckListNo:'',
    remarks:'',
    //3rd Tab
    instrumentName:'',
    imgAttachement:''
  });

  const listViewColumns = [
    { accessorKey: 'adjustmentType', header: 'Adjustment Type', size: 140 },
    { accessorKey: 'currency', header: 'Currency', size: 140 },
    { accessorKey: 'exRate', header: 'Ex.Rate', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'docId', header: 'document No', size: 140 }
  ];

  const [detailsTableData1, setDetailsTableData1] = useState([
    {
      id: 1,
      installationDate:'',
      powerConsumption:'',
      consumption:'',
      powerProduced:'',
      capacity:'',
      unit:'',
      bedSizeMM:'',
      currentInAMPS:'',
      voltage:'',
      cussionTonnage:'',
      machineType:'',
      hourlyRate:'',
      instrumentRate:'',
      uom:'',
      warrentyStartDate:'',
      warrentyEndDate:'',
      lastCalibratedDate:'',
      nextDueDate:'',
      year:'',
      range:'',
      errorAllowed:'',
      frequencyOfCalibration:'',
      maintananceDate:''
    }
  ]);
  const [detailsTableErrors1, setDetailsTableErrors1] = useState([
    {
      id: 1,
      installationDate:'',
      powerConsumption:'',
      consumption:'',
      powerProduced:'',
      capacity:'',
      unit:'',
      bedSizeMM:'',
      currentInAMPS:'',
      voltage:'',
      cussionTonnage:'',
      machineType:'',
      hourlyRate:'',
      instrumentRate:'',
      uom:'',
      warrentyStartDate:'',
      warrentyEndDate:'',
      lastCalibratedDate:'',
      nextDueDate:'',
      year:'',
      range:'',
      errorAllowed:'',
      frequencyOfCalibration:'',
      maintananceDate:''
    }
  ]);
  const [detailsTableData2, setDetailsTableData2] = useState([
    {
      id: 1,
      itemId:'',
      itemDescription:'',
      piece:'',
      ProdQTYHr:'',
      operationName:'',
      remarks:''
    }
  ]);
  const [detailsTableErrors2, setDetailsTableErrors2] = useState([
    {
      id: 1,
      itemId:'',
      itemDescription:'',
      piece:'',
      ProdQTYHr:'',
      operationName:'',
      remarks:''
    }
  ]);
  const [file, setFile] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };
 
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSaveSelectedRows = async () => {}
  const handleSelectAll = () => {}
  const getMachineMasterById = () => {}
  useEffect(() => {
    
    // getAdjustmentJournalDocId();
    // getAllAdjustmentJournalByOrgId();
    // getAllAccountName();
  }, []);

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      department:'',
      type:'',
      machineNo:'',
      machineName:'',
      calibrationRequired:'',
      location:'',
      processNo:'',
      machinecategory:'',
      section:'',
      model:'',
      serialNo:'',
      status:'',
      manufacturedBy:'',
      madeIn:'',
      purchasedFrom:'',
      modeOfPurchase:'',
      machineIncharge:'',
      machineUsedFor:'',
      pmCheckListNo:'',
      remarks:'',
      //3rd Tab
      instrumentName:'',
      imgAttachement:''
    });
    setFieldErrors({
      docDate: dayjs(),
      department:'',
      type:'',
      machineNo:'',
      machineName:'',
      calibrationRequired:'',
      location:'',
      processNo:'',
      machinecategory:'',
      section:'',
      model:'',
      serialNo:'',
      status:'',
      manufacturedBy:'',
      madeIn:'',
      purchasedFrom:'',
      modeOfPurchase:'',
      machineIncharge:'',
      machineUsedFor:'',
      pmCheckListNo:'',
      remarks:'',
      //3rd Tab
      instrumentName:'',
      imgAttachement:''
    });
    setDetailsTableData1([
      { id: 1,
        installationDate:'',
        powerConsumption:'',
        consumption:'',
        powerProduced:'',
        capacity:'',
        unit:'',
        bedSizeMM:'',
        currentInAMPS:'',
        voltage:'',
        cussionTonnage:'',
        machineType:'',
        hourlyRate:'',
        instrumentRate:'',
        uom:'',
        warrentyStartDate:'',
        warrentyEndDate:'',
        lastCalibratedDate:'',
        nextDueDate:'',
        year:'',
        range:'',
        errorAllowed:'',
        frequencyOfCalibration:'',
        maintananceDate:'' }
    ]);
    setDetailsTableErrors1('');
    setDetailsTableData2([
      { id: 1,
        itemId:'',
        itemDescription:'',
        piece:'',
        ProdQTYHr:'',
        operationName:'',
        remarks:'' }
    ]);
    setDetailsTableErrors2('');
    setEditId('');
    getAdjustmentJournalDocId();
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';

    
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    if (!errorMessage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === 'text' || type === 'textarea' ? value.toUpperCase() : value
      }));

      // Preserve cursor position for text inputs
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRow1 = () => {
    if (isLastRowEmpty1(detailsTableData1)) {
      displayRowError1(detailsTableData1);
      return;
    }
    const newRow = {
      id: Date.now(),
      installationDate:'',
      powerConsumption:'',
      consumption:'',
      powerProduced:'',
      capacity:'',
      unit:'',
      bedSizeMM:'',
      currentInAMPS:'',
      voltage:'',
      cussionTonnage:'',
      machineType:'',
      hourlyRate:'',
      instrumentRate:'',
      uom:'',
      warrentyStartDate:'',
      warrentyEndDate:'',
      lastCalibratedDate:'',
      nextDueDate:'',
      year:'',
      range:'',
      errorAllowed:'',
      frequencyOfCalibration:'',
      maintananceDate:''
    };
    setDetailsTableData1([...detailsTableData1, newRow]);
    setDetailsTableErrors1([
      ...detailsTableErrors1,
      { installationDate:'',
        powerConsumption:'',
        consumption:'',
        powerProduced:'',
        capacity:'',
        unit:'',
        bedSizeMM:'',
        currentInAMPS:'',
        voltage:'',
        cussionTonnage:'',
        machineType:'',
        hourlyRate:'',
        instrumentRate:'',
        uom:'',
        warrentyStartDate:'',
        warrentyEndDate:'',
        lastCalibratedDate:'',
        nextDueDate:'',
        year:'',
        range:'',
        errorAllowed:'',
        frequencyOfCalibration:'',
        maintananceDate:'' }
    ]);
  };

  const isLastRowEmpty1 = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData1) {
      return (
        !lastRow.installationDate ||
        !lastRow.powerConsumption ||
        !lastRow.consumption ||
        !lastRow.powerProduced ||
        !lastRow.capacity ||
        !lastRow.unit ||
        !lastRow.bedSizeMM ||
        !lastRow.currentInAMPS ||
        !lastRow.voltage ||
        !lastRow.cussionTonnage ||
        !lastRow.machineType ||
        !lastRow.hourlyRate ||
        !lastRow.instrumentRate ||
        !lastRow.uom ||
        !lastRow.warrentyStartDate ||
        !lastRow.warrentyEndDate ||
        !lastRow.lastCalibratedDate ||
        !lastRow.nextDueDate ||
        !lastRow.year ||
        !lastRow.range ||
        !lastRow.errorAllowed ||
        !lastRow.frequencyOfCalibration ||
        !lastRow.maintananceDate
      );
    }
    return false;
  };

  const displayRowError1 = (table) => {
    if (table === detailsTableData1) {
      setDetailsTableErrors1((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          installationDate: !table[table.length - 1].installationDate ? 'installationDate is required' : '',
          powerConsumption: !table[table.length - 1].powerConsumption ? 'powerConsumption is required' : '',
          consumption: !table[table.length - 1].consumption ? 'consumption is required' : '',
          powerProduced: !table[table.length - 1].powerProduced ? 'powerProduced is required' : '',
          capacity: !table[table.length - 1].capacity ? 'capacity is required' : '',
          unit: !table[table.length - 1].unit ? 'unit is required' : '',
          bedSizeMM: !table[table.length - 1].bedSizeMM ? 'bedSizeMM is required' : '',
          currentInAMPS: !table[table.length - 1].currentInAMPS ? 'currentInAMPS is required' : '',
          voltage: !table[table.length - 1].voltage ? 'voltage is required' : '',
          cussionTonnage: !table[table.length - 1].cussionTonnage ? 'cussionTonnage is required' : '',
          machineType: !table[table.length - 1].machineType ? 'machineType is required' : '',
          hourlyRate: !table[table.length - 1].hourlyRate ? 'hourlyRate is required' : '',
          instrumentRate: !table[table.length - 1].instrumentRate ? 'instrumentRate is required' : '',
          uom: !table[table.length - 1].uom ? 'uom is required' : '',
          warrentyStartDate: !table[table.length - 1].warrentyStartDate ? 'warrentyStartDate is required' : '',
          warrentyEndDate: !table[table.length - 1].warrentyEndDate ? 'warrentyEndDate is required' : '',
          lastCalibratedDate: !table[table.length - 1].lastCalibratedDate ? 'lastCalibratedDate is required' : '',
          nextDueDate: !table[table.length - 1].nextDueDate ? 'nextDueDate is required' : '',
          year: !table[table.length - 1].year ? 'year is required' : '',
          range: !table[table.length - 1].range ? 'range is required' : '',
          errorAllowed: !table[table.length - 1].errorAllowed ? 'errorAllowed is required' : '',
          frequencyOfCalibration: !table[table.length - 1].frequencyOfCalibration ? 'frequencyOfCalibration is required' : '',
          maintananceDate: !table[table.length - 1].maintananceDate ? 'maintananceDate is required' : '',
        };
        return newErrors;
      });
    }
  };

  const handleAddRow2 = () => {
    if (isLastRowEmpty2(detailsTableData2)) {
      displayRowError2(detailsTableData2);
      return;
    }
    const newRow = {
      id: Date.now(),
      itemId:'',
      itemDescription:'',
      piece:'',
      ProdQTYHr:'',
      operationName:'',
      remarks:''
    };
    setDetailsTableData2([...detailsTableData2, newRow]);
    setDetailsTableErrors2([
      ...detailsTableErrors2,
      { itemId:'',
        itemDescription:'',
        piece:'',
        ProdQTYHr:'',
        operationName:'',
        remarks:''}
    ]);
  };

  const isLastRowEmpty2 = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData2) {
      return (
        !lastRow.itemId ||
        !lastRow.itemDescription ||
        !lastRow.piece ||
        !lastRow.ProdQTYHr ||
        !lastRow.operationName ||
        !lastRow.remarks 
        // !lastRow.debitBase
      );
    }
    return false;
  };

  const displayRowError2 = (table) => {
    if (table === detailsTableData2) {
      setDetailsTableErrors2((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          itemId: !table[table.length - 1].itemId ? 'itemId is required' : '',
          itemDescription: !table[table.length - 1].itemDescription ? 'itemDescription is required' : '',
          piece: !table[table.length - 1].piece ? 'piece is required' : '',
          ProdQTYHr: !table[table.length - 1].ProdQTYHr ? 'ProdQTYHr is required' : '',
          operationName: !table[table.length - 1].operationName ? 'operationName is required' : '',
          remarks: !table[table.length - 1].remarks ? 'remarks is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const handleView = () => {
    setShowForm(!showForm);
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.department) {
      errors.department = 'Department is required';
    }
    if (!formData.type) {
      errors.type = 'Type is required';
    }
    if (!formData.machineNo) {
      errors.machineNo = 'Machine No is required';
    }
    if (!formData.machineName) {
      errors.machineName = 'Machine Name is required';
    }
    if (!formData.madeIn) {
      errors.madeIn = 'Made In is required';
    }
    

    let detailTableDataValid1 = true;
    const newTableErrors1 = detailsTableData1.map((row) => {
      const rowErrors = {};
      if (!row.accountName) {
        rowErrors.accountName = 'Account Name is required';
        detailTableDataValid1 = false;
      }
      if (!row.subLedgerCode) {
        rowErrors.subLedgerCode = 'Sub Ledger Code is required';
        detailTableDataValid1 = false;
      }
      if (!row.subledgerName) {
        rowErrors.subledgerName = 'Sub ledger Name is required';
        detailTableDataValid1 = false;
      }
      if (!row.debitAmount) {
        rowErrors.debitAmount = 'Debit Amount is required';
        detailTableDataValid1 = false;
      }
      if (!row.creditAmount) {
        rowErrors.creditAmount = 'Credit Amount is required';
        detailTableDataValid1 = false;
      }
      if (!row.creditBase) {
        rowErrors.creditBase = 'Credit Base is required';
        detailTableDataValid1 = false;
      }
      if (!row.debitBase) {
        rowErrors.debitBase = 'Debit Base is required';
        detailTableDataValid1 = false;
      }
      return rowErrors;
    });
    let detailTableDataValid2 = true;
    const newTableErrors2 = detailsTableData1.map((row) => {
      const rowErrors = {};
      if (!row.accountName) {
        rowErrors.accountName = 'Account Name is required';
        detailTableDataValid2 = false;
      }
      if (!row.subLedgerCode) {
        rowErrors.subLedgerCode = 'Sub Ledger Code is required';
        detailTableDataValid2 = false;
      }
      if (!row.subledgerName) {
        rowErrors.subledgerName = 'Sub ledger Name is required';
        detailTableDataValid2 = false;
      }
      if (!row.debitAmount) {
        rowErrors.debitAmount = 'Debit Amount is required';
        detailTableDataValid2 = false;
      }
      if (!row.creditAmount) {
        rowErrors.creditAmount = 'Credit Amount is required';
        detailTableDataValid2 = false;
      }
      if (!row.creditBase) {
        rowErrors.creditBase = 'Credit Base is required';
        detailTableDataValid2 = false;
      }
      if (!row.debitBase) {
        rowErrors.debitBase = 'Debit Base is required';
        detailTableDataValid2 = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);
    setDetailsTableErrors1(newTableErrors1);
    setDetailsTableErrors2(newTableErrors2);

    if (Object.keys(errors).length === 0 && (detailTableDataValid2 && detailTableDataValid1) ) {
          const AdjustmentVO = detailsTableData1.map((row) => ({
            ...(editId && { id: row.id }),
            accountsName: row.accountName,
            creditAmount: parseInt(row.creditAmount),
            debitAmount: parseInt(row.debitAmount),
            debitBase: parseInt(row.debitBase),
            creditBase: parseInt(row.creditBase),
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
      }));
      const AdjustmentJournalVO = detailsTableData2.map((row) => ({
        ...(editId && { id: row.id }),
        accountsName: row.accountName,
        creditAmount: parseInt(row.creditAmount),
        debitAmount: parseInt(row.debitAmount),
        debitBase: parseInt(row.debitBase),
        creditBase: parseInt(row.creditBase),
        subLedgerCode: row.subLedgerCode,
        subledgerName: row.subledgerName
  }));
      const saveFormData = {
        ...(editId && { id: editId }),
        branch: branch,
              branchCode: branchCode,
              createdBy: loginUserName,
              finYear: finYear,
              orgId: orgId,
              accountParticularsDTO: AdjustmentJournalVO,
              adjustmentType: formData.adjustmentType,
              currency: formData.currency,
              exRate: parseInt(formData.exRate),
              refDate: dayjs(formData.refDate).format('YYYY-MM-DD'),
              refNo: formData.refNo,
              suppRefDate: dayjs(formData.suppRefDate).format('YYYY-MM-DD'),
              suppRefNo: formData.suppRefNo,
              remarks: formData.remarks
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
              const response = await apiCalls('put', `transaction/updateCreateAdjustmentJournal`, saveFormData);
              if (response.status === true) {
                console.log('Response:', response);
                showToast('success', editId ? 'Adjustment Journal Updated Successfully' : 'Adjustment Journal Created successfully');
                getAllAdjustmentJournalByOrgId();
                handleClear();
              } else {
                showToast('error', response.paramObjectsMap.message || 'Adjustment Journal creation failed');
              }
            } catch (error) {
              console.error('Error:', error);
              showToast('error', 'Adjustment Journal creation failed');
            }
    } else {
      setFieldErrors(errors);
    }
  };
  const getAdjustmentJournalDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getAdjustmentJournalDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setDocId(response.paramObjectsMap.adjustmentJournalDocId);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllAdjustmentJournalByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllAdjustmentJournalByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.adjustmentJournalVO || []);
      // showForm(true);
      console.log('adjustmentJournalVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllAdjustmentJournalById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getAdjustmentJournalById?id=${row.original.id}`);

      if (result) {
        const adVO = result.paramObjectsMap.adjustmentJournalVO[0];
        setEditId(row.original.id);
        setDocId(adVO.docId);
        setFormData({
          docDate: adVO.docDate ? dayjs(adVO.docDate, 'YYYY-MM-DD') : dayjs(),
          adjustmentType: adVO.adjustmentType,
          currency: adVO.currency,
          exRate: adVO.exRate,
          refNo: adVO.refNo,
          refDate: adVO.refDate ? dayjs(adVO.refDate, 'YYYY-MM-DD') : dayjs(),
          suppRefNo: adVO.suppRefNo,
          suppRefDate: adVO.suppRefDate ? dayjs(adVO.refDate, 'YYYY-MM-DD') : dayjs(),
          remarks: adVO.remarks,
          orgId: adVO.orgId,
          totalDebitAmount: adVO.totalDebitAmount,
          totalCreditAmount: adVO.totalCreditAmount
        });
        setDetailsTableData1(
          adVO.accountParticularsVO.map((row) => ({
            id: row.id,
            accountName: row.accountsName,
            creditAmount: row.creditAmount,
            debitAmount: row.debitAmount,
            debitBase: row.debitBase,
            creditBase: row.creditBase,
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
          }))
        );

        console.log('DataToEdit', adVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleBulkUploadOpen = () => {
    setUploadOpen(true); // Open dialog
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false); // Close dialog
  };
  const handleBulkUploadOpen1 = () => {
    setUploadOpen(true); // Open dialog
  };

  const handleBulkUploadClose1 = () => {
    setUploadOpen(false); // Close dialog
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };
  const handleFileUpload1 = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };
  const handleSubmit1 = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
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

          {showForm ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Document Date"
                        value={formData.docDate}
                        onChange={(date) => handleDateChange('docDate', date)}
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="docId"
                    label="Document No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    value={docId}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.department}>
                    <InputLabel id="department">
                      {
                        <span>
                          Department <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="department"
                      id="department"
                      label="department"
                      onChange={handleInputChange}
                      name="department"
                      value={formData.department}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.department}>
                          {item.department}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.department && <FormHelperText style={{ color: 'red' }}>Department is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.type}>
                    <InputLabel id="type">
                      {
                        <span>
                          Type <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="type"
                      id="type"
                      label="type"
                      onChange={handleInputChange}
                      name="type"
                      value={formData.type}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.type}>
                          {item.type}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.type && <FormHelperText style={{ color: 'red' }}>Type is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="machineNo"
                    label={
                      <span>
                        Machine Number <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineNo"
                    value={formData.machineNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineNo ? fieldErrors.machineNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.machineNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="machineName"
                    label={
                      <span>
                        Machine Name <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineName"
                    value={formData.machineName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineName ? fieldErrors.machineName : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.machineName}
                  />
                </div>
                
                <div className="col-md-3 mb-3">
                  <TextField
                    id="calibrationRequired"
                    label= 'Calibration Required'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="calibrationRequired"
                    value={formData.calibrationRequired}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.calibrationRequired ? fieldErrors.calibrationRequired : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.calibrationRequired}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="location"
                    label= 'Location'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.location ? fieldErrors.location : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.location}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="processNo"
                    label= 'Process No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="processNo"
                    value={formData.processNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.processNo ? fieldErrors.processNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.processNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="machineCategory"
                    label= 'Machine Category'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineCategory"
                    value={formData.machineCategory}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineCategory ? fieldErrors.machineCategory : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.machineCategory}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="section"
                    label= 'Section'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.section ? fieldErrors.section : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.section}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="model"
                    label= 'Model'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.model ? fieldErrors.model : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.model}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="serialNo"
                    label= 'Serial No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="serialNo"
                    value={formData.serialNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.serialNo ? fieldErrors.serialNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.serialNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="status"
                    label= 'Status'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.status ? fieldErrors.status : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.status}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="manufacturedBy"
                    label= 'Manufactured By'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="manufacturedBy"
                    value={formData.manufacturedBy}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.manufacturedBy ? fieldErrors.manufacturedBy : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.manufacturedBy}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="madeIn"
                    label={
                      <span>
                        Made In <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="madeIn"
                    value={formData.madeIn}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.madeIn ? fieldErrors.madeIn : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.madeIn}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="purchasedFrom"
                    label= 'Purchased From'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="purchasedFrom"
                    value={formData.purchasedFrom}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.purchasedFrom ? fieldErrors.purchasedFrom : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.purchasedFrom}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="modeOfPurchase"
                    label= 'Mode Of Purchase'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="modeOfPurchase"
                    value={formData.modeOfPurchase}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.modeOfPurchase ? fieldErrors.modeOfPurchase : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.modeOfPurchase}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="machineIncharge"
                    label= 'Machine Incharge'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineIncharge"
                    value={formData.machineIncharge}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineIncharge ? fieldErrors.machineIncharge : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.machineIncharge}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="machineUsedFor"
                    label= 'Machine Used For'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineUsedFor"
                    value={formData.machineUsedFor}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineUsedFor ? fieldErrors.machineUsedFor : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.machineUsedFor}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="pmCheckListNo"
                    label= 'PM Check List No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="pmCheckListNo"
                    value={formData.pmCheckListNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.pmCheckListNo ? fieldErrors.pmCheckListNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.pmCheckListNo}
                  />
                </div>
              </div>
              <div className="row d-flex">
                <div className="col-md-6">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="remarks"
                      label="Remarks"
                      size="small"
                      name="remarks"
                      value={formData.remarks}
                      multiline
                      minRows={2}
                      inputProps={{ maxLength: 30 }}
                      onChange={handleInputChange}
                    />
                  </FormControl>
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
                    <Tab value={0} label="Technical Info" />
                    <Tab value={1} label="Machine Capacity" />
                    <Tab value={2} label="Machine Image" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow1} />
                          <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
                        </div>
                        {uploadOpen && (
          <CommonBulkUpload
            open={uploadOpen}
            handleClose={handleBulkUploadClose}
            title="Upload Files"
            uploadText="Upload file"
            downloadText="Sample File"
            onSubmit={handleSubmit}
            sampleFileDownload={sampleFile}
            handleFileUpload={handleFileUpload}
            // apiUrl={`buyerOrder/ExcelUploadForBuyerOrder?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
            screen="Machine Master"
          ></CommonBulkUpload>
        )}
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getMachineMasterById} />
          </div>
          ) : (
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Installation Date</th>
                                    <th className="table-header">Power Consumption</th>
                                    <th className="table-header">Consumption</th>
                                    <th className="table-header">Power Produced</th>
                                    <th className="table-header">Capacity</th>
                                    <th className="table-header">Unit</th>
                                    <th className="table-header">Bed Size MM</th>
                                    <th className="table-header">Current In AMPS</th>
                                    <th className="table-header">Voltage</th>
                                    <th className="table-header">Cussion Tonnage</th>
                                    <th className="table-header">Machine Type</th>
                                    <th className="table-header">Hourly Rate</th>
                                    <th className="table-header">Instrument Rate</th>
                                    <th className="table-header">UOM</th>
                                    <th className="table-header">Warrenty Start Date</th>
                                    <th className="table-header">Warrenty End Date</th>
                                    <th className="table-header">Last Calibrated Date</th>
                                    <th className="table-header">Next Due Date</th>
                                    <th className="table-header">Year</th>
                                    <th className="table-header">Range</th>
                                    <th className="table-header">Error Allowed</th>
                                    <th className="table-header">Frequency Of Calibration</th>
                                    <th className="table-header">Maintanance Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detailsTableData1.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              detailsTableData1,
                                              setDetailsTableData1,
                                              detailsTableErrors1,
                                              setDetailsTableErrors1
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td>
                                        <input
                                          type="date"
                                          value={row.installationDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, installationDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                installationDate: !date ? 'Installation Date is required' : '',
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.installationDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, DetailsTableData)}
                                        />
                                        {detailsTableErrors1[index]?.installationDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].installationDate}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.powerConsumption}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, powerConsumption: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                powerConsumption: !value ? 'Power Consumption is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.powerConsumption ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.powerConsumption && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].powerConsumption}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.consumption}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, consumption: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                consumption: !value ? 'Consumption is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.consumption ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.consumption && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].consumption}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.powerProduced}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, powerProduced: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                powerProduced: !value ? 'Power Produced is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.powerProduced ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.powerProduced && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].powerProduced}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.capacity}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, capacity: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                capacity: !value ? 'Capacity is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.capacity ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.capacity && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].capacity}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.unit}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unit: !value ? 'Unit is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.unit ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.unit && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].unit}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.bedSizeMM}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, bedSizeMM: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                bedSizeMM: !value ? 'Bed Size MM is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.bedSizeMM ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.bedSizeMM && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].bedSizeMM}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.currentInAMPS}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, currentInAMPS: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                currentInAMPS: !value ? 'Current In AMPS is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.currentInAMPS ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.currentInAMPS && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].currentInAMPS}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.voltage}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, voltage: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                voltage: !value ? 'Voltage is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.voltage ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.voltage && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].voltage}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.cussionTonnage}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, cussionTonnage: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                cussionTonnage: !value ? 'Cussion Tonnage is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.cussionTonnage ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.cussionTonnage && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].cussionTonnage}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.machineType}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, machineType: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                machineType: !value ? 'Machine Type is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.machineType ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.machineType && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].machineType}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.hourlyRate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, hourlyRate: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                hourlyRate: !value ? 'Hourly Rate is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.hourlyRate ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.hourlyRate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].hourlyRate}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.instrumentRate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, instrumentRate: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                instrumentRate: !value ? 'Instrument Rate is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.instrumentRate ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.instrumentRate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].instrumentRate}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.uom}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, uom: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                uom: !value ? 'UOM is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.uom ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.uom && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].uom}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <input
                                          type="date"
                                          value={row.warrentyStartDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, warrentyStartDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                warrentyStartDate: !date ? 'Warrenty Start Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.warrentyStartDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, detailsTableData1)}
                                        />
                                        {detailsTableErrors1[index]?.warrentyStartDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].warrentyStartDate}
                                          </div>
                                        )}
                                      </td> 
                                      <td>
                                        <input
                                          type="date"
                                          value={row.warrentyEndDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, warrentyEndDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                warrentyEndDate: !date ? 'Warrenty End Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.warrentyEndDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, detailsTableData1)}
                                        />
                                        {detailsTableErrors1[index]?.warrentyEndDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].warrentyEndDate}
                                          </div>
                                        )}
                                      </td> <td>
                                        <input
                                          type="date"
                                          value={row.lastCalibratedDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, lastCalibratedDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                lastCalibratedDate: !date ? 'Last Calibrated Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.lastCalibratedDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, detailsTableData1)}
                                        />
                                        {detailsTableErrors1[index]?.lastCalibratedDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].lastCalibratedDate}
                                          </div>
                                        )}
                                      </td> <td>
                                        <input
                                          type="date"
                                          value={row.nextDueDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, nextDueDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                nextDueDate: !date ? 'Next Due Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.nextDueDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, detailsTableData1)}
                                        />
                                        {detailsTableErrors1[index]?.nextDueDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].nextDueDate}
                                          </div>
                                        )}
                                      </td>
                                      
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.year}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, year: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                year: !value ? 'Year is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.year ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.year && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].year}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.range}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, range: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                range: !value ? 'Range is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.range ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.range && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].range}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.errorAllowed}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, errorAllowed: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                errorAllowed: !value ? 'Error Allowed is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.errorAllowed ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.errorAllowed && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].errorAllowed}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.frequencyOfCalibration}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, frequencyOfCalibration: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                frequencyOfCalibration: !value ? 'Frequency Of Calibration is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.frequencyOfCalibration ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.frequencyOfCalibration && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].frequencyOfCalibration}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <input
                                          type="date"
                                          value={row.maintananceDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, maintananceDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                maintananceDate: !date ? 'Maintanance Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.maintananceDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, detailsTableData11)}
                                        />
                                        {detailsTableErrors1[index]?.maintananceDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].maintananceDate}
                                          </div>
                                        )}
                                      </td>
                                      
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
          )}
                      </div>
                    </>
                  )}
                  {value === 1 && (
                    <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow1} />
                        <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen1} />
                      </div>
                      {uploadOpen && (
          <CommonBulkUpload
            open={uploadOpen}
            handleClose={handleBulkUploadClose1}
            title="Upload Files"
            uploadText="Upload file"
            downloadText="Sample File"
            onSubmit={handleSubmit1}
            sampleFileDownload={sampleFile}
            handleFileUpload={handleFileUpload1}
            // apiUrl={`buyerOrder/ExcelUploadForBuyerOrder?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
            screen="Machine Master"
          ></CommonBulkUpload>
        )}
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getMachineMasterById} />
          </div>
          ) : (
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered ">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="table-header">Action</th>
                                  <th className="table-header">S.No</th>
                                  <th className="table-header">Item Id</th>
                                  <th className="table-header">Item Description</th>
                                  <th className="table-header">Piece</th>
                                  <th className="table-header">Prod QTY Hr</th>
                                  <th className="table-header">Operation Name</th>
                                  <th className="table-header">Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detailsTableData2.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            detailsTableData2,
                                            setDetailsTableData2,
                                            detailsTableErrors2,
                                            setDetailsTableErrors2
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.itemId}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, itemId: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemId: !value ? 'Item Id is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.itemId ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.itemId && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].itemId}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.itemDescription}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, itemDescription: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemDescription: !value ? 'Item Description is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.itemDescription ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.itemDescription && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].itemDescription}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.piece}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, piece: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              piece: !value ? 'Piece is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.piece ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.piece && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].piece}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.ProdQTYHr}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, ProdQTYHr: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              ProdQTYHr: !value ? 'Prod QTY Hr is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.ProdQTYHr ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.ProdQTYHr && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].ProdQTYHr}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.operationName}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, operationName: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              operationName: !value ? 'Operation Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.operationName ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.operationName && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].operationName}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.remarks}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              remarks: !value ? 'Remarks is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.remarks ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.remarks && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].remarks}
                                        </div>
                                      )}
                                    </td>
                                    
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
        )}
                    </div>
                  </>
                  )}
                    {value === 2 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="row mt-2">
                        <>
                          <div className="row">
                            <div className="col-md-3 mb-3">
                              <input type="file" onChange={handleFileChange} />
                              
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Instrument Name"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="instrumentName"
                                value={formData.instrumentName}
                                onChange={handleInputChange}
                                error={!!fieldErrors.instrumentName}
                                helperText={fieldErrors.instrumentName}
                              />
                            </div>
                          </div>
                        </>
                        </div>
                      </div>
                    </>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllAdjustmentJournalById} />
          )}
        </div>
        <Dialog
                open={modalOpen}
                maxWidth={'md'}
                fullWidth={true}
                onClose={handleCloseModal}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
              >
                <DialogTitle textAlign="center" style={{ cursor: 'move' }} id="draggable-dialog-title">
                  <h6>Grid Details</h6>
                </DialogTitle>
                <DialogContent className="pb-0">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr style={{ backgroundColor: '#673AB7' }}>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                <Checkbox checked={selectAll} onChange={handleSelectAll}  sx={{
                                  color: 'white', // Unchecked color
                                  '&.Mui-checked': {
                                    color: 'white' // Checked color
                                  }}} />
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                S.No
                              </th>
                              <th className="px-2 py-2 text-white text-center">Part No *</th>
                              <th className="px-2 py-2 text-white text-center">Part Desc</th>
                              <th className="px-2 py-2 text-white text-center">SKU</th>
                              <th className="px-2 py-2 text-white text-center">Batch No</th>
                              {/* <th className="px-2 py-2 text-white text-center">Qty *</th> */}
                              <th className="px-2 py-2 text-white text-center">Avl. Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailsTableData1.map((row, index) => (
                              <tr key={index}>
                                <td className="border p-0 text-center">
                                  <Checkbox
                                    checked={selectedRows.includes(index)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));
                                      
                                    }}
                                  />
                                </td>
                                <td className="text-center p-0">
                                  <div style={{ paddingTop: 12 }}>{index + 1}</div>
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.partNo}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.partDesc}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.sku}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.batchNo}
                                </td>
                                {/* <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.qty}
                                </td> */}
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.availQty}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }} className="pt-0">
                  <Button onClick={handleCloseModal}>Cancel</Button>
                  <Button color="secondary" onClick={handleSaveSelectedRows} variant="contained">
                    Proceed
                  </Button>
                </DialogActions>
              </Dialog>
      </div>
    </>
  );
};

export default MachineMaster;
