const ChatService = require('../services/ChatService');

const createChat = async (req, res) => {
    try {
        const chatData = req.body;
        console.log(req.body);
        const response = await ChatService.createChat(chatData);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await ChatService.getChatById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const updateChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const updateData = req.body;
        const updatedChat = await ChatService.updateChat(chatId, updateData);
        return res.status(200).json(updatedChat);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        await ChatService.deleteChat(chatId);
        return res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const getUserChats = async (req, res) => {
    try {
        const { userId } = req.params;
        const userChats = await ChatService.getUserChats(userId);
        return res.status(200).json(userChats);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const addMember = async (req, res) => {
    const { chatId, userId } = req.params;
    try {
        const updatedChat = await ChatService.addMember(chatId, userId);
        return res.status(200).json(updatedChat);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const removeMember = async (req, res) => {
    const { chatId, userId } = req.params;
    try {
        const updatedChat = await ChatService.removeMember(chatId, userId);
        return res.status(200).json(updatedChat);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const updateMemberRole = async (req, res) => {
    const { chatId, userId } = req.params;
    const { role } = req.body;
    try {
        const updatedChat = await ChatService.updateMemberRole(chatId, userId, role);
        return res.status(200).json(updatedChat);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

const requestToJoinGroup = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { members } = req.body;

        // Trích xuất ID của thành viên từ members (giả sử members là một chuỗi ID)
        const userId = members;

        const result = await ChatService.requestToJoinGroup(chatId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message : error });
    }
};

const approveJoinRequest = async (req, res) => {
    try {
        const { chatId, userId } = req.params;
        const { organizerId } = req.body;

        const result = await ChatService.approveJoinRequest(chatId, userId, organizerId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message : error });
    }
};
module.exports = {
    createChat,
    getChatById,
    updateChat,
    deleteChat,
    getUserChats,
    addMember,
    removeMember,
    updateMemberRole,
    requestToJoinGroup,
    approveJoinRequest
};
