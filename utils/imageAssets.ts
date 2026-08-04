const LOCAL_IMAGE_PREFIX = '/assets/img/';
const RASTER_IMAGE_PATTERN = /\.(?:jpe?g|png|webp)$/i;

export function getThumbnailPath(source?: string) {
  if (
    !source ||
    !source.startsWith(LOCAL_IMAGE_PREFIX) ||
    source.startsWith(`${LOCAL_IMAGE_PREFIX}thumbnails/`) ||
    !RASTER_IMAGE_PATTERN.test(source)
  ) {
    return source || '';
  }

  return source
    .replace(LOCAL_IMAGE_PREFIX, `${LOCAL_IMAGE_PREFIX}thumbnails/`)
    .replace(RASTER_IMAGE_PATTERN, '.webp');
}
