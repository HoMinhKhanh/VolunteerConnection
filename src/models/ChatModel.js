const mongoose = require('mongoose');

// Định nghĩa Enum cho các loại và vai trò của cuộc trò chuyện
const chatTypes = ['group', 'private'];


const chatSchema = new mongoose.Schema(
    {
        // Loại cuộc trò chuyện: group hoặc private
        type: { type: String, enum: chatTypes,default : 'private', required: true },

        // Danh sách các thành viên tham gia cuộc trò chuyện
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

        // ten doan chat
        
        nameGruop : {type : String},
        //quan tri vien
        administrators : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
       
        lastMess: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // ID của tin nhắn cuối cùng trong cuộc trò chuyện
        avatar : {type : String},
        pending: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Danh sách các yêu cầu chờ duyệt
    },
    { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
