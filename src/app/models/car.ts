export class Car {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public price: number,
        public status: boolean,
        public createdAt: any,
        public updatedAt: any,
        public image?: string,
    ){}
}