@echo off&setlocal
echo Please Wait, minifying MinTouch...
cscript /nologo "%~dp0minify.wsf" "%~dp0..\MinTouch.js">"%~dp0..\MinTouch.min.js"
echo ...Done, press any key to exit.
pause>nul