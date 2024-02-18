const { v4: uuidv4 } = require("uuid");
const { ScanCommand, PutItemCommand, DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.MY_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_APP_AWS_SECRET_ACCESS_KEY,
  },
});

const getAllUsers = async () => {
  const command = new ScanCommand({
    TableName: "blog_user",
  });
  const response = await client.send(command);
  return { message: "All users", data: response.Items };
}

const addUser = async ({ username, email }) => {
  console.log("addUser function");
  const command = new PutItemCommand({
    TableName: "blog_user",
    Item: {
      userId: { S: uuidv4() },
      username: { S: username },
      email: { S: email },
    },
  });
  const response = await client.send(command);
  return {message: "User added successfully",data:{userId: response.Attributes.userId.S}};
};

const getAllBlogs = async () => {
  const command = new ScanCommand({
    TableName: "blog",
  });
  const response = await client.send(command);
  return { message: "All Blogs", data: response.Items };
}

const addBlog = async ({ title, content, userId }) => {
  console.log("addBlog function");
  const command = new PutItemCommand({
    TableName: "blog",
    Item: {
      blogId: { S: uuidv4() },
      createdAt: new Date().toISOString(),
      title: { S: title },
      content: { S: content },
      userId: { S: userId },
    },
  });
  const response = await client.send(command);
  return {message: "Blog added successfully", data: {blogId: response.Attributes.blogId.S}};
};

const 

module.exports = {
  getAllUsers,
  addUser,
  getAllBlogs,
  addBlog,
};
