require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Profile = require('./models/profile');

async function checkPhoneNumbers() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('✅ Database connected\n');

        const users = await User.find().populate('additionalDetails');
        
        console.log('📞 Phone Numbers Updated:\n');
        users.forEach(u => {
            console.log(`${u.firstName} ${u.lastName} (${u.accountType})`);
            console.log(`   📧 Email: ${u.email}`);
            console.log(`   📱 Phone: ${u.additionalDetails?.contactNumber || 'N/A'}`);
            console.log('');
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkPhoneNumbers();
