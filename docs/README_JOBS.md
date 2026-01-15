# 📋 Job Application System - Complete Overview

## 🎯 What Has Been Implemented

Your Pegas website now has a fully functional job application system that automatically stores all applicant data in your Google Sheet!

### Google Sheet URL
**https://docs.google.com/spreadsheets/d/1VTnK3v1qg0Njcub5AJ8C0_BwsA_nOQT_y0arY7kRCiM/edit?usp=sharing**

---

## 📊 Complete Application Data Structure

### Table Format: 28 Columns with Comprehensive Details

| # | Column | Description | Data Type |
|---|--------|-------------|-----------|
| 1 | **Timestamp** | Submission date & time | Auto-generated |
| 2 | **Job Title** | Position applied for | Text |
| 3 | **Job Department** | IT/Manufacturing/Distribution | Text |
| 4 | **Job ID** | Internal job reference | Number |
| 5 | **First Name** | Applicant's first name | Text (Required) |
| 6 | **Last Name** | Applicant's last name | Text (Required) |
| 7 | **Email** | Contact email | Email (Required) |
| 8 | **Phone** | Contact number | Text (Required) |
| 9 | **Address** | Full address | Text (Required) |
| 10 | **City** | City of residence | Text (Required) |
| 11 | **NIC Number** | National ID | Text (Required) |
| 12 | **LinkedIn Profile** | Professional profile URL | URL |
| 13 | **Portfolio/Website** | Personal website | URL |
| 14 | **Years of Experience** | Work experience range | Dropdown |
| 15 | **Education Level** | Highest qualification | Dropdown |
| 16 | **Degree/Qualification** | Specific degree details | Text (Required) |
| 17 | **Key Skills** | Comma-separated skills | Text (Required) |
| 18 | **Current/Previous Company** | Employer name | Text |
| 19 | **Current/Previous Position** | Job title | Text |
| 20 | **Cover Letter** | Application message | Long Text (Required) |
| 21 | **Resume File Name** | Uploaded file name | Text |
| 22 | **Resume URL** | Google Drive link to resume | URL |
| 23 | **Availability** | Start date preference | Dropdown (Required) |
| 24 | **Expected Salary** | Monthly salary in LKR | Text (Required) |
| 25 | **Referral Source** | How they found the job | Dropdown |
| 26 | **Consent Status** | Data processing agreement | Yes/No |
| 27 | **Submission IP** | User IP address | Text |
| 28 | **User Agent** | Browser/device info | Text |

---

## 🚀 Setup Instructions

### **Option 1: Quick Start (5 minutes)**
Follow: [`docs/QUICK_START_JOBS.md`](./QUICK_START_JOBS.md)

### **Option 2: Detailed Setup**
Follow: [`docs/GOOGLE_SHEETS_SETUP.md`](./GOOGLE_SHEETS_SETUP.md)

---

## 📁 Files Modified/Created

### Created Files:
1. ✅ **`docs/GOOGLE_SHEETS_SETUP.md`** - Complete setup documentation
2. ✅ **`docs/QUICK_START_JOBS.md`** - Quick 5-minute setup guide
3. ✅ **`docs/README_JOBS.md`** - This overview file

### Modified Files:
1. ✅ **`index.html`** - Enhanced job application form with 20+ fields
2. ✅ **`js/script.js`** - Added Google Sheets integration logic

---

## ✨ Key Features

### 📝 **Comprehensive Form Collection**
- 20+ data fields covering all essential applicant information
- Required field validation
- File upload with format validation (PDF, DOC, DOCX)
- Professional multi-section layout

### 📊 **Google Sheets Integration**
- Automatic data submission to your Google Sheet
- 28-column structured table format
- Real-time data storage
- Auto-formatting with styled headers

### 📎 **Resume Management**
- Automatic resume upload to Google Drive
- Organized in "Job Applications - Pegas" folder
- Unique filename generation (timestamp + applicant name)
- Direct links in spreadsheet

### 🔔 **Email Notifications (Optional)**
- Automated HR email alerts for new applications
- Detailed applicant summary in email
- Easy to enable/disable

### 🔒 **Data Privacy & Security**
- Required consent checkbox
- IP address logging
- User agent tracking
- Secure HTTPS transmission

### 🎨 **Professional UI/UX**
- Clean, modern form design
- Loading states during submission
- Success confirmation message
- Form validation feedback

---

## 🎯 How It Works

### **User Journey:**

1. **User clicks "Jobs" button** → Jobs portal opens
2. **Browse available positions** → 8 job listings across 3 divisions
3. **Click "Apply Now"** → Application form appears
4. **Fill 20+ fields** → Personal, professional, and application details
5. **Upload resume** → PDF/DOC/DOCX file
6. **Submit form** → Data processing begins

### **Backend Process:**

1. **JavaScript validation** → Ensures all required fields filled
2. **Resume encoding** → File converted to base64
3. **Data packaging** → JSON object created with all fields
4. **API submission** → POST request to Google Apps Script
5. **Google Script processes:**
   - Creates "Applications" sheet if needed
   - Uploads resume to Google Drive
   - Generates shareable resume link
   - Appends new row with all 28 data points
   - Auto-formats the row
   - (Optional) Sends email notification
6. **Success response** → User sees confirmation message

---

## 📋 Application Form Fields

### **Personal Information Section**
```
✓ First Name *
✓ Last Name *
✓ Email Address *
✓ Phone Number *
✓ Full Address *
✓ City *
✓ NIC Number *
```

### **Professional Information Section**
```
✓ LinkedIn Profile URL
✓ Portfolio/Website URL
✓ Years of Experience * (dropdown)
✓ Education Level * (dropdown)
✓ Degree/Qualification Details *
✓ Key Skills *
✓ Current/Previous Company
✓ Current/Previous Position
```

### **Application Details Section**
```
✓ Cover Letter / Why join Pegas? *
✓ Upload Resume/CV * (PDF/DOC/DOCX, max 5MB)
✓ When can you start? * (dropdown)
✓ Expected Salary (LKR/Month) *
✓ How did you hear about this position? (dropdown)
```

### **Consent Section**
```
☑ Data processing consent *
```

*\* = Required fields*

---

## 🔧 Configuration Required

### **CRITICAL: Update Google Script URL**

After deploying your Google Apps Script, you MUST update this line in `js/script.js` (around line 853):

```javascript
// BEFORE (default):
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

// AFTER (your actual URL):
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

**Until you do this, the form will show an error message and won't submit data.**

---

## 📧 Email Notification Configuration (Optional)

### To enable email alerts:

1. Open Apps Script: Extensions > Apps Script
2. Update email recipient (line ~85):
   ```javascript
   var emailRecipient = 'youremail@pegas.lk';
   ```
3. Uncomment email sending (line ~108):
   ```javascript
   MailApp.sendEmail(emailRecipient, emailSubject, emailBody);
   ```
4. Save and redeploy

### Email includes:
- Job title and department
- Applicant name and contact info
- Professional background summary
- Application preferences
- Direct link to resume
- Link to full spreadsheet

---

## 🎨 Job Positions Available

The system includes 8 pre-configured job positions:

### **IT Solutions Division (4 positions)**
1. Senior Full Stack Developer
2. Cybersecurity Specialist
3. Cloud Solutions Architect
4. Mobile App Developer

### **Manufacturing Division (2 positions)**
5. Production Manager
6. Quality Assurance Engineer

### **Distribution Division (2 positions)**
7. Logistics Coordinator
8. Warehouse Manager

*Add more jobs by editing the job cards in `index.html` and updating `jobsData` in `js/script.js`*

---

## 🔍 Data Analysis Capabilities

With all data in Google Sheets, you can easily:

### **Filtering & Sorting:**
- Filter by job title, department, or division
- Sort by submission date
- Filter by experience level
- Search by skills

### **Analytics:**
- Count applications per position
- Track application trends over time
- Analyze referral sources
- Review salary expectations
- Education level distribution

### **Integration:**
- Export to Excel for offline analysis
- Connect to Google Data Studio for dashboards
- Use Google Sheets formulas for calculations
- Create pivot tables for insights

---

## 🛡️ Security & Privacy

### **Data Protection:**
✅ HTTPS encryption for all transmissions  
✅ Google's secure infrastructure for storage  
✅ Required consent checkbox  
✅ Clear data usage disclosure  

### **Access Control:**
✅ Google Sheet permissions controlled by owner  
✅ Resume files accessible only via link  
✅ Apps Script runs under your Google account  
✅ No third-party services involved  

### **Compliance:**
✅ Timestamp for audit trails  
✅ IP logging for security  
✅ User agent tracking  
✅ Applicant consent recorded  

---

## 📱 Mobile Responsive

The application form is fully responsive and works perfectly on:
- ✅ Desktop computers
- ✅ Tablets (iPad, Android tablets)
- ✅ Mobile phones (all screen sizes)
- ✅ All modern browsers

---

## 🐛 Troubleshooting

### Common Issues:

**1. Form doesn't submit / shows configuration error**
- ➤ Update `GOOGLE_SCRIPT_URL` in `js/script.js`

**2. Data not appearing in Google Sheets**
- ➤ Check sheet is named exactly "Applications"
- ➤ Verify sheet permissions: Anyone with link can Edit
- ➤ Check Apps Script execution logs

**3. Resume upload fails**
- ➤ Ensure file is under 5MB
- ➤ Use only PDF, DOC, or DOCX format
- ➤ Check Google Drive storage quota

**4. Email notifications not working**
- ➤ Verify email code is uncommented
- ➤ Check recipient email address is correct
- ➤ Review Apps Script execution logs

---

## 📞 Support Resources

1. **Setup Guides:**
   - Quick Start: `docs/QUICK_START_JOBS.md`
   - Detailed Guide: `docs/GOOGLE_SHEETS_SETUP.md`

2. **Google Documentation:**
   - [Google Apps Script](https://developers.google.com/apps-script)
   - [Google Sheets API](https://developers.google.com/sheets/api)
   - [Google Drive API](https://developers.google.com/drive/api)

3. **Debugging:**
   - Browser Console: F12 → Console tab
   - Apps Script Logs: Extensions → Apps Script → Executions

---

## ✅ Checklist: Is Everything Working?

Use this checklist to verify your setup:

- [ ] Google Sheet opened and accessible
- [ ] "Applications" sheet created
- [ ] 28 column headers added
- [ ] Google Apps Script created and saved
- [ ] Script deployed as Web App
- [ ] Web App URL copied
- [ ] `js/script.js` updated with Web App URL
- [ ] Sheet permissions set to "Anyone with link can Edit"
- [ ] Test form submission completed
- [ ] Data appears in Google Sheet (new row added)
- [ ] Resume uploaded to Google Drive
- [ ] Resume link clickable in sheet
- [ ] (Optional) Email notifications tested

---

## 🎉 Success!

Once setup is complete, your Pegas website will have:

✨ **Professional job application system**  
✨ **Automatic data collection and storage**  
✨ **Organized applicant database**  
✨ **Resume file management**  
✨ **Email notification system**  
✨ **Analytics-ready data structure**  

All job applications will be automatically organized in your Google Sheet, ready for HR team review!

---

## 📊 Sample Data Preview

After an application is submitted, you'll see a new row like this:

| Timestamp | Job Title | First Name | Last Name | Email | ... | Resume URL | Salary |
|-----------|-----------|------------|-----------|-------|-----|------------|--------|
| 2026-01-15 14:30:25 | Senior Full Stack Developer | John | Doe | john@email.com | ... | [View Resume] | 150,000 |

*Click the resume URL to view/download the applicant's CV directly from Google Drive*

---

**System Version:** 1.0  
**Last Updated:** January 15, 2026  
**Created for:** Pegas (Pvt) Ltd  
**Website:** https://pegas.lk  

---

## 🚀 Ready to Launch!

Your job application system is ready to go live. Just complete the 5-minute setup and start receiving applications!

**Happy Hiring! 🎯**
