import axios from 'axios'
import { userService } from './userService.js'
import { jwtService } from './jwtService.js'
import qs from 'qs';
const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID!
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET!
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI!

export async function exchangeCodeForToken(code: string) {
  const response = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
    params: {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      code,
    },
  })

  return response.data // { access_token, token_type, expires_in }
}


export async function getFacebookUser(accessToken: string) {
  const response = await axios.get('https://graph.facebook.com/me', {
    params: {
      fields: 'id,name,email',
      access_token: accessToken,
    },
  })
  return response.data // { id, name, email }
}

export async function authenticateFacebookUser(code: string) {
  try {
    const tokenData = await exchangeCodeForToken(code);
     console.log('Code recebido:', code);
    const fbUser = await getFacebookUser(tokenData.access_token);
 console.log('token recebido:', tokenData);
    let user = await userService.findByFacebookId(fbUser.id);
 console.log('fbuser recebido:', fbUser);
    if (!user) {
      user = await userService.create({
        instagramId: fbUser.id,
        name: fbUser.name,
        email: fbUser.email || '',
        password: '',
        role: 'user',
        phone: '',
      });
    }

    const jwt = jwtService.signToken({ id: user.id, username: user.name }, '1h');
    return { user, jwt };
  } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error('Erro da API:', error.response?.data || error.message);
  } else if (error instanceof Error) {
    console.error('Erro genérico:', error.message);
  } else {
    console.error('Erro desconhecido:', error);
  }
 throw new Error('Erro ao autenticar com Facebook' );
}
}

