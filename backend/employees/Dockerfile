#
# ---- Dependencies ----
FROM docker-registry.groupclaes.be/node-npm AS dependencies

# copy project file
COPY package.json .

# install node packages
RUN npm install --only=production

# copy production node_modules aside
RUN cp -R node_modules prod_node_modules

#
# from base image node
FROM docker-registry.groupclaes.be/node-base AS release

# set current user to node
USER node

# change the working directory to new exclusive app folder
WORKDIR /usr/src/app

# copy production node_modules
COPY --chown=node:node --from=dependencies /root/npm/prod_node_modules ./node_modules

# copy other source files as well
COPY --chown=node:node ./src .

# command to run when intantiate an image
CMD ["node", "index.js"]