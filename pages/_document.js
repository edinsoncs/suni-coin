import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Raleway:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-gray-900 text-gray-100" style={{ fontFamily: 'Nunito, Raleway, sans-serif' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
