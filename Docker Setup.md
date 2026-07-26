# 🚀 Hirotix Run Guide (Windows User)

This guide will help you run the **Hirotix** application on your Windows machine in under 5 minutes using Docker. You do NOT need to install Java, Python, or MySQL.

---

## 🛠️ Step 1: Install Docker on Windows

Since you do not have Docker installed, follow these steps to set it up:

1. **Enable WSL (Windows Subsystem for Linux):**
   - Click the Windows Start menu, type **PowerShell**, right-click it, and select **Run as Administrator**.
   - Type the following command and press Enter:
     ```powershell
     wsl --install
     ```
   - *If it asks you to restart your computer, please restart it before proceeding.*

2. **Download Docker Desktop:**
   - Download the installer from the official website:
     👉 [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

3. **Install Docker:**
   - Double-click the downloaded installer (`Docker Desktop Installer.exe`).
   - Make sure the option **"Use WSL 2 instead of Hyper-V (recommended)"** is **checked** during installation.
   - Click **Ok** and wait for the installation to finish.
   - Click **Close and restart** to reboot your computer.

4. **Start Docker:**
   - After your PC restarts, open the **Docker Desktop** app from your desktop or start menu.
   - Accept the service agreement.
   - Wait for 1-2 minutes until the bottom-left corner icon turns **green** (showing "Engine Running").

---

## 📂 Step 2: Setup Project Folders & Files

You only need **2 files** to run the project. Set them up like this:

1. Create a new empty folder on your PC (for example, name it `Hirotix`).
2. Inside the `Hirotix` folder, create a new subfolder named **`database`**.
3. Place your files in the folders exactly like this:
   - Place `docker-compose-share.yml` in the main `Hirotix` folder and rename it to **`docker-compose.yml`**.
   - Place `hirotix_db.sql` inside the **`database`** folder.

**Your folder structure must look exactly like this:**
```text
Hirotix/
├── docker-compose.yml
└── database/
    └── hirotix_db.sql
```

---

## 🚀 Step 3: Run the Application

1. Open **Command Prompt (CMD)** or **PowerShell**.
2. Go to your folder using the `cd` command. For example:
   ```cmd
   cd "C:\Users\YourUsername\Documents\Hirotix"
   ```
3. Run the following command to start everything:
   ```cmd
   docker compose up -d
   ```
4. **Wait 1-2 minutes.** Docker will automatically download the pre-built backend, frontend, database, and AI images from the internet and run them.

---

## 🌐 Step 4: Access the Website

Once the terminal command finishes, open your Web Browser (Chrome, Edge, etc.) and go to:
👉 **`http://localhost:3000`**

### 🔑 Login Credentials:
Log in with the default Administrator account:
- **Email:** `admin@hirotix.com`
- **Password:** `admin123`

---

## 🛑 How to Stop the Application?
When you want to stop the application and free up your computer's memory (RAM), open CMD in the same folder and run:
```cmd
docker compose down
```
