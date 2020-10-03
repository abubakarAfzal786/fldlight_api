/* eslint-disable no-restricted-globals */
/* eslint-env browser, worker, es2017 */

/* this is a cloudflare worker, it is not used directly by this application

  https://liftcodeplay.com/2018/10/01/validating-auth0-jwts-on-the-edge-with-a-cloudflare-worker/

*/

// https://login.floodlightinvest.com/.well-known/jwks.json
const jwks = {
  keys: [
    {
      alg: 'RS256',
      kty: 'RSA',
      key_ops: ['verify'], // this key/val is not returned from jwks.json but is included in the sample code
      use: 'sig',
      x5c: ['MIIDAzCCAeugAwIBAgIJPZ4PO+U7T6myMA0GCSqGSIb3DQEBCwUAMB8xHTAbBgNVBAMTFGZsb29kbGlnaHQuYXV0aDAuY29tMB4XDTE5MTAwNjAzMzczMVoXDTMzMDYxNDAzMzczMVowHzEdMBsGA1UEAxMUZmxvb2RsaWdodC5hdXRoMC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCmaJZ1DUqmTTcx0HvHy1g+q+4z8iQ9w4ik1niQBlJKHZkVV+fy5c+cTDoxC/3YnOSlU/xx3kPqiDN9GwCi/8D13CxgalYKez1cPovU2QICtPdsfyzB7oRo/caLp1i6cMGS2hyB7WV/LtH85F+86wHBgv7Pc6YXTngTTLaXh/ER88Rxx6UmanZYEHCG0CbZ2eHY9hIGnugsl8XaSA/1y956w5CnLrqCbCi3G8ZTphl/3eLvIe3ea9ACfEQ+Ul4IXXHCZ2ioXEJf27M7DVPJe5tKtgARjQs/h39zWfuf0L2qh9ZAaJrLjV7X+ROMbeP70MciuowPP3Xf8onpAWlB08ZhAgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFAYVJwJ13RKUDPZJn1dYkGq8kOvAMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAltObvuNCBU1K2P8M86j6ZyQU2d/5H4rEc9VaDi2E3Dpsv6Bez6gfX0jDTVEqaXVtFj8LnQuajZzVhvfnIaV84WGqPXaVaxQWMXPpJauTzk7DbZ8Tj1wszETZvX6lKEPk9rpjX1ZetypIVG8ggWUpzbAQNzOBpO5RVj761Xx7X4LBhg55b6EdFUywLM+v43NCfavKoJkK+KyxBsRe7Vjd2XUje14XI2OYxSFqfVy8fO3TI1yzMEhQ0/CnNU1nBLyR3xxZEd1W0pJAFP0EiH1iiWox5eviuS5K3kihkVueErdpRxx4fdzUFIbj8zwr4M247zhMqdUGA8x2vgkMjWnz+g=='],
      n: 'pmiWdQ1Kpk03MdB7x8tYPqvuM_IkPcOIpNZ4kAZSSh2ZFVfn8uXPnEw6MQv92JzkpVP8cd5D6ogzfRsAov_A9dwsYGpWCns9XD6L1NkCArT3bH8swe6EaP3Gi6dYunDBktocge1lfy7R_ORfvOsBwYL-z3OmF054E0y2l4fxEfPEccelJmp2WBBwhtAm2dnh2PYSBp7oLJfF2kgP9cveesOQpy66gmwotxvGU6YZf93i7yHt3mvQAnxEPlJeCF1xwmdoqFxCX9uzOw1TyXubSrYAEY0LP4d_c1n7n9C9qofWQGiay41e1_kTjG3j-9DHIrqMDz913_KJ6QFpQdPGYQ',
      e: 'AQAB',
      kid: 'NUREMTM1MzdEODhEMUMxMTdBQzA4OEIwRTA4MTlDQzQ0RUIzRjc4RA',
      x5t: 'NUREMTM1MzdEODhEMUMxMTdBQzA4OEIwRTA4MTlDQzQ0RUIzRjc4RA',
    }],
};

// Following code is a modified version of that found at https://blog.cloudflare.com/dronedeploy-and-cloudflare-workers/


/**
 * For this example, the JWT is passed in as part of the Authorization header,
 * after the Bearer scheme.
 * Parse the JWT out of the header and return it.
 */
function getJwt(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
    return null;
  }
  return authHeader.substring(6).trim();
}

/**
 * Parse and decode a JWT.
 * A JWT is three, base64 encoded, strings concatenated with ‘.’:
 *   a header, a payload, and the signature.
 * The signature is “URL safe”, in that ‘/+’ characters have been replaced by ‘_-’
 *
 * Steps:
 * 1. Split the token at the ‘.’ character
 * 2. Base64 decode the individual parts
 * 3. Retain the raw Bas64 encoded strings to verify the signature
 */
function decodeJwt(token) {
  const parts = token.split('.');
  const header = JSON.parse(atob(parts[0]));
  const payload = JSON.parse(atob(parts[1]));
  const signature = atob(parts[2].replace(/_/g, '/').replace(/-/g, '+'));
  console.log(header);
  return {
    header,
    payload,
    signature,
    raw: { header: parts[0], payload: parts[1], signature: parts[2] },
  };
}

/**
 * Validate the JWT.
 *
 * Steps:
 * Reconstruct the signed message from the Base64 encoded strings.
 * Load the RSA public key into the crypto library.
 * Verify the signature with the message and the key.
 */
async function isValidJwtSignature(token) {
  const encoder = new TextEncoder();
  const data = encoder.encode([token.raw.header, token.raw.payload].join('.'));
  const signature = new Uint8Array(Array.from(token.signature).map((c) => c.charCodeAt(0)));

  // You need to JWK data with whatever is your public RSA key. If you're using Auth0 you
  // can download it from https://[your_domain].auth0.com/.well-known/jwks.json
  const jwk = jwks.keys[0];

  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data);
}


/**
 * Parse the JWT and validate it.
 *
 * We are just checking that the signature is valid, but you can do more that.
 * For example, check that the payload has the expected entries or if the signature is expired..
 */
async function isValidJwt(request) {
  const encodedToken = getJwt(request);
  if (encodedToken === null) {
    return false;
  }
  const token = decodeJwt(encodedToken);

  // Is the token expired?
  const expiryDate = new Date(token.payload.exp * 1000);
  const currentDate = new Date(Date.now());
  if (expiryDate <= currentDate) {
    console.log('expired token');
    return false;
  }

  return isValidJwtSignature(token);
}

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  const isValid = await isValidJwt(request);

  if (!isValid) {
    // It is immediately failing here, which is great. The worker doesn't bother hitting your API
    console.log('is NOT valid');
    return new Response('Invalid JWT', { status: 403 });
  }
  console.log('is valid');


  console.log('Got request', request);
  const response = await fetch(request);
  console.log('Got response', response);
  return response;
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
