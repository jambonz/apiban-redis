# apiban-redis
A simple Node.js [APIBAN](https://www.apiban.org) client for downloading banned IPs and inserting them into a redis set.

# Installation
This utility can be run as a shell command if installed globally, i.e.:
```bash
$ sudo npm install -g .

$ APIBAN_REDIS_SERVER=127.0.0.1 APIBAN_REDIS_PORT=6379 \
APIBAN_REDIS_KEY=my-blacklist \
APIBAN_API_KEY=your-apiban-key \
apiban-redis

fetched 250 ips, next ID 1644910929
fetched 250 ips, next ID 1645191645
fetched 2 ips, next ID 1645195595

Success! The redis set named my-blacklist now contains 502 ips
```
# Adding additional ranges

You can also provide a list of network CIDRs that you want to block in addition to whatever apiban is currently blocking:

```bash
$ APIBAN_REDIS_SERVER=127.0.0.1 APIBAN_REDIS_PORT=6379 \
APIBAN_REDIS_KEY=my-blacklist \
APIBAN_API_KEY=your-apiban-key \
APIBAN_FOREVER_BLOCK_RANGES="128.90.0.0/16, 162.142.125.0/24, 198.235.24.0/24" \
apiban-redis

adding 65536 ips from 128.90.0.0/16 to forever block list
adding 256 ips from  162.142.125.0/24 to forever block list
adding 256 ips from  198.235.24.0/24 to forever block list
fetched 250 ips, next ID 1671198826
fetched 250 ips, next ID 1671445397
fetched 250 ips, next ID 1671583586
fetched 92 ips, next ID 1671632041

Success! the redis set named my-blacklist now contains 66890 ips
```
