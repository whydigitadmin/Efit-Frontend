import ClearIcon from '@mui/icons-material/Clear';
import { toWords } from 'number-to-words';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputLabel, Autocomplete, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, Typography, Modal } from '@mui/material';
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
import { FaCloudUploadAlt, FaEye } from 'react-icons/fa';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const VisuallyHiddenInput = ({ ...props }) => {
  return <input type="file" style={{ display: 'none' }} {...props} />;
};
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function PurchaseQuotation() {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [customerName, setCustomerName] = useState([]);
  const [allItemName, setItemName] = useState([]);
  const [workOrderNo, setWorkOrderNo] = useState([]);
  const [enquiryNo, setEnquiryNo] = useState([]);
  // const [allQStatus, setQStatus] = useState([]);
  const [allContactPerson, setContactPerson] = useState([]);
  const [allkindAttention, setKindAttention] = useState([]);
  const [docId, setDocId] = useState('');
  const [subSelectedFile, setSubSelectedFile] = useState(null);
  const [selectedImgFiles, setSelectedImgFiles] = useState([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [imgUploadedFiles, setImgUploadedFiles] = useState([]);

  const [formData, setFormData] = useState({
    docDate: dayjs(),
    customerName: '',
    customerCode: '',
    workOrderNo: '',
    enquiryNo: '',
    enquiryDate: null,
    supplierName: '',
    supplierId: '',
    validTill: null,
    kindAttention: '',
    taxCode: '',
    contactPerson: '',
    contactNo: '',
    qStatus: 'Pending',
    // 2nd table
    grossAmount: '',
    netAmount: '',
    totalDiscount: '',
    narration: '',
    amtInWords: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: dayjs(),
    customerName: '',
    workOrderNo: '',
    enquiryNo: '',
    enquiryDate: null,
    supplierName: '',
    supplierId: '',
    validTill: null,
    kindAttention: '',
    taxCode: '',
    contactPerson: '',
    contactNo: '',
    qStatus: '',
    // 2nd table
    grossAmount: '',
    netAmount: '',
    totalDiscount: '',
    narration: '',
    amtInWords: ''
  });

  const listViewColumns = [
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'docId', header: 'Document No', size: 140 }
  ];

  const [quotationDetails, setQuotationDetails] = useState([
    {
      id: 1,
      item: '',
      itemDescription: '',
      unit: '',
      quantity: '',
      unitPrice: '',
      basicPrice: '',
      discount: '',
      discountPrice: '',
      quoteAmount: ''
    }
  ]);
  const [quotationDetailsTableErrors, setQuotationDetailsTableErrors] = useState([
    {
      id: 1,
      item: '',
      itemDescription: '',
      unit: '',
      quantity: '',
      unitPrice: '',
      basicPrice: '',
      discount: '',
      discountPrice: '',
      quoteAmount: ''
    }
  ]);
  const [attachmentData, setAttachmentData] = useState([
    {
      id: 1,
      fileName: '',
      attachments: ''
    }
  ]);
  const [attachmentTableErrors, setAttachmentTableErrors] = useState([
    {
      fileName: '',
      attachments: ''
    }
  ]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    getCustomerName();
    getPurchaseQuotationDocId();
    getAllPurchaseQuotationByOrgId();
    getKindAttention();
  }, []);

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      customerName: '',
      workOrderNo: '',
      enquiryNo: '',
      enquiryDate: null,
      supplierName: '',
      supplierId: '',
      validTill: null,
      kindAttention: '',
      taxCode: '',
      contactPerson: '',
      contactNo: '',
      qStatus: '',
      // 2nd table
      grossAmount: '',
      netAmount: '',
      totalDiscount: '',
      narration: '',
      amtInWords: ''
    });
    setFieldErrors({
      docDate: dayjs(),
      customerName: '',
      workOrderNo: '',
      enquiryNo: '',
      enquiryDate: null,
      supplierName: '',
      supplierId: '',
      validTill: null,
      kindAttention: '',
      taxCode: '',
      contactPerson: '',
      contactNo: '',
      qStatus: '',
      // 2nd table
      grossAmount: '',
      netAmount: '',
      totalDiscount: '',
      narration: '',
      amtInWords: ''
    });
    setQuotationDetails([
      {
        id: 1,
        item: '',
        itemDescription: '',
        unit: '',
        quantity: '',
        unitPrice: '',
        basicPrice: '',
        discount: '',
        discountPrice: '',
        quoteAmount: ''
      }
    ]);
    setQuotationDetailsTableErrors('');
    setAttachmentData([
      {
        id: 1,
        fileName: '',
        attachments: ''
      }
    ]);
    setAttachmentTableErrors('');
    setEditId('');
    getPurchaseQuotationDocId();
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    switch (name) {
      case 'enquiryNo': {
        const selectedEnquiryNo = enquiryNo.find((a) => a.purchaseEnquiryNo === value);
        if (selectedEnquiryNo) {
          setFormData((prevData) => ({
            ...prevData,
            enquiryDate: selectedEnquiryNo.purchaseDate ? dayjs(selectedEnquiryNo.purchaseDate, 'YYYY-MM-DD') : dayjs(),
            supplierId: selectedEnquiryNo.SupplierCode || '',
            supplierName: selectedEnquiryNo.SupplierName || '',
          }));
          getContactPerson(selectedEnquiryNo.SupplierCode);
          getItemName(selectedEnquiryNo.purchaseEnquiryNo);
        }
        break;
      }
      case 'contactPerson': {
        const selectedContactPerson = allContactPerson.find((a) => a.contactPerson === value);
        if (selectedContactPerson) {
          setFormData((prevData) => ({
            ...prevData,
            taxCode: selectedContactPerson.taxType || '',
            contactNo: selectedContactPerson.contactNo || '',
          }));
        }
        break;
      }
      default:
      break;
    }

    if (!errorMessage) {
      setFormData((prevFormData) => {
        const updatedFormData = {
          ...prevFormData,
          [name]: type === "text" || type === "textarea" ? value.toUpperCase() : value,
        };
        if (updatedFormData.customerCode && updatedFormData.workOrderNo) {
          getEnquiryNo(updatedFormData.customerCode, updatedFormData.workOrderNo);
        }
        return updatedFormData;
      });

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
  const handleAddRowQuotation = () => {
    if (isLastRowEmptyQuotation(quotationDetails)) {
      displayRowErrorQuotation(quotationDetails);
      return;
    }
    const newRow = {
      id: Date.now(),
      item: '',
      itemDescription: '',
      unit: '',
      quantity: '',
      unitPrice: '',
      basicPrice: '',
      discount: '',
      discountPrice: '',
      quoteAmount: ''
    };
    setQuotationDetails([...quotationDetails, newRow]);
    setQuotationDetailsTableErrors([
      ...quotationDetailsTableErrors,
      {
        item: '',
        itemDescription: '',
        unit: '',
        quantity: '',
        unitPrice: '',
        basicPrice: '',
        discount: '',
        discountPrice: '',
        quoteAmount: ''
      }
    ]);
  };
  const isLastRowEmptyQuotation = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === quotationDetails) {
      return (
        !lastRow.item ||
        !lastRow.itemDescription ||
        !lastRow.unit ||
        !lastRow.quantity ||
        !lastRow.unitPrice ||
        !lastRow.basicPrice ||
        !lastRow.discount ||
        !lastRow.discountPrice ||
        !lastRow.quoteAmount
      );
    }
    return false;
  };
  const displayRowErrorQuotation = (table) => {
    if (table === quotationDetails) {
      setQuotationDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !table[table.length - 1].item ? 'Item is required' : '',
          itemDescription: !table[table.length - 1].itemDescription ? 'Item Desc is required' : '', capacity: !table[table.length - 1].capacity ? 'capacity is required' : '',
          unit: !table[table.length - 1].unit ? 'Unit is required' : '',
          unitPrice: !table[table.length - 1].unitPrice ? 'Unit Price is required' : '',
          quantity: !table[table.length - 1].quantity ? 'Quantity is required' : '',
          basicPrice: !table[table.length - 1].basicPrice ? 'Basic Price is required' : '',
          discount: !table[table.length - 1].discount ? 'Discount is required' : '',
          discountPrice: !table[table.length - 1].discountPrice ? 'Discount Price is required' : '',
          quoteAmount: !table[table.length - 1].quoteAmount ? 'Quote Amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleAddRowAttachment = () => {
    if (isLastRowEmptyAttachment(attachmentData)) {
      displayRowErrorAttachment(attachmentData);
      return;
    }
    const newRow = {
      id: Date.now(),
      fileName: '',
      attachments: ''
    };
    setAttachmentData([...attachmentData, newRow]);
    setAttachmentTableErrors([
      ...attachmentTableErrors,
      {
        fileName: '',
        attachments: ''
      }
    ]);
  };
  const isLastRowEmptyAttachment = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === attachmentData) {
      return (
        !lastRow.fileName ||
        !lastRow.attachments
      );
    }
    return false;
  };

  const displayRowErrorAttachment = (table) => {
    if (table === attachmentData) {
      setAttachmentTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          fileName: !table[table.length - 1].fileName ? 'File Name is required' : '',
          attachments: !table[table.length - 1].attachments ? 'Attachments is required' : ''
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

  const handleFileUpload = async (generatedId) => {
    if (!generatedId) {
      console.warn('Generated ID is missing');
      showToast('error', 'Generated ID is required');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    for (let i = 0; i < imgUploadedFiles.length; i++) {
      formData.append('file', imgUploadedFiles[i]);
    }

    try {
      // Make the API call using the apiCalls helper function
      const response = await apiCalls(
        'post',
        `/purchase/uploadPurchaseQuatationAttachementsInBloob?id=${generatedId}`,
        formData,
        {}, // No query parameters needed
        { 'Content-Type': 'multipart/form-data' } // Optional; the browser sets this when using FormData
      );

      console.log('File Upload Response:', response);

      if (response.status === true) {
        showToast('success', response.message || 'Attachment File uploaded successfully!');
      } else {
        console.warn('Attachment File upload failed:', response);
        showToast('error', 'Attachment File upload failed');
      }
    } catch (error) {
      console.error('Attachment File Upload Error:', error);
      showToast('error', 'Failed to upload file');
    }
  };

  const handleSubPartImgFileUpload = (files) => {
    console.log('Test');
    setImgUploadedFiles(files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
    }
    const fileNames = Array.from(files).map((file) => file.name);
    setSelectedImgFiles(fileNames);
  };

  const handleSubPreview = (file) => {
    setSubSelectedFile(file);
    setOpenPreviewModal(true);
  };

  const handleSubCloseModal = () => {
    setOpenPreviewModal(false);
    setSubSelectedFile(null);
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.customerName) {
      errors.customerName = 'Customer Name is required';
    }
    if (!formData.workOrderNo) {
      errors.workOrderNo = 'Work Order No is required';
    }
    if (!formData.enquiryNo) {
      errors.enquiryNo = 'Enquiry No is required';
    }
    if (!formData.enquiryDate) {
      errors.enquiryDate = 'Enquiry Date  is required';
    }
    if (!formData.supplierName) {
      errors.supplierName = 'Supplier Name is required';
    }
    if (!formData.supplierId) {
      errors.supplierId = 'Supplier Id is required';
    }
    if (!formData.validTill) {
      errors.validTill = 'Valid Til is required';
    }
    if (!formData.kindAttention) {
      errors.kindAttention = 'Kind Attention is required';
    }
    if (!formData.taxCode) {
      errors.taxCode = 'Tax Code  is required';
    }
    if (!formData.contactPerson) {
      errors.contactPerson = 'Contact Person is required';
    }
    if (!formData.contactNo) {
      errors.contactNo = 'Contact No  is required';
    }
    if (!formData.qStatus) {
      errors.qStatus = 'qStatus is required';
    }
    if (!formData.grossAmount) {
      errors.grossAmount = 'Gross Amount is required';
    }
    if (!formData.netAmount) {
      errors.netAmount = 'Net Amount is required';
    }
    if (!formData.totalDiscount) {
      errors.totalDiscount = 'Total Discount is required';
    }
    if (!formData.narration) {
      errors.narration = 'Narration is required';
    }
    if (!formData.amtInWords) {
      errors.amtInWords = 'Amount In Words is required';
    }

    let quotationTableDataValid = true;
    const newQuotationTableErrors = quotationDetails.map((row) => {
      const rowErrors = {};
      if (!row.item) {
        rowErrors.item = 'Item is required';
        quotationTableDataValid = false;
      }
      if (!row.itemDescription) {
        rowErrors.itemDescription = 'Item Desc is required';
        quotationTableDataValid = false;
      }
      if (!row.unit) {
        rowErrors.unit = 'Unit is required';
        quotationTableDataValid = false;
      }
      if (!row.quantity) {
        rowErrors.quantity = 'Quantity is required';
        quotationTableDataValid = false;
      }
      if (!row.unitPrice) {
        rowErrors.unitPrice = 'Unit Price  is required';
        quotationTableDataValid = false;
      }
      if (!row.basicPrice) {
        rowErrors.basicPrice = 'Basic Price is required';
        quotationTableDataValid = false;
      }
      if (!row.discount) {
        rowErrors.discount = 'Discount is required';
        quotationTableDataValid = false;
      }
      if (!row.discountPrice) {
        rowErrors.discountPrice = 'Discount Price is required';
        quotationTableDataValid = false;
      }
      if (!row.quoteAmount) {
        rowErrors.quoteAmount = 'Quote Amount is required';
        quotationTableDataValid = false;
      }
      return rowErrors;
    });
    let detailTableDataValid2 = true;
    const newAttachmentTableErrors = attachmentData.map((row) => {
      const rowErrors = {};
      if (!row.fileName) {
        rowErrors.fileName = 'File Name is required';
        detailTableDataValid2 = false;
      }
      if (!row.attachments) {
        rowErrors.attachments = 'Attachment is required';
        detailTableDataValid2 = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);
    setQuotationDetailsTableErrors(newQuotationTableErrors);
    setAttachmentTableErrors(newAttachmentTableErrors);

    if (Object.keys(errors).length === 0 && (detailTableDataValid2 && quotationTableDataValid)) {
      const FileVO = attachmentData.map((row) => ({
        ...(editId && { id: row.id }),
        fileName: row.fileName
      }));
      const purchaseQuotationVO = quotationDetails.map((row) => ({
        ...(editId && { id: row.id }),
        discount: parseInt(row.discount),
        unitPrice: parseInt(row.unitPrice),
        qty: parseInt(row.quantity),
        item: row.item,
        itemDesc: row.itemDescription,
        unit: row.unit,
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        finYear: finYear,
        orgId: orgId,
        purchaseQuotation1DTO: purchaseQuotationVO,
        purchaseQuotationAttachmentDTO: FileVO,
        contactNo: formData.contactNo,
        contactPerson: formData.contactPerson,
        supplierId: parseInt(formData.supplierId),
        enquiryDate: dayjs(formData.enquiryDate).format('YYYY-MM-DD'),
        validTill: dayjs(formData.validTill).format('YYYY-MM-DD'),
        customerName: formData.customerName,
        enquiryNo: formData.enquiryNo,
        kindAttention: formData.kindAttention,
        narration: formData.narration,
        qstatus: formData.qStatus,
        supplierName: formData.supplierName,
        taxCode: formData.taxCode,
        workOrderNo: formData.workOrderNo,
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/purchase/updateCreatePurchaseQuotation`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Purchase Quotation Updated Successfully' : 'Purchase Quotation Created successfully');

          const generatedId = saveFormData?.paramObjectsMap.purchaseQuotationVO.purchaseQuotationAttachmentVO[0].id;

          if (generatedId && selectedImgFiles.length > 0) {
            console.log('Generated ID:', generatedId);

            await handleFileUpload(generatedId);
          } else {
            console.log('handleFileUpload failed');
          }
          getAllPurchaseQuotationByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Purchase Quotation creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Purchase Quotation creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const calculateTotals = (rows, setFormData) => {
    const grossAmount = rows.reduce((sum, row) => sum + parseFloat(row.basicPrice || 0), 0).toFixed(2);
    const netAmount = rows.reduce((sum, row) => sum + parseFloat(row.quoteAmount || 0), 0).toFixed(2);
    const totalDiscount = rows.reduce((sum, row) => sum + parseFloat(row.discountPrice || 0), 0).toFixed(2);

    setFormData((prev) => ({
      ...prev,
      grossAmount,
      netAmount,
      totalDiscount,
      amtInWords: toWords(parseFloat(netAmount)).toUpperCase(),
    }));
  };

  const updateQuotationDetails = (rowId, field, value, quotationDetails, setQuotationDetails, setFormData) => {
    const updatedRows = quotationDetails.map((row) => {
      if (row.id === rowId) {
        const updatedRow = { ...row, [field]: value };

        if (field === 'quantity' || field === 'unitPrice') {
          const quantity = parseFloat(updatedRow.quantity || 0);
          const unitPrice = parseFloat(updatedRow.unitPrice || 0);
          updatedRow.basicPrice = (quantity * unitPrice).toFixed(2);
        }

        if (field === 'discount') {
          const basicPrice = parseFloat(updatedRow.basicPrice || 0);
          const discount = parseFloat(updatedRow.discount || 0);
          updatedRow.discountPrice = ((basicPrice * discount) / 100).toFixed(2);
        }

        if (updatedRow.basicPrice && updatedRow.discountPrice) {
          updatedRow.quoteAmount = (
            parseFloat(updatedRow.basicPrice) - parseFloat(updatedRow.discountPrice)
          ).toFixed(2);
        }

        return updatedRow;
      }
      return row;
    });

    setQuotationDetails(updatedRows);
    calculateTotals(updatedRows, setFormData);
  };

  const getPurchaseQuotationDocId = async () => {
    try {
      const response = await apiCalls(
        'get', `/purchase/getpurchaseQuotationDocId?orgId=${orgId}`
      );
      setDocId(response.paramObjectsMap.purchaseQuotationDocId);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getAllPurchaseQuotationByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/purchase/getAllPurchaseQuotationByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.purchaseQuotationVO || []);
      console.log('purchaseQuotationVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getPurchaseQuotationById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/purchase/getPurchaseQuotationById?id=${row.original.id}`);

      if (result) {
        const pqVO = result.paramObjectsMap.purchaseQuotationVO[0];
        setEditId(row.original.id);
        setDocId(pqVO.docId);
        setFormData({
          docDate: pqVO.docDate ? dayjs(pqVO.docDate, 'YYYY-MM-DD') : dayjs(),
          customerName: pqVO.customerName,
          customerCode: pqVO.customerCode,
          workOrderNo: pqVO.workOrderNo,
          enquiryNo: pqVO.enquiryNo,
          enquiryDate: pqVO.enquiryDate ? dayjs(pqVO.enquiryDate, 'YYYY-MM-DD') : dayjs(),
          suppliername: pqVO.suppliername,
          validTill: pqVO.validTill ? dayjs(pqVO.validTill, 'YYYY-MM-DD') : dayjs(),
          supplierId: pqVO.supplierId,
          orgId: pqVO.orgId,
          kindAttention: pqVO.kindAttention,
          taxCode: pqVO.taxCode,
          contactPerson: pqVO.contactPerson,
          contactNo: pqVO.contactNo,
          grossAmount: pqVO.grossAmount,
          netAmount: pqVO.netAmount,
          totalDiscount: pqVO.totalDiscount,
          narration: pqVO.narration,
          amountInWords: pqVO.amountInWords
        });
        setQuotationDetails(
          pqVO.accountParticularsVO.map((row) => ({
            id: row.id,
            item: row.item,
            itemDescription: row.itemDesc,
            unit: row.unit,
            quantity: row.qty,
            unitPrice: row.unitPrice,
            basicPrice: row.basicPrice,
            discount: row.discount,
            discountAmount: row.discountAmount,
            quoteAmount: row.quoteAmount
          }))
        );
        setAttachmentData(
          pqVO.purchaseQuotationAttachmentVO.map((row) => ({
            id: row.id,
            attachements: row.attachements,
            fileName: row.fileName
          }))
        );

        console.log('DataToEdit', pqVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getItemName = async (enquiryNo) => {
    try {
      const response = await apiCalls('get', `/purchase/getItemDetailsForPurchaseQuotation?orgId=${orgId}&purchaseEnquiryNo=${enquiryNo}`);
      setItemName(response.paramObjectsMap.itemDetails || []);
      console.log('Item Name', response.paramObjectsMap.itemDetails || []);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getCustomerName = async () => {
    try {
      const response = await apiCalls('get', `/purchase/getCustomerNameForPurchaseIndent?orgId=${orgId}`);
      setCustomerName(response.paramObjectsMap.customerNameList || []);
      console.log('Item Name', response.paramObjectsMap.customerNameList || []);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getKindAttention = async () => {
    try {
      const response = await apiCalls('get', `/purchase/getRequestedByForPurchase?orgId=${orgId}`);
      setKindAttention(response.paramObjectsMap.RequestedBy || []);
      console.log('Item Name', response.paramObjectsMap.RequestedBy || []);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getWorkOrderNo = async (customerCode) => {
    try {
      const response = await apiCalls('get', `/purchase/getWorkOrderNoForPurchaseQuotation?customerCode=${customerCode}&orgId=${orgId}`);
      setWorkOrderNo(response.paramObjectsMap.workOrderNo || []);
      console.log('Work Order No', response.paramObjectsMap.workOrderNo || []);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getEnquiryNo = async (customerCode, workOrderNo) => {
    try {
      const response = await apiCalls('get', `/purchase/getPurchaseEnquiryNoForPurchaseQuotation?customerCode=${customerCode}&orgId=${orgId}&workOrderNo=${workOrderNo}`);
      setEnquiryNo(response.paramObjectsMap.purchaseEnquiryNo || []);
      console.log('Enquiry No', response.paramObjectsMap.purchaseEnquiryNo || []);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getContactPerson = async (supplierCode) => {
    try {
      const response = await apiCalls('get', `/purchase/getContactPersonDetailsForPurchaseEnquiry?orgId=${orgId}&supplierCode=${supplierCode}`);
      setContactPerson(response.paramObjectsMap.purchaseEnquiryVO || []);
      console.log('Contact Person', response.paramObjectsMap.purchaseEnquiryVO || []);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                    <InputLabel id="customerName">
                      <span>
                        Customer Name <span className="asterisk">*</span>
                      </span>
                    </InputLabel>
                    <Select
                      labelId="customerName"
                      id="customerName"
                      label="customerName"
                      onChange={(event) => {
                        const selectedCustomer = customerName.find(item => item.customerName === event.target.value);
                        handleInputChange({
                          target: {
                            name: 'customerName',
                            value: selectedCustomer.customerName
                          }
                        });
                        handleInputChange({
                          target: {
                            name: 'customerCode',
                            value: selectedCustomer.customerCode
                          }
                        });
                        getWorkOrderNo(selectedCustomer.customerCode);
                      }}
                      name="customerName"
                      value={formData.customerName}
                    >
                      {customerName.map((item) => (
                        <MenuItem key={item.id} value={item.customerName}>
                          {item.customerName}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.customerName && <FormHelperText style={{ color: 'red' }}>Customer Name is required</FormHelperText>}
                  </FormControl>
                </div>

                {/* <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                    <InputLabel id="customerName">
                      {
                        <span>
                          Customer Name <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="customerName"
                      id="customerName"
                      label="customerName"
                      onChange={handleInputChange}
                      name="customerName"
                      value={formData.customerName}
                    >
                      {customerName.map((item) => (
                        <MenuItem key={item.id} value={item.customerName}>
                          {item.customerName}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.customerName && <FormHelperText style={{ color: 'red' }}>Customer Name is required</FormHelperText>}
                  </FormControl>
                </div> */}

                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.workOrderNo}>
                    <InputLabel id="workOrderNo">
                      {
                        <span>
                          Work Order No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="workOrderNo"
                      id="workOrderNo"
                      label="workOrderNo"
                      onChange={handleInputChange}
                      name="workOrderNo"
                      value={formData.workOrderNo}
                    >
                      {workOrderNo.map((item) => (
                        <MenuItem key={item.id} value={item.workOrderNo}>
                          {item.workOrderNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.workOrderNo && <FormHelperText style={{ color: 'red' }}>Work Order No is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.enquiryNo}>
                    <InputLabel id="enquiryNo">
                      {
                        <span>
                          Enquiry No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="enquiryNo"
                      id="enquiryNo"
                      label="Enquiry No"
                      onChange={handleInputChange}
                      name="enquiryNo"
                      value={formData.enquiryNo}
                    >
                      {enquiryNo.map((item) => (
                        <MenuItem key={item.id} value={item.purchaseEnquiryNo}>
                          {item.purchaseEnquiryNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.enquiryNo && <FormHelperText style={{ color: 'red' }}>Enquiry No is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disabled
                        label="Enquiry Date"
                        value={formData.enquiryDate ? dayjs(formData.enquiryDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('enquiryDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.enquiryDate}
                        helperText={fieldErrors.enquiryDate ? fieldErrors.enquiryDate : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="supplierName"
                    disabled
                    label={
                      <span>
                        Supplier Name <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.supplierName ? fieldErrors.supplierName : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.supplierName}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    disabled
                    id="supplierId"
                    label='Supplier Id'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.supplierId ? fieldErrors.supplierId : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.supplierId}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Valid Till"
                        value={formData.validTill ? dayjs(formData.validTill, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('validTill', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.validTill}
                        helperText={fieldErrors.validTill ? fieldErrors.validTill : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.kindAttention}>
                    <InputLabel id="kindAttention">
                      {
                        <span>
                          Kind Attention <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="kindAttention"
                      id="kindAttention"
                      label="kindAttention"
                      onChange={handleInputChange}
                      name="kindAttention"
                      value={formData.kindAttention}
                    >
                      {allkindAttention.map((item) => (
                        <MenuItem key={item.id} value={item.employeeName}>
                          {item.employeeName}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.kindAttention && <FormHelperText style={{ color: 'red' }}>Kind Attention is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.contactPerson}>
                    <InputLabel id="contactPerson">
                      {
                        <span>
                          Contact Person <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="contactPerson"
                      id="contactPerson"
                      label="contactPerson"
                      onChange={handleInputChange}
                      name="contactPerson"
                      value={formData.contactPerson}
                    >
                      {allContactPerson.map((item) => (
                        <MenuItem key={item.id} value={item.contactPerson}>
                          {item.contactPerson}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.contactPerson && <FormHelperText style={{ color: 'red' }}>Contact Person is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="taxCode"
                    disabled
                    label='Tax Code'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="taxCode"
                    value={formData.taxCode}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.taxCode ? fieldErrors.taxCode : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.taxCode}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="contactNo"
                    disabled
                    label='Contact No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.contactNo ? fieldErrors.contactNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.contactNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.qStatus}>
                    <InputLabel id="qStatus">
                      {
                        <span>
                          Q Status <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="qStatus"
                      id="qStatus"
                      label="Product Type"
                      onChange={handleInputChange}
                      name="qStatus"
                      value={formData.qStatus}
                    >
                      <MenuItem value="--Select--">--Select--</MenuItem>
                      <MenuItem value="PENDING">PENDING</MenuItem>
                    </Select>
                    {fieldErrors.qStatus && <FormHelperText style={{ color: 'red' }}>Q Status is required</FormHelperText>}
                  </FormControl>
                </div>
                {/* <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.qStatus}>
                    <InputLabel id="qStatus">
                      {
                        <span>
                          QStatus <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="qStatus"
                      id="qStatus"
                      label="qStatus"
                      onChange={handleInputChange}
                      name="qStatus"
                      value={formData.qStatus}
                    >
                      {allQStatus.map((item) => (
                        <MenuItem key={item.id} value={item.qStatus}>
                          {item.qStatus}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.qStatus && <FormHelperText style={{ color: 'red' }}>QStatus is required</FormHelperText>}
                  </FormControl>
                </div> */}
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
                    <Tab value={0} label="Quotation Details" />
                    <Tab value={1} label="Summary" />
                    <Tab value={2} label="Attachment" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowQuotation} />
                        </div>
                        {listView ? (
                          <div className="mt-4">
                            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getPurchaseQuotationById} />
                          </div>
                        ) : (
                          <div className="row mt-2">
                            <div className="col-lg-12">
                              <div className="table-responsive">
                                <table className="table table-bordered ">
                                  <thead>
                                    <tr style={{ backgroundColor: '#673AB7' }}>
                                      {/* <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th> */}
                                      <th className="table-header px-2 py-2 text-white text-center" style={{ width: '10px' }}>Action</th>
                                      <th className="table-header px-2 py-2 text-white text-center" style={{ width: '50px' }}>S.No</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Item</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Item Description</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Unit</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Quantity</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Unit Price</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Basic Price</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Discount %</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Discount Amount</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Quote Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {quotationDetails.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="col-md-1 border px-2 py-2 text-center">
                                          <ActionButton
                                            className=" mb-2"
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                quotationDetails,
                                                setQuotationDetails,
                                                quotationDetailsTableErrors,
                                                setQuotationDetailsTableErrors
                                              )
                                            }
                                          />
                                        </td>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>
                                        <td className="border px-2 py-2">
                                          <Autocomplete
                                            disablePortal
                                            options={allItemName}
                                            getOptionLabel={(option) => option.item || ""}
                                            sx={{ width: "100%" }}
                                            size="small"
                                            value={allItemName.find((it) => it.item === row.item) || null}
                                            onChange={(event, newValue) => {
                                              if (newValue) {
                                                setQuotationDetails((prev) =>
                                                  prev.map((r) =>
                                                    r.id === row.id
                                                      ? {
                                                        ...r,
                                                        item: newValue.item,
                                                        itemDescription: newValue.itemDesc || "",
                                                        unit: newValue.uom || "",
                                                      }
                                                      : r
                                                  )
                                                );
                                              } else {
                                                setQuotationDetails((prev) =>
                                                  prev.map((r) =>
                                                    r.id === row.id
                                                      ? { ...r, item: "", itemDesc: "", unit: ""}
                                                      : r
                                                  )
                                                );
                                              }
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Item"
                                                name="item"
                                                error={!!quotationDetailsTableErrors[index]?.item}
                                                helperText={quotationDetailsTableErrors[index]?.item}
                                                InputProps={{
                                                  ...params.InputProps,
                                                  style: { height: 40, width: 170 },
                                                }}
                                              />
                                            )}
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.itemDescription}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, itemDescription: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  itemDescription: !value ? 'Item Desp is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.itemDescription ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.itemDescription && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].itemDescription}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.unit}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  unit: !value ? 'Unit is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.unit ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.unit && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].unit}
                                            </div>
                                          )}
                                        </td>
                                        {/* <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.quantity}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, quantity: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  quantity: !value ? 'Quantity is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.quantity ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.quantity && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].quantity}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.unitPrice}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, unitPrice: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  unitPrice: !value ? 'Unit Price is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.unitPrice ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.unitPrice && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].unitPrice}
                                            </div>
                                          )}
                                        </td>*/}
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.quantity}
                                            onChange={(e) =>
                                              updateQuotationDetails(row.id, 'quantity', e.target.value, quotationDetails, setQuotationDetails, setFormData)
                                            }
                                            className="form-control"

                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.unitPrice}
                                            onChange={(e) =>
                                              updateQuotationDetails(row.id, 'unitPrice', e.target.value, quotationDetails, setQuotationDetails, setFormData)
                                            }
                                            className="form-control"
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            disabled
                                            style={{ width: '150px' }}
                                            value={row.basicPrice}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, basicPrice: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  basicPrice: !value ? 'Basic Price is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.basicPrice ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.basicPrice && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].basicPrice}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.discount}
                                            onChange={(e) =>
                                              updateQuotationDetails(row.id, 'discount', e.target.value, quotationDetails, setQuotationDetails, setFormData)
                                            }
                                            className="form-control"
                                          />
                                        </td>

                                        {/* <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.discount}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, discount: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  discount: !value ? 'Discount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.discount ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.discount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].discount}
                                            </div>
                                          )}
                                        </td> */}
                                        <td className="border px-2 py-2">
                                          <input
                                            disabled
                                            style={{ width: '150px' }}
                                            value={row.discountPrice}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, discountPrice: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  discountPrice: !value ? 'Discount Price is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.discountPrice ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.discountPrice && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].discountPrice}
                                            </div>
                                          )}
                                        </td><td className="border px-2 py-2">
                                          <input
                                            disabled
                                            style={{ width: '150px' }}
                                            value={row.quoteAmount}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setQuotationDetails((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, quoteAmount: value } : r))
                                              );
                                              setQuotationDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  quoteAmount: !value ? 'Quote Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={quotationDetailsTableErrors[index]?.quoteAmount ? 'error form-control' : 'form-control'}
                                          />
                                          {quotationDetailsTableErrors[index]?.quoteAmount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {quotationDetailsTableErrors[index].quoteAmount}
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
                        <div className="row mt-2">
                          <>
                            <div className="row">
                              <div className="col-md-3 mb-3">
                                <TextField
                                  disabled
                                  label="Gross Amount"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="grossAmount"
                                  value={formData.grossAmount}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.grossAmount}
                                  helperText={fieldErrors.grossAmount}
                                />
                              </div>
                              <div className="col-md-3 mb-3">
                                <TextField
                                  disabled
                                  label="Net Amount"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="netAmount"
                                  value={formData.netAmount}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.netAmount}
                                  helperText={fieldErrors.netAmount}
                                />
                              </div>
                              <div className="col-md-3 mb-3">
                                <TextField
                                  disabled
                                  label="Total Discount"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="totalDiscount"
                                  value={formData.totalDiscount}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.totalDiscount}
                                  helperText={fieldErrors.totalDiscount}
                                />
                              </div>
                              <div className="col-md-3 mb-3">
                                <TextField
                                  label="Narration"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="narration"
                                  value={formData.narration}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.narration}
                                  helperText={fieldErrors.narration}
                                />
                              </div>
                              <div className="col-md-3 mb-3">
                                <TextField
                                  disabled
                                  label="Amount In Words"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="amtInWords"
                                  value={formData.amtInWords}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.amtInWords}
                                  helperText={fieldErrors.amtInWords}
                                />
                              </div>
                            </div>
                          </>
                        </div>
                      </div>
                    </>
                  )}
                  {value === 2 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowAttachment} />
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-7">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                      File Name
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '100px' }}>
                                      Attachments
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {attachmentData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              attachmentData,
                                              setAttachmentData,
                                              attachmentTableErrors,
                                              setAttachmentTableErrors
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
                                          value={row.fileName}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setAttachmentData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, fileName: value } : r
                                              )
                                            );
                                            setAttachmentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                fileName: !value ? 'File Name is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={attachmentTableErrors[index]?.fileName ? 'error form-control' : 'form-control'}
                                        />

                                        {attachmentTableErrors[index]?.fileName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {attachmentTableErrors[index].fileName}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        {row.attachments ? (
                                          <>
                                            <div className="d-flex justify-content-center mb-2">
                                              <Button
                                                variant="contained"
                                                color="secondary"
                                                startIcon={<FaEye />}
                                                onClick={() => handleSubPreview(row.attachments)}
                                                style={{ textTransform: 'none' }}
                                              >
                                                Preview
                                              </Button>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="d-flex justify-content-center mb-2">
                                              <Button
                                                component="label"
                                                variant="contained"
                                                color="secondary"
                                                startIcon={<FaCloudUploadAlt />}
                                                style={{ textTransform: 'none', padding: '6px 12px' }}
                                              >
                                                Upload File
                                                <VisuallyHiddenInput onChange={(e) => handleSubPartImgFileUpload(e.target.files)} />
                                              </Button>
                                            </div>
                                            {selectedImgFiles.length > 0 && (
                                              <div className="d-flex justify-content-center uploaded-files mt-2">
                                                <Typography variant="body2">Uploaded Files:</Typography>
                                                {selectedImgFiles.map((filename, index) => (
                                                  <div key={index}>{filename}</div>
                                                ))}
                                              </div>
                                            )}
                                          </>
                                        )}

                                        {/* Modal for file preview */}
                                        <Modal open={openPreviewModal} onClose={handleSubCloseModal}>
                                          <Box
                                            sx={{
                                              position: 'absolute',
                                              top: '50%',
                                              left: '50%',
                                              transform: 'translate(-50%, -50%)',
                                              width: '50%',
                                              height: 'auto',
                                              bgcolor: 'background.paper',
                                              boxShadow: 24,
                                              p: 4,
                                              overflow: 'auto'
                                            }}
                                          >
                                            {subSelectedFile ? (
                                              <img
                                                src={`data:image/jpeg;base64,${subSelectedFile}`}
                                                alt="Preview"
                                                style={{ width: '50%', height: 'auto' }}
                                              />
                                            ) : (
                                              <Typography>No preview available</Typography>
                                            )}
                                            <Button
                                              className="secondary"
                                              onClick={handleSubCloseModal}
                                              style={{ marginTop: '20px' }}
                                              variant="outlined"
                                            >
                                              Close
                                            </Button>
                                          </Box>
                                        </Modal>
                                      </td>
                                      {/* <td className="border px-2 py-2" onClick={handleBulkUploadOpen}>
                                        <input
                                          type="text"
                                          value={row.attachments}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setAttachmentData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, attachments: value } : r))
                                            );
                                            setAttachmentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                attachments: !value ? 'Attachment is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={attachmentTableErrors[index]?.attachments ? 'error form-control' : 'form-control'}
                                        />
                                        {attachmentTableErrors[index]?.attachments && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {attachmentTableErrors[index].attachments}
                                          </div>
                                        )}
                                      </td> */}
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
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getPurchaseQuotationById} />
          )}
        </div>
      </div>
    </>

  )
};

export default PurchaseQuotation;
