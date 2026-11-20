export async function onRequestGet() {
  const channelId = "UCx-C_nD4xjKbFBsB111bwUQ";
  const feedUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelId;

  try {
    const response = await fetch(feedUrl, {
      headers: { "User-Agent": "PIT-EKIBI-LEAGUE/1.0" },
      cf: { cacheTtl: 60, cacheEverything: true }
    });

    if (!response.ok) {
      return Response.json({ error: "YouTube feed unavailable" }, {
        status: 502,
        headers: { "Cache-Control": "no-store" }
      });
    }

    const xml = await response.text();
    const firstEntry = xml.match(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/i);
    const videoMatch = firstEntry && firstEntry[1].match(/<yt:videoId>([^<]+)<\/yt:videoId>/i);

    if (!videoMatch) {
      return Response.json({ error: "No videos found", videoId: null }, {
        status: 404,
        headers: { "Cache-Control": "public, max-age=60" }
      });
    }

    return Response.json({ videoId: videoMatch[1].trim() }, {
      headers: { "Cache-Control": "public, max-age=60" }
    });
  } catch (error) {
    return Response.json({ error: "Could not retrieve latest upload" }, {
      status: 500,
      headers: { "Cache-Control": "no-store" }
    });
  }
}
