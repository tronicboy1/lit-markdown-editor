/**
 * Loads a custom element if it is not already registered.
 *
 * @returns {void}
 */
export const loadComponent = <T extends CustomElementConstructor>(tagName: string, elementDefinition: T) => {
  if (window.customElements.get(tagName)) return;
  customElements.define(tagName, elementDefinition);
};

export const generateRandomText = () => Math.random().toString(24).substring(4, 10);

export const readFileAsDataString = (file: File | Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const { result } = reader;
      if (typeof result !== "string") throw TypeError();
      resolve(result);
    });

    reader.addEventListener("error", () => reject(reader.error));

    reader.readAsDataURL(file);
  });
