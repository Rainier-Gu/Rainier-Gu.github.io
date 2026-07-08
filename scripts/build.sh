#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

baseurl="$(ruby -ryaml -e 'print(YAML.load_file("_config.yml").fetch("baseurl", ""))')"
destination="_site${baseurl}"

rm -rf _site
bundle exec jekyll build --destination "$destination" --trace
