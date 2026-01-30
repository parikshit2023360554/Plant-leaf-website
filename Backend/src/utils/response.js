exports.ok = (res, data = {}, status = 200) => {
  res.status(status).json({ success: true, data });
};

exports.fail = (res, error = 'Request failed', status = 400) => {
  const message = typeof error === 'string' ? error : error?.message || 'Error';
  res.status(status).json({ success: false, error: message });
};