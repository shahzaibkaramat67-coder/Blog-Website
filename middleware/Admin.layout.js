const AdminDashboardLayout = (req, res, next) => {
  res.locals.layout = "Admin.Dashbord/layout";
  next();
};

export default AdminDashboardLayout
