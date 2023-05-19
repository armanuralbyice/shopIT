class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword
            ? {
                name: {
                    $regex: this.queryString.keyword,
                    $options: 'i',
                },
            }
            : {};
        this.query = this.query.find({...keyword});
        return this;
    }

    filter() {
        const copyQuery = {...this.queryString};
        const removeField = ['keyword', 'limit', 'page'];
        removeField.forEach((param) => delete copyQuery[param]);
        this.query = this.query.find(copyQuery);
        return this;
    }

    pagination(resPerPage) {
        const currentPage = Number(this.queryString.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        this.query = this.query.skip(skip).limit(resPerPage);
        return this;
    }
}

module.exports = ApiFeatures;
