export async function ProfileRoute(req, res) {
  const { username } = req.user.profile;
  res.json({ username });
}
