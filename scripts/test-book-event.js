import axios from 'axios';

const testBookEvent = async () => {
    const url = 'http://127.0.0.1:3000/api/events/book-event';
    const data = {
        "event_id": 2,
        "first_name": "James",
        "last_name": "Maina",
        "email": "kirugjames@gmail.com",
        "phone": "0796598108",
        "payment_method": null
    };

    try {
        console.log('Sending request to book event...');
        const response = await axios.post(url, data);
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

        if (response.status === 200 && response.data.message === "Event booking was successful") {
            console.log('Verification SUCCESSFUL');
        } else {
            console.log('Verification FAILED: Unexpected response');
        }
    } catch (error) {
        if (error.response) {
            console.error('Verification FAILED: Server responded with error');
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Verification FAILED: Request error', error.message);
        }
    }
};

testBookEvent();
