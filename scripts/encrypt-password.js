import bcrypt from 'bcryptjs';

const password = 'Maina@254';

async function encryptPassword() {
    try {
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        console.log('\n=================================');
        console.log('Password Encryption Result');
        console.log('=================================');
        console.log('Original Password:', password);
        console.log('Encrypted Hash:', hashedPassword);
        console.log('=================================\n');
    } catch (error) {
        console.error('Error encrypting password:', error);
    }
}

encryptPassword();
