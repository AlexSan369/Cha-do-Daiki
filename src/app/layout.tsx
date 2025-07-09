// Caminho: src/app/layout.tsx
import type { Metadata } from "next";
// Importando a fonte Nunito, que é estável
import { Nunito } from "next/font/google";
import "./globals.css";

// Configurando a fonte Nunito
const nunito = Nunito({
  subsets: ["latin"],
  weight: ['400', '700', '800'], // Pesos que usamos no site
  variable: '--font-nunito',     // Nome da variável CSS para a fonte
});

export const metadata: Metadata = {
  title: "Chá de Bebê do Daiki",
  description: "Participe do nosso chá de bebê e ajude a montar o ninho do Daiki!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      {/* Aplicando a classe da fonte Nunito e a classe do nosso fundo */}
      <body className={`${nunito.variable} antialiased body-background`}>
        {children}
      </body>
    </html>
  );
}