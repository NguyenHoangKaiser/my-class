import Roles from "src/utils/constants";

const mockUsers = {
  teacher: {
    id: "al814zcy82344hldsgadrg1mv",
    name: "Teacher Hoang",
    role: Roles.Teacher,
    email: "teacherhoang@example.com",
    image: null,
  },
  student: {
    id: "bl814zcy82344hldsgadrg1mv",
    name: "Student Huy",
    role: Roles.Student,
    email: "studenthuy@example.com",
    image: null,
  },
  unauthenticated: null,
};

export const getMockUser = (role: Roles) => {
  return mockUsers[role];
};
