import { generateSecureRandom } from 'react-native-securerandom';



function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

class Auth0Client {

  method = async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const verifier = base64URLEncode(await generateSecureRandom(32));

    const challenge = createChallenge(verifier);

    const result = await AuthSession.startAsync({
      authUrl:
        `${auth0Domain}/authorize` +
        toQueryString({
          audience: "https://some.hostname.com/some/api/url",
          client_id: auth0ClientId,
          response_type: "code",
          scope: "openid profile email",
          code_challenge: challenge,
          code_challenge_method: "S256",
          redirect_uri: redirectUrl,
          connection: "optional-id-for-connection-that-will-be-preselected-auth0-lock-screen"
        })
    });

    if (result.type !== "success") {
      throw Error(
        `result.type was ${
          result.type
          } instead of "success", full result was: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    }
    const code = result.params.code;
    const body = {
      grant_type: "authorization_code",
      client_id: auth0ClientId,
      code_verifier: verifier,
      code,
      redirect_uri: redirectUrl
    };
    const resp = await fetch("https://some.host.domain.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const respJson = await resp.json();
    console.log("respJson=", JSON.stringify(respJson, null, 2));
    const jwtAccessToken = jwtDecoder(respJson.access_token);
    console.log("token=", JSON.stringify(token, null, 2));
    const email = token.sub.split("|")[1];
  }
}

export default Auth0Client;