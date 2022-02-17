const { sharepriceupdatefind, sharepriceremainfind } = require("../db/query")

const canuserbuy=async(data,next)=>{
    console.log(data)
    //data.name , data.quantity ==> user
    const sharename=await sharepriceupdatefind()
    const shareremain=await sharepriceremainfind()
    if(sharename.name!=data.name)
            return "No Share Found"
    if(shareremain[data.name]<data.quantity)
            return "No Share Found"
    return next
}
module.exports={canuserbuy}