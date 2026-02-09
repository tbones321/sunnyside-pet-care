Set-StrictMode -Version Latest

$backendDir = 'C:\Users\tonyf\Documents\test\sunnyside-pet-care\backend'
Set-Location $backendDir

# Kill any process listening on 8080
$lines = netstat -ano | Select-String ':8080' -SimpleMatch
if ($lines) {
    foreach ($l in $lines) {
        $cols = ($l -replace '\\s+', ' ').Trim() -split ' '
        $kpid = $cols[-1]
        Write-Output "Killing PID $kpid"
        taskkill /PID $kpid /F | Out-Null
    }
} else {
    Write-Output 'No process listening on 8080'
}

# Start backend via Maven (background)
$mvncmd = 'C:\Users\tonyf\apache-maven-3.9.4\bin\mvn.cmd'
$proc = Start-Process -FilePath $mvncmd -ArgumentList 'spring-boot:run' -WorkingDirectory $backendDir -PassThru
Write-Output "Started mvn PID $($proc.Id)"

# Wait up to 60s for the app to respond on health endpoint
$timeout = 60
$start = Get-Date
do {
    try {
        $r = Invoke-RestMethod -Uri 'http://localhost:8080/api/health' -TimeoutSec 2 -ErrorAction Stop
        if ($r -and ($r.status -eq 'UP' -or $r -eq 'OK')) { Write-Output 'App is up'; break }
    } catch {
        try {
            $r = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/health' -TimeoutSec 2 -ErrorAction Stop
            if ($r.status -eq 'UP') { Write-Output 'App is up (actuator)'; break }
        } catch {}
    }
    Start-Sleep -Seconds 1
} while ((Get-Date) - $start).TotalSeconds -lt $timeout

Start-Sleep -Seconds 2
Write-Output 'Sending test request...'
& '.\send_test_request.ps1'
Start-Sleep -Seconds 2

if (Test-Path '.\backend.log') {
    Get-Content '.\backend.log' -Tail 400
} elseif (Test-Path 'backend.log') {
    Get-Content 'backend.log' -Tail 400
} else {
    Get-Process -Id $proc.Id -ErrorAction SilentlyContinue | Format-List
    Write-Output 'No backend.log found'
}