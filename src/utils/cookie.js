const maxCookieAge = 24 * 3 * 60 * 60 * 1000;

export const cookieOptions = (expiry = new Date(Date.now() + maxCookieAge)) => {
  const options = {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    expires: expiry,
  };

  return options;
};
