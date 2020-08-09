
::开启HTTP服务主要是一些HTML资源
::启动webServer
::启动nginx反向代理
@echo off
start cmd /k "cd html_test&&http-server -p 8001"
start cmd /k "cd blog-1&&npm run dev"
start cmd /c "cd /./nginx-1.18.0&&start nginx"
pause