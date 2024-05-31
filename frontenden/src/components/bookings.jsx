import React, { useState } from 'react';


function createBooking(bookingData) {
    fetch('/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Something went wrong');
    })
    .then(data => {
        console.log('Booking created successfully:', data);
        displayMessage('Booking created successfully!', 'success');
    })
    .catch(error => {
        console.error('Failed to create booking:', error);
        displayMessage('Failed to create booking.', 'error');
    });
}

function displayMessage(message, type) {
    // Logic to display messages on the frontend, `type` could be 'success' or 'error'
    alert(message); // For simplicity, using alert; ideally, you would update the DOM or use a notification library.
}
