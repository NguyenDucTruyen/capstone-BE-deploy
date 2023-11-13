import { Blog, User } from "../../database/models";
import { isActiveEnum, statusBlogEnum } from "../../database/models/enum";
import { myCustomLabels } from "../../constant";
class blogService {
    constructor() {
    }
    async checkUserBlockPosting(userId) {
        const user = await User.findById(userId);
        if (user?.isActive === isActiveEnum.BLOCKPOSTING) {
            return true;
        }
        return false;
    }
    async getAllBlogs(page=1,limit=1000) {
        const options = {
            page,
            limit,
            populate: { path: 'userId' , select:'_id firstName lastName email gender phone dayOfBirth profileImage isActive roleName createdAt updatedAt' },
            sort: { createdAt: -1 },
            myCustomLabels,
        };
        const blogs = await Blog.paginate({ deleted: false, status: statusBlogEnum.APPROVED }, options, function (err, result) {
            if (err)
            throw new Error('Error');
            return result;
        });
        return blogs;
    }
    async createBlogByIdUser(userId, body) {
        console.log("aaaa" + userId);
        
        if ( !this.checkUserBlockPosting(userId) ) {
            throw new Error('User is blocked posting');
        }
        const blog = new Blog( {
            userId: userId,
            title: body.title,
            content: body.content,
            blogImage: body.blogImages,
            status: statusBlogEnum.PENDING,
        })
        const blogCreated = await Blog.create(blog);
        return blogCreated;
    }
    async updateBlogByIdUser(userId, id, body) {
        try {
            const blog = await Blog.findOne({ _id: id, deleted: false, status: statusBlogEnum.APPROVED });
    
            if (!blog) {
                throw new Error('Blog not found or not approved.');
            }
    
            if (body.title) {
                blog.title = body.title;
            }
    
            if (body.content) {
                blog.content = body.content;
            }
    
            if (body.blogImage) {
                blog.blogImage = body.blogImage;
            }
    
            if (body.reaction) {
                blog.reaction.push({
                    userId: userId,
                    reaction: body.reaction,
                });
            }

            const updatedBlog = await blog.save();
            
            return updatedBlog;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }
    
    async getBlogAwaitingApproval(page=1,limit=1000) {
        const options = {
            page,
            limit,
            populate: { path: 'userId' , select:'_id firstName lastName email gender phone dayOfBirth profileImage isActive roleName createdAt updatedAt' },
            sort: { createdAt: -1 },
            myCustomLabels,
        };
        return await Blog.paginate({ deleted: false, status: statusBlogEnum.PENDING }, options, function (err, result) {
            if (err) throw new Error('Error');
            return result;
        });
    }
    async approvedOrRejectBlog(id, status) {
        const blog = await Blog.findById(id);
        if (!blog) {
            throw new Error('Blog not found');
        }
        
        blog.status = statusBlogEnum[status];
        const blogUpdated = await blog.save();
        return blogUpdated;
    }
    async getNewestBlog(limit=100000, page=1) {
        const options = {
            page,
            limit,
            populate: { path: 'userId' , select:'_id firstName lastName email gender phone dayOfBirth profileImage isActive roleName createdAt updatedAt' },
            sort: { createdAt: -1 },
            myCustomLabels,
        };
        console.log(options);
        
        return await Blog.paginate({ deleted: false, status: statusBlogEnum.APPROVED }, options, function (err, result) {
            if (err) throw new Error('Error');
            return result;
        })  
    }
    async getPopularBlog(page=1,limit=1000) {
        const options = {
            page,
            limit,
            populate: { path: 'userId' , select:'_id firstName lastName email gender phone dayOfBirth profileImage isActive roleName createdAt updatedAt' },
            sort: { createdAt: -1 },
            myCustomLabels,
        };
        const popularBlogs = await Blog.aggregate([
            {
                $match: {
                    deleted: false,
                    status: statusBlogEnum.APPROVED
                }
            },
            {
                $addFields: {
                    reactionCount: { $size: "$reaction" }
                }
            },
            {
                $match: {
                    reactionCount: { $gt: 1 }
                }
            }
        ]);
        console.log(popularBlogs);
        
        const paginatedResult:any = await Blog.paginate({}, options);
        paginatedResult.docs = popularBlogs;
        return {
            paginatedResult
        };
    }
    async getBlogById(id) {
        const blog = await Blog.findById(id).populate('userId');
        if (!blog) {
            throw new Error('Blog not found');
        }
        return blog;
    }
}

export default new blogService();