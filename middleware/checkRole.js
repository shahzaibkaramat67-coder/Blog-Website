const checkUserRole = function(userRole){
   return function(req, res, next){
       if (!req.user || !userRole.includes(req.user.role)) {

       return res.redirect("/Api"); // Redirect, not JSON
        
       }
       next();
    }
}
export default checkUserRole;