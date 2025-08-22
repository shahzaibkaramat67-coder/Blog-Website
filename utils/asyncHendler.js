const asyncHendler =  (requestHendler) =>{
   return(req, res, next) =>{
    Promise.resolve(requestHendler(req, res, next))
     .catch((error)=> next(error))
    }
}

export default asyncHendler