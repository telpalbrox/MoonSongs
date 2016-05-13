import bcrypt = require('bcrypt');

export class User {
    public constructor(
        private _uuid: string,
        private _userName: string,
        private _password: string,
        private _admin: boolean = false,
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
            uuid: this.uuid,
            admin: this.admin
        };
    }
    
    toJSON() {
        return {
            userName: this.userName,
            uuid: this.uuid,
            admin: this.admin
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

    set admin(admin) {
        this._admin = admin;
    }

    get admin() {
        return this._admin;
    }
}
