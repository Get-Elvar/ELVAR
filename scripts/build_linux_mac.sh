#!/bin/bash
echo "Installing requirements..."
python3 -m pip install customtkinter pillow pystray keyboard pyinstaller pyperclip requests cryptography google-api-python-client google-auth-oauthlib

echo "Checking for application icon..."
if [ ! -f "elvar_icon.ico" ]; then
    echo "Creating default application icon..."
    python3 -c "from PIL import Image, ImageDraw; img = Image.new('RGBA', (256, 256), color=(0, 0, 0, 0)); d = ImageDraw.Draw(img); d.ellipse((10, 10, 246, 246), fill=(0, 122, 255)); d.polygon([(100, 60), (180, 128), (100, 196)], fill=(255, 255, 255)); img.save('elvar_icon.ico', format='ICO', sizes=[(256, 256)])"
else
    echo "Using existing elvar_icon.ico"
fi

echo "Building executable..."
python3 -m PyInstaller --noconfirm --onedir --windowed --icon=elvar_icon.ico --add-data "elvar_icon.ico:." --distpath . --collect-all customtkinter --name "Elvar" "../src/main.py"
echo "Build complete! The 'Elvar' folder has been created in this directory."
