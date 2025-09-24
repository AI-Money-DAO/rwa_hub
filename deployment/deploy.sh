#!/bin/bash

# RWA Hub 一体化部署脚本
# 支持静态部署和PM2部署两种模式
# 作者: RWA Hub Team
# 版本: 2.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 配置变量
API_BASE_URL="http://www.ce182.com"
NODE_ENV="production"
PORT=3000
HOSTNAME="0.0.0.0"
NEXT_PUBLIC_APP_NAME="RWA Hub"
NEXT_PUBLIC_API_BASE_URL="$API_BASE_URL"
NEXT_PUBLIC_ENABLE_MOCK_API="false"

# PM2配置
PM2_APP_NAME="rwa-hub-frontend"
PM2_INSTANCES=1
PM2_EXEC_MODE="fork"
PM2_MAX_MEMORY="1G"

# 脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 打印函数
print_header() {
    echo -e "${CYAN}================================${NC}"
    echo -e "${CYAN}    RWA Hub 一体化部署脚本${NC}"
    echo -e "${CYAN}================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_info() {
    echo -e "${BLUE}$1${NC}"
}

print_step() {
    echo -e "${PURPLE}📋 $1${NC}"
}

# 显示配置信息
show_config() {
    print_info "📋 当前配置:"
    echo -e "   ${YELLOW}API地址: $API_BASE_URL${NC}"
    echo -e "   ${YELLOW}环境: $NODE_ENV${NC}"
    echo -e "   ${YELLOW}端口: $PORT${NC}"
    echo -e "   ${YELLOW}应用名: $NEXT_PUBLIC_APP_NAME${NC}"
    echo ""
}

# 检查依赖
check_dependencies() {
    print_step "检查系统依赖..."
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        print_error "❌ Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        print_error "❌ npm 未安装，请先安装 npm"
        exit 1
    fi
    
    print_success "✅ 系统依赖检查通过"
}

# 安装依赖
install_dependencies() {
    print_step "安装项目依赖..."
    cd "$PROJECT_ROOT"
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "✅ 依赖安装完成"
    else
        print_info "📦 依赖已存在，跳过安装"
    fi
}

# 构建项目
build_project() {
    print_step "构建项目..."
    cd "$PROJECT_ROOT"
    
    # 设置环境变量
    export NODE_ENV="$NODE_ENV"
    export NEXT_PUBLIC_APP_NAME="$NEXT_PUBLIC_APP_NAME"
    export NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL"
    export NEXT_PUBLIC_ENABLE_MOCK_API="$NEXT_PUBLIC_ENABLE_MOCK_API"
    export PORT="$PORT"
    
    npm run build
    print_success "✅ 项目构建完成"
}

# 生成PM2配置
generate_pm2_config() {
    print_step "生成PM2配置文件..."
    
    local pm2_config="$SCRIPT_DIR/deploy-package/ecosystem.config.js"
    
    cat > "$pm2_config" << EOF
module.exports = {
  apps: [{
    name: '$PM2_APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: './',
    instances: $PM2_INSTANCES,
    exec_mode: '$PM2_EXEC_MODE',
    autorestart: true,
    watch: false,
    max_memory_restart: '$PM2_MAX_MEMORY',
    env: {
      NODE_ENV: '$NODE_ENV',
      PORT: $PORT,
      HOSTNAME: '$HOSTNAME',
      NEXT_PUBLIC_APP_NAME: '$NEXT_PUBLIC_APP_NAME',
      NEXT_PUBLIC_API_BASE_URL: '$NEXT_PUBLIC_API_BASE_URL',
      NEXT_PUBLIC_ENABLE_MOCK_API: '$NEXT_PUBLIC_ENABLE_MOCK_API'
    }
  }]
}
EOF
    
    print_success "✅ PM2配置文件已生成"
}

# 创建部署包
create_deploy_package() {
    print_step "创建部署包..."
    
    local deploy_dir="$SCRIPT_DIR/deploy-package"
    
    # 清理旧的部署包
    if [ -d "$deploy_dir" ]; then
        rm -rf "$deploy_dir"
    fi
    
    mkdir -p "$deploy_dir"
    
    # 复制必要文件
    cp -r "$PROJECT_ROOT/.next" "$deploy_dir/"
    cp -r "$PROJECT_ROOT/public" "$deploy_dir/"
    cp "$PROJECT_ROOT/package.json" "$deploy_dir/"
    cp "$PROJECT_ROOT/package-lock.json" "$deploy_dir/" 2>/dev/null || true
    cp "$PROJECT_ROOT/next.config.js" "$deploy_dir/" 2>/dev/null || true
    
    # 生成启动脚本
    cat > "$deploy_dir/start.sh" << 'EOF'
#!/bin/bash

# RWA Hub 启动脚本

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_info() {
    echo -e "${BLUE}$1${NC}"
}

# 检查依赖
if [ ! -d "node_modules" ]; then
    print_info "📦 安装生产依赖..."
    npm ci --only=production
fi

# 设置环境变量
export NODE_ENV=production
export NEXT_PUBLIC_APP_NAME="RWA Hub"
export NEXT_PUBLIC_API_BASE_URL="http://www.ce182.com"
export NEXT_PUBLIC_ENABLE_MOCK_API="false"
export PORT=3000

print_success "✅ RWA Hub 准备完成！"
print_info "🚀 启动应用..."

# 启动应用
npm start
EOF
    
    chmod +x "$deploy_dir/start.sh"
    
    # 生成PM2配置
    generate_pm2_config
    
    print_success "✅ 部署包创建完成"
}

# 打包部署包
package_deploy() {
    print_step "打包部署文件..."
    
    cd "$SCRIPT_DIR"
    
    # 删除旧的压缩包
    if [ -f "rwa-hub-deploy-package.tar.gz" ]; then
        rm "rwa-hub-deploy-package.tar.gz"
    fi
    
    # 创建新的压缩包
    tar -czf "rwa-hub-deploy-package.tar.gz" -C deploy-package .
    
    print_success "✅ 部署包已打包: rwa-hub-deploy-package.tar.gz"
}

# 静态部署
deploy_static() {
    print_info "🌐 开始静态部署..."
    
    check_dependencies
    install_dependencies
    build_project
    
    # 设置环境变量并启动
    export NODE_ENV="$NODE_ENV"
    export NEXT_PUBLIC_APP_NAME="$NEXT_PUBLIC_APP_NAME"
    export NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL"
    export NEXT_PUBLIC_ENABLE_MOCK_API="$NEXT_PUBLIC_ENABLE_MOCK_API"
    export PORT="$PORT"
    
    print_success "✅ 静态部署完成！"
    print_info "🚀 启动应用..."
    
    cd "$PROJECT_ROOT"
    npm start
}

# PM2部署
deploy_pm2() {
    print_info "⚡ 开始PM2部署..."
    
    # 检查PM2（可选）
    if ! command -v pm2 &> /dev/null; then
        print_warning "⚠️  PM2 未安装，将生成部署包供后续使用"
        print_info "💡 可稍后安装PM2: npm install -g pm2"
    fi
    
    check_dependencies
    install_dependencies
    build_project
    create_deploy_package
    package_deploy
    
    print_success "✅ PM2部署包准备完成！"
    print_info "📋 使用说明:"
    echo -e "   ${YELLOW}1. 解压部署包: tar -xzf rwa-hub-deploy-package.tar.gz${NC}"
    echo -e "   ${YELLOW}2. 进入目录: cd rwa-hub-deploy-package${NC}"
    echo -e "   ${YELLOW}3. 启动PM2: pm2 start ecosystem.config.js${NC}"
    echo -e "   ${YELLOW}4. 或直接启动: ./start.sh${NC}"
}

# 验证配置
verify_config() {
    print_step "验证配置..."
    
    # 检查前端配置
    local api_config="$PROJECT_ROOT/src/config/api.js"
    if [ -f "$api_config" ]; then
        if grep -q "process.env.NEXT_PUBLIC_API_BASE_URL" "$api_config"; then
            print_success "✅ 前端API配置正确"
        else
            print_error "❌ 前端API配置有误"
            return 1
        fi
    else
        print_error "❌ API配置文件不存在"
        return 1
    fi
    
    print_success "✅ 配置验证通过"
}

# 显示帮助
show_help() {
    echo -e "${CYAN}RWA Hub 一体化部署脚本${NC}"
    echo ""
    echo -e "${YELLOW}用法:${NC}"
    echo "  $0 [选项]"
    echo ""
    echo -e "${YELLOW}选项:${NC}"
    echo "  static    静态部署模式（直接启动服务）"
    echo "  pm2       PM2部署模式（生成部署包）"
    echo "  verify    验证配置"
    echo "  config    显示当前配置"
    echo "  help      显示帮助信息"
    echo ""
    echo -e "${YELLOW}示例:${NC}"
    echo "  $0 static   # 静态部署并启动"
    echo "  $0 pm2      # 生成PM2部署包"
    echo "  $0 verify   # 验证配置"
    echo ""
}

# 主函数
main() {
    print_header
    
    case "${1:-}" in
        "static")
            show_config
            deploy_static
            ;;
        "pm2")
            show_config
            deploy_pm2
            ;;
        "verify")
            verify_config
            ;;
        "config")
            show_config
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        "")
            print_warning "⚠️  请指定部署模式"
            echo ""
            show_help
            exit 1
            ;;
        *)
            print_error "❌ 未知选项: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"