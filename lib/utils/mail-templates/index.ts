
import fs from 'fs';
import path from 'path';
import sendMail from '../mail-sender';

function readTemplate(type: string) {
  return fs.readFileSync(path.join(__dirname, `/${type}.html`), 'utf8');
}

async function sendEmailTemplate(template: string, to: string, subject: string, ) {
  const html = readTemplate(template);
  await sendMail(to, subject, html);
}

export default sendEmailTemplate;
