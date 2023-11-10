import { commentService } from './index';
import { HttpResponseBuilder } from '../../middleware/error';
class CommentController {
    constructor() {
    }  
    async getComments(req, res) {
        try {
            const { blogId} = req.params;
            const data = await commentService.getCommentsByIdBlog(blogId);
            return HttpResponseBuilder.buildOK(res,data);
        } catch (error) {
            return HttpResponseBuilder.buildBadRequest(res, error);
        }
    }
    async createComment(req, res) {

        try {            
            const { blogId } = req.params;
            const  id  = req.userToken.id
            const { content } = req.body;
            console.log("userId",id + "blogId",blogId + "content",content);
            
            const data = await commentService.createComment( id, blogId, content);
            return HttpResponseBuilder.buildCreated(res,data);
        } catch (error) {
            return HttpResponseBuilder.buildBadRequest(res, error);
        }
    }
    async updateComment(req, res) {
        try {
            const { blogId } = req.params;
            const { userId } = req.userToken.id
            const { content } = req.body;
            await commentService.updateComment( userId, blogId, content);
            return HttpResponseBuilder.buildOK(res,{'message':'update comment success'});
        } catch (error) {
            return HttpResponseBuilder.buildBadRequest(res, error);
        }
    }
    async deleteComment(req, res) {
        try {
            const {  commentId } = req.params;
            await commentService.deleteComment(commentId);
            return HttpResponseBuilder.buildOK(res,{commentId});
        } catch (error) {
            return HttpResponseBuilder.buildBadRequest(res, error);
        }
    }
}

export default new CommentController();