$ErrorActionPreference = "Stop"

Set-Location (Join-Path $PSScriptRoot "..")

docker compose up --build
if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose 启动失败，退出码：$LASTEXITCODE"
}
