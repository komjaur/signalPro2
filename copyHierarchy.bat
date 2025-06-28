@echo off
(
echo --- FOLDER STRUCTURE ---
tree . /F /A
echo.
echo --- DART/FLUTTER SOURCE CONTENT ---
for /R %%i in (*.js *.yaml) do (
echo ------------------------------
echo File: %%~fi
echo ------------------------------
type "%%i"
echo.
)
) | clip
echo Folder structure and Flutter source code copied to clipboard
pause
