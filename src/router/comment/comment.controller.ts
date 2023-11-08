import { HttpResponseBuilder } from "../../middleware/error";

class CommentController {
   constructor() {}
   async getCommentsByBlogId(req, res) {
       res.send('getCommentsByBlogId');
   }
   async postComment(req, res) {
         res.send('postComment');
    }
    async updateComment(req, res) {
         res.send('updateComment');
    }
}

export default new CommentController();