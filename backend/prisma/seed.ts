import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

async function main() {
  console.log("🌱 Iniciando seed...");

  const existingUser = await prisma.user.findUnique({
    where: {
      email: "admin@financy.com",
    },
  });

  if (existingUser) {
    console.log("✅ Usuário padrão já existe, atualizando permissões...");
    await prisma.user.update({
      where: {
        email: "admin@financy.com",
      },
      data: {
        role: Role.admin,
      },
    });
    console.log("✅ Usuário padrão atualizado com sucesso!");
  } else {
    const hashedPassword = await hashPassword("admin123");

    const admin = await prisma.user.create({
      data: {
        fullname: "Administrador",
        email: "admin@financy.com",
        password: hashedPassword,
        role: Role.admin,
      },
    });

    console.log("✅ Usuário admin criado com sucesso!");
    console.log("📧 Email: admin@financy.com");
    console.log("🔑 Senha: admin123");
    console.log("👤 ID:", admin.id);
  }

  console.log("✨ Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
