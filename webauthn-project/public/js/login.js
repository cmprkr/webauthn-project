document.getElementById('login').addEventListener('click', async () => {
    try {
        const response = await fetch('/login/start', { method: 'POST' });
        const options = await response.json();

        // Convert challenge from Base64URL to ArrayBuffer
        options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
        if (options.allowCredentials) {
            for (let cred of options.allowCredentials) {
                cred.id = Uint8Array.from(atob(cred.id), c => c.charCodeAt(0));
            }
        }

        // Call WebAuthn API for authentication
        const assertion = await navigator.credentials.get({ publicKey: options });

        // Prepare assertion response to be sent to the server
        const assertionResponse = {
            id: assertion.id,
            rawId: btoa(String.fromCharCode(...new Uint8Array(assertion.rawId))),
            type: assertion.type,
            response: {
                authenticatorData: btoa(String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData))),
                clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(assertion.response.clientDataJSON))),
                signature: btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature))),
                userHandle: assertion.response.userHandle ? btoa(String.fromCharCode(...new Uint8Array(assertion.response.userHandle))) : null,
            },
        };

        // Send assertion response to server
        const verificationResponse = await fetch('/login/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assertionResponse),
        });

        const verificationResult = await verificationResponse.json();
        if (verificationResult.success) {
            alert('Login successful');
        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error(error);
        alert('Error during login');
    }
});
