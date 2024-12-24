
const MESSAGES = {
    success: {
        otpSent: "OTP has been sent successfully.",
        otpVerified: "OTP has been verified successfully.",
        loginSuccess: "Logged in successfully"
    },
    error: {
        invalidEpfoCredentials: "Invalid UAN or password. Try resetting password with the mobile number registred with finright or EPFO",
        invalidOtp: "The OTP entered is invalid. Please try again.",
        correctEmail:"Please enter the correct email",
        uanInvalidLength: "UAN must be a 12-digit number.",        
        password: {
            length: "Password must be at least 8 characters long.",
            upperCase: "Password must contain at least one uppercase letter.",
            lowerCase: "Password must contain at least one lowercase letter.",
            specialCharacter: "Password must contain at least one special character."
        },
        invalidUanPassword: 'Either UAN or Password is incorrect',
        unauthorized: 'Session Expired! Please login again',
        invalidOpnLogin: 'Invalid Credentails',
        logoutError : 'Unauthorized: Session expired or invalid',
        ZOHOError: "Provide new details",
    },
    labels: {
        otp: "Enter OTP",
        resendOtp: "Resend OTP",
    },
    placeholders: {},
    required: {
        requiredField: (type) => `${type} is required.`,
    },
    api: {
        baseUrl: 'https://uat.finright.in/'
        // baseUrl: 'https://epf.finright.in/'
        // baseUrl: 'http://localhost:3001'
    }
};

export default MESSAGES;