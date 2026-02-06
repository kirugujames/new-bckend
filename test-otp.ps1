$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    email = "periskirugu1194@gmail.com"
} | ConvertTo-Json

try {
    Write-Host "Testing resend-otp endpoint..."
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/users/resend-otp" -Method POST -Headers $headers -Body $body
    Write-Host "Success:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message
    } else {
        # Try to read stream if available
        $stream = $_.Exception.Response.GetResponseStream()
        if ($stream) {
            $reader = New-Object System.IO.StreamReader($stream)
            Write-Host $reader.ReadToEnd()
        }
    }
}
