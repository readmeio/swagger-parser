const { expect } = require('chai');

const OpenAPIParser = require('../../..');
const helper = require('../../utils/helper');
const path = require('../../utils/path');

describe("Invalid APIs (can't be parsed)", function () {
  it('not a Swagger API', async function () {
    try {
      await OpenAPIParser.parse(path.rel('specs/invalid/not-swagger.yaml'));
      helper.shouldNotGetCalled();
    } catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.contain('not-swagger.yaml is not a valid OpenAPI definition');
    }
  });

  it('not a valid OpenAPI 3.1 definition', async function () {
    try {
      await OpenAPIParser.parse(path.rel('specs/invalid/no-paths-or-webhooks.yaml'));
      helper.shouldNotGetCalled();
    } catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.contain('no-paths-or-webhooks.yaml is not a valid OpenAPI definition');
    }
  });

  it('invalid Swagger version (1.2)', async function () {
    try {
      await OpenAPIParser.dereference(path.rel('specs/invalid/old-version.yaml'));
      helper.shouldNotGetCalled();
    } catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal('Unrecognized Swagger version: 1.2. Expected 2.0');
    }
  });

  it('invalid Swagger version (3.0)', async function () {
    try {
      await OpenAPIParser.bundle(path.rel('specs/invalid/newer-version.yaml'));
      helper.shouldNotGetCalled();
    } catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal('Unrecognized Swagger version: 3.0. Expected 2.0');
    }
  });

  it('numeric Swagger version (instead of a string)', async function () {
    try {
      await OpenAPIParser.validate(path.rel('specs/invalid/numeric-version.yaml'));
      helper.shouldNotGetCalled();
    } catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal('Swagger version number must be a string (e.g. "2.0") not a number.');
    }
  });

  it('numeric API version (instead of a string)', async function () {
    try {
      await OpenAPIParser.validate(path.rel('specs/invalid/numeric-info-version.yaml'));
      helper.shouldNotGetCalled();
    } catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal('API version number must be a string (e.g. "1.0.0") not a number.');
    }
  });
});
