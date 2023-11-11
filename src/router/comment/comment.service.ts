import { Comment,User } from '../../database/models';
import { isActiveEnum } from '../../database/models/enum';
class UserService {
      constructor() {
      }
      getCommentsByIdBlog(blogId) {
            return Comment.find({blogId:blogId}).populate({ path: 'userId' ,  select: 'firstName profileImage' });
        }  
      createComment(userId,blogId,content) {
            const user = User.findOne({_id:userId});
            if(user.isActive === isActiveEnum.BLOCKCOMMENT) 
            {
                  return new Error('User is blocked comment');
            }
            return Comment.create({userId:userId,blogId:blogId,content:content});
        }  
      updateComment(userId,content) {
            return Comment.updateOne({userId:userId,},{content:content});
        }
      deleteComment(commentId) {
            return Comment.deleteOne({commentId});
      }
      createReply(userId,commentId,content) {
            return Comment.updateOne({_id:commentId},{$push:{reply:{userId:userId,content:content}}});
      }
}
export default new UserService();