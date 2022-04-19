import { resolve } from "path";

const bcrypt = require('bcrypt-nodejs');

interface User {
    username: string
    password: string
}

export class UserDB {
    users: User[]

    constructor() {
        this.users = []
    }

    create(user: User) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) { throw new Error(err) }
                bcrypt.hash(user.password, salt, null, (err, hash) => {
                    if (err) { throw new Error(err) }
                    let storedUser = { ...user }
                    storedUser.password = hash;
                    this.users.push(storedUser)
                    console.log('Adding new users to DB', storedUser)
                    resolve(storedUser)
                });
            });
        })
    }

    find(username: string): User {
        const found = this.users.find(u => u.username === username)
        return found
    }

    comparePassword(password, username) {
        const foundUser = this.users.find(u => u.username === username)
        if (!foundUser) return false
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, foundUser.password, (err, isMatch) => {
                if (err) { reject(err) }
                resolve(isMatch)
            });
        })
    }
}