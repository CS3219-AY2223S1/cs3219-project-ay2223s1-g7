import bcrypt from 'bcryptjs'

const saltRounds = 10; // Increase according to alloted processing time, saw 20k as recommended

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

export async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
}