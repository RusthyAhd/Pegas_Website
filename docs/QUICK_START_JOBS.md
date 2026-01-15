# Quick Start: Job Application Google Sheets Integration

## 🚀 Setup in 5 Minutes

### Step 1: Open Your Google Sheet
Visit: https://docs.google.com/spreadsheets/d/1VTnK3v1qg0Njcub5AJ8C0_BwsA_nOQT_y0arY7kRCiM/edit?usp=sharing

### Step 2: Create "Applications" Sheet
1. Rename Sheet1 to **"Applications"**
2. Add these headers in Row 1 (copy-paste the entire row):

```
Timestamp	Job Title	Job Department	Job ID	First Name	Last Name	Email	Phone	Address	City	NIC Number	LinkedIn Profile	Portfolio/Website	Years of Experience	Education Level	Degree/Qualification	Key Skills	Current/Previous Company	Current/Previous Position	Cover Letter	Resume File Name	Resume URL	Availability	Expected Salary	Referral Source	Consent Status	Submission IP	User Agent
```

### Step 3: Create Google Apps Script
1. In your Google Sheet, click **Extensions > Apps Script**
2. Delete existing code
3. Copy the entire script from `docs/GOOGLE_SHEETS_SETUP.md` (Section: "Step 2")
4. Click **Save** (💾 icon)
5. Name it: "Pegas Job Application Handler"

### Step 4: Deploy Web App
1. Click **Deploy > New deployment**
2. Click gear icon ⚙️ > Select **"Web app"**
3. Configure:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Click **Authorize access** and follow prompts
6. **COPY THE WEB APP URL** (looks like: `https://script.google.com/macros/s/AKfycby.../exec`)

### Step 5: Update Your Website
1. Open `js/script.js`
2. Find line ~853:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace with your Web App URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. Save the file

### Step 6: Set Permissions
1. In Google Sheet, click **Share** button
2. Change **General access** to: "Anyone with the link" > "Editor"
3. Click **Done**

### Step 7: Test
1. Open your website (`index.html`)
2. Click **Jobs** button
3. Click **Apply Now** on any job
4. Fill and submit the form
5. Check your Google Sheet for the new row! ✅

---

## ✨ What's Included

### 📝 Complete Application Form
The job application form now collects:

**Personal Information:**
- ✅ First Name & Last Name
- ✅ Email & Phone
- ✅ Full Address & City
- ✅ NIC Number

**Professional Information:**
- ✅ LinkedIn Profile
- ✅ Portfolio/Website
- ✅ Years of Experience
- ✅ Education Level & Degree
- ✅ Key Skills
- ✅ Current/Previous Company & Position

**Application Details:**
- ✅ Cover Letter
- ✅ Resume Upload (PDF/DOC/DOCX)
- ✅ Availability
- ✅ Expected Salary
- ✅ Referral Source

**Metadata:**
- ✅ Timestamp
- ✅ IP Address
- ✅ User Agent
- ✅ Consent Confirmation

### 📊 Google Sheets Features
- **Automatic Data Storage** - All submissions saved instantly
- **Resume File Upload** - PDFs stored in Google Drive with links
- **Structured Table** - 28 columns with all applicant details
- **Auto-formatting** - Headers styled, alternating row colors
- **Timestamp Tracking** - Exact submission time recorded
- **Email Notifications** (optional) - Get alerts for new applications

---

## 🔧 Troubleshooting

### ❌ "Google Sheets integration is not configured"
**Fix:** Update `GOOGLE_SCRIPT_URL` in `js/script.js` with your Web App URL

### ❌ Form submits but no data in sheet
**Fix:** 
- Check sheet name is exactly "Applications"
- Verify sheet permissions are set to "Anyone with link can Edit"
- Check Apps Script execution logs: Extensions > Apps Script > Executions

### ❌ Resume upload fails
**Fix:**
- Ensure file is under 5MB
- Only PDF, DOC, DOCX formats allowed
- Check Google Drive storage quota

---

## 📧 Enable Email Notifications (Optional)

1. Open Apps Script: Extensions > Apps Script
2. Find line ~85: `var emailRecipient = 'hr@pegas.lk';`
3. Change to your email: `var emailRecipient = 'youremail@example.com';`
4. Find line ~108: `// MailApp.sendEmail(...)`
5. Remove `//` to uncomment
6. Save and redeploy

---

## 📋 Summary

✅ **Form Fields:** 20+ comprehensive fields  
✅ **Data Storage:** Google Sheets with 28 columns  
✅ **Resume Storage:** Google Drive with automatic linking  
✅ **Auto-formatting:** Professional table structure  
✅ **Email Alerts:** Optional HR notifications  
✅ **Security:** Data consent checkbox required  

---

## 📄 Full Documentation

For detailed setup instructions, see: `docs/GOOGLE_SHEETS_SETUP.md`

---

**Setup Time:** ~5 minutes  
**Last Updated:** January 15, 2026  
**Support:** Check browser console and Apps Script logs for errors
