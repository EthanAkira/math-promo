import { readManifest, jsonResponse, CORS_HEADERS } from './_shared.js';
import { getArchiveItemsBySubject } from '../_archive.js';

export async function onRequestGet({ env }) {
  const manifest = await readManifest(env.AMC_FILES);
  const tags = await getArchiveItemsBySubject(env.DB, 'amc');
  const tagByKey = new Map(tags.map((row) => [row.file_key, row]));

  for (const yearEntries of Object.values(manifest)) {
    for (const entry of yearEntries) {
      for (const variant of entry.variants) {
        for (const file of Object.values(variant.files)) {
          const tag = tagByKey.get(file.key);
          if (tag) {
            file.meta = {
              contentType: tag.content_type,
              unitTag: tag.unit_tag,
              accessTier: tag.access_tier,
              solutionMethod: tag.solution_method,
              sourceItemId: tag.source_item_id,
            };
          }
        }
      }
    }
  }

  return jsonResponse(manifest);
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
