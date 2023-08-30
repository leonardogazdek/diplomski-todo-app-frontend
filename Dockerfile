FROM node:16-alpine AS build
ARG base_url=http://localhost:8888/todo-api
ENV NEXT_PUBLIC_BASE_URL=$base_url
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i --production
COPY --from=build /build/.next /app/.next
COPY --from=build /build/public /app/public
ENTRYPOINT ["npm", "run", "start"]
