ARG BUILDKIT_SBOM_SCAN_CONTEXT=true
# ---- Deps ----
FROM groupclaes/npm AS depedencies
ARG BUILDKIT_SBOM_SCAN_STAGE=true

# change the working directory to new exclusive app folder
WORKDIR /usr/src/app

# copy package file
COPY package.json ./

# install node packages
RUN npm install --omit=dev

# ---- Build ----
FROM depedencies AS build
ARG BUILDKIT_SBOM_SCAN_STAGE=true

# copy required files for build
COPY ./src ./src
COPY package.json ./package.json
COPY .npmrc ./.npmrc
COPY index.ts ./index.ts

# install node packages
RUN npm install

# create esbuild package
RUN esbuild ./index.ts --bundle --platform=node --minify --packages=external --external:'./config' --outfile=index.min.js

# --- release ---
FROM groupclaes/node AS release

# change the working directory to new exclusive app folder
WORKDIR /usr/src/app

# copy dependencies and assets
COPY --chown=node:node --from=depedencies /usr/src/app ./

# copy project file
COPY --chown=node:node --from=build /usr/src/app/index.min.js ./

# command to run when intantiate an image
CMD ["node","index.min.js"]
