// src/utils/imageResolver.ts
import { Image as RNImage } from "react-native";
import { Asset } from "expo-asset";

/**
 * resolveImageSource(raw)
 * raw に入り得る値:
 *  - 数値の asset ID (例: 3)
 *  - モジュールオブジェクト (import SomeImg from './a.png')
 *  - 文字列 URL
 *  - { uri: '...' }
 *
 * 戻り値: react-native / react-native-web に安全に渡せる形式
 *  - { uri: '...' } またはモジュールオブジェクト
 */
export function resolveImageSource(raw: any): any {
  if (!raw) return undefined;

  // 既に { uri } の形ならそのまま
  if (typeof raw === "object" && raw !== null && "uri" in raw && typeof raw.uri === "string") {
    return raw;
  }

  // 文字列 URL の場合
  if (typeof raw === "string") return { uri: raw };

  // try Image.resolveAssetSource (ネイティブ/Expo で数値IDやモジュールを解決)
  try {
    const resolved = RNImage.resolveAssetSource(raw);
    if (resolved && resolved.uri) return resolved;
  } catch (e) {
    // ignore
  }

  // Expo の Asset を使って URI を取得（静的 import に対して有効）
  try {
    const asset = Asset.fromModule(raw);
    if (asset && asset.uri) return { uri: asset.uri };
  } catch (e) {
    // ignore
  }

  // 最終フォールバック：そのまま返す（レンダラーが処理できる場合のみ）
  return raw;
}

