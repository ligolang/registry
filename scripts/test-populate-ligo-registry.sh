#! /bin/sh

URL="https://ligo-registry.gcp-npr.marigold.dev"
URL="http://0.0.0.0:4000/-/api"
PACKAGES=("ligo-foo" "ligo-list-helpers" "ligo-set-helpers")

npm login --registry $URL

for P in "${PACKAGES[@]}"
do
  curl -O $(npm info $P --json | jq -r .dist.tarball)
  npm publish --registry $URL ./$P*.tgz
done
