import bcrypt = require('bcrypt');

export class User {
    public constructor(
        private _uuid: string,
        private _userName: string,
        private _password: string,
        newUser: boolean = false
    ) {
        if(newUser) {
            if(!this._password.trim()) {
                throw new Error('Invalid user password');
            }
            this.password = bcrypt.hashSync(_password.trim(), 8);
        }
    }
    
    comparePassword(password: string) {
        return bcrypt.compareSync(password, this.password)
    }
    
    getTokenInfo() {
        return {
            userName: this.userName,
            uuid: this.uuid
        };
    }

    set userName(userName: string) {
        this._userName = userName;
    }

    get userName() {
        return this._userName;
    }
    
    set password(password: string) {
        this._password = password;
    }
    
    get password() {
        return this._password;
    }

    set uuid(uuid: string) {
        this._uuid = uuid;
    }

    get uuid() {
        return this._uuid;
    }
}
