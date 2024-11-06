import { format } from 'date-fns';

const generateRandomAlphaNumeric = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 2; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateTransactionId = async () => {
  const randomPart = generateRandomAlphaNumeric();

  const currentDateTime = new Date();
  const formattedDateTime = format(currentDateTime, 'yyMMddHHmm');

  const transactionId = `TXMS${randomPart}${formattedDateTime}`;

  return transactionId;
};

export default generateTransactionId;
