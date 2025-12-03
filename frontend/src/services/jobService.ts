import { BASE_URL } from '../constants/apiConstants'
import { removeToken } from '../utils/token'

const handleResponse = async (response: Response) => {
    const data = await response.json()
    if (response.ok) {
        return data
    } else {
        if (data.errorMessage === 'NAVIGATE TO LOGIN') {
            removeToken()
            window.location.replace('/login')
            throw new Error('Session expired, redirecting to login...')
        }
        throw new Error(data.errorMessage || 'Failed to fetch data')
    }
}

export const getJobsList = async (token?: string, minimumSalary?: number, employmentType?: string[], searchRoleName?: string, page_number: number = 1, page_size: number = 10) => {
    const response = await fetch(`${BASE_URL}/dashboard/get-jobs-list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, minimumSalary, employmentType, searchRoleName, page_number, page_size }),
    })
    return handleResponse(response)
}

export const getJobDetails = async (token?: string, jobId?: string) => {
    const response = await fetch(`${BASE_URL}/dashboard/get-job-details`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, jobId }),
    })
    return handleResponse(response)
}

export const getSimilarJobs = async (token?: string, jobId?: string) => {
    const response = await fetch(`${BASE_URL}/dashboard/get-similar-jobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, jobId }),
    })
    return handleResponse(response)
}


