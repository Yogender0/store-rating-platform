import bcrypt from "bcryptjs";

const password = "Admin@123";

const hash = bcrypt.hashSync(password, 10);
console.log("NEW HASH:", hash);
