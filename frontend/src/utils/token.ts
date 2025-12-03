import Cookies from 'js-cookie'

export const setToken = (token: string) => {
    Cookies.set('jwt_token', token, { expires: 30, path: '/' })
}

export const getToken = () => {
    return Cookies.get('jwt_token')
}

export const removeToken = () => {
    Cookies.remove('jwt_token', { path: '/' })
}
