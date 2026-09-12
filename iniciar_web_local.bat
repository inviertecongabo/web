@echo off
title Servidor Local - Invierte con Gabo
echo ==============================================
echo Iniciando servidor de pruebas...
echo ==============================================
echo.
echo No cierres esta ventana negra mientras estes probando la web.
echo.
start http://localhost:8000
python -m http.server 8000
