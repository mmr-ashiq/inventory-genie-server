const maxCookieAge = 24 * 3 * 60 * 60 * 1000;

const cookieOptions = (expiry = new Date(Date.now() + maxCookieAge)) => {
  const options = {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    expires: expiry,
    domain: process.env.NODE_ENV === 'development' ? 'localhost' : '',
  };

  return options;
};

module.exports = cookieOptions;
