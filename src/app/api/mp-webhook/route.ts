// Caminho: src/app/api/mp-webhook/route.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, increment } from 'firebase/firestore'; // Trocamos updateDoc por setDoc

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  const body = await request.json();

  if (body.type === 'payment') {
    const paymentId = body.data.id;

    try {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });
      
      if (paymentInfo.status === 'approved' && paymentInfo.transaction_amount) {
        const summaryRef = doc(db, 'arrecadacao', 'total');

        // Usamos setDoc com { merge: true } para criar o doc se não existir, ou atualizar se já existir.
        await setDoc(summaryRef, {
          valor: increment(paymentInfo.transaction_amount)
        }, { merge: true });
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}