/** Andrea Tino - 2020 */

/**
 * Describe an object requiring clean-up.
 */
export interface Disposable {
    /**
     * Cleans up all resources owned by the object.
     */
    dispose(): void;

    /**
     * A value indicating whether the object has been disposed or not.
     */
    isDisposed: boolean;
}
