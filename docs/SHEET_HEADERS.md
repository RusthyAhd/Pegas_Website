# 📋 Google Sheets Headers - Copy & Paste Ready

## Quick Setup: Column Headers for "Applications" Sheet

### Option 1: Tab-Separated (Recommended)
**Copy this entire line and paste into Row 1, Column A of your Google Sheet:**

```
Timestamp	Job Title	Job Department	Job ID	First Name	Last Name	Email	Phone	Address	City	NIC Number	LinkedIn Profile	Portfolio/Website	Years of Experience	Education Level	Degree/Qualification	Key Skills	Current/Previous Company	Current/Previous Position	Cover Letter	Resume File Name	Resume URL	Availability	Expected Salary	Referral Source	Consent Status	Submission IP	User Agent
```

### Option 2: Individual Headers (Manual Entry)
If copy-paste doesn't work, type these headers in each column:

**Row 1:**
- **A1:** Timestamp
- **B1:** Job Title
- **C1:** Job Department
- **D1:** Job ID
- **E1:** First Name
- **F1:** Last Name
- **G1:** Email
- **H1:** Phone
- **I1:** Address
- **J1:** City
- **K1:** NIC Number
- **L1:** LinkedIn Profile
- **M1:** Portfolio/Website
- **N1:** Years of Experience
- **O1:** Education Level
- **P1:** Degree/Qualification
- **Q1:** Key Skills
- **R1:** Current/Previous Company
- **S1:** Current/Previous Position
- **T1:** Cover Letter
- **U1:** Resume File Name
- **V1:** Resume URL
- **W1:** Availability
- **X1:** Expected Salary
- **Y1:** Referral Source
- **Z1:** Consent Status
- **AA1:** Submission IP
- **AB1:** User Agent

### Option 3: Google Sheets Formula
Alternatively, paste this formula in cell A1:

```
={"Timestamp","Job Title","Job Department","Job ID","First Name","Last Name","Email","Phone","Address","City","NIC Number","LinkedIn Profile","Portfolio/Website","Years of Experience","Education Level","Degree/Qualification","Key Skills","Current/Previous Company","Current/Previous Position","Cover Letter","Resume File Name","Resume URL","Availability","Expected Salary","Referral Source","Consent Status","Submission IP","User Agent"}
```

Then press Enter. This will create all headers automatically across Row 1.

---

## ✨ Optional: Format Headers

After adding headers, make them look professional:

1. **Select Row 1** (click the "1" on the left)
2. **Bold:** Click the **B** button or press Ctrl+B (Cmd+B on Mac)
3. **Background Color:** Click paint bucket → Choose blue (#4285F4)
4. **Text Color:** Click text color → Choose white
5. **Freeze:** View → Freeze → 1 row

---

## 📊 Expected Result

Your sheet should look like this:

| Timestamp | Job Title | Job Department | Job ID | First Name | Last Name | Email | ... |
|-----------|-----------|----------------|--------|------------|-----------|-------|-----|
| *(Empty)* | *(Empty)* | *(Empty)* | *(Empty)* | *(Empty)* | *(Empty)* | *(Empty)* | ... |

**28 columns total, spanning from A to AB**

---

## ✅ Verification

**Check these:**
- [ ] 28 columns created (A through AB)
- [ ] All headers spelled correctly
- [ ] Row 1 contains headers
- [ ] Headers are bold (optional)
- [ ] Row is frozen (optional)
- [ ] No extra spaces in header names

---

## 🔗 Your Google Sheet

**Open here:** https://docs.google.com/spreadsheets/d/1VTnK3v1qg0Njcub5AJ8C0_BwsA_nOQT_y0arY7kRCiM/edit?usp=sharing

---

## 🚀 Next Steps

After adding headers:
1. ✅ Headers added → Proceed to Apps Script setup
2. Follow: `docs/QUICK_START_JOBS.md` (Step 3)

---

**Tip:** If tab-separated paste doesn't work, try copying from a text editor (Notepad, TextEdit) first, then paste into Google Sheets.
