const { v4: uuidv4 } = require("uuid");
const { ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { dynamodbClient } = require("../aws/clients");

const getAllBlogs = async () => {
  const command = new ScanCommand({
    TableName: "blog",
  });
  const response = await dynamodbClient.send(command);
  const items = [];
  for (const Item of response.Items) {
    const item = await unmarshall(Item);
    items.push(item);
  }
  return { message: "All Blogs", data: { blogs: items } };
};

const getBlog = async ({ blogId }) => {
  const command = new ScanCommand({
    TableName: "blog",
    FilterExpression: "blogId = :blogId",
    ExpressionAttributeValues: {
      ":blogId": { S: blogId },
    },
  });
  const response = await dynamodbClient.send(command);
  const items = [];
  for (const Item of response.Items) {
    const item = await unmarshall(Item);
    items.push(item);
  }
  return { message: "Blog", data: { blogs: items } };
};

const addBlog = async ({ blogData, userId }) => {
  try {
    console.log("addBlog function");
    const blogId = uuidv4();
    const Item = marshall({
      blogId,
      userId,
      ...blogData,
      createdAt: new Date().toISOString(),
    });
    const command = new PutItemCommand({
      TableName: "blog",
      Item: Item,
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
  const items = [];
  for (const Item of response.Items) {
    const item = await unmarshall(Item);
    items.push(item);
  }
  return { success: true, message: "User Blogs", data: { blogs: items } };
};

module.exports = {
  getAllBlogs,
  addBlog,
  getBlog,
  getUserBlogs,
};
