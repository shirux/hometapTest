FROM node:22-alpine

ARG PORT=5173
ENV PORT=${PORT}

WORKDIR /app
COPY package*.json ./

RUN npm ci
COPY . .
EXPOSE ${PORT}

CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port ${PORT}"]
