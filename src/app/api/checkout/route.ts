// Caminho: src/app/api/checkout/route.ts
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    // Recebendo o nome do doador do front-end
    const { title, unit_price, quantity, donor_name } = await req.json();

    if (!title || !unit_price || !quantity || !donor_name) {
      return NextResponse.json({ message: 'Dados da requisição ausentes' }, { status: 400 });
    }
    
    // 1. Salva uma "intenção de doação" no Firebase
    const donationRef = await addDoc(collection(db, "doacoes"), {
        nomeDoador: donor_name,
        valor: Number(unit_price),
        status: 'pendente',
        createdAt: serverTimestamp()
    });

    // 2. Cria a preferência de pagamento no Mercado Pago
    const preferenceBody = {
      body: {
        items: [
          {
            id: 'presente-daiki',
            title,
            unit_price: Number(unit_price),
            quantity: Number(quantity),
            currency_id: 'BRL' as const,
          },
        ],
        // 3. Adiciona o ID do nosso documento do Firebase como referência externa
        external_reference: donationRef.id,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/`,
          failure: `${process.env.NEXT_PUBLIC_URL}/`,
          pending: `${process.env.NEXT_PUBLIC_URL}/`,
        },
        auto_return: 'approved' as const,
        binary_mode: true,
      }
    };

    const preference = new Preference(client);
    const result = await preference.create(preferenceBody);

    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (err) {
    console.error('Mercado Pago error →', err);
    const msg = err instanceof Error ? err.message : 'Erro desconhecido ao criar preferência';
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}