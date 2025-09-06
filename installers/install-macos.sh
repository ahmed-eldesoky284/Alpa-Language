#!/usr/bin/env bash
# Minimal installer for macOS - example: copies built dist to /Applications/Alpa-Language (demo)
set -e
TARGET_DIR="/Applications/Alpa-Language"
mkdir -p "$TARGET_DIR"
cp -R "$(pwd)/dist" "$TARGET_DIR/"
echo "Installed Alpa Language app files to $TARGET_DIR"
