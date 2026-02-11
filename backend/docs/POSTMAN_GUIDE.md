# Postman Testing Guide

I have created a **Postman Collection** file for you to easy import all the requests at once.

## 🚀 How to Import
1.  Open **Postman**.
2.  Click **Import** (top left).
3.  Drag and drop the file: `backend/docs/Hirotix_API.postman_collection.json`.
    *(Or perform a file search to find it in your project folder)*.
4.  You will see a collection named **"Hirotix Backend API"** appear on the left.

## 🧪 How to Test

### 1. Register Users
- Open **Auth > Register Recruiter**.
- Click **Send**.
- **Note the ID** in the response (e.g., `id: 1`).
- Open **Auth > Register Seeker**.
- Click **Send**.
- **Note the ID** in the response (e.g., `id: 2`).

### 2. Post a Job
- Open **Jobs > Post Job**.
- **Params Tab**: Ensure `recruiterId` matches the Recruiter's ID (e.g., `1`).
- Click **Send**.
- **Note the Job ID** (e.g., `1`).

### 3. Search Data
- Open **Jobs > Search Jobs**.
- Click **Send** to see results for "Java" in "Pune".
- You can change the Query Params (`query`, `location`) in the **Params** tab.

### 4. Upload Resume
- Open **Profiles > Upload Resume**.
- **Body Tab**:
    - Select **form-data**.
    - You will see a `file` key.
    - Hover over the **Value** field and select **File** from the dropdown.
    - Click **Select File** and choose a PDF from your computer.
- **URL**: Ensure the ID matches the Seeker's ID (e.g., `2`).
- Click **Send**.

### 5. Apply for Job
- Open **Applications > Apply for Job**.
- **URL**: Check the Job ID (e.g., `/jobs/1/apply`).
- **Params**: Check the `userId` (Seeker's ID).
- Click **Send**.

---
**Troubleshooting**:
- If you get `Access Denied` error for DB, fix your `application.properties` password.
- If endpoints fail, ensure the server is running (`.\mvnw spring-boot:run`).
