FROM node:lts-alpine as build-stage
WORKDIR /app
COPY [".", "./"]
RUN npm install -g npm@8.5.5
RUN npm install
RUN npm run build
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

