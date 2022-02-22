export const DECODE_RESULT = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

export type Title = {
  before: string;
  after: string;
  pretty: string;
};

export type Tag = {
  name: string;
  href: string;
};

export type Cover = {
  source: string;

  /**
   * string of ArrayBufferSerialize
   */
  data: string;
};

export type DecodeData = {
  title: Title;
  subtitle: Title;
  cover: Cover;
  tags: Tag[];
};

export type DecodeResult =
  | { status: typeof DECODE_RESULT.SUCCESS; data: DecodeData }
  | { status: typeof DECODE_RESULT.FAILED; data: null };

export type ArrayBufferSerialize = {
  data: ArrayBufferLike;
  contentType: string;
};

export function serializeArrayBufferToJSON(
  buffer: ArrayBuffer,
  contentType: string
) {
  return JSON.stringify({
    data: Array.from(new Uint8Array(buffer)),
    contentType,
  });
}

export function deserializeArrayBufferFromJSON(jsonString: string) {
  const parsed = JSON.parse(jsonString) as ArrayBufferSerialize;
  parsed.data = new Uint8Array(parsed.data).buffer;

  return parsed;
}
