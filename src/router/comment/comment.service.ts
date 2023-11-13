import { Comment,User } from '../../database/models';
import { isActiveEnum } from '../../database/models/enum';
import { ErrorBuilder } from '../../middleware/error';
class UserService {
      constructor() {
      }
      getCommentsByIdBlog(blogId) {
            return Comment.find({blogId:blogId}).populate({ path: 'userId' ,  select: 'firstName lastName profileImage' }).populate({ path: 'reply.userId' ,  select: 'firstName lastName profileImage' });
        }  
      createComment(userId,blogId,content) {
            const user = User.findOne({_id:userId});
            if(user.isActive === isActiveEnum.BLOCKCOMMENT) 
            {
                  return new Error('User is blocked comment');
            }
            return Comment.create({userId:userId,blogId:blogId,content:content});
        }  
      async updateComment(userId, commentId, content) {
            const comment: any = await Comment.findById(commentId);
            console.log(comment.userId != userId);
            if( comment.userId != userId )
            {
                  throw new Error('User is not comment');
            }
            return Comment.updateOne({_id:commentId},{$set:{content:content}});
        }
      deleteComment(userId, commentId) {
            const comment: any = Comment.findById(commentId);
            if( comment.userId != userId )
            {
                  throw ErrorBuilder.badRequest('User is not comment');
            }
            return Comment.deleteOne({commentId});
      }
      createReply(userId,commentId,content) {
            return Comment.updateOne({_id:commentId},{$push:{reply:{userId:userId,content:content}}});
      }
}
export default new UserService();