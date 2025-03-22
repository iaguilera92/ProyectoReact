// hashea.js
import bcrypt from "bcrypt";

const usuario = process.argv[2];
const password = process.argv[3];

if (!usuario || !password) {
  console.error("⚠️ Debes ingresar usuario y contraseña: node hashea.js usuario password");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

console.log(`✅ Usuario: ${usuario}`);
console.log(`🔐 Hash: ${hash}`);
