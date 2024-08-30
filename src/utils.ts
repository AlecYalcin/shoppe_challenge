import fs from "fs";
import path from "path";
import fileType from "file-type";

export async function convertImageToBase64(path: fs.PathLike) {
  try {
    const file = fs.readFileSync(path);
    const base64String = file.toString("base64");
    return base64String;
  } catch (error) {
    console.error("Erro ao ler a imagem: ", error);
  }
}

export async function convertBase64toImage(base64: String) {
  try {
    const buffer = Buffer.from(base64, "base64");
    fs.writeFileSync("src/temp/temp.jpg", buffer);
  } catch (error) {
    console.error("Erro ao converter em imagem: ", error);
  }
}

export function isDateTime(date_string: string): boolean {
  const date = new Date(date_string);
  if (isNaN(date.getTime())) {
    return false;
  }
  return true;
}

export function isMeasureType(measure_type: string): boolean {
  if (measure_type != "WATER" && measure_type != "GAS") {
    return false;
  }
  return true;
}

export function getPath(name: string) {
  return path.join(__dirname, name);
}
