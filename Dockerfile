FROM node:17-alpine3.14

ENV CRA_BUILD_DIR=/app/client/build
ENV DEBUG=app
RUN apk --update add ca-certificates bash
WORKDIR /app
COPY . .
RUN yarn
WORKDIR client
RUN yarn build
RUN yarn react-scripts tsc
RUN npm pack
WORKDIR ../server
ENV NODE_ENV=production
RUN yarn build
ENTRYPOINT ["node", "server.bundle.js"]

