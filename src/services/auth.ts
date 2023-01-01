import axios from "axios";

export const getToken = async ({
    name,
    phone_number,
    identifier,
    password
}) => {
    // Get Refresh Token
    let refreshToken = null;
    const resRefreshToken = await axios.post(
        `http://localhost:3002/auth/refresh-token`,
        {
            name,
            phone_number,
            identifier,
            password,
        }
    );

    refreshToken = resRefreshToken.data.refreshToken;

    // Use Refresh token to get Token
    let token = null;

    const resToken = await axios.post(`http://localhost:3002/auth/token`, {
        refreshToken,
    });
    token = resToken.data.token;

    return token;
}

export const generate2FACode = async (phone_number: string) => {
    try {

        const response = await axios.post(`http://localhost:3002/auth/generate-2fa-code`, {
            phone_number
        });

        return true;

    } catch (err) {

        return false;

    }
};

export const validate2FA = async (phone_number: string, verification_code: string) => {

    try {

        const response = await axios.post(`http://localhost:3002/auth/validate-2fa`, {
            verification_code, phone_number
        });

        return true;

    } catch (err) {

        return false;

    }

};