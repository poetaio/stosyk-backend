module.exports = {
    association: 'user',
    // attributes: [],
    required: true,
    include: {
        association: 'account',
        required: true,
    },
}