const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin.js');
const authMiddleware = require('../lib/authMiddleware.js');
const Business = require('../../models/BusinessSchema.js');
const ExcelJS = require('exceljs');
const { sendConfirmationEmail, sendStatusUpdateEmail } = require('../lib/emailService');

const router = express.Router();
 
function getAuthCookieConfig(extra = {}) {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProd, // Required for HTTPS
    sameSite: isProd ? 'None' : 'Lax', // 'None' for cross-domain cookies
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    ...extra,
  };
}
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({
    admin: req.admin
  });
});
 

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = getAuthCookieConfig(
      isProd ? {} : { domain: 'localhost' }
    );
    res.cookie('token', token, cookieOptions);

    res.cookie('token', token, {
      httpOnly: true,
      secure:true, 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,  
    });
 
    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/business-orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Business.countDocuments();
    const orders = await Business.find()
      .sort({ createdAt: -1 })  
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      orders
    });
  } catch (err) {
    console.error('Error fetching business orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper to flatten object for Excel columns with error handling and depth limit
function flattenObject(obj, prefix = '', result = {}, depth = 0, maxDepth = 5) {
  if (depth > maxDepth) {
    result[prefix.slice(0, -1)] = '[Max depth reached]';
    return result;
  }
  for (const key in obj) {
    try {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((item, idx) => {
          flattenObject(item, `${prefix}${key}[${idx}].`, result, depth + 1, maxDepth);
        });
      } else if (obj[key] && typeof obj[key] === 'object') {
        flattenObject(obj[key], `${prefix}${key}.`, result, depth + 1, maxDepth);
      } else {
        result[`${prefix}${key}`] = obj[key];
      }
    } catch (err) {
      console.error(`Error flattening field: ${prefix}${key}`, err);
      result[`${prefix}${key}`] = '[Error flattening field]';
    }
  }
  return result;
}

// Helper to make Excel cell values safe
function safeExcelValue(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return val;
  if (val instanceof Date) return val.toISOString();
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

router.get('/business-orders/export', async (req, res) => {
  try {
    const orders = await Business.find().sort({ createdAt: -1 });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Business Orders');

    worksheet.columns = [
      { header: 'Email', key: 'Contact.ContactEmail', width: 28 },
      { header: 'First Name', key: 'Contact.ContactFirstName', width: 18 },
      { header: 'Last Name', key: 'Contact.ContactLastName', width: 18 },
      { header: 'Phone', key: 'Contact.ContactPhone', width: 18 },
      { header: 'Evening Phone', key: 'Contact.ContactEveningPhone', width: 18 },
      { header: 'Desired Company Name', key: 'CompanyInfo.CompanyDesiredName', width: 28 },
      { header: 'Alternative Company Name', key: 'CompanyInfo.CompanyAlternativeName', width: 28 },
      { header: 'Business Category', key: 'CompanyInfo.CompanyBusinessCategory', width: 20 },
      { header: 'Business Description', key: 'CompanyInfo.CompanyBusinessDescription', width: 32 },
      { header: 'Country', key: 'BusinessAddress.BusinessAddressCountry', width: 8 },
      { header: 'Address Line 1', key: 'BusinessAddress.BusinessAddressAddress1', width: 24 },
      { header: 'Address Line 2', key: 'BusinessAddress.BusinessAddressAddress2', width: 24 },
      { header: 'City', key: 'BusinessAddress.BusinessAddressCity', width: 18 },
      { header: 'State', key: 'BusinessAddress.BusinessAddressState', width: 8 },
      { header: 'ZIP Code', key: 'BusinessAddress.BusinessAddressZip', width: 10 },
      { header: 'Is CorpNet Agent?', key: 'RegisterAgent.RegisteredAgentIsCorpnetAgent', width: 8 },
      { header: 'Agent First Name', key: 'RegisterAgent.RegisteredAgentFirstName', width: 18 },
      { header: 'Agent Last Name', key: 'RegisterAgent.RegisteredAgentLastName', width: 18 },
      { header: 'Agent Address Line 1', key: 'RegisterAgent.RegisteredAgentAddress1', width: 24 },
      { header: 'Agent Address Line 2', key: 'RegisterAgent.RegisteredAgentAddress2', width: 24 },
      { header: 'Agent City', key: 'RegisterAgent.RegisteredAgentCity', width: 18 },
      { header: 'Agent State', key: 'RegisterAgent.RegisteredAgentState', width: 8 },
      { header: 'Agent ZIP Code', key: 'RegisterAgent.RegisteredAgentZip', width: 10 },
      { header: 'Agent Country', key: 'RegisterAgent.RegisteredAgentCountry', width: 8 },
      { header: 'Package ID', key: 'selectedPackage.id', width: 18 },
      { header: 'Package Name', key: 'selectedPackage.name', width: 18 },
      { header: 'Package Price', key: 'selectedPackage.price', width: 12 },
      { header: 'Package Total Price', key: 'selectedPackage.totalPrice', width: 12 },
      { header: 'Filing Speed', key: 'filingSpeed', width: 14 },
      { header: 'Payment Status', key: 'paymentStatus', width: 14 },
      { header: 'Payment Amount', key: 'paymentAmount', width: 14 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Created Time', key: 'createdTime', width: 12 },
   
    ];
    orders.forEach(order => {
      worksheet.addRow({
        'Contact.ContactEmail': order.Contact?.ContactEmail || '',
        'Contact.ContactFirstName': order.Contact?.ContactFirstName || '',
        'Contact.ContactLastName': order.Contact?.ContactLastName || '',
        'Contact.ContactPhone': order.Contact?.ContactPhone || '',
        'Contact.ContactEveningPhone': order.Contact?.ContactEveningPhone || '',
        'CompanyInfo.CompanyDesiredName': order.CompanyInfo?.CompanyDesiredName || '',
        'CompanyInfo.CompanyAlternativeName': order.CompanyInfo?.CompanyAlternativeName || '',
        'CompanyInfo.CompanyBusinessCategory': order.CompanyInfo?.CompanyBusinessCategory || '',
        'CompanyInfo.CompanyBusinessDescription': order.CompanyInfo?.CompanyBusinessDescription || '',
        'BusinessAddress.BusinessAddressCountry': order.BusinessAddress?.BusinessAddressCountry || '',
        'BusinessAddress.BusinessAddressAddress1': order.BusinessAddress?.BusinessAddressAddress1 || '',
        'BusinessAddress.BusinessAddressAddress2': order.BusinessAddress?.BusinessAddressAddress2 || '',
        'BusinessAddress.BusinessAddressCity': order.BusinessAddress?.BusinessAddressCity || '',
        'BusinessAddress.BusinessAddressState': order.BusinessAddress?.BusinessAddressState || '',
        'BusinessAddress.BusinessAddressZip': order.BusinessAddress?.BusinessAddressZip || '',
        'RegisterAgent.RegisteredAgentIsCorpnetAgent': order.RegisterAgent?.RegisteredAgentIsCorpnetAgent || '',
        'RegisterAgent.RegisteredAgentFirstName': order.RegisterAgent?.RegisteredAgentFirstName || '',
        'RegisterAgent.RegisteredAgentLastName': order.RegisterAgent?.RegisteredAgentLastName || '',
        'RegisterAgent.RegisteredAgentAddress1': order.RegisterAgent?.RegisteredAgentAddress1 || '',
        'RegisterAgent.RegisteredAgentAddress2': order.RegisterAgent?.RegisteredAgentAddress2 || '',
        'RegisterAgent.RegisteredAgentCity': order.RegisterAgent?.RegisteredAgentCity || '',
        'RegisterAgent.RegisteredAgentState': order.RegisterAgent?.RegisteredAgentState || '',
        'RegisterAgent.RegisteredAgentZip': order.RegisterAgent?.RegisteredAgentZip || '',
        'RegisterAgent.RegisteredAgentCountry': order.RegisterAgent?.RegisteredAgentCountry || '',
        'selectedPackage.id': order.selectedPackage?.id || '',
        'selectedPackage.name': order.selectedPackage?.name || '',
        'selectedPackage.price': order.selectedPackage?.price || '',
        'selectedPackage.totalPrice': order.selectedPackage?.totalPrice || '',
        'filingSpeed': order.filingSpeed || '',
        'paymentStatus': order.paymentStatus || '',
        'paymentAmount': order.paymentAmount || '',
        'createdAt': order.createdAt ? order.createdAt.toISOString().split('T')[0] : '',
        'createdTime': order.createdAt ? new Date(order.createdAt).toLocaleTimeString('en-US', { hour12: false }) : '',
        
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="business-orders.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting business orders:', err);
    res.status(500).json({ message: 'Failed to export orders' });
  }
});

// Update order status and send status update email for any status
router.put('/business-orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Business.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.paymentStatus = status;
    await order.save();

   
    try {
      const emailData = {
        contact: order.Contact,
        companyInfo: order.CompanyInfo,
        selectedPackage: order.selectedPackage,
        filingSpeed: order.filingSpeed
      };
      await sendStatusUpdateEmail(emailData, status);
    } catch (emailErr) {
      console.error('Failed to send status update email:', emailErr);
    }
    res.status(200).json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Change admin password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });
    admin.password = newPassword;
    await admin.save();
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Failed to change password.' });
  }
});
function generateWorksheetColumns(maxParticipants = 3) {
  const baseColumns = [
    { header: 'Email', key: 'Contact.ContactEmail', width: 28 },
    { header: 'First Name', key: 'Contact.ContactFirstName', width: 18 },
    { header: 'Last Name', key: 'Contact.ContactLastName', width: 18 },
    { header: 'Phone', key: 'Contact.ContactPhone', width: 18 },
    { header: 'Evening Phone', key: 'Contact.ContactEveningPhone', width: 18 },
    { header: 'Desired Company Name', key: 'CompanyInfo.CompanyDesiredName', width: 28 },
    { header: 'Alternative Company Name', key: 'CompanyInfo.CompanyAlternativeName', width: 28 },
    { header: 'Business Category', key: 'CompanyInfo.CompanyBusinessCategory', width: 20 },
    { header: 'Business Description', key: 'CompanyInfo.CompanyBusinessDescription', width: 32 },
    { header: 'Business Country', key: 'BusinessAddress.BusinessAddressCountry', width: 12 },
    { header: 'Business Address Line 1', key: 'BusinessAddress.BusinessAddressAddress1', width: 24 },
    { header: 'Business Address Line 2', key: 'BusinessAddress.BusinessAddressAddress2', width: 24 },
    { header: 'Business City', key: 'BusinessAddress.BusinessAddressCity', width: 18 },
    { header: 'Business State', key: 'BusinessAddress.BusinessAddressState', width: 10 },
    { header: 'Business ZIP Code', key: 'BusinessAddress.BusinessAddressZip', width: 12 },
    { header: 'CorpNet Agent?', key: 'RegisterAgent.RegisteredAgentIsCorpnetAgent', width: 10 },
    { header: 'Agent First Name', key: 'RegisterAgent.RegisteredAgentFirstName', width: 18 },
    { header: 'Agent Last Name', key: 'RegisterAgent.RegisteredAgentLastName', width: 18 },
    { header: 'Agent Address Line 1', key: 'RegisterAgent.RegisteredAgentAddress1', width: 24 },
    { header: 'Agent Address Line 2', key: 'RegisterAgent.RegisteredAgentAddress2', width: 24 },
    { header: 'Agent City', key: 'RegisterAgent.RegisteredAgentCity', width: 18 },
    { header: 'Agent State', key: 'RegisterAgent.RegisteredAgentState', width: 10 },
    { header: 'Agent ZIP Code', key: 'RegisterAgent.RegisteredAgentZip', width: 12 },
    { header: 'Agent Country', key: 'RegisterAgent.RegisteredAgentCountry', width: 10 },
    { header: 'Package ID', key: 'selectedPackage.id', width: 18 },
    { header: 'Package Name', key: 'selectedPackage.name', width: 18 },
    { header: 'Package Price', key: 'selectedPackage.price', width: 12 },
    { header: 'Package Total Price', key: 'selectedPackage.totalPrice', width: 14 },
    { header: 'Filing Speed', key: 'filingSpeed', width: 14 },
    { header: 'Payment Status', key: 'paymentStatus', width: 14 },
    { header: 'Payment Amount', key: 'paymentAmount', width: 14 },
    { header: 'Created Date', key: 'createdAt', width: 18 },
    { header: 'Created Time', key: 'createdTime', width: 14 }
  ];

  const participantFields = [
    { suffix: 'Type', header: 'Type', width: 14 },
    { suffix: 'FirstName', header: 'First Name', width: 16 },
    { suffix: 'MiddleInitial', header: 'Middle Initial', width: 10 },
    { suffix: 'LastName', header: 'Last Name', width: 16 },
    { suffix: 'Titles', header: 'Titles', width: 20 },
    { suffix: 'MailingAddress.Address1', header: 'Address Line 1', width: 20 },
    { suffix: 'MailingAddress.Address2', header: 'Address Line 2', width: 20 },
    { suffix: 'MailingAddress.City', header: 'City', width: 14 },
    { suffix: 'MailingAddress.State', header: 'State', width: 10 },
    { suffix: 'MailingAddress.Zip', header: 'ZIP Code', width: 12 },
    { suffix: 'MailingAddress.Country', header: 'Country', width: 10 },
    { suffix: 'OwnershipPercentage', header: 'Ownership %', width: 14 },
    { suffix: 'IsAuthorizedSigner', header: 'Authorized Signer', width: 16 },
    { suffix: 'socialNumber', header: 'SSN', width: 16 }
  ];

  const participantColumns = [];

  for (let i = 1; i <= maxParticipants; i++) {
    participantFields.forEach(field => {
      participantColumns.push({
        header: `Participant ${i} - ${field.header}`,
        key: `Participant${i}.${field.suffix}`,
        width: field.width
      });
    });
  }

  return [...baseColumns, ...participantColumns];
}

// Usage
 // Download a single business order as Excel with all details
router.get('/business-orders/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Business.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Order Details');

    // worksheet.columns = [
    //   { header: 'Email', key: 'Contact.ContactEmail', width: 28 },
    //   { header: 'First Name', key: 'Contact.ContactFirstName', width: 18 },
    //   { header: 'Last Name', key: 'Contact.ContactLastName', width: 18 },
    //   { header: 'Phone', key: 'Contact.ContactPhone', width: 18 },
    //   { header: 'Evening Phone', key: 'Contact.ContactEveningPhone', width: 18 },
    //   { header: 'Desired Company Name', key: 'CompanyInfo.CompanyDesiredName', width: 28 },
    //   { header: 'Alternative Company Name', key: 'CompanyInfo.CompanyAlternativeName', width: 28 },
    //   { header: 'Business Category', key: 'CompanyInfo.CompanyBusinessCategory', width: 20 },
    //   { header: 'Business Description', key: 'CompanyInfo.CompanyBusinessDescription', width: 32 },
    //   { header: 'Country', key: 'BusinessAddress.BusinessAddressCountry', width: 8 },
    //   { header: 'Address Line 1', key: 'BusinessAddress.BusinessAddressAddress1', width: 24 },
    //   { header: 'Address Line 2', key: 'BusinessAddress.BusinessAddressAddress2', width: 24 },
    //   { header: 'City', key: 'BusinessAddress.BusinessAddressCity', width: 18 },
    //   { header: 'State', key: 'BusinessAddress.BusinessAddressState', width: 8 },
    //   { header: 'ZIP Code', key: 'BusinessAddress.BusinessAddressZip', width: 10 },
    //   { header: 'Is CorpNet Agent?', key: 'RegisterAgent.RegisteredAgentIsCorpnetAgent', width: 8 },
    //   { header: 'Agent First Name', key: 'RegisterAgent.RegisteredAgentFirstName', width: 18 },
    //   { header: 'Agent Last Name', key: 'RegisterAgent.RegisteredAgentLastName', width: 18 },
    //   { header: 'Agent Address Line 1', key: 'RegisterAgent.RegisteredAgentAddress1', width: 24 },
    //   { header: 'Agent Address Line 2', key: 'RegisterAgent.RegisteredAgentAddress2', width: 24 },
    //   { header: 'Agent City', key: 'RegisterAgent.RegisteredAgentCity', width: 18 },
    //   { header: 'Agent State', key: 'RegisterAgent.RegisteredAgentState', width: 8 },
    //   { header: 'Agent ZIP Code', key: 'RegisterAgent.RegisteredAgentZip', width: 10 },
    //   { header: 'Agent Country', key: 'RegisterAgent.RegisteredAgentCountry', width: 8 },
    //   { header: 'Package ID', key: 'selectedPackage.id', width: 18 },
    //   { header: 'Package Name', key: 'selectedPackage.name', width: 18 },
    //   { header: 'Package Price', key: 'selectedPackage.price', width: 12 },
    //   { header: 'Package Total Price', key: 'selectedPackage.totalPrice', width: 12 },
    //   { header: 'Filing Speed', key: 'filingSpeed', width: 14 },
    //   { header: 'Payment Status', key: 'paymentStatus', width: 14 },
    //   { header: 'Payment Amount', key: 'paymentAmount', width: 14 },
    //   { header: 'Created At', key: 'createdAt', width: 20 },
    //   { header: 'Created Time', key: 'createdTime', width: 12 },
    //   { header: 'Participant1.Type', key: 'Participant1.Type', width: 12 },
    //   { header: 'Participant1.FirstName', key: 'Participant1.FirstName', width: 14 },
    //   { header: 'Participant1.MiddleInitial', key: 'Participant1.MiddleInitial', width: 8 },
    //   { header: 'Participant1.LastName', key: 'Participant1.LastName', width: 14 },
    //   { header: 'Participant1.Titles', key: 'Participant1.Titles', width: 18 },
    //   { header: 'Participant1.MailingAddress.Address1', key: 'Participant1.MailingAddress.Address1', width: 18 },
    //   { header: 'Participant1.MailingAddress.Address2', key: 'Participant1.MailingAddress.Address2', width: 18 },
    //   { header: 'Participant1.MailingAddress.City', key: 'Participant1.MailingAddress.City', width: 14 },
    //   { header: 'Participant1.MailingAddress.State', key: 'Participant1.MailingAddress.State', width: 8 },
    //   { header: 'Participant1.MailingAddress.Zip', key: 'Participant1.MailingAddress.Zip', width: 10 },
    //   { header: 'Participant1.MailingAddress.Country', key: 'Participant1.MailingAddress.Country', width: 8 },
    //   { header: 'Participant1.OwnershipPercentage', key: 'Participant1.OwnershipPercentage', width: 10 },
    //   { header: 'Participant1.IsAuthorizedSigner', key: 'Participant1.IsAuthorizedSigner', width: 10 },
    //   { header: 'Participant1.socialNumber', key: 'Participant1.socialNumber', width: 14 },
    //   { header: 'Participant2.Type', key: 'Participant2.Type', width: 12 },
    //   { header: 'Participant2.FirstName', key: 'Participant2.FirstName', width: 14 },
    //   { header: 'Participant2.MiddleInitial', key: 'Participant2.MiddleInitial', width: 8 },
    //   { header: 'Participant2.LastName', key: 'Participant2.LastName', width: 14 },
    //   { header: 'Participant2.Titles', key: 'Participant2.Titles', width: 18 },
    //   { header: 'Participant2.MailingAddress.Address1', key: 'Participant2.MailingAddress.Address1', width: 18 },
    //   { header: 'Participant2.MailingAddress.Address2', key: 'Participant2.MailingAddress.Address2', width: 18 },
    //   { header: 'Participant2.MailingAddress.City', key: 'Participant2.MailingAddress.City', width: 14 },
    //   { header: 'Participant2.MailingAddress.State', key: 'Participant2.MailingAddress.State', width: 8 },
    //   { header: 'Participant2.MailingAddress.Zip', key: 'Participant2.MailingAddress.Zip', width: 10 },
    //   { header: 'Participant2.MailingAddress.Country', key: 'Participant2.MailingAddress.Country', width: 8 },
    //   { header: 'Participant2.OwnershipPercentage', key: 'Participant2.OwnershipPercentage', width: 10 },
    //   { header: 'Participant2.IsAuthorizedSigner', key: 'Participant2.IsAuthorizedSigner', width: 10 },
    //   { header: 'Participant2.socialNumber', key: 'Participant2.socialNumber', width: 14 },
    //   { header: 'Participant3.Type', key: 'Participant3.Type', width: 12 },
    //   { header: 'Participant3.FirstName', key: 'Participant3.FirstName', width: 14 },
    //   { header: 'Participant3.MiddleInitial', key: 'Participant3.MiddleInitial', width: 8 },
    //   { header: 'Participant3.LastName', key: 'Participant3.LastName', width: 14 },
    //   { header: 'Participant3.Titles', key: 'Participant3.Titles', width: 18 },
    //   { header: 'Participant3.MailingAddress.Address1', key: 'Participant3.MailingAddress.Address1', width: 18 },
    //   { header: 'Participant3.MailingAddress.Address2', key: 'Participant3.MailingAddress.Address2', width: 18 },
    //   { header: 'Participant3.MailingAddress.City', key: 'Participant3.MailingAddress.City', width: 14 },
    //   { header: 'Participant3.MailingAddress.State', key: 'Participant3.MailingAddress.State', width: 8 },
    //   { header: 'Participant3.MailingAddress.Zip', key: 'Participant3.MailingAddress.Zip', width: 10 },
    //   { header: 'Participant3.MailingAddress.Country', key: 'Participant3.MailingAddress.Country', width: 8 },
    //   { header: 'Participant3.OwnershipPercentage', key: 'Participant3.OwnershipPercentage', width: 10 },
    //   { header: 'Participant3.IsAuthorizedSigner', key: 'Participant3.IsAuthorizedSigner', width: 10 },
    //   { header: 'Participant3.socialNumber', key: 'Participant3.socialNumber', width: 14 },
    // ];
// Base row data
worksheet.columns = generateWorksheetColumns(order.CompanyParticipants.length || 3);

const rowData = {
  'Contact.ContactEmail': order.Contact?.ContactEmail || '',
  'Contact.ContactFirstName': order.Contact?.ContactFirstName || '',
  'Contact.ContactLastName': order.Contact?.ContactLastName || '',
  'Contact.ContactPhone': order.Contact?.ContactPhone || '',
  'Contact.ContactEveningPhone': order.Contact?.ContactEveningPhone || '',
  'CompanyInfo.CompanyDesiredName': order.CompanyInfo?.CompanyDesiredName || '',
  'CompanyInfo.CompanyAlternativeName': order.CompanyInfo?.CompanyAlternativeName || '',
  'CompanyInfo.CompanyBusinessCategory': order.CompanyInfo?.CompanyBusinessCategory || '',
  'CompanyInfo.CompanyBusinessDescription': order.CompanyInfo?.CompanyBusinessDescription || '',
  'BusinessAddress.BusinessAddressCountry': order.BusinessAddress?.BusinessAddressCountry || '',
  'BusinessAddress.BusinessAddressAddress1': order.BusinessAddress?.BusinessAddressAddress1 || '',
  'BusinessAddress.BusinessAddressAddress2': order.BusinessAddress?.BusinessAddressAddress2 || '',
  'BusinessAddress.BusinessAddressCity': order.BusinessAddress?.BusinessAddressCity || '',
  'BusinessAddress.BusinessAddressState': order.BusinessAddress?.BusinessAddressState || '',
  'BusinessAddress.BusinessAddressZip': order.BusinessAddress?.BusinessAddressZip || '',
  'RegisterAgent.RegisteredAgentIsCorpnetAgent': order.RegisterAgent?.RegisteredAgentIsCorpnetAgent || '',
  'RegisterAgent.RegisteredAgentFirstName': order.RegisterAgent?.RegisteredAgentFirstName || '',
  'RegisterAgent.RegisteredAgentLastName': order.RegisterAgent?.RegisteredAgentLastName || '',
  'RegisterAgent.RegisteredAgentAddress1': order.RegisterAgent?.RegisteredAgentAddress1 || '',
  'RegisterAgent.RegisteredAgentAddress2': order.RegisterAgent?.RegisteredAgentAddress2 || '',
  'RegisterAgent.RegisteredAgentCity': order.RegisterAgent?.RegisteredAgentCity || '',
  'RegisterAgent.RegisteredAgentState': order.RegisterAgent?.RegisteredAgentState || '',
  'RegisterAgent.RegisteredAgentZip': order.RegisterAgent?.RegisteredAgentZip || '',
  'RegisterAgent.RegisteredAgentCountry': order.RegisterAgent?.RegisteredAgentCountry || '',
  'selectedPackage.id': order.selectedPackage?.id || '',
  'selectedPackage.name': order.selectedPackage?.name || '',
  'selectedPackage.price': order.selectedPackage?.price || '',
  'selectedPackage.totalPrice': order.selectedPackage?.totalPrice || '',
  'filingSpeed': order.filingSpeed || '',
  'paymentStatus': order.paymentStatus || '',
  'paymentAmount': order.paymentAmount || '',
  'createdAt': order.createdAt ? order.createdAt.toISOString().split('T')[0] : '',
  'createdTime': order.createdAt ? new Date(order.createdAt).toLocaleTimeString('en-US', { hour12: false }) : '',
};

 
(order.CompanyParticipants || []).forEach((participant, index) => {
  const i = index + 1;
  rowData[`Participant${i}.Type`] = participant?.Type || '';
  rowData[`Participant${i}.FirstName`] = participant?.FirstName || '';
  rowData[`Participant${i}.MiddleInitial`] = participant?.MiddleInitial || '';
  rowData[`Participant${i}.LastName`] = participant?.LastName || '';
  rowData[`Participant${i}.Titles`] = Array.isArray(participant?.Titles) ? participant.Titles.join(', ') : '';
  rowData[`Participant${i}.MailingAddress.Address1`] = participant?.MailingAddress?.Address1 || '';
  rowData[`Participant${i}.MailingAddress.Address2`] = participant?.MailingAddress?.Address2 || '';
  rowData[`Participant${i}.MailingAddress.City`] = participant?.MailingAddress?.City || '';
  rowData[`Participant${i}.MailingAddress.State`] = participant?.MailingAddress?.State || '';
  rowData[`Participant${i}.MailingAddress.Zip`] = participant?.MailingAddress?.Zip || '';
  rowData[`Participant${i}.MailingAddress.Country`] = participant?.MailingAddress?.Country || '';
  rowData[`Participant${i}.OwnershipPercentage`] = participant?.OwnershipPercentage || '';
  rowData[`Participant${i}.IsAuthorizedSigner`] = participant?.IsAuthorizedSigner || '';
  rowData[`Participant${i}.socialNumber`] = participant?.socialNumber || '';
});
 
 
worksheet.addRow(rowData);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="order-${order._id}.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting single order:', err);
    res.status(500).json({ message: 'Failed to export order' });
  }
});

module.exports = router;
