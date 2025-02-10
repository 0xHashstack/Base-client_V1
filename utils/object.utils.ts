/* eslint-disable @typescript-eslint/no-explicit-any */
// Define a more specific type for objects that can be merged
interface DeepMergeableObject {
	[key: string]: DeepMergeable;
}

// Define the union type for all mergeable types
type DeepMergeable = DeepMergeableObject | Array<any> | primitive;
type primitive = string | number | boolean | null | undefined;

/**
 * Type guard to check if value is a mergeable object (not an array)
 */
function isMergeableObject(value: unknown): value is DeepMergeableObject {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Deeply merges multiple objects or arrays
 * @param target The target object to merge into
 * @param sources Array of source objects to merge from
 * @returns The merged result
 */
export function customMerge<T extends DeepMergeableObject | Array<any>>(
	target: T,
	...sources: Array<DeepMergeableObject | Array<any>>
): T {
	if (!sources.length) return target;

	const source = sources.shift();
	if (source === undefined) return target;

	if (isMergeableObject(target) && isMergeableObject(source)) {
		Object.keys(source).forEach((key) => {
			const sourceValue = source[key];
			if (isMergeableObject(sourceValue)) {
				if (!target[key] || !isMergeableObject(target[key])) {
					target[key] = {} as DeepMergeable;
				}
				customMerge(target[key] as DeepMergeableObject, sourceValue);
			} else if (Array.isArray(sourceValue)) {
				if (!target[key] || !Array.isArray(target[key])) {
					target[key] = [] as DeepMergeable;
				}
				customMerge(target[key] as Array<any>, sourceValue);
			} else {
				target[key] = sourceValue;
			}
		});
	} else if (Array.isArray(target) && Array.isArray(source)) {
		source.forEach((item, index) => {
			if (
				isMergeableObject(item) &&
				target[index] &&
				isMergeableObject(target[index])
			) {
				customMerge(target[index], item);
			} else {
				target[index] = item;
			}
		});
	}

	return customMerge(target, ...sources);
}
