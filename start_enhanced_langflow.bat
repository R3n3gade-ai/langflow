@echo off
echo ===================================
echo Starting YOUR Enhanced Langflow
echo ===================================
echo.
echo Current directory: %CD%
echo.

cd /d "C:\Users\josh\geminilang\langflow\src\backend\base"
echo Changed to backend directory: %CD%
echo.

echo Setting Python path...
set PYTHONPATH=%CD%;%PYTHONPATH%
echo PYTHONPATH set to: %PYTHONPATH%
echo.

echo Starting enhanced Langflow server...
echo Your customizations and enhancements are preserved!
echo.
echo Server will be available at: http://127.0.0.1:7860
echo.

python -m langflow run --host 127.0.0.1 --port 7860 --log-level info

pause
