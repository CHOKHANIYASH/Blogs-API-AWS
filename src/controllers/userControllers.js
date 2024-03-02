const {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({});

const { addUser, addData } = require("./dynamodbControllers");

const signUp = async ({ username, password, email }) => {
  try {
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
    const userId = await addUser({ username, email });
    return {
      success: true,
      message: "User created successfully",
      data: {
        userId,
      },
    };
  } catch (err) {
    throw err;
  }
};

const login = async ({ username, password }) => {
  try {
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
    return {
      success: true,
      message: "User logged in successfully",
      data: {
        Authentication: response.AuthenticationResult,
      },
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  signUp,
  login,
};
