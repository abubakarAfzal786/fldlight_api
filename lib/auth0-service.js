const decode = require('jwt-decode');
const http = require("axios");
const managementDomain = process.env.AUTH0_MANAGEMENT_DOMAIN || process.env.AUTH0_DOMAIN;

/**
 * Adds subscription details to auth0 user's app_metadata
 * @param subscription
 * @param authUserId
 * @returns {Promise<*>}
 */
const addSubscriptionData = async function(subscription, authUserId){
  
  const managementApiToken = await getManagementApiToken();
  const metadata = {
    customer_id: subscription.customer,
    subscription: subscription
  };

  let updatedUser;

  try {
    updatedUser = await http.patch(
      `https://${managementDomain}/api/v2/users/${authUserId}`,
      {app_metadata: metadata},
      {
        headers: {
          Authorization: `Bearer ${managementApiToken}`
        }
      });
  } catch (error) {
    // Error 😨
    console.error(JSON.stringify(error));
  }

  return updatedUser;
};

/**
 * reduces a stripe subscription object to a set of attributes to be stored on Auth0
 *
 * @param subscription
 * @returns {Object}
 */
const subscriptionPayload = (subscription) => {
 return {
   id: subscription['id'],
   status: subscription['status'],
   created_at: subscription['created'],
   current_period_end: subscription['current_period_end'],
   product_id: subscription['plan.product'],
   plan_id: subscription['plan.id'],
   plan_nickname: subscription['plan.nickname'],
 }
};

/**
 * retrieves a "management" JWT to be used in management API interactions
 * @returns {Promise<string>}
 */
const getManagementApiToken = async function(){
  const options = {
    method: 'post',
    url: `https://${managementDomain}/oauth/token`,
    data: {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${managementDomain}/api/v2/`
    }
  };

  let response;

  try {
    response = await http(options);
  } catch(e){
    console.error(JSON.stringify(e));
  }

  return response.data.access_token;
};

/**
 * retrieves auth0 user ID from a given JWT
 * @param token
 * @returns {*|string}
 */
const userId = (token) => decode(token).sub;


module.exports = {addSubscriptionData, subscriptionPayload, userId};
