$ErrorActionPreference = "Stop"

$pythonInstallerUrl = "https://www.python.org/ftp/python/3.10.11/python-3.10.11-amd64.exe"
$pythonInstallerPath = "$env:TEMP\python-3.10.11-amd64.exe"
$pythonInstallDir = "$env:LocalAppData\Programs\Python\Python310"
$pythonExe = "$pythonInstallDir\python.exe"

if (-not (Test-Path $pythonExe)) {
    Write-Host "Downloading Python 3.10.11..."
    Invoke-WebRequest -Uri $pythonInstallerUrl -OutFile $pythonInstallerPath
    Write-Host "Installing Python 3.10.11 silently..."
    Start-Process -FilePath $pythonInstallerPath -ArgumentList "/quiet InstallAllUsers=0 PrependPath=0 Include_test=0" -Wait -NoNewWindow
    Write-Host "Python 3.10 installed at $pythonExe"
} else {
    Write-Host "Python 3.10 is already installed at $pythonExe"
}

if (-not (Test-Path ".\.venv310")) {
    Write-Host "Creating virtual environment..."
    & $pythonExe -m venv .\.venv310
}

$venvPython = ".\.venv310\Scripts\python.exe"
$venvPip = ".\.venv310\Scripts\pip.exe"

Write-Host "Upgrading pip..."
& $venvPython -m pip install --upgrade pip

Write-Host "Installing PyTorch 2.0.1..."
& $venvPip install torch==2.0.1 torchvision==0.15.2 torchaudio==2.0.2 --index-url https://download.pytorch.org/whl/cu118

Write-Host "Installing requirements..."
& $venvPip install -r requirements.txt

Write-Host "Installing OpenMIM and MMLab packages..."
& $venvPip install --no-cache-dir -U openmim
& $venvPython -m mim install mmengine
& $venvPython -m mim install "mmcv==2.0.1"
& $venvPython -m mim install "mmdet==3.1.0"
& $venvPython -m mim install "mmpose==1.1.0"

Write-Host "Running download_weights.bat..."
cmd.exe /c "download_weights.bat"

Write-Host "Done setting up MuseTalk."
