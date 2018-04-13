/* API base url */
export const BASE_URL = 'https://api.instagram.com/v1/';

/* media type */
export const POPULAR = 'popular';
export const TAGS = 'tags';
export const LOCATION = 'location';
export const USER = 'user';

/* resolution */
export const RESOLUTION_STANDARD = 'standard';
export const RESOLUTION_LOW = 'low';
export const RESOLUTION_THUMBNAIL = 'thumbnail';
export const FULL_RESOLUTION_PROPERTY = {
  [RESOLUTION_STANDARD]: 'standard_resolution',
  [RESOLUTION_LOW]: 'low_resolution',
  [RESOLUTION_THUMBNAIL]: 'thumbnail',
};

/* anchor target type */
export const TARGET_BLANK = '_blank';
export const TARGET_SELF = '_self';
export const TARGET_PARENT = '_parent';
export const TARGET_TOP = '_top';

/* function for getting pathname */
export const getPathname = {
  [POPULAR]: () => 'media/popular',
  [TAGS]: (tag = 'instagram') => `tags/${tag}/media/recent`,
  [LOCATION]: location => `locations/${location}/media/recent`,
  [USER]: (user = 'self') => `users/${user}/media/recent`,
};
