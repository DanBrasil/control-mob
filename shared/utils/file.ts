import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { ImportFileSelection } from "@/modules/settings/types/settings.types";

export const writeJsonFile = async (
  fileName: string,
  payload: unknown,
): Promise<string> => {
  const baseDir = FileSystem.cacheDirectory;

  if (!baseDir) {
    throw new Error("Diretorio temporario indisponivel no dispositivo.");
  }

  const uri = `${baseDir}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return uri;
};

export const readTextFile = async (uri: string): Promise<string> => {
  return FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });
};

export const pickJsonFile = async (): Promise<ImportFileSelection | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const file = result.assets[0];
  const content = await readTextFile(file.uri);

  return {
    name: file.name,
    content,
  };
};

export const shareFile = async (uri: string): Promise<void> => {
  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error(
      "Compartilhamento de arquivo nao disponivel neste dispositivo.",
    );
  }

  await Sharing.shareAsync(uri, {
    mimeType: "application/json",
    dialogTitle: "Exportar dados do app",
    UTI: "public.json",
  });
};
