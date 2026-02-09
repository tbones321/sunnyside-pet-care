# Stop any process listening on 8080
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object {
    try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Output "Stopped PID: $($_.OwningProcess)" } catch { }
}

$mvn = "$env:USERPROFILE\apache-maven-3.9.4\bin\mvn.cmd"
# Start backend via Maven (detached)
$wd = (Get-Location).Path + '\\backend'
$start = Start-Process -FilePath $mvn -ArgumentList 'spring-boot:run' -WorkingDirectory $wd -NoNewWindow -PassThru
Start-Sleep -Seconds 6
Write-Output "Started mvn (PID: $($start.Id))"

# Run the test POST script
& powershell -NoProfile -ExecutionPolicy Bypass -File "send_test_request.ps1"

Start-Sleep -Seconds 2

# Output backend.log tail
if (Test-Path -Path 'backend.log') {
    Write-Output "--- backend.log (tail 400) ---"
    Get-Content 'backend.log' -Tail 400
} else {
    Write-Output 'backend.log not found'
}
