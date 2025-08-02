const nodemailer = require('nodemailer');
require('dotenv').config();
 
 
const transporter = nodemailer.createTransport({
  host:'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS 
  }
});
 
const createConfirmationEmailTemplate = (userData) => {
  const { contact, companyInfo, selectedPackage, filingSpeed } = userData;
  const logoUrl = process.env.LOGO_URL || 'https://launchmybiz.net/mainlogo-3-2.png';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Business Formation Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }
            .success-icon {
                font-size: 48px;
                color: #28a745;
                margin-bottom: 20px;
            }
            .package-details {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
            }
            .contact-info {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #28a745;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
            }
            .highlight {
                color: #667eea;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${logoUrl}" alt="LaunchMyBiz Logo" style="max-width: 200px; height: auto; margin-bottom: 15px;">
            </div>
            <h1>Business Formation Confirmation</h1>
            <p>Your LLC formation order has been successfully submitted!</p>
        </div>
        
        <div class="content">
            <div style="text-align: center;">
                <div class="success-icon">✅</div>
                <h2>Thank you for choosing LaunchMyBiz!</h2>
                <p>We're excited to help you start your business journey. Your order has been received and is being processed.</p>
            </div>
            
            <div class="package-details">
                <h3>📦 Package Details</h3>
                <p><strong>Package:</strong> <span class="highlight">${selectedPackage.name}</span></p>
                <p><strong>Filing Speed:</strong> <span class="highlight">${filingSpeed}</span></p>
                <p><strong>Total Amount:</strong> <span class="highlight">$${selectedPackage.totalPrice}</span></p>
            </div>
            
            <div class="contact-info">
                <h3>👤 Contact Information</h3>
                <p><strong>Name:</strong> ${contact.ContactFirstName} ${contact.ContactLastName}</p>
                <p><strong>Email:</strong> ${contact.ContactEmail}</p>
                <p><strong>Phone:</strong> ${contact.ContactPhone}</p>
            </div>
            
            <div class="contact-info">
                <h3>🏢 Company Information</h3>
                <p><strong>Company Name:</strong> <span class="highlight">${companyInfo.CompanyDesiredName}</span></p>
                <p><strong>Business Category:</strong> ${companyInfo.CompanyBusinessCategory}</p>
                <p><strong>Business Description:</strong> ${companyInfo.CompanyBusinessDescription}</p>
            </div>
            
            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>📋 What Happens Next?</h3>
                <ol>
                    <li><strong>Order Processing:</strong> Our team will review your application within 24-48 hours</li>
                    <li><strong>Document Preparation:</strong> We'll prepare all necessary formation documents</li>
                    <li><strong>State Filing:</strong> Your LLC will be filed with the state authorities</li>
                    <li><strong>Confirmation:</strong> You'll receive your formation documents and EIN</li>
                </ol>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>⚠️ Important Notes</h3>
                <ul>
                    <li>Please keep this email for your records</li>
                    <li>Processing times may vary based on state requirements</li>
                    <li>You'll receive updates via email throughout the process</li>
                    <li>If you have any questions, contact us at support@launchmybiz.net</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <div style="text-align: center; margin-bottom: 15px;">
                <img src="${logoUrl}" alt="LaunchMyBiz Logo" style="max-width: 150px; height: auto; opacity: 0.8;">
            </div>
            <p><strong>LaunchMyBiz</strong></p>
            <p>Your trusted partner in business formation</p>
            <p>Email: support@launchmybiz.net</p>
            <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
    </body>
    </html>
  `;
};

 
const sendConfirmationEmail = async (userData) => {
    try {
      const emailTemplate = createConfirmationEmailTemplate(userData);
      
         const mailOptions = {
          from: `"LaunchMyBiz" <${process.env.EMAIL_USER}>`, 
          to: userData.contact.ContactEmail,
          subject: 'Your LLC Formation Order Confirmation - LaunchMyBiz',
          html: emailTemplate
        };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Confirmation email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return { success: false, error: error.message };
    }
  };
  
// Status update email templates
const createStatusUpdateEmailTemplate = (userData, status) => {
  const { contact, companyInfo } = userData;
  const logoUrl = process.env.LOGO_URL || 'https://launchmybiz.net/mainlogo-3-2.png';
  let statusMessage = '';
  let subject = '';
  switch (status) {
    case 'approved':
      subject = 'Your LLC Formation Order is Approved!';
      statusMessage = `<p style='color:green'><strong>Congratulations!</strong> Your order has been <b>approved</b>. We will proceed with the next steps and keep you updated.</p>`;
      break;
    case 'rejected':
      subject = 'Your LLC Formation Order was Rejected';
      statusMessage = `<p style='color:red'><strong>We regret to inform you that your order was <b>rejected</b>.</strong> Please contact support for more information.</p>`;
      break;
    case 'paid':
      subject = 'Payment Received for Your LLC Formation Order';
      statusMessage = `<p style='color:blue'><strong>Thank you!</strong> We have received your payment. Your order is now being processed.</p>`;
      break;
    case 'pending':
      subject = 'Your LLC Formation Order is Pending';
      statusMessage = `<p style='color:orange'><strong>Your order is currently <b>pending</b>.</strong> We will notify you once there is an update.</p>`;
      break;
    default:
      subject = 'Order Status Update';
      statusMessage = `<p>Your order status has been updated to: <b>${status}</b>.</p>`;
  }
  return {
    subject,
    html: `
      <html><body>
        <div style="text-align:center;">
          <img src="${logoUrl}" alt="LaunchMyBiz Logo" style="max-width:180px; margin-bottom:20px;" />
        </div>
        <h2 style="text-align:center;">Order Status Update</h2>
        ${statusMessage}
        <div style="margin:20px 0;">
          <strong>Company Name:</strong> ${companyInfo.CompanyDesiredName}<br/>
          <strong>Contact:</strong> ${contact.ContactFirstName} ${contact.ContactLastName} (${contact.ContactEmail})
        </div>
        <p>If you have any questions, please contact us at <a href="mailto:support@launchmybiz.net">support@launchmybiz.net</a>.</p>
        <div style="text-align:center; margin-top:30px; color:#888; font-size:12px;">
          LaunchMyBiz &copy; ${new Date().getFullYear()}
        </div>
      </body></html>
    `
  };
};

const sendStatusUpdateEmail = async (userData, status) => {
  try {
    const { subject, html } = createStatusUpdateEmailTemplate(userData, status);
    const mailOptions = {
      from: `"LaunchMyBiz" <${process.env.EMAIL_USER}>`,
      to: userData.contact.ContactEmail,
      subject,
      html
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Status update email (${status}) sent:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending status update email:', error);
    return { success: false, error: error.message };
  }
};

// Admin alert email for new order
const sendAdminOrderAlert = async (userData) => {
  const { contact, companyInfo, selectedPackage, filingSpeed } = userData;
  const logoUrl = process.env.LOGO_URL || 'https://launchmybiz.net/mainlogo-3-2.png';
  const subject = `New LLC Formation Order: ${companyInfo.CompanyDesiredName}`;
  const html = `
    <html><body>
      <div style="text-align:center;">
        <img src="${logoUrl}" alt="LaunchMyBiz Logo" style="max-width:180px; margin-bottom:20px;" />
      </div>
      <h2>New Order Alert</h2>
      <p>A new LLC formation order has been created. Here are the details:</p>
      <ul>
        <li><strong>Company Name:</strong> ${companyInfo.CompanyDesiredName}</li>
        <li><strong>Contact:</strong> ${contact.ContactFirstName} ${contact.ContactLastName} (${contact.ContactEmail})</li>
        <li><strong>Phone:</strong> ${contact.ContactPhone}</li>
        <li><strong>Package:</strong> ${selectedPackage.name} ($${selectedPackage.totalPrice})</li>
        <li><strong>Filing Speed:</strong> ${filingSpeed}</li>
      </ul>
      <p>Check the admin panel for more details.</p>
      <div style="text-align:center; margin-top:30px; color:#888; font-size:12px;">
        LaunchMyBiz &copy; ${new Date().getFullYear()}
      </div>
    </body></html>
  `;
  try {
    const mailOptions = {
      from: `"LaunchMyBiz" <${process.env.EMAIL_USER}>`,
      to: 'support@launchmybiz.net',
      subject,
      html
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Admin alert email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin alert email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendConfirmationEmail,
  sendStatusUpdateEmail,
  sendAdminOrderAlert
}; 