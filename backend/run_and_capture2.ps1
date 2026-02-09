# Stop any process listening on 8080
$connection = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($null -ne $connection) {
  try { Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Output "Stopped PID: $($connection.OwningProcess)" } catch { Write-Output "Failed stopping PID: $($_.Exception.Message)" }
}

$mvn = 'C:\Users\tonyf\apache-maven-3.9.4\bin\mvn.cmd'
$wd = Join-Path (Get-Location).Path 'backend'

if (-Not (Test-Path $mvn)) {
  Write-Output "mvn not found at $mvn"
  exit 1
}

Write-Output "Starting mvn from $mvn (working dir: $wd)"
$proc = Start-Process -FilePath $mvn -ArgumentList 'spring-boot:run' -WorkingDirectory $wd -PassThru -NoNewWindow
Start-Sleep -Seconds 8
Write-Output "Started mvn PID: $($proc.Id)"

# Run the test POST script located in backend
$testScript = Join-Path $wd 'send_test_request.ps1'
if (Test-Path $testScript) {
  & powershell -NoProfile -ExecutionPolicy Bypass -File $testScript
} else {
  Write-Output "Test script not found at $testScript"
}

Start-Sleep -Seconds 2

# Print log if available
$log1 = Join-Path $wd 'backend.log'
$log2 = Join-Path (Get-Location).Path 'backend.log'
if (Test-Path $log1) { Write-Output "--- tail $log1 ---"; Get-Content $log1 -Tail 400 } elseif (Test-Path $log2) { Write-Output "--- tail $log2 ---"; Get-Content $log2 -Tail 400 } else { Write-Output 'no log file found' }
