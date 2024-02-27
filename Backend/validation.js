const usernameValidation = (username) => {
    const regex = /^[a-zA-Z0-9]{4,15}$/;
    return regex.test(username);
};
const passwordValidation = (password) => {
    const regex = /^[a-zA-Z0-9]{8,20}$/;
    return regex.test(password);
};
export { usernameValidation, passwordValidation };
