import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    create: {
      id: "al814zcy82344hldsgadrg1mv",
      name: "Teacher Hoang",
      role: "teacher",
      email: "teacherhoang@example.com",
    },
    update: {},
    where: { email: "teacherhoang@example.com" },
  });

  await prisma.user.upsert({
    create: {
      id: "bl814zcy82344hldsgadrg1mv",
      name: "Student Huy",
      role: "student",
      email: "studenthuy@example.com",
    },
    update: {},
    where: { email: "studenthuy@example.com" },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
