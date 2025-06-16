export class User{
    constructor(
        public id: number,
        public role: string,
        public name: string,
        public lastName: string,
        public email: string,
        public password: string
    ) {}
}