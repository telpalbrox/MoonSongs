export class PaginatedRequest {
    constructor(public page: number = 1, public limit: number = 20) { }

    get offset() {
        return this.limit * (this.page - 1);
    }
}
