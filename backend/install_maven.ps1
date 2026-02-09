$version = '3.9.4'
$zipUrl = "https://archive.apache.org/dist/maven/maven-3/$version/binaries/apache-maven-$version-bin.zip"
$out = "$env:USERPROFILE\apache-maven-$version-bin.zip"
Write-Output "Downloading $zipUrl to $out"
Invoke-WebRequest -Uri $zipUrl -OutFile $out
Expand-Archive -Path $out -DestinationPath $env:USERPROFILE -Force
Remove-Item $out
$mavenDir = "$env:USERPROFILE\apache-maven-$version"
[Environment]::SetEnvironmentVariable('MAVEN_HOME', $mavenDir, 'User')
$old = [Environment]::GetEnvironmentVariable('Path','User')
if(-not $old) { $old = [Environment]::GetEnvironmentVariable('Path','Machine') }
if(-not $old) { $old = '' }
if($old -notlike "*$mavenDir*") { [Environment]::SetEnvironmentVariable('Path', ($old + ';' + "$mavenDir\bin"), 'User') }
Write-Output "Installed to: $mavenDir"
& "$mavenDir\bin\mvn.cmd" -v
