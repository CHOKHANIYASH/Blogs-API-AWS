const { sesClient } = require("../aws/clients");
const {
  SendEmailCommand,
  CreateTemplateCommand,
  GetTemplateCommand,
  SendBulkEmailCommand,
  SendTemplatedEmailCommand,
} = require("@aws-sdk/client-ses");

const welcomeEmail = async ({ email, username }) => {
  try {
    const command = new SendTemplatedEmailCommand({
      Source: "yashchokhani95@gmail.com",
      Destination: {
        ToAddresses: [email],
      },
      Template: "WelcomeEmailTemplate2801",
      TemplateData: JSON.stringify({
        recepient: {
          username,
        },
      }),
    });
    const response = await sesClient.send(command);
    console.log("Email sent successfully");
    console.log(response);
  } catch (error) {
    console.log("Error in welcomeEmail:", error);
    return error;
  }
};

const sendBlogEmail = async ({ emailList, username, blogData }) => {
  try {
    const Destination = {
      ToAddresses: emailList,
    };
    const command = new SendEmailCommand({
      Source: "yashchokhani95@gmail.com",
      Destination,
      Message: {
        Subject: {
          Data: `New Blog by ${username}`,
        },
        Body: {
          Html: {
            Data: `<html>
            <head></head>
            <body>
            <h1>New Blog Alert!</h1>
            <p>Dear Blogistaan User,</p>
            <p>A new blog has been published by <b>${username}</b>. Check it out!</p>
            <p>Title: ${blogData.title}</p>
            <p>Content: ${blogData.content}</p>
            </body>
            </html>`,
          },
        },
      },
    });
    const response = await sesClient.send(command);
  } catch (error) {
    console.log("Error in sendBlogEmail:", error);
    return error;
  }
};

// const CreateTemplate = async () => {
//   try {
//     const command = new CreateTemplateCommand({
//       Template: {
//         TemplateName: "WelcomeEmailTemplate2801",
//         SubjectPart: "Welcome to Blogistaan!",
//         HtmlPart:
//           "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>\
//                     <title>Welcome to Blogistaan!</title>\
//                     </head>\
//                     <body style='font-family: Arial, sans-serif;'>\
//                     <table style='max-width: 600px; margin: 0 auto;'>\
//                     <tr>\
//                     <td><h2 style='color: #333;'>Welcome to Blogistaan!</h2><p>Dear {{recepient.username}},\
//                     </p><p>Welcome to Blogistaan! We are thrilled to have you on board and look forward to serving you.</p>\
//                     <p>At Blogistaan,we are dedicated to providing exceptional blog contents and many more and ensuring your experience\
//                     with us is nothing short of excellent.</p>\
//                     <p> Best regards,<br>Yash Chokhani<br>Blogistaan<br>Email:yashchokhani95@gmail.com </p></td></tr></table>\
//                     </body></html>",
//       },
//     });
//     const response = await sesClient.send(command);
//     console.log(response);
//   } catch (error) {
//     console.log("Error in CreateTemplate:", error);
//     return error;
//   }
// };

// CreateTemplate();
module.exports = {
  welcomeEmail,
  sendBlogEmail,
};
