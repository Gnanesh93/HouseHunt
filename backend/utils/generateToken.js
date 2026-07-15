import jwt from 'jsonwebtoken';

// Generates a JSON Web Token and sets it in an HTTP-only cookie
const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_production';
  const expires = process.env.JWT_EXPIRE || '24h';
  
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: expires
  });

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10) || 1;

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000
  });

  return token;
};

export default generateToken;
