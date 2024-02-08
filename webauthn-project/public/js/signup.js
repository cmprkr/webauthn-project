document.getElementById('signup').addEventListener('click', async () => {
    try {
        const response = await fetch('/register/start', { method: 'POST' });
        const options = await response.json();

        // Convert challenge and user.id from Base64URL to ArrayBuffer
        options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
        options.user.id = Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0));

        // Call WebAuthn API for registration
        const credential = await navigator.credentials.create({ publicKey: options });

        // Prepare credential response to be sent to the server
        const credentialResponse = {
            id: credential.id,
            rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
            type: credential.type,
            response: {
                attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
                clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
            },
        };

        // Send credential response to server
        const verificationResponse = await fetch('/register/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentialResponse),
        });

        const verificationResult = await verificationResponse.json();
        if (verificationResult.success) {
            alert('Registration successful');
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error(error);
        alert('Error during registration');
    }
});
