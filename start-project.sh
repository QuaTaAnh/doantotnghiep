#!/bin/bash

# Script khởi động dự án Connect Housing
# MySQL: Docker | Backend + Frontend: PM2
# Author: QuaTaAnh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

print_message() {
    echo -e "${2}${1}${NC}"
}

print_header() {
    clear
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         🏠 CONNECT HOUSING - AUTO STARTER 🏠             ║"
    echo "║                MySQL: Docker | BE+FE: PM2                  ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

check_requirements() {
    print_message "🔍 Kiểm tra yêu cầu hệ thống..." "${BLUE}"
    echo ""
    
    local missing=0
    
    # Check Docker
    if ! command_exists docker; then
        print_message "❌ Docker chưa cài đặt" "${RED}"
        print_message "   → https://www.docker.com/products/docker-desktop/" "${YELLOW}"
        missing=1
    else
        if ! docker info >/dev/null 2>&1; then
            print_message "❌ Docker chưa chạy! Vui lòng khởi động Docker Desktop" "${RED}"
            exit 1
        fi
        print_message "✅ Docker" "${GREEN}"
    fi
    
    # Check Node.js
    if ! command_exists node; then
        print_message "❌ Node.js chưa cài đặt" "${RED}"
        print_message "   → https://nodejs.org/" "${YELLOW}"
        missing=1
    else
        print_message "✅ Node.js $(node -v)" "${GREEN}"
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_message "❌ npm chưa cài đặt" "${RED}"
        missing=1
    else
        print_message "✅ npm $(npm -v)" "${GREEN}"
    fi
    
    # Check PM2
    if ! command_exists pm2; then
        print_message "⚠️  PM2 chưa cài đặt, đang cài đặt..." "${YELLOW}"
        npm install -g pm2 --silent
        print_message "✅ PM2 đã cài đặt" "${GREEN}"
    else
        print_message "✅ PM2 $(pm2 -v)" "${GREEN}"
    fi
    
    if [ $missing -eq 1 ]; then
        echo ""
        print_message "❌ Vui lòng cài đặt các công cụ còn thiếu!" "${RED}"
        exit 1
    fi
    
    echo ""
}

create_env_files() {
    print_message "📝 Kiểm tra file .env..." "${BLUE}"
    
    # Root .env
    if [ ! -f ".env" ]; then
        cat > .env << 'EOF'
MYSQL_ROOT_PASSWORD=17102002
MYSQL_DATABASE=connectHousingDB
EOF
        print_message "✅ Tạo .env" "${GREEN}"
    else
        print_message "✅ .env exists" "${GREEN}"
    fi
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << 'EOF'
PORT=8080
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3307
DB_NAME=connectHousingDB
DB_USER=root
DB_PASSWORD=17102002
CLIENT_URL=http://localhost:3000
SECRET_KEY=my_super_secret_jwt_key_for_connect_housing_2024
EXPIRES_IN_ACCESS_TOKEN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EOF
        print_message "✅ Tạo backend/.env" "${GREEN}"
    else
        print_message "✅ backend/.env exists" "${GREEN}"
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << 'EOF'
VITE_API_BASE_URL=http://localhost:8080
VITE_SOCKET_URL=http://localhost:8800
EOF
        print_message "✅ Tạo frontend/.env" "${GREEN}"
    else
        print_message "✅ frontend/.env exists" "${GREEN}"
    fi
    
    echo ""
}

install_dependencies() {
    print_message "📦 Kiểm tra dependencies..." "${BLUE}"
    
    # Root
    if [ ! -d "node_modules" ]; then
        print_message "   → Cài đặt root dependencies..." "${YELLOW}"
        npm install --silent
    fi
    
    # Backend
    if [ ! -d "backend/node_modules" ]; then
        print_message "   → Cài đặt backend dependencies..." "${YELLOW}"
        cd backend && npm install --silent && cd ..
    fi
    
    # Frontend
    if [ ! -d "frontend/node_modules" ]; then
        print_message "   → Cài đặt frontend dependencies..." "${YELLOW}"
        cd frontend && npm install --silent && cd ..
    fi
    
    # Fix bcrypt permissions
    chmod +x backend/node_modules/.bin/* 2>/dev/null || true
    
    print_message "✅ Dependencies OK" "${GREEN}"
    echo ""
}

start_mysql() {
    print_message "🐳 Khởi động MySQL trên Docker..." "${BLUE}"
    
    if docker ps | grep -q "connecthousing_mysql"; then
        print_message "✅ MySQL đang chạy" "${GREEN}"
    else
        print_message "   → Starting MySQL container..." "${YELLOW}"
        docker-compose up -d
        
        print_message "   → Đợi MySQL khởi động (10s)..." "${YELLOW}"
        sleep 10
        
        if docker ps | grep -q "connecthousing_mysql"; then
            print_message "✅ MySQL started" "${GREEN}"
        else
            print_message "❌ MySQL không khởi động được!" "${RED}"
            print_message "   Xem logs: docker-compose logs" "${YELLOW}"
            exit 1
        fi
    fi
    echo ""
}

run_migrations() {
    print_message "🗄️  Database migrations..." "${BLUE}"
    
    cd backend
    npx sequelize-cli db:migrate 2>/dev/null || print_message "   (đã chạy hoặc bỏ qua)" "${YELLOW}"
    cd ..
    
    print_message "✅ Database ready" "${GREEN}"
    echo ""
}

create_log_dir() {
    mkdir -p logs
}

start_pm2() {
    print_message "🚀 Khởi động Backend & Frontend với PM2..." "${BLUE}"
    echo ""
    
    # Stop existing processes
    pm2 delete all 2>/dev/null || true
    
    # Start with PM2
    pm2 start ecosystem.config.js
    
    # Save PM2 list
    pm2 save --force 2>/dev/null || true
    
    echo ""
    print_message "✅ Tất cả services đã khởi động!" "${GREEN}"
}

show_info() {
    echo ""
    print_message "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "${CYAN}"
    print_message "   🎉 DỰ ÁN ĐÃ KHỞI ĐỘNG THÀNH CÔNG!" "${GREEN}"
    print_message "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "${CYAN}"
    echo ""
    print_message "📱 Frontend:     http://localhost:3000" "${MAGENTA}"
    print_message "🔧 Backend API:  http://localhost:8080/api/v1" "${MAGENTA}"
    print_message "💬 Socket.IO:    http://localhost:8800" "${MAGENTA}"
    print_message "🌐 Adminer:      http://localhost:8081" "${MAGENTA}"
    print_message "🗄️  MySQL:        localhost:3307" "${MAGENTA}"
    echo ""
    print_message "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "${CYAN}"
    print_message "   📊 LỆNH QUẢN LÝ" "${YELLOW}"
    print_message "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "${CYAN}"
    echo ""
    echo "  pm2 list              # Xem trạng thái"
    echo "  pm2 logs              # Xem logs tất cả"
    echo "  pm2 logs backend      # Logs backend"
    echo "  pm2 logs frontend     # Logs frontend"
    echo "  pm2 restart all       # Restart tất cả"
    echo "  pm2 stop all          # Dừng tất cả"
    echo "  pm2 delete all        # Xóa tất cả"
    echo "  pm2 monit             # Monitor realtime"
    echo ""
    echo "  docker-compose logs   # Logs MySQL"
    echo "  docker-compose down   # Dừng MySQL"
    echo ""
    print_message "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "${CYAN}"
    echo ""
}

main() {
    print_header
    
    # Make executable
    if [ ! -x "$0" ]; then
        chmod +x "$0"
    fi
    
    # Run setup
    check_requirements
    create_env_files
    install_dependencies
    start_mysql
    run_migrations
    create_log_dir
    start_pm2
    show_info
    
    # Show PM2 status
    pm2 list
}

main "$@"
