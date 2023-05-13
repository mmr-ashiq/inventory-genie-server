const maxCookieAge = 24 * 3 * 60 * 60 * 1000; // 3 days

export const cookieOptions = (expiry = new Date(Date.now() + maxCookieAge)) => {
  const options = {
    secure: true,
    sameSite: 'None',
    httpOnly: true,
    expires: expiry,
  };

  return options;
};
