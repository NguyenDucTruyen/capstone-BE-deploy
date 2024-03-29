import { Blog,Category } from "../../database/models"
import { myCustomLabels } from "../../constant";
import { statusBlogEnum } from "../../database/models/enum";
class categoryService {

    async getCategories(slug, page, limit) {
      // Find the category with the given slug and not deleted.
      const category = await Category.findOne({ slug, deleted: false });
    
      if (!category) {
        throw new Error('Category not found or deleted');
      }
    
      const categoryId = category._id;
    
      let query = { category: categoryId, deleted: false, status: statusBlogEnum.APPROVED };
    
      if (page !== undefined && limit !== undefined) {
        // Pagination options
        const options = {
          page,
          limit,
          populate: { path: 'userId' , select:'_id firstName lastName email gender phone dayOfBirth profileImage isActive roleName createdAt updatedAt' },
          sort: { createdAt: -1 },
          myCustomLabels, // Define myCustomLabels somewhere in your code
        };
    
        const blogs = await Blog.paginate(query, options)
        console.log(blogs.docs + "aaaaaaaaaa");
        
        return { ...category.toJSON(), blogs: blogs.docs };
      } else {
        const blogs = await Blog.find(query).populate({ path: 'userId' , select:'_id firstName lastName email gender phone dayOfBirth profileImage isActive roleName createdAt updatedAt' })
        console.log(blogs + "aaaaaaaaaa");
        
        return { ...category.toJSON(), blogs };
      }
    }

    async createCategory(body) {
        const category = new Category( {
            name: body.name,
            description: body.description,
            
        })
        const categoryCreated = await Category.create(category);
        return categoryCreated;
    }
    async getListCategories() {
        const categories = await Category.find({deleted: false}).populate({ path:'parentId', select:'name slug description'} );
        return categories;
    }

}

export default new categoryService()