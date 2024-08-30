import fs from "fs";
import path from "path";

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
    fs.writeFileSync("src/temp.jpg", buffer);
  } catch (error) {
    console.error("Erro ao converter em imagem: ", error);
  }
}

export function getPath(name: string) {
  return path.join(__dirname, name);
}
