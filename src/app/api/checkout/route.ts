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
        // --- INÍCIO DA MUDANÇA ---
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/?status=approved`, // Adicionado o aviso de sucesso
          failure: `${process.env.NEXT_PUBLIC_URL}/?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_URL}/?status=pending`,
        },
        // --- FIM DA MUDANÇA ---
        auto_return: 'approved' as const,
        binary_mode: true,
      }
    };

    const preference = new Preference(client);
    const result = await preference.create(preferenceBody);

    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (err) {
    // ... (bloco catch continua o mesmo)
  }
}