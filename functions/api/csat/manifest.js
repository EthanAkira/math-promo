import { readManifest, jsonResponse, CORS_HEADERS } from './_shared.js';
import { getArchiveItemsBySubject } from '../_archive.js';

const CONTENT_TYPE_TO_FILE_TYPE = {
  problem: 'problems',
  solution: 'solutions',
  answer: 'answers',
  theory: 'theory',
  variant_problem: 'variant_problem',
  related_problem: 'related_problem',
  forecast: 'forecast',
  stats: 'stats',
};

function slotTypeFor(row) {
  const fileType = CONTENT_TYPE_TO_FILE_TYPE[row.content_type] || row.content_type;
  if (fileType === 'solutions' && row.solution_method && row.solution_method.trim()) {
    const slug = row.solution_method.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 40);
    return `solutions__${slug}`;
  }
  return fileType;
}

function ensureYearEntry(list, year) {
  let entry = list.find((item) => item.year === year);
  if (!entry) {
    entry = { year, variants: [] };
    list.push(entry);
  }
  return entry;
}

function ensureVariant(yearEntry, variantId, label) {
  let variant = yearEntry.variants.find((item) => item.id === variantId);
  if (!variant) {
    variant = { id: variantId, label: label || variantId, files: {} };
    yearEntry.variants.push(variant);
  } else if (label && variant.label === variant.id) {
    variant.label = label;
  }
  return variant;
}

// D1's archive_items table gets one atomic row per uploaded file (see upsertArchiveItem),
// so it never loses a sibling variant (e.g. 나형 dropped by a 가형 upload landing at the
// same time) the way the shared KV manifest blob can under a read-modify-write race.
// D1 is therefore treated as the source of truth for structure, with the KV blob folded
// in only for older files uploaded before D1 tagging existed (2026-09-01) and thus have
// no matching archive_items row.
export async function onRequestGet({ env }) {
  const kvManifest = await readManifest(env.AMC_FILES);
  const rows = await getArchiveItemsBySubject(env.DB, 'csat');

  const manifest = { june: [], sept: [], nov: [], 'city-mock': [] };
  const seenKeys = new Set();

  for (const row of rows) {
    const examType = row.exam_type;
    if (!manifest[examType]) continue;
    const yearEntry = ensureYearEntry(manifest[examType], row.year);
    const variantId = row.variant || '공통';
    const variant = ensureVariant(yearEntry, variantId, row.title);
    const slotType = slotTypeFor(row);
    variant.files[slotType] = {
      key: row.file_key,
      label: row.filename || slotType,
      filename: row.filename || slotType,
      meta: {
        contentType: row.content_type,
        unitTag: row.unit_tag,
        accessTier: row.access_tier,
        solutionMethod: row.solution_method,
        sourceItemId: row.source_item_id,
        grade: row.grade,
        issuer: row.issuer,
      },
    };
    seenKeys.add(row.file_key);
  }

  for (const [examType, yearEntries] of Object.entries(kvManifest)) {
    if (!manifest[examType]) manifest[examType] = [];
    for (const entry of yearEntries) {
      for (const variant of entry.variants) {
        for (const [slotType, file] of Object.entries(variant.files)) {
          if (!file || !file.key || seenKeys.has(file.key)) continue;
          const yearEntry = ensureYearEntry(manifest[examType], entry.year);
          const mergedVariant = ensureVariant(yearEntry, variant.id, variant.label);
          mergedVariant.files[slotType] = file;
        }
      }
    }
  }

  return jsonResponse(manifest);
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
