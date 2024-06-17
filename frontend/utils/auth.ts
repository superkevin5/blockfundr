export async function isAuthChecked() {

    try {
        // Send request to backend to check authentication
        const response = await fetch(process.env.apiRoot + '/api/protected', {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            // Authentication cookie is valid, return true
            const responseData = await response.json();
            return responseData.user;
        } else {
            // Authentication cookie is not valid, return false
            return false;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

export async function login( username: String, password: String) {
    return fetch(process.env.apiRoot + '/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
}

export async function logout() {
    return fetch(process.env.apiRoot + '/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}