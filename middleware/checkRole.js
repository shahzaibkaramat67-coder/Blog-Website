const checkUserRole = function(userRole){
   return function(req, res, next){
       if (!req.user || !userRole.includes(req.user.role)) {

        return res.status(403).json({message : 'Access Denied'})
        
       }
       next();
    }
}
export default checkUserRole;