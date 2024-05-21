const MessageService = require('../services/MessageService');

const createMessage = async (req, res) => {
    try {
        const { chatId, type, content, senderId } = req.body;
        const message = await MessageService.createMessage(chatId, type, content, senderId);
        return res.status(201).json(message);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const getMessageById = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await MessageService.getMessageById(messageId);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(404).json({ message : error });
    }
};

const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const updatedMessage = await MessageService.updateMessage(messageId, content);
        return res.status(200).json(updatedMessage);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        await MessageService.deleteMessage(messageId);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const revokeMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const result = await MessageService.revokeMessage(messageId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const revokeMessageForUser = async (req, res) => {
    try {
        const { messageId, userId } = req.params;
        const result = await MessageService.revokeMessageForUser(messageId, userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

module.exports = {
    createMessage,
    getMessageById,
    updateMessage,
    deleteMessage,
    revokeMessage,
    revokeMessageForUser
};
