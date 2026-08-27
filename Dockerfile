FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm install

COPY . .

RUN npm --prefix shared run build
RUN npm --prefix backend run build
RUN npm --prefix frontend run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app ./

EXPOSE 5000 3000

CMD ["npm", "start"]
