import { Blog, Category } from "../../database/models"
import { myCustomLabels } from "../../constant";
import { statusBlogEnum } from "../../database/models/enum";
class categoryService {

  async getCategories(slug, page = 1, limit = 5) {
    const category = await Category.findOne({ slug, deleted: false });
    console.log("query trong:", page, limit)
    if (!category) {
      throw new Error('Category not found or deleted');
    }

    const categoryId = category._id;

    let query = { category: categoryId, deleted: false, status: statusBlogEnum.APPROVED };
    const options = {
      page,
      limit,
      populate: { path: 'userId', select: '_id firstName lastName email gender phone dayOfBirth profileImage isActive roleName createdAt updatedAt' },
      sort: { createdAt: -1 },
      myCustomLabels,
    };

    const blogs = await Blog.paginate(query, options)
    console.log("get category paginate result:", blogs)
    const { docs, ...rest } = blogs;
    return { ...category.toJSON(), blogs: docs, ...rest };
  }

  async createCategory(body) {
    const category = new Category({
      name: body.name,
      description: body.description,

    })
    const categoryCreated = await Category.create(category);
    return categoryCreated;
  }
  async getListCategories() {
    const categories = await Category.find({ deleted: false }).populate({ path: 'parentId', select: 'name slug description' });
    return categories;
  }

}

export default new categoryService()