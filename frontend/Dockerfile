FROM node:22-slim AS base
ENV APP_PATH=/app

# 安裝必要的系統依賴
RUN apt-get update && apt-get install -y \
    python3 \
    && rm -rf /var/lib/apt/lists/*

COPY . $APP_PATH

WORKDIR $APP_PATH

RUN rm -rf node_modules

# 安裝 pnpm
RUN npm install -g pnpm@9.15.5

# 安裝 dependencies
RUN pnpm install

# 設定 Tailwind CSS 環境
ENV TAILWIND_MODE=build

RUN pnpm build

# 設定環境變數
ENV PORT=3000

CMD [ "pnpm", "start"]

EXPOSE 3000