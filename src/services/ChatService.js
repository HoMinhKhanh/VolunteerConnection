const Chat = require('../models/ChatModel');

const createChat = (chatData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdChat = await Chat.create(chatData);
            resolve({
                status: 'OK',
                message: 'Chat created successfully',
                data: createdChat
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};

const getChatById = (chatId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const chat = await Chat.findById(chatId);
            resolve(chat);
        } catch (error) {
            reject(error);
        }
    });
};

const updateChat = (chatId, updateData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedChat = await Chat.findByIdAndUpdate(chatId, updateData, { new: true });
            resolve(updatedChat);
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};

const deleteChat = (chatId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Chat.findByIdAndDelete(chatId);
            resolve();
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};

const getUserChats = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userChats = await Chat.find({ members: userId }).populate({ path: 'members', options: { strictPopulate: false } });

            resolve({
                status: 'OK',
                message: 'Chat created successfully',
                data : userChats});
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};

const addMember = (chatId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const chat = await Chat.findById(chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }
            if (!chat.members.includes(userId)) {
                chat.members.push(userId);
                await chat.save();
            }
            resolve(chat);
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};

const removeMember = (chatId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const chat = await Chat.findById(chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }
            const index = chat.members.indexOf(userId);
            if (index !== -1) {
                chat.members.splice(index, 1);
                await chat.save();
            }
            resolve(chat);
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};

const updateMemberRole = (chatId, userId, role) => {
    return new Promise(async (resolve, reject) => {
        try {
            const chat = await Chat.findById(chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }
            const index = chat.members.indexOf(userId);
            if (index !== -1) {
                chat.roles[index] = role;
                await chat.save();
            }
            resolve(chat);
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};

const requestToJoinGroup = (chatId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const chat = await Chat.findById(chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }

            // Kiểm tra và khởi tạo mảng pending nếu cần
            if (!chat.pending || !Array.isArray(chat.pending)) {
                chat.pending = [];
            }

            // Loại bỏ các giá trị null khỏi mảng pending nếu có
            chat.pending = chat.pending.filter(pendingId => pendingId !== null);

            // Thêm userId vào mảng pending nếu userId không tồn tại trong mảng
            if (!chat.pending.includes(userId)) {
                chat.pending.push(userId);
            }

            await chat.save();
            resolve({ 
                message: 'Join request sent successfully', 
                pending: chat.pending,
                userId: userId // Bao gồm ID của thành viên trong phản hồi
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};


const approveJoinRequest = (chatId, userId, organizerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm cuộc trò chuyện dựa trên chatId
            const chat = await Chat.findById(chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }

            // Kiểm tra xem người duyệt yêu cầu có vai trò "organizer" và là thành viên của cuộc trò chuyện hay không
            if (!chat.members.includes(organizerId) || chat.roles[chat.members.indexOf(organizerId)] !== 'organizer') {
                throw new Error('Permission denied. Only organizers can approve join requests.');
            }

            // Kiểm tra xem userId có tồn tại trong danh sách yêu cầu chờ duyệt không
            if (!chat.pending.includes(userId)) {
                throw new Error('User join request not found');
            }

            // Xóa userId khỏi danh sách yêu cầu chờ duyệt và thêm vào danh sách thành viên
            chat.pending = chat.pending.filter(id => id.toString() !== userId);
            chat.members.push(userId);

            // Lưu thay đổi vào cơ sở dữ liệu
            await chat.save();

            resolve({ message: 'Join request approved successfully' });
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
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
