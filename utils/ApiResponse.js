class ApiResponse {
    constructor(
        message= ' success',
        statuscode,
        data 
    ){
        this.message = message,
        this.statuscode= statuscode,
        this.data= data,
        this.success = statuscode < 400
    }
}

export default ApiResponse