import axios from "axios";



const validateRecaptcha = async (
  token: string
)=> {
  const secret = process.env.RECAPTCHA_SECRET as string;

  const res = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    new URLSearchParams({
      secret,
      response: token,
    })
  );

  return res.data;
};
export default validateRecaptcha