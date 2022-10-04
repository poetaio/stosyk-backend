module.exports = (asyncIterator, onCancel) => {
    const asyncReturn = asyncIterator.return;

    asyncIterator.return = () => {
        onCancel();
        return asyncReturn ? asyncReturn.call(asyncIterator) : Promise.resolve({ value: undefined, done: true });
    };

    return asyncIterator;
};
