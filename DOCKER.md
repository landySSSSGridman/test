# Docker 部署指南

## 📦 已创建文件

✅ Rich4Backend/Dockerfile - 后端Docker镜像
✅ Rich4Backend/.dockerignore - 后端忽略文件
✅ rich4-frontend/Dockerfile - 前端Docker镜像  
✅ rich4-frontend/.dockerignore - 前端忽略文件
✅ rich4-frontend/nginx.conf - Nginx配置
✅ rich4-frontend/.env.production - 生产环境变量
✅ docker-compose.yml - Docker Compose配置
✅ start-docker.ps1 - 快速启动脚本
✅ stop-docker.ps1 - 停止脚本

## 🚀 快速启动

### 方式一：使用启动脚本（推荐）
```powershell
.\start-docker.ps1
```

### 方式二：使用docker-compose命令
```powershell
# 构建并启动（首次运行或代码更新后）
docker-compose up --build

# 后台运行
docker-compose up -d --build

# 仅启动已构建的镜像
docker-compose up
```

## 🛑 停止服务

### 使用停止脚本
```powershell
.\stop-docker.ps1
```

### 使用docker-compose命令
```powershell
# 停止服务
docker-compose down

# 停止并删除卷
docker-compose down -v
```

## 📋 常用命令

```powershell
# 查看运行中的容器
docker ps

# 查看所有容器（包括已停止的）
docker ps -a

# 查看日志
docker-compose logs

# 实时查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs backend
docker-compose logs frontend

# 重启服务
docker-compose restart

# 重新构建特定服务
docker-compose build backend
docker-compose build frontend
```

## 🌐 访问地址

启动成功后可访问：
- 🎮 游戏前端：http://localhost:3000
- 🔧 后端API：http://localhost:5285/api
- 📚 Swagger文档：http://localhost:5285/swagger

## 🔍 故障排查

### 端口被占用
如果3000或5285端口被占用，修改docker-compose.yml中的端口映射：
```yaml
ports:
  - "新端口:原端口"
```

### 构建失败
```powershell
# 清理Docker缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache
```

### 容器无法启动
```powershell
# 查看详细日志
docker-compose logs -f

# 检查容器状态
docker ps -a
```

## 📦 架构说明

- **Backend**: ASP.NET Core 8.0 应用，监听端口5285
- **Frontend**: React应用，通过Nginx提供服务，端口80（映射到主机3000）
- **Network**: 使用Docker bridge网络，容器间通过服务名通信
- **API代理**: Nginx配置了反向代理，/api和/gamehub请求转发到backend服务

## 🔧 开发模式

如需在开发模式下运行（支持热重载），仍建议使用原始启动方式：
```powershell
# 后端
cd Rich4Backend
dotnet run

# 前端
cd rich4-frontend  
npm start
```

Docker主要用于生产部署和环境隔离。
