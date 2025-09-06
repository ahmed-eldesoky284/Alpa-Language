@echo off
REM Alpa Installer (Windows) - helper batch
SETLOCAL ENABLEDELAYEDEXPANSION
SET ROOT=%~dp0\..
SET LOCAL_VSIX=%ROOT%\vscode-alpa\vscode-alpa-0.0.3.vsix
SET DOWNLOAD_VSIX=%TEMP%\vscode-alpa-0.0.3.vsix

REM Configure GitHub links (adjust if you publish a different release name)
SET GITHUB_USER=ahmed-eldesoky284
SET GITHUB_REPO=Alpa-Language
SET RELEASE_URL=https://github.com/ahmed-eldesoky284/Alpa-Language/releases/latest/download/vscode-alpa-0.0.3.vsix

ECHO Alpa Installer (Windows)

REM Function: try install a VSIX file using 'code' CLI
:try_install
  where code >nul 2>&1
  IF %ERRORLEVEL%==0 (
    ECHO Installing VSIX using 'code --install-extension' "%1"
    code --install-extension "%1"
    IF %ERRORLEVEL%==0 (
      ECHO Installation completed.
      EXIT /B 0
    ) ELSE (
      ECHO Failed to install VSIX via 'code'. Please open VS Code and install the VSIX manually.
      EXIT /B 2
    )
  ) ELSE (
    ECHO The 'code' command is not available in PATH.
    ECHO You can add it from VS Code (Command Palette -> 'Shell Command: Install 'code' command in PATH')
    EXIT /B 3
  )

REM 1) Use local VSIX if present
IF EXIST "%LOCAL_VSIX%" (
  CALL :try_install "%LOCAL_VSIX%"
  GOTO :EOF
)

REM 2) Try to download VSIX from latest release
ECHO Local VSIX not found. Attempting to download VSIX from releases: %RELEASE_URL%
powershell -Command "try { Invoke-WebRequest -Uri '%RELEASE_URL%' -OutFile '%DOWNLOAD_VSIX%' -UseBasicParsing -ErrorAction Stop } catch { exit 1 }"
IF %ERRORLEVEL%==0 (
  ECHO Downloaded VSIX to %DOWNLOAD_VSIX%
  CALL :try_install "%DOWNLOAD_VSIX%"
  GOTO :EOF
) ELSE (
  ECHO Failed to download VSIX from releases.
)

REM 3) Final fallback: instruct user how to install manually
ECHO.
ECHO Could not find or download the VSIX automatically.
ECHO Please either:
ECHO  - Download the VSIX manually from:
ECHO    %RELEASE_URL%
ECHO  - Or build it locally from the 'vscode-alpa' folder using vsce and then run this script:
ECHO    cd "%%~dp0\..\vscode-alpa"
ECHO    npm install -g vsce
ECHO    npm run package
ECHO  - Once you have the VSIX, install it using the 'code' CLI:
ECHO    code --install-extension path\to\vscode-alpa-0.0.3.vsix

ENDLOCAL

EXIT /B 1
