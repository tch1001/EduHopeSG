import * as Yup from "yup";

Yup.addMethod(Yup.string, "password", function (
    options = { minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    errorMessage = "Password must have at least 1 lowercase, 1 uppercase, 1 number and 1 symbol/special character"
) {
    return this.test("password-strength", errorMessage, function (password) {
        const { minLowercase, minUppercase, minNumbers, minSymbols } = options;

        const lowercaseRegex = /[a-z]/g;
        const uppercaseRegex = /[A-Z]/g;
        const numbersRegex = /[0-9]/g;
        const symbolsRegex = /[^a-zA-Z0-9]/g;

        const lowercaseCount = (password.match(lowercaseRegex) || []).length;
        const uppercaseCount = (password.match(uppercaseRegex) || []).length;
        const numbersCount = (password.match(numbersRegex) || []).length;
        const symbolsCount = (password.match(symbolsRegex) || []).length;

        return (
            lowercaseCount >= minLowercase &&
            uppercaseCount >= minUppercase &&
            numbersCount >= minNumbers &&
            symbolsCount >= minSymbols
        );
    })
});

export default Yup;