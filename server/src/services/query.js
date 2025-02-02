const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query){
    const page = Math.abs(query.page);
    const limit = Math.abs(query.limit);
    const skip = (page -1) * limit;

    return {
        skip,
        limit,
    }


}

export {getPagination}