FROM node:22

ENV PROJECT_ROOT=/app
WORKDIR $PROJECT_ROOT

COPY package.json yarn.lock .yarnrc.yml $PROJECT_ROOT/
RUN corepack enable && yarn install --immutable

COPY . $PROJECT_ROOT/

RUN yarn build

CMD ["node", "build/index.js"]
