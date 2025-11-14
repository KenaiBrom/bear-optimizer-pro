
@echo off
SETLOCAL
SET OWNER=KenaiBrom
SET REPO=bear-optimizer-pro

if "%GITHUB_TOKEN%"=="" (
  echo ERROR: Set GITHUB_TOKEN in the session before running this script.
  pause
  exit /b 1
)

echo %GITHUB_TOKEN%>._tmp_token
gh auth login --with-token < ._tmp_token
del ._tmp_token

if not exist .git git init
git add .
git commit -m "Initial commit - Bear Optimizer Pro" 2>nul
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/%OWNER%/%REPO%.git
git push -u origin main --force
git tag -f v1.0.0
git push origin --tags --force
gh release view v1.0.0 --repo %OWNER%/%REPO% >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  gh release create v1.0.0 -t "v1.0.0" -n "Initial public release" --repo %OWNER%/%REPO%
)
echo Done.
pause
