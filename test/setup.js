'use strict'

const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const nock = require('nock')

chai.use(sinonChai)
nock.disableNetConnect()

global.expect = chai.expect
global.sinon = sinon
global.nock = nock
