/* eslint-disable no-underscore-dangle */
// function combine all config in next plugin
const _combine = (fns, cfg) => fns.reduce((result, fn) => fn(result), cfg || {});

const _cfg = (cfg, extra) => Object.assign(cfg || {}, extra);

module.exports = {
  _combine,
  _cfg,
};
