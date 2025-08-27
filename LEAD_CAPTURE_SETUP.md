# LEAD CAPTURE SETUP GUIDE

## 🚨 **TROUBLESHOOTING: "Failed to save to API" Error**

If you're seeing "Failed to save to API" errors in the console, follow these steps:

### **1. Check Environment Variables**
Ensure these are set in your `.env.local` file:
```bash
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
GOOGLE_SPREADSHEET_ID=your_actual_spreadsheet_id
GOOGLE_CALENDAR_ID=caiorarity@gmail.com
```

### **2. Verify Google Credentials File**
- Ensure `google-credentials.json` exists in your project root
- Check file permissions (should be readable)
- Verify the JSON contains valid service account credentials

### **3. Test API Connectivity**
Run this command to test Google Sheets API:
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

### **4. Common Issues & Solutions**

#### **Issue: 500 Internal Server Error**
- **Cause**: Missing or invalid Google API credentials
- **Solution**: Regenerate service account key and update credentials

#### **Issue: "Failed to load resource"**
- **Cause**: API route not accessible or server error
- **Solution**: Check Next.js server logs and restart development server

#### **Issue: Google Sheets Permission Denied**
- **Cause**: Service account doesn't have access to spreadsheet
- **Solution**: Share spreadsheet with service account email

---

## 📋 **Complete Setup Instructions**

### **Step 1: Google Cloud Platform Setup**

1. **Create a new project** or select existing one
2. **Enable APIs**:
   - Google Sheets API v4
   - Google Calendar API v3
3. **Create Service Account**:
   - Go to IAM & Admin > Service Accounts
   - Create new service account
   - Download JSON key file
   - Rename to `google-credentials.json`

### **Step 2: Google Sheets Setup**

1. **Create new spreadsheet** or use existing one
2. **Set up columns** (in this order):
   - A: Name
   - B: WhatsApp
   - C: Email
   - D: Instagram
   - E: Industry/Business
   - F: Main Struggle
   - G: Budget/Investment
   - H: Scheduled Date & Time
   - I: Timestamp

3. **Share with service account**:
   - Copy service account email from credentials
   - Share spreadsheet with that email
   - Give "Editor" permissions

4. **Get Spreadsheet ID**:
   - From URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the ID part

### **Step 3: Google Calendar Setup**

1. **Create new calendar** or use existing one
2. **Set timezone** to Europe/Madrid
3. **Configure working hours**:
   - Monday-Friday: 8:00 AM - 6:00 PM
   - No weekend availability
4. **Share with service account**:
   - Add service account email as calendar admin

### **Step 4: Environment Configuration**

Create `.env.local` file in project root:
```bash
# Google API Configuration
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_CALENDAR_ID=caiorarity@gmail.com

# SMTP Configuration (Required for email sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail_address@gmail.com
SMTP_PASS=your_16_character_app_password
MAIL_FROM=your_gmail_address@gmail.com

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXT_PUBLIC_EMAIL_ENABLED=true
```

### **Step 5: Email Setup (Gmail SMTP)**

To enable email confirmation for lead capture, you need to set up Gmail SMTP:

#### **5.1 Enable 2-Step Verification**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click "2-Step Verification" and follow the setup process
3. This is required to generate app passwords

#### **5.2 Generate App Password**
1. **Direct Link**: Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other (Custom name)" as the device
4. Enter a name like "Caio Lead Capture System"
5. Click "Generate"
6. **Copy the 16-character password** (e.g., `affz lhsl qiem nbcz`)

#### **5.3 Update Environment Variables**
Replace the SMTP values in your `.env.local`:
```bash
SMTP_USER=caiorarity@gmail.com
SMTP_PASS=affz lhsl qiem nbcz
MAIL_FROM=caiorarity@gmail.com
```

**Important Notes:**
- Use the **app password**, not your regular Gmail password
- Remove spaces from the app password when adding to `.env.local`
- Keep the app password secure and don't share it
- The app password grants full access to your Google Account

### **Step 6: Test the Setup**

1. **Start development server**:
```bash
npm run dev
```

2. **Open lead capture modal** and fill out form

3. **Check console** for any errors

4. **Verify data** appears in Google Sheets

5. **Check calendar** for scheduled events
6. **Verify email confirmation** is sent (if email is enabled)

#### **6.1 Test Email API (Optional)**
To test email functionality separately:
```bash
# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/email" -Method POST -ContentType "application/json" -Body '{"to":["test@example.com"],"subject":"Test Email","html":"<h1>Test Email</h1><p>This is a test email.</p>"}'

# Using curl (if available)
curl -X POST http://localhost:3000/api/email -H "Content-Type: application/json" -d "{\"to\":[\"test@example.com\"],\"subject\":\"Test Email\",\"html\":\"<h1>Test Email</h1><p>This is a test email.</p>\"}"
```

**Expected Response**: `{"success":true,"id":"message_id_here"}`

---

## 🔧 **Advanced Configuration**

### **Customizing Available Time Slots**

Edit `lib/google-services.ts` to modify:
- Working hours
- Timezone settings
- Slot duration (currently 1 hour)

### **Modifying Form Fields**

Edit `lib/types.ts` to:
- Add/remove form fields
- Change validation rules
- Modify field types

### **Styling Customization**

Edit `components/LeadCaptureModal.tsx` to:
- Change colors and themes
- Modify layout and spacing
- Add custom animations

---

## 🚀 **Deployment Considerations**

### **Production Environment**

1. **Secure credentials**:
   - Use environment variables in production
   - Never commit credentials to git
   - Use secure secret management

2. **API quotas**:
   - Monitor Google API usage
   - Implement rate limiting if needed
   - Set up alerts for quota limits

3. **Error monitoring**:
   - Set up logging and monitoring
   - Implement retry logic for failed API calls
   - Monitor user experience metrics

---

## 📞 **Support & Troubleshooting**

### **Getting Help**

1. **Check console logs** for detailed error messages
2. **Verify API status** at [Google Cloud Console](https://console.cloud.google.com)
3. **Test API endpoints** individually
4. **Check network tab** for failed requests

### **Common Error Messages**

- **"Failed to save to API"**: Check credentials and permissions
- **"500 Internal Server Error"**: Server-side configuration issue
- **"Permission denied"**: Service account access issue
- **"Quota exceeded"**: API usage limits reached

### **Email-Specific Issues**

- **"500 Internal Server Error" on /api/email**: Check SMTP configuration in `.env.local`
- **"Authentication failed"**: Verify app password is correct and 2-Step Verification is enabled
- **"Connection timeout"**: Check SMTP_HOST and SMTP_PORT settings
- **"Invalid credentials"**: Ensure SMTP_USER and SMTP_PASS are properly set

#### **Email Troubleshooting Steps**
1. **Verify SMTP settings** in `.env.local`
2. **Check app password** is correct (16 characters, no spaces)
3. **Ensure 2-Step Verification** is enabled on Gmail
4. **Restart development server** after changing environment variables
5. **Test email API** separately using the test commands above

---

*This guide covers the essential setup steps. For advanced configuration, refer to the Google API documentation.*
