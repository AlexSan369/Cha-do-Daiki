// Caminho: src/app/api/mp-webhook/route.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
// Adicionamos 'updateDoc' à nossa lista de importação
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });
      
      if (paymentInfo && paymentInfo.status === 'approved') {
        const donationAmount = paymentInfo.transaction_amount;
        // Pegamos de volta o ID do nosso documento que enviamos como referência
        const donationId = paymentInfo.external_reference; 

        if (donationAmount && donationId) {
          // 1. Atualiza o valor total arrecadado (essa parte já estava funcionando)
          const summaryRef = doc(db, 'arrecadacao', 'total');
          await setDoc(summaryRef, {
            valor: increment(donationAmount)
          }, { merge: true });

          // --- INÍCIO DA CORREÇÃO ---
          // 2. Atualiza o status da doação específica de 'pendente' para 'aprovado'
          const donationRef = doc(db, 'doacoes', donationId);
          await updateDoc(donationRef, {
            status: 'aprovado',
            paymentId: paymentId // Também salvamos o ID do pagamento do MP para referência
          });
          // --- FIM DA CORREÇÃO ---

          console.log(`Webhook processado: Doação ${donationId} atualizada para 'aprovado'.`);
        }
      }
    }
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}