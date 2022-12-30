import Roles from "src/utils/constants";

const mockUsers = {
  teacher: {
    id: "al814zcy80074hloomogrg1mv",
    role: Roles.Teacher,
    name: "Teacher Rick",
    email: "testing@example.com",
    image: null,
  },
  student: {
    id: "bl814zcy80074hloomogrg1mv",
    role: Roles.Student,
    name: "Student Bob",
    email: "testing@example.com",
    image: null,
  },
  unauthenticated: null,
};

export const getMockUser = (role: Roles) => {
  return mockUsers[role];
};
