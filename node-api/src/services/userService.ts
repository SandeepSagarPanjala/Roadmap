// This acts as your mock database / data layer
// In a real application, this is where you'd use Mongoose or Entity Framework Core equivalent

export interface User {
  id: number;
  name: string;
  username: string;
  password?: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Sandeep",
    username: "sandeep",
    password: "$2b$10$wWErQglICnIzCCNOJ3stcuFXbVo4fUVJaha3u5ygEi/mefvUFxRs6",
  }, // test1234
  {
    id: 2,
    name: "John",
    username: "john",
    password: "$2b$10$wWErQglICnIzCCNOJ3stcuFXbVo4fUVJaha3u5ygEi/mefvUFxRs6",
  },
  {
    id: 3,
    name: "Jane",
    username: "jane",
    password: "$2b$10$wWErQglICnIzCCNOJ3stcuFXbVo4fUVJaha3u5ygEi/mefvUFxRs6",
  },
];

export const getAllUsers = () => {
  // Omit passwords when returning all users
  return users.map(({ password, ...user }) => user);
};

export const getUserById = (id: string | number) => {
  const user = users.find((x) => x.id === (typeof id === 'string' ? parseInt(id, 10) : id));
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const getUserByUsername = (username: string) => {
  return users.find((x) => x.username === username);
};

export const addUser = (name: string, username: string, hashedPassword: string) => {
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
