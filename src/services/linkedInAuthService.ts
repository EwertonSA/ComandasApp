import axios from 'axios';
import { userService } from './userService.js';
import { jwtService } from './jwtService.js';
import crypto from 'crypto';

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

export async function exchangeCodeForToken(code: string) {  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: LINKEDIN_CLIENT_ID,
    client_secret: LINKEDIN_CLIENT_SECRET,
  });

  const response = await axios.post(
    'https://www.linkedin.com/oauth/v2/accessToken',
    params.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  return response.data; // { access_token, expires_in }
}
export function generateState(length = 16) {
  return crypto.randomBytes(length).toString('hex'); // string aleatória
}

const getLinkedinUser = async (accessToken: string) => {
  // Buscar dados básicos do usuário
  const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Buscar email do usuário
  const emailResponse = await axios.get(
    'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return {
    id: profileResponse.data.id,
    name: `${profileResponse.data.localizedFirstName} ${profileResponse.data.localizedLastName}`,
    email: emailResponse.data.elements[0]['handle~'].emailAddress,
  };
};

export async function authenticateLinkedinUser(code: string) {
  try {
    const tokenData = await exchangeCodeForToken(code);
    const linkedinUser = await getLinkedinUser(tokenData.access_token);

    let user = await userService.findByLinkedinId(linkedinUser.id);

    if (!user) {
      user = await userService.create({
        linkedinId: linkedinUser.id,
        name: linkedinUser.name,
        email: linkedinUser.email || '',
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
    throw new Error('Erro ao autenticar com LinkedIn');
  }
}
