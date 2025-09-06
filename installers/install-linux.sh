#!/usr/bin/env bash
# Minimal installer for Linux - example: copies dist to /opt/alpa-language and creates desktop entry
set -e
TARGET_DIR="/opt/alpa-language"
sudo mkdir -p "$TARGET_DIR"
sudo cp -R "$(pwd)/dist" "$TARGET_DIR/"
# create desktop entry for GNOME/KDE
cat <<EOF | sudo tee /usr/share/applications/alpa-language.desktop
[Desktop Entry]
Name=Alpa Language
Exec=xdg-open "$TARGET_DIR/index.html"
Type=Application
Terminal=false
Categories=Development;Education;
EOF

echo "Installed to $TARGET_DIR and created desktop entry"
