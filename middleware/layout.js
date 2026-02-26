const dashboardLayout = (req, res, next) => {
  res.locals.layout = "Dashbord/layout";
  next();
};

export default dashboardLayout
