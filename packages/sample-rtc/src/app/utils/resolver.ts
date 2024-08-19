export async function resolver<T>(
  promise: Promise<T>
): Promise<[T, null] | [null, unknown]> {
  try {
    return [await promise, null];
  } catch (err) {
    return [null, err];
  }
}
