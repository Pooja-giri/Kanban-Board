// In-memory user model supporting OAuth and local authentication
const users = [];

export const User = {
  findOne: async (query) => {
    return (
      users.find((u) => {
        if (query.googleId && u.googleId === query.googleId) return true;
        if (query.githubId && u.githubId === query.githubId) return true;
        if (query.microsoftId && u.microsoftId === query.microsoftId) return true;
        if (query._id && u._id === query._id) return true;
        if (query.id && u.id === query.id) return true;
        if (query.email && u.email?.toLowerCase() === query.email?.toLowerCase()) return true;
        return false;
      }) || null
    );
  },

  create: async (userData) => {
    const newUser = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      createdAt: new Date(),
      ...userData,
    };
    users.push(newUser);
    return newUser;
  },

  findById: async (id) => {
    return users.find((u) => u._id === id || u.id === id) || null;
  },

  getAll: async () => [...users],
};

export default User;
