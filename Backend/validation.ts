const usernameValidation = (username: string) => {
  const regex = /^[a-zA-Z0-9-_ ]{4,15}$/;
 return regex.test(username)
};

const passwordValidation = (password: string ) => {
  const regex = /^[a-zA-Z0-9]{8,20}$/
  return regex.test(password)
}
export {usernameValidation, passwordValidation}