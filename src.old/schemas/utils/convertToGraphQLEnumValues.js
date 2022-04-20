module.exports = (enumToConvert) => ({
    ...Object.entries(enumToConvert)
        .reduce((obj, [field]) => ({
            ...obj,
            [field]: {
                value: field
            }
    }), {})
});
