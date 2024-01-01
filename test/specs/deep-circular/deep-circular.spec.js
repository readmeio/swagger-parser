const { expect } = require('chai');

const OpenAPIParser = require('../../..');
const helper = require('../../utils/helper');
const path = require('../../utils/path');

const bundledAPI = require('./bundled');
const dereferencedAPI = require('./dereferenced');
const parsedAPI = require('./parsed');

describe('API with deeply-nested circular $refs', () => {
  it('should parse successfully', async () => {
    const parser = new OpenAPIParser();
    const api = await parser.parse(path.rel('specs/deep-circular/deep-circular.yaml'));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(parsedAPI.api);
    expect(parser.$refs.paths()).to.deep.equal([path.abs('specs/deep-circular/deep-circular.yaml')]);
  });

  it(
    'should resolve successfully',
    helper.testResolve(
      'specs/deep-circular/deep-circular.yaml',
      parsedAPI.api,
      'specs/deep-circular/definitions/name.yaml',
      parsedAPI.name,
      'specs/deep-circular/definitions/required-string.yaml',
      parsedAPI.requiredString,
    ),
  );

  it('should dereference successfully', async () => {
    const parser = new OpenAPIParser();
    const api = await parser.dereference(path.rel('specs/deep-circular/deep-circular.yaml'));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(dereferencedAPI);
    // Reference equality
    expect(api.paths['/family-tree'].get.responses['200'].schema.properties.name.type)
      .to.equal(api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.name.type)
      .to.equal(
        api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.name.type,
      )
      .to.equal(
        api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.level3
          .properties.name.type,
      )
      .to.equal(
        api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.level3
          .properties.level4.properties.name.type,
      );
  });

  it('should validate successfully', async () => {
    const parser = new OpenAPIParser();
    const api = await parser.validate(path.rel('specs/deep-circular/deep-circular.yaml'));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(dereferencedAPI);
    // Reference equality
    expect(api.paths['/family-tree'].get.responses['200'].schema.properties.name.type)
      .to.equal(api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.name.type)
      .to.equal(
        api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.name.type,
      )
      .to.equal(
        api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.level3
          .properties.name.type,
      )
      .to.equal(
        api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.level3
          .properties.level4.properties.name.type,
      );
  });

  it('should bundle successfully', async () => {
    const parser = new OpenAPIParser();
    const api = await parser.bundle(path.rel('specs/deep-circular/deep-circular.yaml'));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(bundledAPI);
  });
});
