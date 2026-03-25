// This acts as your mock database / data layer
// In a real application, this is where you'd use Mongoose or Entity Framework Core equivalent

const users = [
  { id: 1, name: "Sandeep" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
];

export const getAllUsers = () => {
  // We can just return the data here. The service doesn't care about HTTP requests or responses.
  return users;
};

export const getUserById = (id) => {
  return users.find((x) => x.id === parseInt(id));
};

export const addUser = (name) => {
  const user = {
    id: users.length + 1,
    name: name,
  };
  users.push(user);
  return user;
};
