// Caminho: src/app/api/mp-webhook/route.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';
// Usando o caminho relativo para máxima compatibilidade
import { db } from '../../../lib/firebase'; 
import { doc, setDoc, increment } from 'firebase/firestore';

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
      
      if (paymentInfo && paymentInfo.status === 'approved' && paymentInfo.transaction_amount) {
        const summaryRef = doc(db, 'arrecadacao', 'total');

        await setDoc(summaryRef, {
          valor: increment(paymentInfo.transaction_amount)
        }, { merge: true });

        console.log(`Webhook processado com sucesso para pagamento ${paymentId}`);
      }
    }
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}