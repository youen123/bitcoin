kill -9 $(ps -ef | grep "node trade.js"| grep -v grep | awk '{print $2}')
