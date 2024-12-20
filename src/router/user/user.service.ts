import { Blog, User } from '../../database/models';
import bcrypt from 'bcrypt';
import { myCustomLabels } from '../../constant';
import { statusBlogEnum } from '../../database/models/enum';
class UserService {
    _constructor() {
    }
    async getUsers(page=1 , limit=1000) {
        try {
         
              const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                // select: User.publicFields(),
                select: '_id firstName lastName email gender phone dayOfBirth profileImage isActive roleName createdAt updatedAt',
                myCustomLabels,
              };  

            const users = await User.paginate({ deleted: false}, options, function (err, result) {
                if (err) throw new Error('Error');
                return result;
              });
            return users;
        } catch(error) {
            throw error;
        }
    }
    async isAdmin(id) {
            const user =await User.findById({_id:id,deleted:false});
            if(!user) throw new Error('User not found');
            if(user.roleName == 'ADMIN' || user.roleName == 'MODERATOR') return true;
            return false;
    }
    
    async updateUser(idToken, id, body) {    
        try {
            if (idToken == id || await this.isAdmin(idToken)) {
                const user = await User.findOne({ _id: id, deleted: false }).select('_id firstName lastName email gender phone dayOfBirth profileImage isActive roleName createdAt updatedAt');
                if (!user) throw new Error('User not found');
                
                
                user.set(body);
                const updatedUser = await user.save(); 
    
                return updatedUser;
            } else {
                throw new Error('You are not allowed to edit this user');
            }
        } catch (error) {
            throw error;
        }
    }
    
    async deleteUser(id) {
        try {
            const user = await User.findById({_id:id,deleted:false});
            if(!user) throw new Error('User not found');
            // await user.set({deleted:true});
            // await user.save();
            user.delete();
            return
        } catch(error) {
            throw error;
        }
    }
    async changeStatus(id, isActive) {
        try {
            const user = await User.findById({_id:id,deleted:false});
            if(!user) throw new Error('User not found');
            await user.set({isActive:isActive});
            await user.save();
        } catch(error) {
            throw error;
        }
    }
    async getUserById(id) {
        try {
            const user = await User.findById({_id:id,deleted:false}).select('-passwordResetToken -password');
            if(!user) throw new Error('User not found');
            return user;
        } catch(error) {
            throw error;
        }
    }
    async changeRole(id, role) {
        try {
            const user = await User.findById({_id:id,deleted:false});
            if(!user) throw new Error('User not found');
            await user.set({role:role});
            await user.save();
        } catch(error) {
            throw error;

        }
    }
    async changeAvatar(id, avatar) {
        const user = await User.findById({_id:id,deleted:false});
        if(!user) throw new Error('User not found');
        await user.set({profileImage:avatar});
        await user.save();
    }
    
    async changePassword(userId, password, newPassword) {
        try {
            const user = await User.findOne({ _id: userId, deleted: false });
            if (user === null) {
                throw new Error("Email not exists");
            }
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                throw Error("Password not match");
            }
            const salt = bcrypt.genSaltSync(10);
            const hashPasswordUser = bcrypt.hashSync(newPassword, salt);
            await user.set({ password: hashPasswordUser });
            await user.save();
            return;
        } catch (error) {
            throw error;
        }
    }
    async getBlogsByUserId(id, page=1, limit=1000) {
        try {
            const options = {
                page,
                limit,
                populate: { path: 'userId' , select:'_id firstName lastName email gender phone dayOfBirth profileImage isActive roleName createdAt updatedAt' },
                sort: { createdAt: -1 },
                select: 'category title content blogImage reaction createdAt updatedAt',
                myCustomLabels,
            };
            return await Blog.paginate({ userId: id, deleted: false,status: statusBlogEnum.APPROVED }, options, function (err, result) {
                if (err) throw new Error('Error');
                return result;
            });
        } catch(error) {
            throw error;
        }
    }
}
export default new UserService();