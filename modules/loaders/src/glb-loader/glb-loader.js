// Binary container format for glTF

import GLBDecoder from './glb-decoder';
import unpackGLBBuffers from './unpack-glb-buffers';
import unpackJsonArrays from './unpack-json-arrays';

function parseGLB(arrayBuffer, options = {}) {
  const {json, binaryByteOffset} = GLBDecoder.parseGlbBuffer(arrayBuffer, options);
  const unpackedBuffers = unpackGLBBuffers(arrayBuffer, json, binaryByteOffset);
  return unpackJsonArrays(json, unpackedBuffers);
}

export default {
  name: 'GLB',
  extension: 'glb',
  parseBinary: parseGLB
};
