/**
 * withId — converts a Mongoose document to a plain object with `id` set to
 * the string form of `_id`, alongside the existing `_id` (kept for anyone
 * who wants it). This matters because the frontend's local fallback data
 * (used when the backend is unreachable) uses plain string ids like
 * 'svc-hair-styling' — every consuming component just needs a consistent
 * `.id` field, not `._id`. Apply this to every list/create/update response
 * so backend-sourced and locally-sourced content are interchangeable from
 * the frontend's point of view.
 */
export function withId(doc) {
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return { ...obj, id: obj._id != null ? String(obj._id) : obj.id };
}

export function withIds(docs) {
  return docs.map(withId);
}
