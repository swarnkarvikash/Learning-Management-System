export function isEmail(string){
    return string.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i);
}

export function isValidPassword(string){
    return string.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]*$/);
}