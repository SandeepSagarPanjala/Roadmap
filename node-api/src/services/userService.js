// This acts as your mock database / data layer
// In a real application, this is where you'd use Mongoose or Entity Framework Core equivalent

const users = [
  {
    id: 1,
    name: "Sandeep",
    username: "sandeep",
    password: "$2b$10$X8m1D5/e6iN9wO9G5DpwFOWZJ1b7K7ZkK1h0oZ8B1fXQO4l9w5M1S",
  }, // test1234
  {
    id: 2,
    name: "John",
    username: "john",
    password: "$2b$10$X8m1D5/e6iN9wO9G5DpwFOWZJ1b7K7ZkK1h0oZ8B1fXQO4l9w5M1S",
  },
  {
    id: 3,
    name: "Jane",
    username: "jane",
    password: "$2b$10$X8m1D5/e6iN9wO9G5DpwFOWZJ1b7K7ZkK1h0oZ8B1fXQO4l9w5M1S",
  },
];

export const getAllUsers = () => {
  // Omit passwords when returning all users
  return users.map(({ password, ...user }) => user);
};

export const getUserById = (id) => {
  const user = users.find((x) => x.id === parseInt(id));
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const getUserByUsername = (username) => {
  return users.find((x) => x.username === username);
};

export const addUser = (name, username, hashedPassword) => {
  const user = {
    id: users.length + 1,
    name: name,
    username: username,
    password: hashedPassword,
  };
  users.push(user);
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
