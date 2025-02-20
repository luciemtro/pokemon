export function generateOrderEmail(
  orderId: string,
  card: any[],
  totalAmount: number
) {
  const productList = card
    .map(
      (p) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #e94560; color: black;">${
            p.name
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #e94560; color: black;">${p.price.toFixed(
            2
          )} €</td>
          <td style="padding: 10px; border-bottom: 1px solid #e94560; color: black;">${
            p.quantity
          }</td>
        </tr>`
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de commande - Pokémon Store</title>
    </head>
    <body style="margin: 0; padding: 100px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1a1a2e; width: 100%;">
        <tr>
          <td align="center">
            <table role="presentation" width="600px" cellspacing="0" cellpadding="20" border="0" style="background-color: #ffffff; color: #000000; text-align: left; border-radius: 10px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #e94560;">Confirmation de votre commande #${orderId}</h2>
                  <p>Merci pour votre achat ! 🎉</p>
                </td>
              </tr>
              <tr>
                <td>
                  <table width="100%" cellspacing="0" cellpadding="10" border="0">
                    <tr>
                      <th style="text-align: left; padding-bottom: 10px;">Produit</th>
                      <th style="text-align: left; padding-bottom: 10px;">Prix</th>
                      <th style="text-align: left; padding-bottom: 10px;">Quantité</th>
                    </tr>
                    ${productList}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="text-align: right; padding: 20px;">
                  <strong>Total: ${totalAmount.toFixed(2)} €</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p>Votre commande sera traitée sous peu.</p>
                  <p>Merci pour votre confiance !</p>
                  <p><strong>L'équipe Pokémon Store</strong></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
