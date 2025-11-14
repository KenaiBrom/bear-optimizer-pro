@echo off
REM Uso: bear_push_auto.bat
REM Automate push to existing repo

set OWNER=KenaiBrom
set REPO_NAME=bear-optimizer-pro

if "%GITHUB_TOKEN%"=="" (
  echo ERRO: Defina a variavel de ambiente GITHUB_TOKEN.
  echo Exemplo no PowerShell:
  echo   $env:GITHUB_TOKEN = "seu_token_aqui"
  pause
  exit /b 1
)

git --version >nul 2>&1 || (
  echo Git nao encontrado.
  pause
  exit /b 1
)

gh --version >nul 2>&1 || (
  echo GitHub CLI nao encontrado.
  pause
  exit /b 1
)

echo Autenticando gh...
echo %GITHUB_TOKEN%>._tmp_token
gh auth login --with-token < ._tmp_token
del ._tmp_token

echo Inicializando git local...
if not exist .git git init

git add .
git commit -m "Publicação inicial - Bear Optimizer Pro"
git branch -M main

echo Configurando origin...
git remote remove origin 2>nul
git remote add origin https://github.com/%OWNER%/%REPO_NAME%.git

echo Enviando arquivos...
git push -u origin main --force

echo Criando tag inicial...
git tag v1.0.0
git push origin --tags

echo PROJETO PUBLICADO COM SUCESSO!
echo Link: https://github.com/%OWNER%/%REPO_NAME%
pause
