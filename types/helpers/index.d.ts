/**
 * Loads a custom element if it is not already registered.
 *
 * @returns {void}
 */
export declare const loadComponent: <T extends CustomElementConstructor>(tagName: string, elementDefinition: T) => void;
export declare const generateRandomText: () => string;
export declare const readFileAsDataString: (file: File | Blob) => Promise<string>;
