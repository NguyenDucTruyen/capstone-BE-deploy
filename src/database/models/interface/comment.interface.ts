import { Document } from 'mongoose';
interface IComment extends Document {
    userId: object;
    blogId: object;
    content: string;
    reply: [
        {
        userId: object;
        content: string;
        createdAt: Date;
        }
    ];
    createdAt: Date;
    updateAt: Date;
}
export default IComment;