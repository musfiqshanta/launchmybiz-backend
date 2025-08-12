require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const corpnet = require('@api/corpnet');
const Business=require('../models/BusinessSchema');
const router = require('./routes/admin');
const customersRouter = require('./routes/customers');
const { sendConfirmationEmail, sendAdminOrderAlert } = require('./lib/emailService');
const { connectToDatabase } = require('./lib/db');
corpnet.auth(process.env.CORPNET_API_KEY);
const axios =require('axios')
const app = express();
const PORT = process.env.PORT || 5001;
const cookieParser = require('cookie-parser');
const API_URL = 'https://staging22api.corpnet.com/api/business-formation/package';

 
  

 
const corsOptions = {
  origin: [
     'https://launch-31561078355.europe-west1.run.app',
     'https://launch-896056687002.europe-west1.run.app',
     'https://launchmybiz.net',
     'https://www.launchmybiz.net',
     'http://localhost:5173'

  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));
 
 
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
   const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  console.log(sig,endpointSecret,`endpointSecretendpointSecretendpointSecret
    endpointSecretendpointSecretendpointSecretendpointSecret`)
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`,err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`Payment was successful for session: ${session.id}`);

    const existingBusiness = await Business.findOne({ stripeCheckoutId: session.id });
    if (existingBusiness) {
      console.log("This session has already been processed.");
      return res.status(200).send('Already processed.');
    }

    try {
      const metadata = session.metadata;
      console.log('Processing metadata:', metadata);

      // Parse all JSON strings from metadata
      const contact = JSON.parse(metadata.Contact || '{}');
      const companyInfo = JSON.parse(metadata.CompanyInfo || '{}');
      const businessAddress = JSON.parse(metadata.BusinessAddress || '{}');
      const registerAgent = JSON.parse(metadata.RegisterAgent || '{}');
      const participants = JSON.parse(metadata.CompanyParticipants || '[]');
      const selectedPackage = JSON.parse(metadata.selectedPackage || '{}');

      // Create the CorpNet order payload with proper types
      const partnerOrder = {
        contact: {
          contactEmail: String(contact.ContactEmail || ''),
          contactFirstName: String(contact.ContactFirstName || ''),
          contactLastName: String(contact.ContactLastName || ''),
          contactPhone: String(contact.ContactPhone || ''),
          contactEveningPhone: String(contact.ContactEveningPhone || '')
        },
        companyInfo: {
          companyDesiredName: String(companyInfo.CompanyDesiredName || ''),
          companyAlternativeName: String(companyInfo.CompanyAlternativeName || ''),
          companyBusinessCategory: String(companyInfo.CompanyBusinessCategory || ''),
          companyBusinessDescription: String(companyInfo.CompanyBusinessDescription || '')
        },
        businessAddress: {
          businessAddressCountry: String(businessAddress.BusinessAddressCountry || 'US'),
          businessAddressAddress1: String(businessAddress.BusinessAddressAddress1 || ''),
          businessAddressAddress2: String(businessAddress.BusinessAddressAddress2 || ''),
          businessAddressCity: String(businessAddress.BusinessAddressCity || ''),
          businessAddressState: String(businessAddress.BusinessAddressState || ''),
          businessAddressZip: String(businessAddress.BusinessAddressZip || '')
        },
        // registerAgent: {
        //   registeredAgentIsCorpnetAgent: false,
        //   registeredAgentFirstName: String(registerAgent.RegisteredAgentFirstName || ''),
        //   registeredAgentLastName: String(registerAgent.RegisteredAgentLastName || ''),
        //   registeredAgentAddress1: String(registerAgent.RegisteredAgentAddress1 || ''),
        //   registeredAgentAddress2: String(registerAgent.RegisteredAgentAddress2 || ''),
        //   registeredAgentCity: String(registerAgent.RegisteredAgentCity || ''),
        //   registeredAgentState: String(registerAgent.RegisteredAgentState || ''),
        //   registeredAgentZip: String(registerAgent.RegisteredAgentZip || ''),
        //   registeredAgentCountry: String(registerAgent.RegisteredAgentCountry || 'US')
        // },
        registerAgent: {
          registeredAgentIsCorpnetAgent: false,
          registeredAgentFirstName: "registeredAgentFirstName",
          registeredAgentLastName: "registeredAgentFirstName",
          registeredAgentAddress1: "registeredAgentFirstName",
          registeredAgentAddress2: "registeredAgentFirstName",
          registeredAgentCity: "registeredAgentFirstName",
          registeredAgentState: "CA",
          registeredAgentZip: "45656",
          registeredAgentCountry: "USA"
        },
        apiUserPid: String(process.env.CORPNET_API_USER_PID || ''),
        pcid: String(process.env.CORPNET_PCID || ''),
        businessStructureType: 'LLC',
        businessStateInitial: String(businessAddress.BusinessAddressState || ''),
        orderTotalPrice: Number(metadata.totalAmount || 0),
        packageId: String(selectedPackage.id || ''),
        products: [{
          productId: '01tUS000009xuh7YAA',
          quantity: '1'
        }]
      };

      // Save to database first
      const newBusiness = new Business({
        Contact: contact,
        CompanyInfo: companyInfo,
        BusinessAddress: businessAddress,
        RegisterAgent: registerAgent,
        CompanyParticipants: participants,
        selectedPackage: {
          id: String(selectedPackage.id || ''),
          name: String(selectedPackage.name || ''),
          price: String(selectedPackage.price || ''),
          totalPrice: Number(selectedPackage.totalPrice || 0)
        },
        filingSpeed: String(metadata.filingSpeed || ''),
        stripeCheckoutId: String(session.id),
        paymentStatus: String(session.payment_status || ''),
        paymentAmount: Number(session.amount_total / 100 || 0)
      });

      await newBusiness.save();
      console.log(`Successfully saved business for: ${contact.ContactFirstName}`);

      // Send confirmation email to user (even if CorpNet fails)
      let emailSent = false;
      try {
        const emailData = {
          contact,
          companyInfo,
          selectedPackage,
          filingSpeed: metadata.filingSpeed
        };
        const emailResult = await sendConfirmationEmail(emailData);
        if (emailResult.success) {
          console.log('Confirmation email sent successfully to:', contact.ContactEmail);
          emailSent = true;
        } else {
          console.error('Failed to send confirmation email:', emailResult.error);
        }
      
        await sendAdminOrderAlert(emailData);
      } catch (emailErr) {
        console.error('Error sending confirmation email:', emailErr);
      }

     
      try {
        const { data: corpnetResponse } = await corpnet.postBusinessFormationV2CreateOrder({
          partnerOrder
        });
        console.log('CorpNet order success:', corpnetResponse);

         
        if (corpnetResponse?.orderId) {
          newBusiness.corpnetOrderId = String(corpnetResponse.orderId);
          await newBusiness.save();
        }
      } catch (corpnetErr) {
        console.error('Error calling CorpNet API:', corpnetErr?.response?.data || corpnetErr.message);
        // Don't throw error here, as we've already saved the business
      }

    } catch (err) {
      console.error('Error during business save or CorpNet call:', err);
      return res.status(500).json({ 
        error: 'Failed to process order',
        details: err.message 
      });
    }
  }

  res.status(200).send();
});

app.use(express.json());

// Customer auth routes
app.use('/api/customers', customersRouter);


app.post('/api/create-checkout-session', async (req, res) => {
  const formData = req.body.payload;
  console.log(req.body?.payload, 'reqdata12');

  if (!formData) {
    return res.status(400).json({ error: 'Form data is missing or invalid.' });
  }

  try {
    const baseAmount = formData.selectedPackage.totalPrice;
    const totalAmount = Math.round(baseAmount * 1.4);  

    const description = `Business Registration for ${formData.companyName} - ${formData.selectedPackage.name}`;

    console.log('Creating Stripe session with:', {
      totalAmount,
      description,
      email: formData.email
    });

    const metadata = {
      ...Object.entries(formData).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
        return acc;
      }, {}),
      packageId: formData.selectedPackage.id,
      packageName: formData.selectedPackage.name,
      packagePrice: formData.selectedPackage.price,
      baseAmount: baseAmount.toString(),
      totalAmount: baseAmount.toString(),  
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
            description: `Package: ${formData.selectedPackage.name} - Filing Speed: ${formData.filingSpeed}`,
          },
          unit_amount: baseAmount * 100,  
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: formData.email,
      metadata,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ 
      error: 'Failed to create payment session.',
      details: error.message 
    });
  }
});



app.get('/api/business-formation-package', async (req, res) => {
  try {
   
    const { entityType, state, filing } = req.query;
    console.log(entityType, state, filing,'entityType, state, filing')
    if (!entityType || !state || !filing) {
      return res.status(400).json({ 
        error: 'Missing required parameters. Please provide entityType, state, and filing.' 
      });
    }
    const params = {
      entityType:entityType,
      state: state,
      filing:filing
    };
    
    const response = await axios.get(API_URL, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization':'Bearer B3FD30BB85103E34BB5369D4A5E8DD3D85A196C1303B8044F7196AFE6FAA41F75BF06996652A657AA7C1EF4481D1B9F360A6'
      },
      timeout: 10000  
    });
    // const result = await corpnet.getBusinessFormationV2Package({
    //   entityType,
    //   state,
    //   filing
    // });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching business formation package:', error);
    res.status(500).json({ 
      error: 'Failed to fetch business formation package',
      details: error.message 
    });
  }
});

// corpnet.getBusinessFormationV2Package({entityType: 'LLC', state: 'NY', filing: 'standard'})
//   .then(({ data }) => console.log(data))
//   .catch(err => console.error(err));
app.use('/api/admin',router)

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('Failed to start server due to DB connection error:', error);
    process.exit(1);
  });