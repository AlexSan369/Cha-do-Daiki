// Caminho: src/app/api/checkout/route.ts
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse, type NextRequest } from 'next/server';

// Inicializa o cliente com a classe
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { title, unit_price, quantity } = await req.json();

    if (!title || !unit_price || !quantity) {
      return NextResponse.json(
        { message: 'Dados do item ausentes' },
        { status: 400 },
      );
    }
    
    // --- INÍCIO DA CORREÇÃO ---
    // Criando o corpo da preferência DENTRO de um objeto "body"
    const preferenceBody = {
      body: {
        items: [
          {
            id: 'item-id-123', // ID do item, pode ser gerado dinamicamente
            title,
            unit_price: Number(unit_price),
            quantity: Number(quantity),
            currency_id: 'BRL' as const,
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/`,
          failure: `${process.env.NEXT_PUBLIC_URL}/`,
          pending: `${process.env.NEXT_PUBLIC_URL}/`,
        },
        auto_return: 'approved' as const,
      }
    };

    const preference = new Preference(client);
    // Passando o objeto que agora contém a propriedade "body"
    const result = await preference.create(preferenceBody);
    // --- FIM DA CORREÇÃO ---

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