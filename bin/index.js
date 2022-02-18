#!/usr/bin/env node
const assert = require('assert');
const { createClient } = require('redis');
const bent = require('bent');
const get = bent('https://apiban.org', 'GET', 'json', 200);
let client;

/* validate environment */
const {
  APIBAN_API_KEY,
  APIBAN_REDIS_SERVER,
  APIBAN_REDIS_PORT = 6379,
  APIBAN_REDIS_KEY,
} = process.env;
assert.ok(APIBAN_REDIS_SERVER, 'env APIBAN_REDIS_SERVER is required');
assert.ok(APIBAN_REDIS_KEY, 'env APIBAN_REDIS_KEY is required');
assert.ok(APIBAN_API_KEY, 'env APIBAN_API_KEY is required');

//const buff = Buffer.from(`${APIBAN_USERNAME}:${APIBAN_PASSWORD}`);
//const base64data = buff.toString('base64');
//const post = bent('https://apiban.org', 'POST', 'json', {'Authorization': `Basic ${base64data}`}, 200);

const connectRedis = async() => {
  return new Promise((resolve, reject) => {
    client = createClient({
      url: `redis://${APIBAN_REDIS_SERVER}:${APIBAN_REDIS_PORT}`
    });
    client
      .on('error', (err) => {
        console.log('failed connecting to redis', err);
        reject(err);
      })
      .on('ready', resolve);
    client.connect();
  });
};

/* not used atm - for reference
const getApiKey = async() => {
  try {
    const response = await post('/sponsor/newkey', {client: process.env.APIBAN_CLIENT_ID});
    console.log(response);
    return response?.ApiKey;
  } catch (err) {
    console.error('Failed to get blacklist from apiban', err);
    throw err;
  }
};
*/

const getBlacklist = async() => {
  let id;
  let ips = [];
  do {
    try {
      const url = `/api/${APIBAN_API_KEY}/banned${id ? ('/' + id) : ''}`;
      const response = await get(url);
      ips = [...ips, ...response.ipaddress];
      id = response.ID;
      console.log(`fetched ${response.ipaddress.length} ips, next ID ${id}`);
    } catch (err) {
      if (ips.length) return ips;
      console.error('Failed to get blacklist from apiban', err);
      throw err;
    }
  } while (id && id !== 'none');
  return ips;
};

const updateRedis = async(ips) => {
  try {
    await client.DEL(APIBAN_REDIS_KEY);
    await client.sendCommand(['SADD', APIBAN_REDIS_KEY, ...ips]);
    console.log();
    console.log(`Success! the redis set named ${APIBAN_REDIS_KEY} now contains ${ips.length} ips`);
  } catch (err) {
    console.log(err);
  }
};

connectRedis()
  .then(getBlacklist)
  .then(updateRedis)
  .then(process.exit)
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });

