module.exports = (teacherId) =>({
    association:"teacher",
        where:{
        teacherId,
    },
    required: true,
        attributes: []
})