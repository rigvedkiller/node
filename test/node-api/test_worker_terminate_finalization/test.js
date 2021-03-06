'use strict';
const common = require('../../common');

// TODO(addaleax): Run this test once it stops failing under ASAN/valgrind.
// Refs: https://github.com/nodejs/node/issues/34731
common.skip('Reference management in N-API leaks memory');

const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('error', common.mustNotCall());
} else {
  const { Test } =
    require(`./build/${common.buildType}/test_worker_terminate_finalization`);

  // Spin up thread and call add-on create the right sequence
  // of rerences to hit the case reported in
  // https://github.com/nodejs/node-addon-api/issues/722
  // will crash if run under debug and its not possible to
  // create object in the specific finalizer
  Test(new Object());
}
