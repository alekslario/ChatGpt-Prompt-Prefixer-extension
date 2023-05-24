# FROM ubuntu:20.04
FROM node:19-alpine3.15

# RUN apt-get update

RUN apk update

# ENV NODE_VERSION=14.16.1
# RUN apt install -y curl
# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# ENV NVM_DIR=/root/.nvm
# RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
# RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
# RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
# ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# ENV NVM_DIR /usr/local/nvm
# RUN mkdir -p /usr/local/nvm/ && \
#           curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash 
# RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install 14.16.1"
# ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
# ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH```

# RUN groupadd -r node && useradd --no-log-init -r -g node node

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json ./

#RUN npm ci
RUN npm i

COPY --chown=node:node . .

#EXPOSE 8080

USER node

#forcing it to run
ENTRYPOINT ["tail", "-f", "/dev/null"]
