@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Project Dead Drop Operator AI

set "BRIDGE_CMD=G:\LLM\NPCAi\operator-server.cmd"
set "OLLAMA_START=G:\LLM\NPCAi\scripts\Start-Ollama.ps1"
set "OPERATOR_PORT=8787"
set "OPERATOR_URI=http://127.0.0.1:8787/operator"
set "OLLAMA_URI=http://127.0.0.1:11435/api/version"

if /i "%~1"=="--check" (
  call :log INFO "Launcher syntax check OK"
  exit /b 0
)

call :log INFO "Starting Operator AI launcher"
call :log DEBUG "Bridge command: %BRIDGE_CMD%"

if not exist "%BRIDGE_CMD%" (
  call :fail "Operator bridge not found at %BRIDGE_CMD%"
  goto :done
)

call :stop_bridge
if errorlevel 1 goto :done

call :check_ollama
if errorlevel 1 (
  call :start_ollama
  if errorlevel 1 goto :done
)

call :log INFO "Starting fresh Project Dead Drop live Operator bridge"
call :log INFO "Endpoint: %OPERATOR_URI%"
call :log INFO "Leave this window open while using the site. Bridge output follows."
echo.

call "%BRIDGE_CMD%"
set "BRIDGE_EXIT=%ERRORLEVEL%"
if not "%BRIDGE_EXIT%"=="0" (
  call :log ERROR "Operator bridge exited with code %BRIDGE_EXIT%"
)

:done
echo.
pause
exit /b %ERRORLEVEL%

:log
echo [%date% %time%] [%~1] %~2
exit /b 0

:fail
call :log ERROR %1
exit /b 1

:stop_bridge
call :log DEBUG "Scanning port %OPERATOR_PORT% for an existing Operator bridge listener"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$port = %OPERATOR_PORT%; $connections = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue); if (-not $connections.Count) { Write-Host 'No listener found on Operator port.'; exit 0 }; foreach ($connection in $connections) { $process = Get-CimInstance Win32_Process -Filter ('ProcessId = ' + $connection.OwningProcess) -ErrorAction SilentlyContinue; if (-not $process -or $process.CommandLine -notmatch 'operator-server\.mjs') { Write-Host ('Port ' + $port + ' is occupied by non-Operator process ' + $connection.OwningProcess + ': ' + $process.CommandLine); exit 2 }; Write-Host ('Stopping existing Operator bridge process ' + $process.ProcessId + ': ' + $process.CommandLine); Stop-Process -Id $process.ProcessId -Force }; for ($attempt = 1; $attempt -le 20; $attempt++) { $remaining = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue); if (-not $remaining.Count) { Write-Host ('Operator bridge stopped and port ' + $port + ' is clear.'); exit 0 }; Write-Host ('Waiting for port ' + $port + ' to clear... attempt ' + $attempt + '/20'); Start-Sleep -Milliseconds 250 }; Write-Host ('Operator bridge did not release port ' + $port + ' after being stopped.'); exit 1"
set "STOP_RESULT=%ERRORLEVEL%"
if "%STOP_RESULT%"=="0" exit /b 0
if "%STOP_RESULT%"=="2" (
  call :log ERROR "Not stopping non-Operator process on port %OPERATOR_PORT%"
  exit /b 1
)
call :log ERROR "Operator bridge did not stop cleanly"
exit /b 1

:check_ollama
call :log DEBUG "Checking Ollama at %OLLAMA_URI%"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { $version = Invoke-RestMethod -Uri '%OLLAMA_URI%' -TimeoutSec 2; Write-Host ('Ollama answered, version ' + $version.version); exit 0 } catch { exit 1 }"
if "%ERRORLEVEL%"=="0" (
  call :log INFO "Ollama is already running"
  exit /b 0
)

call :log DEBUG "Ollama did not answer"
exit /b 1

:start_ollama
if not exist "%OLLAMA_START%" (
  call :log ERROR "Ollama start script not found at %OLLAMA_START%"
  exit /b 1
)

call :log INFO "Starting Ollama for live Operator responses"
powershell.exe -ExecutionPolicy Bypass -File "%OLLAMA_START%"
call :check_ollama
if errorlevel 1 (
  call :log ERROR "Ollama did not respond after startup"
  exit /b 1
)

exit /b 0
