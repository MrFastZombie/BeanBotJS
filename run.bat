@ECHO OFF
:main
node bot.js
echo Beanbot has crashed! Restarting...
TIMEOUT 5
goto main
