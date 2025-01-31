const { createUser, getUserByGoogleId } = require('../models/user');

// Create user (if not exists) after Google authentication
const createUserAfterGoogleAuth = async (profile) => {
    try {
        const existingUser = await getUserByGoogleId(profile.id);
        if (!existingUser) {
            return await createUser(profile);
        }
        return existingUser;
    } catch (err) {
        throw new Error('Error during user creation');
    }
};

module.exports = { createUserAfterGoogleAuth };
