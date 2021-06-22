export async function LogoutRoute(req, res) {
  req.logOut();
  res.send("ok");
}
