const sequelize = require('sequelize');
const Op = sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 4;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

module.exports = ({
    async user(_, { id }, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        const data = await models.User.findOne({ where: { id: id } });
        if (data) {
            return data;
        } else {
            return null;
        }
    },
    async phoneVerification(_, args, { models }) {
        const data = await models.User.findOne({ where: { phone: args.phone } });
        return data === null;
    },
    async users(_, args, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }

        const { limit, offset } = getPagination(args.page, args.size);
        const data = await models.User.findAndCountAll({
            // where: {
            //     [Op.or]: {
            //         phone: { [Op.substring]: args.query || '' } || '',
            //     }
            // },
            include: [{
                model: models.Profile,
                where: {
                    [Op.or]: {
                        firstName: { [Op.substring]: args.query || '' },
                        lastname: { [Op.substring]: args.query || '' },
                        name: { [Op.substring]: args.query || '' },
                        gender: { [Op.substring]: args.query || '' },
                        address: { [Op.substring]: args.query || '' },
                    }
                }
            }],
            offset: offset, limit: limit,
            order: [['createdAt', 'DESC']],
        });
        const { count: totalItems, rows: users } = data;
        const currentPage = (args.page ? +args.page : 0) + 1;
        const totalPages = Math.ceil(totalItems / limit);
        const hasMore = currentPage < totalPages;
        const responseData = { totalItems, totalPages, currentPage, hasMore, users };
        return responseData;
    },
    async periode(_, { id }, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Periode.findOne({ where: { id: id } })
    },
    async periodes(_, __, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Periode.findAll()
    },
    async conseil(_, args, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Conseil.findOne({ where: { id: args.id } })

    },
    async conseils(_, __, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Conseil.findAll();
    },
    async conseilItems(_, args, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.ConseilItem.findAll({ where: args });
    },
    async symptome(_, { id }, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Symptome.findOne({ where: { id: id } })
    },
    async symptomes(root, args, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Symptome.findAll({ where: args })
    },
    async post(_, { id }, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        const post = await models.Post.findOne({ where: { id: id } });
        return post;
    },
    async postResult(_, args, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }

        const { limit, offset } = getPagination(args.page, args.size);
        const data = await models.Post.findAndCountAll({
            where: { 
                [Op.or]: { tagId: args.tagId || { [Op.ne]: null } },
                [Op.or]: {
                    title: { [Op.substring]: args.query || '' },
                    body: { [Op.substring]: args.query || '' }
                }
            },
            attributes: [`id`, `title`, `body`, `tagId`, `authorId`, `status`, `createdAt`, `updatedAt`],
            offset: offset, limit: limit,
            order: [['createdAt', 'DESC']],
        });

        const { count: totalItems, rows: posts } = data;
        const currentPage = (args.page ? +args.page : 0) + 1;
        const totalPages = Math.ceil(totalItems / limit);
        const hasMore = currentPage < totalPages;
        const responseData = { totalItems, totalPages, currentPage, hasMore, posts };
        return responseData;
    },
    async tag(_, { id }, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.PostTag.findOne({ where: { id: id } })
    },
    async tags(_, args, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.PostTag.findAll()
    },
    async comments(_, { postId }, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Comment.findAll({
            where: { postId: postId },
            order: [['createdAt', 'DESC']]
        })
    },
    async showDashboard(_, args, { models }) {
        return await models.Comment.count()
    },
})
