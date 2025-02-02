const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
    const page = Math.abs(query.page) || 1;  // Default to page 1
    const limit = Math.abs(query.limit) || 10; // Default to limit 10
    const skip = (page - 1) * limit; // Ensure skip is non-negative

    return { skip, limit };
}


export {getPagination}