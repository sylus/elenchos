import { getFile } from "./getFile";
const DIR = process.env.CODE_DIR || "/tmp";

export const elenchosConfig = async sha => {
  const configData = await getFile(`${DIR}/${sha}/elenchos.json`);
  if (!configData) return false;
  try {
    const config = JSON.parse(configData);
    if (!config["dockerfiles"] || !config["overlay"]) {
      console.log("Missing elenchos configuration variables");
      return false;
    } else {
      return config;
    }
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
