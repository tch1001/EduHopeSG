import * as Yup from "yup";

Yup.addMethod(Yup.string, "password", function (
    options = { minLowercase: 2, minUppercase: 2, minNumbers: 2, minSymbols: 2 },
    errorMessage = "Password must have at least 2 lowercase, 2 uppercase, 2 number 2 symbols/special characters"
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