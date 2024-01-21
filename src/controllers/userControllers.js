const {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
} = require("@aws-sdk/client-cognito-identity-provider");
const client = new CognitoIdentityProviderClient({});

const signUp = async (username, password, email) => {
  const command = new AdminCreateUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
    UserAttributes: [
      { Name: "email", Value: email },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    MessageAction: "SUPPRESS",
  });
  const user = await client.send(command);
  if (!user) {
    throw new Error("User not created");
  }
  const passwordCommand = new AdminSetUserPasswordCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
    Password: password,
    Permanent: true,
  });
  const passwordResponse = await client.send(passwordCommand);
  return {
    user,
    passwordResponse,
  };
};

const login = async (username, password) => {
  const user_pool_id = process.env.COGNITO_USER_POOL_ID;
  const client_id = process.env.COGNITO_USER_POOL_CLIENT_ID;
  const command = new AdminInitiateAuthCommand({
    AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
    UserPoolId: user_pool_id,
    ClientId: client_id,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });
  const response = await client.send(command);
  console.log(response);
  return response;
};

module.exports = {
  signUp,
  login,
};
