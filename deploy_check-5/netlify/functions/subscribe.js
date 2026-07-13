const https = require('https');

const ML_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYzRlMmZkY2JiOTkyZTliZDYzNGI1MjZkMDU3YjI0ZjZlNzMyOWEzODE2MGUwYzZhNzdkMTgzNjdmMzdmMDE4NmJmZjM4NDFiODkyYzAyODMiLCJpYXQiOjE3ODM4Njg1NzQuNjg5NzcyLCJuYmYiOjE3ODM4Njg1NzQuNjg5Nzc1LCJleHAiOjQ5Mzk1NDIxNzQuNjgyMzUyLCJzdWIiOiIyNTIxMjY0Iiwic2NvcGVzIjpbXX0.oeo1_G0RKOUcCL23AB_7HD2uuv_pC2_ATc8FiY2iipvE3mqgqXJwMAX6wtdKqe2RikUEcsezrNoCWde8WMQM-U2xXrd77QLK3JhD9RkLOC8tiRjV9RCW9mIXbDF1uCq76goQ7W_qtjG2y1w34gHShNCk8pG0AHA6TKQ8VBclYu7Y31WLYblJZNQxciC_7sLd-zEiqxAY4kPCJZ_0z6HD-lCZcBo3GHHbxeG_6Iqv_ONN1b_GmA6-v3srksdN6l8aokD5at-Vzeg4U67LI1-8aX2wqigso_SYbU5WXBCxrJEx3Cpc-gcgCeckAK3RbMRqL8Vqq-gQDHfYd6MfjpLYqhbZ7_edxbKE_bRLI1bn7MT15xA9YelzxkMhmwHlcvRgJatr6dn7JCeV_vSmV_1vnkUMCyTvmRBfjJaUng2KUYCgoj9O4FSO_d3BIrAHCME8mZBswLo2j30vh_IUCOTA3WerwFBp96SZNCirCbtmW5YezTNjOwUWeyo2DLt0doy953XE3XY4NWcB3egL8W3mXCyVuvjFsSS4_3Xm2IzvVZRo5Vla_LGGOaZOMpPDTFsTNwT0ACuEmX7tU0hTlKZD1gKU6XlkjpIAVZEeuRoWEaQcV0pUC3mSzzowGdaMEY7dIjSPDp25AfcFTFS7P2nIjxE9B2YE_qmDx1-DADyobdo';

function post(data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = https.request({
      hostname: 'connect.mailerlite.com',
      path: '/api/subscribers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ML_TOKEN,
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method not allowed' };

  try {
    const { email, groupId } = JSON.parse(event.body);
    const result = await post({ email, groups: [groupId] });
    return { statusCode: 200, headers, body: result.body };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
