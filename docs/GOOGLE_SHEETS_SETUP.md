# Google Sheets Job Application Integration Setup Guide

## Overview
This guide will help you set up automatic storage of job applications from your website to Google Sheets.

## Google Sheet URL
https://docs.google.com/spreadsheets/d/1VTnK3v1qg0Njcub5AJ8C0_BwsA_nOQT_y0arY7kRCiM/edit?usp=sharing

---

## Step 1: Prepare Your Google Sheet

1. **Open your Google Sheet** using the URL above
2. **Create a sheet named "Applications"** (or rename Sheet1 to Applications)
3. **Add the following headers in Row 1:**

| Column | Header |
|--------|---------|
| A | Timestamp |
| B | Job Title |
| C | Job Department |
| D | Job ID |
| E | First Name |
| F | Last Name |
| G | Email |
| H | Phone |
| I | Address |
| J | City |
| K | NIC Number |
| L | LinkedIn Profile |
| M | Portfolio/Website |
| N | Years of Experience |
| O | Education Level |
| P | Degree/Qualification |
| Q | Key Skills |
| R | Current/Previous Company |
| S | Current/Previous Position |
| T | Cover Letter |
| U | Resume File Name |
| V | Resume URL |
| W | Availability |
| X | Expected Salary |
| Y | Referral Source |
| Z | Consent Status |
| AA | Submission IP |
| AB | User Agent |

---

## Step 2: Create Google Apps Script

1. **Open the Google Sheet**
2. **Click on "Extensions" > "Apps Script"**
3. **Delete any existing code** in the Code.gs file
4. **Copy and paste the following script:**

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.openById('1VTnK3v1qg0Njcub5AJ8C0_BwsA_nOQT_y0arY7kRCiM').getSheetByName('Applications');
    
    // If Applications sheet doesn't exist, create it
    if (!sheet) {
      sheet = SpreadsheetApp.openById('1VTnK3v1qg0Njcub5AJ8C0_BwsA_nOQT_y0arY7kRCiM').insertSheet('Applications');
      
      // Add headers
      sheet.getRange(1, 1, 1, 28).setValues([[
        'Timestamp', 'Job Title', 'Job Department', 'Job ID', 'First Name', 'Last Name', 
        'Email', 'Phone', 'Address', 'City', 'NIC Number', 'LinkedIn Profile', 'Portfolio/Website', 
        'Years of Experience', 'Education Level', 'Degree/Qualification', 'Key Skills', 
        'Current/Previous Company', 'Current/Previous Position', 'Cover Letter', 
        'Resume File Name', 'Resume URL', 'Availability', 'Expected Salary', 
        'Referral Source', 'Consent Status', 'Submission IP', 'User Agent'
      ]]);
      
      // Format headers
      sheet.getRange(1, 1, 1, 28).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    
    // Parse the JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Handle resume file upload if present
    var resumeFileName = '';
    var resumeUrl = '';
    
    if (data.resumeData && data.resumeFileName) {
      try {
        // Create folder for resumes if it doesn't exist
        var folders = DriveApp.getFoldersByName('Job Applications - Pegas');
        var folder;
        
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder('Job Applications - Pegas');
          // Make folder accessible
          folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        }
        
        // Create unique filename with timestamp
        var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
        var uniqueFileName = timestamp + '_' + data.firstName + '_' + data.lastName + '_' + data.resumeFileName;
        
        // Decode base64 and create file
        var resumeBlob = Utilities.newBlob(Utilities.base64Decode(data.resumeData), data.resumeType, uniqueFileName);
        var file = folder.createFile(resumeBlob);
        
        // Set file sharing to view with link
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        resumeFileName = uniqueFileName;
        resumeUrl = file.getUrl();
      } catch (error) {
        Logger.log('Error uploading resume: ' + error);
        resumeFileName = data.resumeFileName + ' (Upload Failed)';
        resumeUrl = 'Error: ' + error.message;
      }
    }
    
    // Prepare row data with all fields
    var rowData = [
      new Date(), // Timestamp
      data.jobTitle || '',
      data.jobDepartment || '',
      data.jobId || '',
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.address || '',
      data.city || '',
      data.nic || '',
      data.linkedin || '',
      data.portfolio || '',
      data.experience || '',
      data.education || '',
      data.degree || '',
      data.skills || '',
      data.currentCompany || '',
      data.currentPosition || '',
      data.coverLetter || '',
      resumeFileName,
      resumeUrl,
      data.availability || '',
      data.salary || '',
      data.referral || '',
      data.consent ? 'Yes' : 'No',
      data.ip || '',
      data.userAgent || ''
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better visibility
    sheet.autoResizeColumns(1, 28);
    
    // Format the new row
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 28).setWrap(true);
    
    // Apply alternating row colors for better readability
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, 28).setBackground('#f3f3f3');
    }
    
    // Send email notification (optional)
    try {
      var emailRecipient = 'hr@pegas.lk'; // Change this to your HR email
      var emailSubject = 'New Job Application: ' + data.jobTitle;
      var emailBody = '=== NEW JOB APPLICATION RECEIVED ===\n\n' +
                      'Position: ' + data.jobTitle + '\n' +
                      'Department: ' + data.jobDepartment + '\n\n' +
                      '--- APPLICANT DETAILS ---\n' +
                      'Name: ' + data.firstName + ' ' + data.lastName + '\n' +
                      'Email: ' + data.email + '\n' +
                      'Phone: ' + data.phone + '\n' +
                      'City: ' + data.city + '\n' +
                      'NIC: ' + data.nic + '\n\n' +
                      '--- PROFESSIONAL BACKGROUND ---\n' +
                      'Experience: ' + data.experience + '\n' +
                      'Education: ' + data.education + '\n' +
                      'Degree: ' + data.degree + '\n' +
                      'Skills: ' + data.skills + '\n' +
                      'Current Company: ' + data.currentCompany + '\n' +
                      'Current Position: ' + data.currentPosition + '\n\n' +
                      '--- APPLICATION INFO ---\n' +
                      'Availability: ' + data.availability + '\n' +
                      'Expected Salary: LKR ' + data.salary + '/month\n' +
                      'Referral Source: ' + data.referral + '\n\n' +
                      'Resume: ' + resumeUrl + '\n\n' +
                      'View all applications:\n' +
                      'https://docs.google.com/spreadsheets/d/1VTnK3v1qg0Njcub5AJ8C0_BwsA_nOQT_y0arY7kRCiM/edit';
      
      // Uncomment the line below to enable email notifications
      // MailApp.sendEmail(emailRecipient, emailSubject, emailBody);
    } catch (emailError) {
      Logger.log('Error sending email: ' + emailError);
    }
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Application submitted successfully',
        'rowNumber': sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      'status': 'ok',
      'message': 'Job Application API is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

5. **Save the script** (Click the floppy disk icon or Ctrl+S / Cmd+S)
6. **Name your project** (e.g., "Pegas Job Application Handler")

---

## Step 3: Deploy the Script as a Web App

1. **Click on "Deploy" > "New deployment"**
2. **Click the gear icon** next to "Select type" and choose **"Web app"**
3. **Configure the deployment:**
   - **Description:** "Job Application Form Handler"
   - **Execute as:** "Me (your email)"
   - **Who has access:** "Anyone"
4. **Click "Deploy"**
5. **Authorize the script:**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" > "Go to [Project Name] (unsafe)"
   - Click "Allow"
6. **Copy the Web App URL** - It will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
   **IMPORTANT: Save this URL! You'll need it in Step 4.**

---

## Step 4: Update Your Website

1. **Open the file:** `js/script.js`
2. **Find the line** that says:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. **Replace** `YOUR_GOOGLE_SCRIPT_URL_HERE` with the Web App URL you copied in Step 3
4. **Save the file**

---

## Step 5: Test the Integration

1. **Open your website** (index.html)
2. **Click on the "Jobs" button** in navigation
3. **Click "Apply Now"** on any job
4. **Fill out the application form** with test data
5. **Submit the form**
6. **Check your Google Sheet** - A new row should appear with the application data

---

## Step 6: Set Up Permissions (Important!)

### Google Sheet Permissions
1. **Open your Google Sheet**
2. **Click "Share"** button (top right)
3. **Under "General access"** select **"Anyone with the link"** can **"Edit"**
   - This allows the script to write data
4. **Click "Done"**

### Google Drive Folder Permissions
The script will automatically create a folder named **"Job Applications - Pegas"** in your Google Drive to store resume files. This folder will be set to viewable by anyone with the link.

---

## Features Included

✅ **Automatic Data Storage** - All form data saved to Google Sheets  
✅ **Resume File Upload** - Resumes stored in Google Drive with links in sheet  
✅ **Timestamp Tracking** - Each submission timestamped automatically  
✅ **IP & User Agent Logging** - Track submission source  
✅ **Email Notifications** - Optional HR email alerts (currently disabled)  
✅ **Structured Data Table** - Clean, organized spreadsheet format  
✅ **Auto-formatting** - Headers styled, columns auto-resized  

---

## Optional: Enable Email Notifications

To receive email notifications when someone applies:

1. **Open the Apps Script** (Extensions > Apps Script)
2. **Find this line** (around line 85):
   ```javascript
   var emailRecipient = 'hr@pegas.lk'; // Change this to your HR email
   ```
3. **Change** `hr@pegas.lk` to your actual email address
4. **Find this line** (around line 93):
   ```javascript
   // MailApp.sendEmail(emailRecipient, emailSubject, emailBody);
   ```
5. **Remove the //** to uncomment it:
   ```javascript
   MailApp.sendEmail(emailRecipient, emailSubject, emailBody);
   ```
6. **Save and redeploy** the script

---

## Troubleshooting

### Problem: Form submission fails
**Solution:** 
- Check that the Google Script URL is correctly set in `js/script.js`
- Verify the script is deployed as "Anyone" can access
- Check browser console for error messages

### Problem: Data not appearing in sheet
**Solution:**
- Ensure sheet is named "Applications"
- Check sheet permissions (Anyone with link can Edit)
- View Apps Script logs: Extensions > Apps Script > Executions

### Problem: Resume upload fails
**Solution:**
- Check file size is under 5MB
- Ensure file is PDF, DOC, or DOCX format
- Google Drive quota may be full

### Problem: "Authorization required" error
**Solution:**
- Redeploy the script
- Make sure you authorized with the correct Google account
- Try opening the script URL in a browser and authorize again

---

## Security Recommendations

1. **Review submissions regularly** and delete test data
2. **Backup your Google Sheet** periodically
3. **Monitor Google Drive storage** for resume files
4. **Consider adding CAPTCHA** to prevent spam submissions
5. **Regularly review Apps Script execution logs** for unusual activity

---

## Support

For issues or questions:
- Check the browser console for JavaScript errors
- View Apps Script execution logs for backend errors
- Test with different browsers
- Verify all URLs and IDs are correct

---

## Summary Checklist

- [ ] Google Sheet created with "Applications" sheet
- [ ] Headers added to row 1
- [ ] Apps Script code copied and saved
- [ ] Script deployed as Web App
- [ ] Web App URL copied
- [ ] `js/script.js` updated with Web App URL
- [ ] Sheet permissions set to "Anyone with link can Edit"
- [ ] Test submission completed successfully
- [ ] Data appears in Google Sheet
- [ ] Resume uploaded to Google Drive

---

**Last Updated:** January 15, 2026  
**Version:** 1.0
