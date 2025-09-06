@echo off
REM Minimal installer for Windows - copies dist to %ProgramFiles%\Alpa-Language and creates shortcut
set TARGET_DIR=%ProgramFiles%\Alpa-Language
mkdir "%TARGET_DIR%"
xcopy /E /I "%~dp0\..\dist" "%TARGET_DIR%\dist"
echo Installed Alpa Language to %TARGET_DIR%
pause
