import { Html, Head, Main, NextScript } from 'next/document';
import type { ReactElement } from 'react';

export default function Document(): ReactElement {
  return (
    <Html>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const t = localStorage.getItem('theme') || 'dark'; document.documentElement.classList.add(t); } catch (_) {} })();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind.config = { darkMode: 'class' }`,
          }}
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=IBM+Plex+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body
        className="bg-white text-black dark:bg-black dark:text-white transition-colors duration-300"
        style={{ fontFamily: "'__IBM_Plex_Sans_ce9353','__IBM_Plex_Sans_Fallback_ce9353', sans-serif" }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
