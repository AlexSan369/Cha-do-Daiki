// Caminho: src/app/api/checkout/route.ts
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse, type NextRequest } from 'next/server';
// Usando caminho relativo para máxima segurança no build
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { title, unit_price, quantity, donor_name } = await req.json();

    if (!title || !unit_price || !quantity || !donor_name) {
      return NextResponse.json({ message: 'Dados da requisição ausentes' }, { status: 400 });
    }
    
    const donationRef = await addDoc(collection(db, "doacoes"), {
        nomeDoador: donor_name,
        valor: Number(unit_price),
        status: 'pendente',
        createdAt: serverTimestamp()
    });

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
        external_reference: donationRef.id,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/?status=approved`,
          failure: `${process.env.NEXT_PUBLIC_URL}/?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_URL}/?status=pending`,
        },
        auto_return: 'approved' as const,
        binary_mode: true,
      }
    };

    // =================================================================
    // LOG DE DEPURAÇÃO ADICIONADO AQUI
    // Esta linha vai imprimir o objeto exato que estamos enviando
    // nos logs da Vercel para podermos inspecioná-lo.
    console.log("Enviando para o Mercado Pago:", JSON.stringify(preferenceBody, null, 2));
    // =================================================================

    const preference = new Preference(client);
    const result = await preference.create(preferenceBody);

    return NextResponse.json(
      { id: result.id, init_point: result.init_point },
      { status: 201 },
    );
  } catch (err) {
    console.error('Mercado Pago error →', err);
    const msg =
      err instanceof Error ? err.message : 'Erro desconhecido ao criar preferência';
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}