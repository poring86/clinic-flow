# Dockerfile para frontend Next.js
FROM node:24-alpine
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps && npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
