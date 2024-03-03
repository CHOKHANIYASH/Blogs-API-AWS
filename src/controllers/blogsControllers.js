const { v4: uuidv4 } = require("uuid");
const { ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { dynamodbClient } = require("../aws/clients");

const addBlog = async ({ title, content, userId }) => {
  try {
    console.log("addBlog function");
    const blogId = uuidv4();
    const command = new PutItemCommand({
      TableName: "blog",
      Item: {
        blogId: { S: blogId },
        createdAt: { S: new Date().toISOString() },
        title: { S: title },
        content: { S: content },
        userId: { S: userId },
      },
    });
    const response = await dynamodbClient.send(command);
    return {
      success: true,
      message: "Blog added successfully",
      data: { blogId },
    };
  } catch (err) {
    throw err;
  }
};

const getUserBlogs = async ({ userId }) => {
  const command = new ScanCommand({
    TableName: "blog",
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  });
  const response = await dynamodbClient.send(command);
  const items = response.Items;
  items.forEach((item) => {
    item.title = item.title.S;
    item.content = item.content.S;
    item.blogId = item.blogId.S;
    item.userId = item.userId.S;
    item.createdAt = item.createdAt.S;
  });
  console.log(response);
  return { success: true, message: "User Blogs", data: { blogs: items } };
};

const getBlog = async (blogId) => {
  const command = new ScanCommand({
    TableName: "blog",
    FilterExpression: "blogId = :blogId",
    ExpressionAttributeValues: {
      ":blogId": { S: blogId },
    },
  });
  const response = await dynamodbClient.send(command);
  return { message: "Blog", data: response.Items };
};
module.exports = {
  addBlog,
  getBlog,
  getUserBlogs,
};
