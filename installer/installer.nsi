
!define PRODUCT_NAME "Bear Optimizer Pro"
!define COMPANY_NAME "Bear Service"
!define INSTALL_DIR "$PROGRAMFILES\${PRODUCT_NAME}"
!define OUTPUT_EXE "Bear-Optimizer-Pro-Setup.exe"

OutFile "${OUTPUT_EXE}"
InstallDir "${INSTALL_DIR}"
RequestExecutionLevel admin
ShowInstDetails show

Page directory
Page instfiles
UninstPage uninstConfirm
UninstPage uninstFiles

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "dist\*.*"
  CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\uninstall.exe"
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\${PRODUCT_NAME}.exe"
  Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd
