const format = (level, message, meta) => {
  const time = new Date().toISOString();
  const base = `[${time}] [${level.toUpperCase()}] ${message}`;
  if (meta) {
    try {
      return `${base} ${JSON.stringify(meta)}`;
    } catch (_) {
      return base;
    }
  }
  return base;
};

exports.log = (message, meta) => console.log(format('log', message, meta));
exports.info = (message, meta) => console.info(format('info', message, meta));
exports.warn = (message, meta) => console.warn(format('warn', message, meta));
exports.error = (message, meta) => console.error(format('error', message, meta));