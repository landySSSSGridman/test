# start-docker.ps1 - Rich 4 游戏 Docker 快速启动脚本
Write-Host "🚀 启动 Rich 4 游戏..." -ForegroundColor Green

# 检查Docker是否运行
if (-not (docker info 2>$null)) {
    Write-Host "❌ Docker 未运行，请先启动 Docker Desktop" -ForegroundColor Red
    exit 1
}

# 停止旧容器
Write-Host "🛑 停止旧容器..." -ForegroundColor Yellow
docker-compose down 2>$null

# 构建并启动
Write-Host "🔨 构建并启动服务..." -ForegroundColor Cyan
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    # 等待服务启动
    Write-Host "⏳ 等待服务启动..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # 显示状态
    Write-Host "`n✅ 服务已启动！" -ForegroundColor Green
    Write-Host "🌐 前端地址: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 后端API: http://localhost:5285/api" -ForegroundColor Cyan
    Write-Host "📚 Swagger: http://localhost:5285/swagger" -ForegroundColor Cyan
    Write-Host "`n📋 查看日志命令: docker-compose logs -f" -ForegroundColor Yellow
    Write-Host "🛑 停止服务命令: docker-compose down" -ForegroundColor Yellow
} else {
    Write-Host "❌ 启动失败，请检查错误信息" -ForegroundColor Red
}
