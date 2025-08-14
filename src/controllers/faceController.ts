import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Code not provided" });
  }

  try {
    // Troca o code pelo token de acesso
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
      `client_id=${process.env.FACEBOOK_CLIENT_ID}&` +
      `client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&` +
      `redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&` +
      `code=${code}`
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error.message });
    }

    const accessToken = tokenData.access_token;

    // Usa o token para pegar os dados do usuário
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
    );

    const userData = await userResponse.json();

    if (userData.error) {
      return res.status(400).json({ error: userData.error.message });
    }

    // Aqui você pode salvar userData no banco, criar ou buscar o usuário

    return res.status(200).json({ user: userData, token: accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
