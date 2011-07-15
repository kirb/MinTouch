@echo off&setlocal
echo Please Wait, minifying MinTouch...
cscript /nologo pack.wsf MinTouch.js>MinTouch.min.js
echo ...Done, press any key to exit.
pause>nul