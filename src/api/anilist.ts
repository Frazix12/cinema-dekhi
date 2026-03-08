/**
 * Fetches the Anilist ID for a given MyAnimeList (MAL) ID.
 * This is useful because Jikan returns MAL IDs, but some streaming APIs
 * (like VidNest) require Anilist IDs to work.
 *
 * @param {number | string} malId - The MyAnimeList ID of the anime.
 * @returns {Promise<number | null>} - The Anilist ID, or null if mapping fails.
 */
export const getAnilistId = async (malId: number | string): Promise<number | null> => {
  const query = `
    query ($idMal: Int) {
      Media(idMal: $idMal, type: ANIME) {
        id
      }
    }
  `;
  const variables = { idMal: Number(malId) };

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.error("Failed to fetch Anilist ID. Status:", response.status);
      return null;
    }

    const data = await response.json();
    return data?.data?.Media?.id || null;
  } catch (error) {
    console.error("Error fetching Anilist ID:", error);
    return null;
  }
};
