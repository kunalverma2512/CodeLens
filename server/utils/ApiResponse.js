class ApiResponse {
  constructor(success, message, data = null) {
    this.success = success;
    this.message = message;
    if (data !== null) {
      this.data = data;
    }
  }

  static success(message, data = null) {
    return new ApiResponse(true, message, data);
  }

  static error(message, data = null) {
    return new ApiResponse(false, message, data);
  }

  static paginated(message, items, page, limit, totalItems) {
    const totalPages = Math.ceil(totalItems / limit);
    return new ApiResponse(true, message, {
      items,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalItems: parseInt(totalItems, 10),
        totalPages
      }
    });
  }
}

export default ApiResponse;
