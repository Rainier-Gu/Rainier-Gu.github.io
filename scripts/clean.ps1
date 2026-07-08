$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$targets = @("_site", ".jekyll-cache", ".jekyll-metadata")

foreach ($relativePath in $targets) {
    $target = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $relativePath))
    $expectedPrefix = $repoRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar

    if (-not $target.StartsWith($expectedPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "拒绝清理仓库外路径：$target"
    }

    if (Test-Path -LiteralPath $target) {
        Remove-Item -LiteralPath $target -Recurse -Force
        Write-Host "已清理 $relativePath"
    }
}
