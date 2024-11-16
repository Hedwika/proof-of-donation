const PinataSDK = require('@pinata/sdk');
const fs = require('fs');

// Initialize Pinata SDK
const pinata = new PinataSDK('b3fd2f10507f52baf4ae', '36634f8d5532d523bcc6f4c9d27490fe4ef7c84ea4bb7a7cbb86377446ac2ec2');

const uploadFileToIPFS = async () => {
    const fileStream = fs.createReadStream('./metadata.json');
    const options = {
        pinataMetadata: {
            name: 'Proof of Donation Metadata',
        },
        pinataOptions: {
            cidVersion: 0,
        },
    };

    try {
        const result = await pinata.pinFileToIPFS(fileStream, options);
        console.log('File uploaded successfully:', result);
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
    }
};

uploadFileToIPFS();
