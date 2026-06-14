import { hashJson } from "./hash.js";
import { HexString } from "./types.js";

const ZERO_ROOT = `0x${"0".repeat(64)}` as HexString;

function normalizeLeaf(leaf: HexString): HexString {
  return leaf.toLowerCase() as HexString;
}

function hashPair(a: HexString, b: HexString): HexString {
  const [left, right] = [normalizeLeaf(a), normalizeLeaf(b)].sort();
  return hashJson({ left, right });
}

export function computeMerkleRoot(leaves: HexString[]): HexString {
  if (leaves.length === 0) return ZERO_ROOT;

  let level = [...new Set(leaves.map(normalizeLeaf))].sort();
  while (level.length > 1) {
    const next: HexString[] = [];
    for (let index = 0; index < level.length; index += 2) {
      const left = level[index];
      const right = level[index + 1] ?? left;
      next.push(hashPair(left, right));
    }
    level = next.sort();
  }
  return level[0];
}
