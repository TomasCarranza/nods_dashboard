export async function sendClientWebhook(clientId: string, webhookUrl: string) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        timestamp: new Date().toISOString(),
        event_type: 'client_selected'
      })
    });

    if (!response.ok) {
      throw new Error(`Error al enviar webhook: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar webhook:', error);
    throw error;
  }
} 