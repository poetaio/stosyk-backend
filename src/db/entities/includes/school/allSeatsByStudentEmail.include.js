module.exports = (email) => ({
    association: 'student',
    attributes: [],
    required: true,
    include: {
        association: 'user',
        attributes: [],
        required: true,
        include: {
            association: 'account',
            attributes: [],
            required: true,
            where: { login: email },
        }
    }
});
