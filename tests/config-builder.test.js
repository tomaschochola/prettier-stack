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

import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { format, resolveConfig } from 'prettier';

import { PrettierConfigBuilder } from '../src/index.js';

const formatWithResolvedConfig = async (source, filename, options) => {
    const filepath = fileURLToPath(new URL(filename, import.meta.url));
    const resolvedConfig = await resolveConfig(filepath, { editorconfig: true });

    return format(source, {
        ...resolvedConfig,
        ...options,
        filepath,
    });
};

test('provides the complete shared formatting policy', () => {
    const config = new PrettierConfigBuilder().toConfig();

    assert.deepEqual(config, {
        arrowParens: 'always',
        bracketSameLine: false,
        objectWrap: 'preserve',
        plugins: [],
        proseWrap: 'never',
        semi: true,
        singleAttributePerLine: true,
        singleQuote: true,
        trailingComma: 'all',
    });
});

test('merges options without exposing mutable plugin arrays', () => {
    const plugins = ['custom-plugin'];

    const builder = new PrettierConfigBuilder().mergeOptions({
        plugins,
        printWidth: 120,
    });

    plugins.push('external-mutation');
    const config = builder.toConfig();

    config.plugins.push('output-mutation');

    assert.equal(config.printWidth, 120);
    assert.deepEqual(builder.toConfig().plugins, ['custom-plugin']);
});

test('adds the Pug plugin once and formats Pug source', async () => {
    const config = new PrettierConfigBuilder().addPugPlugin().addPugPlugin().toConfig();

    assert.deepEqual(config.plugins, ['@prettier/plugin-pug']);
    assert.equal(
        await formatWithResolvedConfig('div\n span hello\n', 'fixture.pug', {
            ...config,
            parser: 'pug',
        }),
        'div\n    span hello\n',
    );
});

test('formats XML with the default whitespace policy', async () => {
    const config = new PrettierConfigBuilder().addXmlPlugin().addXmlPlugin().mergeOptions({ printWidth: 160 }).toConfig();

    assert.deepEqual(config.plugins, ['@prettier/plugin-xml']);
    assert.equal(config.printWidth, 160);
    assert.equal(config.xmlQuoteAttributes, 'double');
    assert.equal(config.xmlSelfClosingSpace, true);
    assert.equal(config.xmlWhitespaceSensitivity, 'preserve');
    assert.equal(
        await formatWithResolvedConfig('<?xml version="1.0"?><root key=\'value\'><value>  a   b  </value><empty /></root>\n', 'fixture.xml', {
            ...config,
            parser: 'xml',
        }),
        '<?xml version="1.0" ?>\n<root key="value">\n    <value>  a   b  </value>\n    <empty />\n</root>\n',
    );
});

test('copy templates expose the intended configuration tiers', async () => {
    const { default: baseConfig } = await import('../templates/base.js');
    const { default: recommendedConfig } = await import('../templates/recommended.js');
    const { default: fullConfig } = await import('../templates/full.js');

    assert.deepEqual(baseConfig.plugins, []);
    assert.deepEqual(recommendedConfig.plugins, ['@prettier/plugin-xml']);
    assert.deepEqual(fullConfig.plugins, ['@prettier/plugin-xml', '@prettier/plugin-pug']);
});
