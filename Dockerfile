FROM node:17-alpine3.14

RUN apk --update add ca-certificates bash
WORKDIR /app
COPY . .
RUN yarn
WORKDIR client
RUN yarn build
RUN yarn react-scripts tsc
RUN npm pack
WORKDIR ../server
RUN yarn build
ENV CRA_BUILD_DIR=/app/client/build
ENTRYPOINT ["node", "server.bundle.js"]

