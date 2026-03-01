import nodemailer from 'nodemailer';

async function testEmail() {
    console.log('Starting SMTP test...');
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'info@basserahai.com',
                pass: 'Tomy#2022',
            },
            debug: true, // Enable debug output
            logger: true // Log information into console
        });

        console.log('Verifying connection configuration...');
        // Verify connection configuration
        await transporter.verify();
        console.log('Server is ready to take our messages');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: '"Baseerah AI" <info@basserahai.com>',
            to: 'mohmmedc@gmail.com', // Sending to the admin email
            subject: 'Test Email (Directly from Script)',
            text: 'Hello! If you receive this, it means the Hostinger SMTP settings are correct and working from an external script.',
            html: '<b>Hello!</b><br>If you receive this, it means the Hostinger SMTP settings are correct and working from an external script.'
        });

        console.log('Message sent successfully! Message ID: %s', info.messageId);
    } catch (error) {
        console.error('Error occurred during SMTP test:');
        console.error(error);
    }
}

testEmail();
