import sharp from 'sharp';

export async function prepareLogoForPdf(buffer) {
  if (!buffer) return buffer;
  try {
    return await sharp(buffer).rotate().toBuffer();
  } catch (_) {
    return buffer;
  }
}
