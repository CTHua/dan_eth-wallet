# 構建階段
FROM node:22-alpine AS builder

# 安裝 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 pnpm-lock.yaml
COPY package.json ./

# 安裝依賴
RUN pnpm install

# 複製源代碼
COPY . .

# 構建應用
RUN pnpm build && mkdir -p dist

# 運行階段
FROM node:22-alpine

# 安裝 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 設置工作目錄
WORKDIR /app

# 從構建階段複製必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# 暴露端口
EXPOSE 3000

# 啟動應用
CMD ["node", "dist/index.js"]
