# apiban-redis
A simple Node.js [APIBAN](https://www.apiban.org) client for downloading banned IPs and inserting them into a redis set.

# Installation
This utility can be run as a shell command if installed globally, i.e.:
```bash
$ sudo npm install -g .

$ APIBAN_REDIS_SERVER=127.0.0.1 APIBAN_REDIS_PORT=6379 \
APIBAN_REDIS_KEY=my-blacklist \
APIBAN_API_KEY=cad1ffe572193875345f55cd5855580e \
apiban-redis

fetched 250 ips, next ID 1644910929
fetched 250 ips, next ID 1645191645
fetched 2 ips, next ID 1645195595

Success! The redis set named my-blacklist now contains 502 ips
```
