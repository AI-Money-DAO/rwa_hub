#!/bin/bash

# RWA Hub 静态部署脚本 - 使用本地构建的文件直接部署
# 使用方法: ./deploy-static.sh

set -e

# ==================== 配置区域 ====================
# 只需要修改下面的 API_BASE_URL，其他配置都是固定的

# 后端 API 配置（唯一需要修改的地方）
API_BASE_URL="http://www.ce182.com"

# ==================== 常用配置示例 ====================
# 本地开发: API_BASE_URL="http://127.0.0.1:2025"
# 测试环境: API_BASE_URL="https://test-api.example.com"
# 生产环境: API_BASE_URL="https://api.example.com"
# 内网环境: API_BASE_URL="http://192.168.1.100:8080"
# 注意：不要在末尾加 /api，因为前端代码中已经包含了 /api/ 路径

# ==================== 脚本开始 ====================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

print_success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

print_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

print_info "📦 准备 RWA Hub 静态部署文件"

# 检查当前目录
if [ ! -f "../package.json" ]; then
    print_error "错误: 请在 deployment 目录中运行此脚本"
    exit 1
fi

# 进入项目根目录
cd ..

# 检查必要的依赖
if ! command -v node &> /dev/null; then
    print_error "Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm 未安装，将使用 npm"
    PACKAGE_MANAGER="npm"
else
    PACKAGE_MANAGER="pnpm"
fi

# 设置环境变量
export NEXT_PUBLIC_APP_NAME="RWA Hub"
export NEXT_PUBLIC_API_BASE_URL="${API_BASE_URL}"
export NEXT_PUBLIC_ENABLE_MOCK_API="false"

print_info "🔨 本地构建 RWA Hub 项目..."
print_info "📋 使用包管理器: ${PACKAGE_MANAGER}"
print_info "🌐 API 地址: ${API_BASE_URL}"

# 安装依赖并构建
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm install
    pnpm build --no-lint
else
    npm install
    npm run build -- --no-lint
fi

# 检查构建结果
if [ ! -d ".next" ]; then
    print_error "构建失败: .next 目录不存在"
    exit 1
fi

print_success "✅ RWA Hub 构建完成！"

# 回到 deployment 目录
cd deployment

# 创建部署包
print_info "📦 创建部署包..."
rm -rf deploy-package
mkdir -p deploy-package

# 复制必要文件到部署包
print_info "📋 复制文件..."
cp -r ../.next deploy-package/
cp -r ../public deploy-package/
cp ../package.json deploy-package/

# 复制锁文件
if [ -f "../package-lock.json" ]; then
    cp ../package-lock.json deploy-package/
fi

if [ -f "../pnpm-lock.yaml" ]; then
    cp ../pnpm-lock.yaml deploy-package/
fi

# 优化部署包大小
print_info "🗜️ 优化部署包大小..."
# 删除缓存目录
rm -rf deploy-package/.next/cache
# 删除 standalone 目录（如果存在）
rm -rf deploy-package/.next/standalone 2>/dev/null || true
# 删除构建追踪文件
rm -f deploy-package/.next/trace 2>/dev/null || true

# 创建启动脚本
print_info "📝 创建启动脚本..."
cat > deploy-package/start.sh << EOF
#!/bin/bash

# RWA Hub 服务器启动脚本

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
    echo -e "\${BLUE}[INFO] \$1\${NC}"
}

print_success() {
    echo -e "\${GREEN}[SUCCESS] \$1\${NC}"
}

print_error() {
    echo -e "\${RED}[ERROR] \$1\${NC}"
}

print_info "🚀 启动 RWA Hub 前端服务"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    print_error "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

# 检查包管理器
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
else
    PACKAGE_MANAGER="npm"
fi

print_info "📋 使用包管理器: \${PACKAGE_MANAGER}"

# 安装生产依赖
print_info "📦 安装生产依赖..."
if [ "\$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm install --prod
else
    npm install --only=production
fi

# 设置环境变量
export NODE_ENV=production
export NEXT_PUBLIC_APP_NAME="RWA Hub"
export NEXT_PUBLIC_API_BASE_URL="${API_BASE_URL}"
export NEXT_PUBLIC_ENABLE_MOCK_API="false"
export PORT=3000

print_success "✅ RWA Hub 准备完成！"
print_info "🌐 启动服务器..."
print_info "📋 访问地址: http://localhost:3000"
print_info "🛑 按 Ctrl+C 停止服务"

# 启动 Next.js 生产服务器
if [ "\$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm start
else
    npm start
fi
EOF

chmod +x deploy-package/start.sh

# 创建 PM2 配置文件
print_info "📝 创建 PM2 配置..."
cat > deploy-package/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'rwa-hub-frontend',
    script: 'npm',
    args: 'start',
    cwd: './',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      HOSTNAME: '0.0.0.0',
      NEXT_PUBLIC_APP_NAME: 'RWA Hub',
      NEXT_PUBLIC_API_BASE_URL: '${API_BASE_URL}',
      NEXT_PUBLIC_ENABLE_MOCK_API: 'false'
    }
  }]
}
EOF



# 打包部署文件
print_info "📦 打包部署文件..."
tar -czf rwa-hub-deploy-package.tar.gz deploy-package/

print_success "🎉 RWA Hub 部署包创建完成！"
print_info ""
print_info "📋 部署包信息:"
print_info "  - 项目: RWA Hub"
print_info "  - 文件: rwa-hub-deploy-package.tar.gz"
print_info "  - 大小: $(du -h rwa-hub-deploy-package.tar.gz | cut -f1)"
print_info "  - API 地址: ${API_BASE_URL}"
print_info "  - 内容: .next 构建产物 + 启动脚本 + PM2 配置"
print_info ""
print_info "📤 上传到服务器:"
print_info "  scp rwa-hub-deploy-package.tar.gz user@server:/opt/"
print_info ""
print_info "🚀 在服务器上部署:"
print_info "  # 方式1: 直接启动"
print_info "  tar -xzf rwa-hub-deploy-package.tar.gz"
print_info "  cd deploy-package"
print_info "  ./start.sh"
print_info ""
print_info "  # 方式2: 使用 PM2"
print_info "  pm2 start ecosystem.config.js"
print_info ""
print_success "✅ RWA Hub 静态部署包准备完成！"