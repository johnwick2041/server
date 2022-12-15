exports.getErrorMessage = (err) => {
    if(err.message.includes('Cast to ObjectId failed')) return 'Wrong ID!';
    if (err.hasOwnProperty('errors')) return Object.values(err.errors)[0].message;

    return err.message;
}