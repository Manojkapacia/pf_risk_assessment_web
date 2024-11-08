
const MESSAGES = {
    success: {
        otpSent: "OTP has been sent successfully.",
        otpVerified: "OTP has been verified successfully.",
    },
    error: {
        invalidOtp: "The OTP entered is invalid. Please try again.",
        uanInvalidLength: "UAN must be a 12-digit number.",        
        password: {
            length: "Password must be at least 8 characters long.",
            upperCase: "Password must contain at least one uppercase letter.",
            lowerCase: "Password must contain at least one lowercase letter.",
            specialCharacter: "Password must contain at least one special character."
        }
    },
    labels: {
        otp: "Enter OTP",
        resendOtp: "Resend OTP",
    },
    placeholders: {},
    required: {
        requiredField: (type) => `${type} is required.`,
    },
};

export default MESSAGES;