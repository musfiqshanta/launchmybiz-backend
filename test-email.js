const { sendConfirmationEmail } = require('./src/lib/emailService');

// Test data
const testUserData = {
  contact: {
    ContactFirstName: 'John',
    ContactLastName: 'Doe',
    ContactEmail: 'arifhusain5010@gmail.com', // Change this to your test email
    ContactPhone: '+1-555-123-4567'
  },
  companyInfo: {
    CompanyDesiredName: 'Test Business LLC',
    CompanyBusinessCategory: 'Technology',
    CompanyBusinessDescription: 'A test business for email verification'
  },
  selectedPackage: {
    name: 'Basic LLC Formation Package',
    totalPrice: 299
  },
  filingSpeed: 'Standard Filing (5-7 business days)'
};

async function testEmail() {
  console.log('Testing email functionality...');
  console.log('Sending test email to:', testUserData.contact.ContactEmail);
  
  try {
    const result = await sendConfirmationEmail(testUserData);
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send email:', result.error);
    }
  } catch (error) {
    console.log('❌ Error testing email:', error.message);
  }
}

testEmail(); 