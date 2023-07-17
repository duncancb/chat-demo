FROM node:20.4-alpine3.17
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --omit=dev
COPY ["./bin", "./bin"]
COPY ["./src", "./src"]
CMD ["npm", "run", "start"]
