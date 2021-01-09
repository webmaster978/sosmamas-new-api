
const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

module.exports = ({
    async user(root, { id }, { user, models }) {
        // if (!user) {
        //     throw new Error('Unauthenticated!');
        // }
        const data = models.User.findOne({ where: { id: id } });
        if (data) {
            return data;
        } else {
            return null;
        }
    },
    async phoneVerification(root, args , { models }) {
        const data = await models.User.findOne({ where: { phone: args.phone } });
        return data === null;
    },
    async users(root, args, { user, models }) {
        // if (!user) {
        //     throw new Error('Unauthenticated!');
        // }
        const data = models.User.findAll();
        if (data) {
            return data;
        } else {
            return null;
        }
    },
    async periode(root, { id }, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Periode.findOne({ where: { id: id } })
    },
    async allPeriodes(root, args, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Periode.findAll()
    },
    async conseil(root, { id }, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Conseil.findOne({ where: { id: id } })
    },
    async allConseil(_, args, { models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Conseil.findAll()
    },
    async symptome(_, { id }, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Symptome.findOne({ where: { id: id } })
    },
    async allSymptome(root, args, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        return models.Post.findAll()
    },
    async post(_, { id }, { user, models }) {
        if (!user) {
            throw new Error('Unauthenticated!');
        }
        const post = await models.Post.findOne({ where: { id: id } });
        console.log(post);
        return post;
    },
    async postResult(_, args, { user, models }) {
        // if (!user) {
        //     throw new Error('Unauthenticated!');
        // }
        const { limit, offset } = getPagination(args.page, args.size);
        const data = await models.Post.findAndCountAll({
            offset: offset, limit: limit,
            order: [['createdAt', 'DESC']]
        });
        const { count: totalItems, rows: posts } = data;
        const currentPage = (args.page ? +args.page : 0) + 1;
        const totalPages = Math.ceil(totalItems / limit);
        const hasMore = currentPage < totalPages;
        const responseData = { totalItems, totalPages, currentPage, hasMore, posts };
        return responseData;
    },
    async tag(_, { id }, { user, models }) {
        // if (!user) {
        //     throw new Error('Unauthenticated!');
        // }
        return models.PostTag.findOne({ where: { id: id } })
    },
    async tags(_, args, { user, models }) {
        // if (!user) {
        //     throw new Error('Unauthenticated!');
        // }
        return models.PostTag.findAll()
    },
    async comments(_, { postId }, { user, models }) {
        // if (!user) {
        //     throw new Error('Unauthenticated!');
        // }
        return models.Comment.findAll({
            where: { postId: postId },
        })
    },
})
