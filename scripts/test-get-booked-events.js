import axios from 'axios';

const testGetBookedEvents = async () => {
    const url = 'http://127.0.0.1:3000/api/events/book-event/all';

    try {
        console.log('Fetching all booked events...');
        const response = await axios.get(url);
        console.log('Response Status:', response.status);

        if (response.data.data && response.data.data.length > 0) {
            const firstBooking = response.data.data[0];
            console.log('First booking details:');
            console.log(' - ID:', firstBooking.id);
            console.log(' - Event ID:', firstBooking.event_id);
            console.log(' - Event Name:', firstBooking.event_name);

            if (firstBooking.event_name !== undefined) {
                console.log('Verification SUCCESS: event_name is present');
            } else {
                console.log('Verification FAILED: event_name is missing');
            }
        } else {
            console.log('No booked events found to verify.');
        }
    } catch (error) {
        console.error('Error fetching booked events:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
};

testGetBookedEvents();
