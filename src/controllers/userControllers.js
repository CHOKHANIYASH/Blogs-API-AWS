const {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminInitiateAuthCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { v4: uuidv4 } = require("uuid");
const {
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { cognitoClient, dynamodbClient } = require("../aws/clients");
const { welcomeEmail } = require("./sesControllers");
// Add Users to the database
const addUser = async ({ username, email }) => {
  console.log("addUser function");
  userId = uuidv4();
  const command = new PutItemCommand({
    TableName: "blog_user",
    Item: {
      userId: { S: userId },
      username: { S: username },
      email: { S: email },
    },
  });
  const response = await dynamodbClient.send(command);
  console.log(response);
  return {
    message: "User added successfully",
    data: { userId },
  };
};
// User Signup
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
    const user = await cognitoClient.send(command);
    if (!user) {
      throw new Error("User not created");
    }
    const passwordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: username,
      Password: password,
      Permanent: true,
    });
    const passwordResponse = await cognitoClient.send(passwordCommand);
    const userId = await addUser({ username, email });
    await welcomeEmail({ email, username });
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
// User Login
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
    const response = await cognitoClient.send(command);
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
// Getting List of all Users
const getAllUsers = async () => {
  try {
    const command = new ScanCommand({
      TableName: "blog_user",
    });
    const response = await dynamodbClient.send(command);
    const Items = response.Items;
    Items.forEach((item) => {
      item.username = item.username.S;
      item.email = item.email.S;
      item.userId = item.userId.S;
    });
    return { success: true, message: "All users list", data: { users: Items } };
  } catch (err) {
    throw err;
  }
};
// get user details
const getUser = async ({ userId }) => {
  try {
    const command = new GetItemCommand({
      TableName: "blog_user",
      Key: marshall({ userId }),
    });
    const response = await dynamodbClient.send(command);
    if (!response.Item) {
      return {
        success: false,
        message: "User not found",
        data: {},
      };
    }
    const user = unmarshall(response.Item);
    return {
      success: true,
      message: "User found",
      data: { user },
    };
  } catch (err) {
    throw err;
  }
};

// List of all the subscribers of user
const subscribers = async ({ userId }) => {
  try {
    const command = new GetItemCommand({
      TableName: "blog_subscriptions",
      Key: marshall({ userId }),
    });
    const response = await dynamodbClient.send(command);
    if (!response.Item) {
      return {
        success: false,
        message: "No subscribers found",
        data: {},
      };
    }
    const subscribers = unmarshall(response.Item).subscriber;
    return {
      success: true,
      message: "Subscribers list",
      data: { subscribers },
    };
  } catch (err) {
    throw err;
  }
};

// Add Subscribers to Users Blogs
const subscribe = async ({ userId, email }) => {
  try {
    const command = new GetItemCommand({
      TableName: "blog_subscriptions",
      Key: marshall({ userId }),
    });
    const response = await dynamodbClient.send(command);
    if (!response.Item) {
      const putCommand = new PutItemCommand({
        TableName: "blog_subscriptions",
        Item: marshall({ userId, subscriber: [email] }),
      });
      const putResponse = await dynamodbClient.send(putCommand);
    } else {
      const updateCommand = new UpdateItemCommand({
        TableName: "blog_subscriptions",
        Key: marshall({ userId }),
        UpdateExpression: "SET subscriber = list_append(subscriber, :email)",
        ExpressionAttributeValues: marshall({ ":email": [email] }),
      });
      const updateResponse = await dynamodbClient.send(updateCommand);
    }
    return {
      success: true,
      message: "User subscribed successfully",
      data: {},
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  signUp,
  login,
  getUser,
  getAllUsers,
  subscribers,
  subscribe,
};
