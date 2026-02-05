const day = function(){

    const startDay = new Date()
    startDay.setHours(0,0,0,0)
    const endDay = new Date()
    endDay.setHours(23,59,59,999)

    return {startDay, endDay}


}
const month = function(){

    const startMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const endMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23,59,59,999)

    return{startMonth, endMonth}
}
// const Year = function(){

// }


export {
    day,
    month,
    // Year
}