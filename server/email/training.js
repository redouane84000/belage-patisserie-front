import { Resend } from 'resend'

const loginUrl = 'https://www.belagepatisserie.com/plateforme/connexion'
const adminEmail = 'redouanektm@hotmail.fr'

export async function sendTrainingPurchaseEmail({ email, firstName, lastName, courseName, amount, username, password, isNew, orderReference }) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured')
  const credentials = isNew
    ? `<p><strong>Utilisateur :</strong> ${username}<br/><strong>Mot de passe :</strong> ${password}</p>`
    : '<p>Votre nouveau module a été ajouté à votre compte existant. Vos identifiants ne changent pas.</p>'
  const resend = new Resend(process.env.RESEND_API_KEY)
  const summary = `<h2>Récapitulatif de votre commande</h2><p><strong>Formation :</strong> ${courseName}<br/><strong>Montant :</strong> ${(amount / 100).toFixed(2).replace('.', ',')} €<br/><strong>Référence Stripe :</strong> ${orderReference}</p>`
  const clientEmail = {
    from: 'Belage Formation <formation@belagepatisserie.com>',
    to: email,
    subject: isNew ? 'Vos accès Belage Formation' : 'Votre nouvelle formation est disponible',
    html: `<h1>Félicitations 🎉</h1><p>Votre paiement a été confirmé avec succès.</p>${summary}${credentials}<p><a href="${loginUrl}">Accéder à ma formation</a></p>`,
  }
  const adminCredentials = isNew ? credentials : '<p>Cliente existante : aucun mot de passe n’a été modifié.</p>'
  await Promise.all([
    resend.emails.send(clientEmail),
    resend.emails.send({
      from: 'Belage Formation <formation@belagepatisserie.com>',
      to: adminEmail,
      subject: `Nouvelle commande Belage · ${courseName}`,
      html: `<h1>Nouvelle commande validée 🎉</h1><p><strong>Cliente :</strong> ${firstName} ${lastName || ''}<br/><strong>E-mail :</strong> ${email}</p>${summary}${adminCredentials}<p><a href="${loginUrl}">Ouvrir la plateforme</a></p>`,
    }),
  ])
}
