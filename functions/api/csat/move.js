import { readManifest, writeManifest, jsonResponse, fileKey, CORS_HEADERS } from './_shared.js';
import { getArchiveItemByFileKey, deleteArchiveItemByFileKey, upsertArchiveItem, VALID_FILE_TYPES, FILE_TYPE_TO_CONTENT_TYPE } from '../_archive.js';

const VALID_EXAM_TYPES = ['june', 'sept', 'nov', 'city-mock'];

function isValidDestinationType(type) {
  return VALID_FILE_TYPES.includes(type) || type.startsWith('solutions__');
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { password, examType, year, variantId, fileType, to } = body || {};
  if (password !== env.AMC_UPLOAD_PASSWORD) {
    return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });
  }

  const toExamType = String(to?.examType || '');
  const toYear = String(to?.year || '');
  const toVariantId = String(to?.variantId || '').trim();
  const toVariantLabel = String(to?.variantLabel || '').trim();
  const toFileType = String(to?.fileType || '');

  if (!VALID_EXAM_TYPES.includes(toExamType)) return jsonResponse({ error: 'Invalid destination exam type.' }, { status: 400 });
  if (!/^\d{4}$/.test(toYear)) return jsonResponse({ error: 'Invalid destination year.' }, { status: 400 });
  if (!toVariantId) return jsonResponse({ error: 'Missing destination variant.' }, { status: 400 });
  if (!isValidDestinationType(toFileType)) return jsonResponse({ error: 'Invalid destination file type.' }, { status: 400 });

  const manifest = await readManifest(env.AMC_FILES);
  const examYears = manifest[String(examType)];
  const yearEntry = examYears && examYears.find((entry) => entry.year === Number(year));
  const variant = yearEntry && yearEntry.variants.find((item) => item.id === variantId);
  const sourceFile = variant && variant.files[fileType];
  if (!sourceFile) return jsonResponse({ error: 'Source file not found.' }, { status: 404 });

  const oldKey = sourceFile.key || fileKey(examType, year, variantId, fileType);
  const newKey = fileKey(toExamType, toYear, toVariantId, toFileType);

  if (oldKey === newKey) return jsonResponse({ error: 'Source and destination are identical.' }, { status: 400 });

  const stored = await env.AMC_FILES.getWithMetadata(oldKey, 'arrayBuffer');
  if (!stored || !stored.value) return jsonResponse({ error: 'Stored file is missing.' }, { status: 404 });

  const destExamYears = manifest[toExamType];
  let destYearEntry = destExamYears.find((entry) => entry.year === Number(toYear));
  if (!destYearEntry) {
    destYearEntry = { year: Number(toYear), variants: [] };
    destExamYears.push(destYearEntry);
  }
  let destVariant = destYearEntry.variants.find((item) => item.id === toVariantId);
  if (!destVariant) {
    destVariant = { id: toVariantId, label: toVariantLabel || toVariantId, files: {} };
    destYearEntry.variants.push(destVariant);
  } else if (toVariantLabel) {
    destVariant.label = toVariantLabel;
  }

  const overwritten = destVariant.files[toFileType];
  if (overwritten && overwritten.key && overwritten.key !== oldKey) {
    await env.AMC_FILES.delete(overwritten.key);
    await deleteArchiveItemByFileKey(env.DB, overwritten.key);
  }

  await env.AMC_FILES.put(newKey, stored.value, { metadata: stored.metadata || {} });
  await env.AMC_FILES.delete(oldKey);

  destVariant.files[toFileType] = { key: newKey, label: sourceFile.label, filename: sourceFile.filename };

  delete variant.files[fileType];
  if (Object.keys(variant.files).length === 0) {
    yearEntry.variants = yearEntry.variants.filter((item) => item.id !== variantId);
  }
  if (yearEntry.variants.length === 0) {
    manifest[String(examType)] = examYears.filter((entry) => entry.year !== Number(year));
  }

  await writeManifest(env.AMC_FILES, manifest);

  const existingTag = await getArchiveItemByFileKey(env.DB, oldKey);
  await deleteArchiveItemByFileKey(env.DB, oldKey);
  await upsertArchiveItem(env.DB, {
    subject: 'csat',
    examType: toExamType,
    grade: existingTag ? existingTag.grade : null,
    issuer: existingTag ? existingTag.issuer : null,
    year: Number(toYear),
    variant: toVariantId,
    contentType: existingTag ? existingTag.content_type : FILE_TYPE_TO_CONTENT_TYPE[toFileType.split('__')[0]],
    solutionMethod: existingTag ? existingTag.solution_method : null,
    unitTag: existingTag ? existingTag.unit_tag : null,
    sourceItemId: existingTag ? existingTag.source_item_id : null,
    accessTier: existingTag ? existingTag.access_tier : 'free',
    title: existingTag ? existingTag.title : (toVariantLabel || toVariantId),
    fileKey: newKey,
    filename: sourceFile.filename,
  });

  return jsonResponse({ ok: true, key: newKey });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
