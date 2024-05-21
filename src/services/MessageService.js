const Message = require("../models/MessageModel");

const createMessage = (chatId, type, content, senderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tạo một đối tượng tin nhắn mới
      const newMessage = new Message({
        chatId,
        type,
        content,
        senderId,
        sentTime: new Date(),
      });

      // Lưu tin nhắn vào cơ sở dữ liệu
      await newMessage.save();

      resolve({
        status: "OK",
        message: "Message created successfully",
        data: newMessage,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message,
      });
    }
  });
};
// can update them
const getMessageById = (chatId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const message = await Message.find({ chatId })
        .populate({
          path: "senderId",
        })
        .sort({ createdAt: 1 });
      if (!message) {
        reject({
          status: "ERR",
          message: error.message,
        });
      }
     
      resolve({
        status: "OK",
        message: "Chat created successfully",
        data: message,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message,
      });
    }
  });
};

const updateMessage = (messageId, content) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { content },
        { new: true }
      );
      if (!updatedMessage) {
        throw new Error("Message not found");
      }
      resolve(updatedMessage);
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message,
      });
    }
  });
};

const deleteMessage = (messageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedMessage = await Message.findByIdAndDelete(messageId);
      if (!deletedMessage) {
        throw new Error("Message not found");
      }
      resolve(deletedMessage); // Return deleted message or any other info if needed
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message,
      });
    }
  });
};

// dang con error
const revokeMessage = async (messageId) => {
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Xóa các trường không cần thiết
    delete message.type;
    delete message.content;
    delete message.senderId;
    delete message.sentTime;
    delete message.createdAt;
    delete message.updatedAt;
    delete message.__v;

    await message.save();
    return message;
  } catch (error) {
    throw error;
  }
};

//dang con error
const revokeMessageForUser = async (messageId, userId) => {
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      throw new Error("Message not found");
    }
    message.isDeleted = message.isDeleted || [];
    if (!message.isDeleted.includes(userId)) {
      message.isDeleted.push(userId);
    }
    await message.save();
    return message;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessage,
  revokeMessage,
  revokeMessageForUser,
};
