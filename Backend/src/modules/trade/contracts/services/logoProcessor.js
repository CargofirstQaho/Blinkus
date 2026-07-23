import sharp from 'sharp';

export async function prepareLogoForPdf(buffer) {
  if (!buffer) return buffer;
  try {
    // .rotate() applies EXIF orientation; .trim() removes the uniform
    // transparent/white border baked into the source logo so the visible
    // mark sits flush against the left margin instead of floating inward.
    return await sharp(buffer).rotate().trim().toBuffer();
  } catch (_) {
    // Trim can throw if the image is a single solid colour; fall back to
    // the un-trimmed (but orientation-corrected) buffer.
    try {
      return await sharp(buffer).rotate().toBuffer();
    } catch (__) {
      return buffer;
    }
  }
}
