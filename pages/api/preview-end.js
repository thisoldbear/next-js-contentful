export default function handler(req, res) {
  // Clears the preview mode cookies.
  // This function accepts no arguments.
  res.clearPreviewData();

  const { slug } = req.query;

  res.redirect(`/${slug}`);
}
