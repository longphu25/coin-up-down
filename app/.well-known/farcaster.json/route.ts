function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    baseBuilder: {
      allowedAddresses: ["0xA60B225D55B60A1A30DA8Db294C154eaeb63A96A"]
    },
    frame: {
      ...withValidProperties({
        version: "1",
        name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
        subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
        description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
        screenshotUrls: [`${URL}/screenshot.png`],
        iconUrl: process.env.NEXT_PUBLIC_APP_ICON,
        splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
        splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
        homeUrl: URL,
        webhookUrl: `${URL}/api/webhook`,
        primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY,
        heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
        ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
        ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
        ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE,
      }),
      tags: ["prediction", "crypto", "ethereum", "game", "defi"],
      noindex: false,
    },
  });
}
