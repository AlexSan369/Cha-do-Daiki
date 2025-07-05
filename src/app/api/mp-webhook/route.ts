// Caminho: src/app/api/mp-webhook/route.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Usando o atalho, pois já sabemos que está configurado
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

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
        // Referência para um documento específico que guardará o total
        const summaryRef = doc(db, 'arrecadacao', 'total');

        // Atualiza o total de forma atômica
        await updateDoc(summaryRef, {
          valor: increment(paymentInfo.transaction_amount)
        });
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}