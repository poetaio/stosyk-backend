module.exports = {
    association: "user",
    attributes: [],
    include: {
        association: "account",
        attributes: ["login"],
    },
}