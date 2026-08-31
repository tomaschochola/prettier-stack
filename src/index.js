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
        return this.#replaceConfig({
            ...this.#config,
            plugins: this.#config.plugins.includes('@prettier/plugin-xml') ? [...this.#config.plugins] : [...this.#config.plugins, '@prettier/plugin-xml'],
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
