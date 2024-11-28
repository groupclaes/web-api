#!/bin/bash
docker_tag="latest"
docker_company="groupclaes"
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
PACKAGE_NAME=$(cat package.json \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "building docker images ${docker_company}/${PACKAGE_NAME}:${docker_tag} and ${docker_company}/${PACKAGE_NAME}:${PACKAGE_VERSION}"

docker buildx build --platform=linux/amd64 -t "${docker_company}/${PACKAGE_NAME}:${docker_tag}" -t "${docker_company}/${PACKAGE_NAME}:${PACKAGE_VERSION}" -f Dockerfile --push . #--sbom=true --provenance=true --push .