$ErrorActionPreference = "Stop"

Set-Location (Join-Path $PSScriptRoot "..")

docker compose build site
if ($LASTEXITCODE -ne 0) {
    throw "Docker 镜像构建失败，退出码：$LASTEXITCODE"
}

docker compose run --rm --no-deps -e JEKYLL_ENV=production site bash -lc "bash scripts/build.sh && bundle exec htmlproofer _site --disable-external"
if ($LASTEXITCODE -ne 0) {
    throw "Jekyll 生产构建或链接检查失败，退出码：$LASTEXITCODE"
}
