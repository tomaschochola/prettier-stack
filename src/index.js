/**
 * @file
 * @author Tomáš Chochola <tomaschochola@tomaschochola.cz>
 * @copyright © 2026 Tomáš Chochola <tomaschochola@tomaschochola.cz>
 *
 * @license CC-BY-ND-4.0
 *
 * @see {@link https://creativecommons.org/licenses/by-nd/4.0/} License
 * @see {@link https://github.com/tomaschochola} GitHub Profile
 * @see {@link https://github.com/sponsors/tomaschochola} GitHub Sponsors
 */

export class PrettierConfigBuilder {
    #config;

    constructor() {
        this.#config = {
            arrowParens: 'always',
            bracketSameLine: false,
            objectWrap: 'preserve',
            plugins: [],
            proseWrap: 'never',
            semi: true,
            singleAttributePerLine: true,
            singleQuote: true,
            trailingComma: 'all',
        };
    }

    #replaceConfig(config) {
        this.#config = { ...config };

        return this;
    }

    #addPlugin(plugin) {
        return this.#replaceConfig({
            ...this.#config,
            plugins: this.#config.plugins.includes(plugin) ? [...this.#config.plugins] : [...this.#config.plugins, plugin],
        });
    }

    mergeOptions(options) {
        if (typeof options !== 'object' || options === null || Array.isArray(options)) {
            throw new TypeError('mergeOptions requires a plain options object.');
        }

        if (options.plugins !== undefined) {
            if (!Array.isArray(options.plugins)) {
                throw new TypeError('mergeOptions plugins must be an array of non-empty strings.');
            }

            for (const plugin of options.plugins) {
                if (typeof plugin !== 'string' || plugin === '') {
                    throw new TypeError('mergeOptions plugins must be an array of non-empty strings.');
                }
            }

            if (new Set(options.plugins).size !== options.plugins.length) {
                throw new TypeError('Duplicate plugin.');
            }
        }

        return this.#replaceConfig({
            ...this.#config,
            ...options,
            plugins: options.plugins === undefined ? [...this.#config.plugins] : [...options.plugins],
        });
    }

    addPugPlugin() {
        return this.#addPlugin('@prettier/plugin-pug');
    }

    addXmlPlugin() {
        this.#addPlugin('@prettier/plugin-xml');

        return this.#replaceConfig({
            ...this.#config,
            xmlQuoteAttributes: 'double',
            xmlSelfClosingSpace: true,
            xmlWhitespaceSensitivity: 'preserve',
        });
    }

    toConfig() {
        return {
            ...this.#config,
            plugins: [...this.#config.plugins],
        };
    }
}
