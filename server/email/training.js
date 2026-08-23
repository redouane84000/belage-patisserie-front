import { Resend } from 'resend'

const loginUrl = 'https://www.belagepatisserie.com/plateforme/connexion'

export async function sendTrainingPurchaseEmail({ email, firstName, courseName, amount, username, password, isNew }) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured')
  const credentials = isNew
    ? `<p><strong>Utilisateur :</strong> ${username}<br/><strong>Mot de passe :</strong> ${password}</p>`
    : '<p>Votre nouveau module a été ajouté à votre compte existant. Vos identifiants ne changent pas.</p>'
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Belage Formation <formation@belagepatisserie.com>',
    to: email,
    subject: isNew ? 'Vos accès Belage Formation' : 'Votre nouvelle formation est disponible',
    html: `<h1>Félicitations 🎉</h1><p>Votre paiement a été confirmé.</p><h2>Récapitulatif de votre commande</h2><p><strong>Formation :</strong> ${courseName}<br/><strong>Montant :</strong> ${(amount / 100).toFixed(2).replace('.', ',')} €</p>${credentials}<p><a href="${loginUrl}">Accéder à ma formation</a></p>`,
  })
}
