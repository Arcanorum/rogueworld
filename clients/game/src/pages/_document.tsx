import Document, {
    Html, Head, Main, NextScript,
} from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="manifest" href="/manifest.json" />

                    <meta httpEquiv="cache-control" content="max-age=0" />
                    <meta httpEquiv="cache-control" content="no-cache" />
                    <meta httpEquiv="expires" content="0" />
                    <meta httpEquiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
                    <meta httpEquiv="pragma" content="no-cache" />

                    <link rel="shortcut icon" type="image/png" href="/assets/favicon.png" />
                    <link rel="icon" sizes="192x192" href="/assets/favicon.png" />
                    <link rel="shortcut icon" href="/assets/home-icon.png" />
                    <link rel="apple-touch-icon" href="/assets/home-icon.png" />
                    <meta charSet="UTF-8" />
                    <meta httpEquiv="X-UA-Compatible" content="chrome=1, IE=9" />
                    <meta
                        name="description"
                        content="Rogueworld.io, the free to play massively multiplayer online roguelite io game. Play with and against other players to gather resources, craft items, train skills and fight monsters to clear dungeons."
                    />
                    <meta name="keywords" content="game,io,multiplayer,roguelite,MMO,dungeon,online,games,gaming" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="HandheldFriendly" content="true" />
                    <meta name="robots" content="noindex,nofollow" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                    <meta name="apple-mobile-web-app-title" content="Rogueworld.io" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui"
                    />

                    <meta property="og:title" content="Rogueworld.io" />
                    <meta property="og:url" content="https://rogueworld.io/" />
                    <meta property="og:type" content="game" />
                    <meta
                        property="og:description"
                        content="Rogueworld.io, the free to play massively multiplayer online roguelite io game. Play with and against other players to gather resources, craft items, train skills and fight monsters to clear dungeons."
                    />
                    <meta property="og:image" content="/assets/share-banner.png" />
                    <meta property="og:image:width" content="1032" />
                    <meta property="og:image:height" content="679" />

                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:site" content="@waywardworlds" />
                    <meta property="twitter:creator" content="@waywardworlds" />
                    <meta property="twitter:url" content="https://rogueworld.io/" />
                    <meta property="twitter:title" content="Rogueworld.io" />
                    <meta
                        property="twitter:description"
                        content="Rogueworld.io, the free to play massively multiplayer online roguelite io game. Play with and against other players to gather resources, craft items, train skills and fight monsters to clear dungeons."
                    />
                    <meta property="twitter:image" content="/assets/share-banner.png" />
                    <meta property="twitter:image:alt" content="A scene from the game with players fighting monsters." />

                    {/* Global site tag (gtag.js) - Google Analytics */}
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-111760957-3"></script>
                    <script dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag() { dataLayer.push(arguments); }
                            gtag("js", new Date());

                            gtag("config", "UA-111760957-3");
                        `,
                    }}
                    />
                </Head>
                <body>
                    <div id="page-load">Loading page</div>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
