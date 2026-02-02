export const getProfile = async (req, res) => {
  const user = req.user;

  res.json({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    is_admin: user.is_admin
  });
};
