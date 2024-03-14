const mysql = require('mysql');

const Campaigns = async (user_name) =>{
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_NAME
        });

        console.log('USERNAME DENTRO DE CAMPAIGNS');
        console.log(user_name)
        const query = `SELECT DISTINCT campaign FROM disparos WHERE user=?`;
        const values = [user_name];
        const campaigns = [];

        connection.query(query, values, (error, results, fields) => {
            if (error) {
                console.error('Error executing query:', error);
                reject(error);
                return;
            }
            results.forEach(row => {
                campaigns.push(row.campaign);
            });
            console.log('CAMPANHAS');
            console.log(campaigns)
            connection.end((err) => {
                if (err) {
                    console.error('Error closing connection:', err);
                    reject(err);
                    return;
                }
                console.log('Connection closed successfully.');
                resolve(campaigns);
            });
        });
    });
}

const NumbersFromExcludedCampaign = async (user_name, campaign_to_exclude) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_NAME
        });

        const query = `SELECT DISTINCT target_number FROM disparos WHERE user=? AND campaign=?`;
        const values = [user_name, campaign_to_exclude];
        const blocked_numbers = [];

        connection.query(query, values, (error, results, fields) => {
            if (error) {
                console.error('Error executing query:', error);
                reject(error);
                return;
            }
            results.forEach(row => {
                blocked_numbers.push(row.target_number);
            });
            console.log('BLOCKED NUMBERS')
            console.log(blocked_numbers)
            connection.end((err) => {
                if (err) {
                    console.error('Error closing connection:', err);
                    reject(err);
                    return;
                }
                console.log('Connection closed successfully.');
                resolve(blocked_numbers);
            });
        });
    });
};

const recordCampaignOnSentMessage = async (user_name,connection_name, campaign_name, target_number)=>{
    try{
        const currentDate = new Date();

    // Format the date and time as needed for SQL (assuming MySQL format)
        const moment = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        
        const server_connection_name = user_name?.toString() + '_' + (connection_name?.replace(/\s+/g, ' ')?.trim())?.toString();

        const connection = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_NAME
        });

        connection.connect((err) => {
                if (err) {
                    console.error('Error connecting to database:', err);
                    return;
                }
                const query = `INSERT INTO disparos(moment, user, campaign, truthy_connection, target_number) VALUES (?, ?, ?, ?, ?)`;
                const values = [moment, user_name, campaign_name, server_connection_name, target_number];
                connection.query(query, values, (error, results, fields) => {
                    if (error) {
                        console.error('Error executing query:', error);
                        return;
                    }
                    // Handle successful insertion
                    console.log('Campaign saved successfully.');
                    
                    // Close the connection
                    connection.end((err) => {
                        if (err) {
                            console.error('Error closing connection:', err);
                            return;
                        }
                        console.log('Connection closed successfully.');
                    });
                });
        });
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    recordCampaignOnSentMessage, NumbersFromExcludedCampaign, Campaigns
}

