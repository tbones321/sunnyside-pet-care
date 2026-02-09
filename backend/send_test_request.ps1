$body = @{
  service = 'Sitting'
  ownerName = 'Automated SMTP Test'
  address = '1 Test Way'
  email = 'notify-test@example.com'
  phone = '0000000000'
  fromDate = '2026-01-29'
  toDate = '2026-01-30'
  pets = @(@{ name = 'Probe'; species = 'Cat'; breed = 'N/A'; age = '0' })
} | ConvertTo-Json -Depth 5

try {
  $r = Invoke-RestMethod -Uri 'http://localhost:8080/api/requests' -Method Post -Body $body -ContentType 'application/json' -TimeoutSec 20
  Write-Output 'OK_RESPONSE:'
  Write-Output $r
} catch {
  Write-Output 'ERROR_MESSAGE:'
  Write-Output $_.Exception.Message
}
