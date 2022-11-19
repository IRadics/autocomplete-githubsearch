import mergeWith from "lodash/mergeWith";
import isArray from "lodash/isArray";

/**
 * Recursively merges object properties of the source object to the target object
 * @param target
 * @param source
 * @param arrayKeysToMerge keys of those arrays which should not be overwritten, but merged with the source object's array with the same key
 * @returns object
 */
export default function mergeResponses(
  target: object,
  source: object,
  arrayKeysToMerge: string[] = []
) {
  return mergeWith(target, source, (objValue, srcValue, key) => {
    if (isArray(objValue) && arrayKeysToMerge.includes(key)) {
      return objValue.concat(srcValue);
    }
  });
}
