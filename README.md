# 🚀 Elvar - The Ultimate Workflow Automation Tool

Welcome to **Elvar**, a blazing-fast, locally-running desktop application designed to supercharge your productivity. Elvar acts as an intelligent bridge between your browser and your local machine, allowing you to save open tabs, launch complex workflows, and manage your digital workspace with unprecedented efficiency.

If you find yourself opening the same 15 tabs every morning, or losing track of important research sessions, Elvar is the solution you've been waiting for.

---

## 📥 Download & Install (For Users)

You don't need to be a programmer to use Elvar! 

1. **Download the App:** Go to the [Releases](../../releases) page and download the latest **Elvar Setup ZIP / EXE** file.
2. **Install:** Extract the ZIP and run the installer.
3. **Get the Extension:** Once Elvar is running, open the app, go to **Settings**, and follow the built-in instructions to install the companion Browser Extension.

---

## ✨ Key Features

Elvar isn't just a bookmark manager; it's a complete workspace orchestrator.

*   **🧠 Smart Workflows:** Save your current browser tabs as a "Session" or "Workflow" and launch them all with a single click.
*   **🌐 Browser Extension Integration:** Send tabs directly from your Chrome, Edge, or Brave browser straight to the Elvar desktop app.
*   **⚡ Advanced Execution Engine:** 
    *   Launch workflows in **Incognito/Private Mode**.
    *   Force workflows to open in a **New Window**.
    *   Target specific browsers (Chrome, Edge, Firefox, Brave).
*   **⏱️ Batch Processing & Delays:** Prevent your browser from crashing by opening tabs in batches (e.g., 5 tabs every 2 seconds).
*   **🔒 Protected Workflows:** Secure sensitive or private workflows with a custom passcode.
*   **🏷️ Tagging System:** Organize hundreds of workflows with custom, color-coded tags.
*   **📊 Analytics Dashboard:** Track your usage, see your most launched workflows, and calculate exactly how much time Elvar has saved you.
*   **🗜️ Mini Widget Mode:** Collapse Elvar into a sleek, always-on-top mini widget for instant access while you work.
*   **💾 Local & Secure:** Everything runs locally on your machine. No cloud accounts, no subscriptions, no tracking. Export and import encrypted backups anytime.

---

## 💻 Developer Documentation (For Devs)

Want to contribute, modify, or build Elvar from source? You're in the right place.

### Repository Structure
```text
elvar/
├── src/                  # Main Python source code
│   ├── __init__.py       # Marks this as a Python package
│   └── main.py           # Application entry point (Monolithic Core)
├── extension/            # Chrome/Edge Browser Extension source
├── scripts/              # Build and Installer scripts
│   ├── build_windows.bat
│   ├── build_linux_mac.sh
│   └── elvar_installer.iss
├── requirements.txt      # Python dependencies
├── .gitignore            # Git ignore rules
├── LICENSE               # Custom License
└── README.md             # This file
```

### Prerequisites
- Python 3.8 or higher
- Windows, macOS, or Linux

### Running from Source
1. Clone or download this repository.
2. Create a virtual environment (highly recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the application:
   ```bash
   python src/main.py
   ```

### Building the Executable
You can build a standalone executable using PyInstaller.

**Windows:**
Navigate to the `scripts` folder and run `build_windows.bat`

**Linux / macOS:**
Navigate to the `scripts` folder and run `bash build_linux_mac.sh`

### Creating an Installer (Windows)
To create a professional Windows installer (`.exe`), use the provided `elvar_installer.iss` script inside the `scripts` folder with [Inno Setup](https://jrsoftware.org/isinfo.php).

---

## 📄 License & Usage Restrictions

**Elvar Custom License**

This software is free for personal use. However, **you may not sell, resell, or use this software for any commercial, corporate, or office purposes without explicit written permission.**

For commercial licensing inquiries, please contact: **get.elvar@gmail.com**

See the `LICENSE` file for full details.
