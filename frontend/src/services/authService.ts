import { BASE_URL } from '../constants/apiConstants'

export const login = async (username: string, password: string) => {
    const response = await fetch(`${BASE_URL}/login/validate-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    const data = await response.json()
    if (response.ok) {
        return data
    } else {
        throw new Error(data.errorMessage || 'Login failed')
    }
}

export const getUserData = async (token: string) => {
    const response = await fetch(`${BASE_URL}/login/get_user_data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    })
    const data = await response.json()
    if (response.ok) {
        return data
    } else {
        throw new Error(data.errorMessage || 'Failed to fetch user data')
    }
}
