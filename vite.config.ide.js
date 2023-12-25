import { visualizer } from 'rollup-plugin-visualizer';
import * as fs from 'fs';
import * as path from 'path';
const makeNeededFolder = () => {
  const reportPath = path.join(__dirname, '@reports');
  const folderPath = path.join(reportPath, '@webpack');
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath)
  }
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }
}

const dragonflyUtil = () => {
  const packageTime = { begin: 0, end: 0 };
  return {
    name: 'ide-util',
    enforce: 'pre||post',
    apply: 'build',
    buildStart() {
      packageTime.begin = Math.floor(Date.now() / 1000)
    },
    buildEnd() {
      packageTime.end = Math.floor(Date.now() / 1000);

    },
    writeBundle(info, bundle) {
      const distAbsolutePath = info.dir;
      const distReactivePath = distAbsolutePath.replace(__dirname, "").replace(/\\/g, '/');
      const filePath = path.join(__dirname, '@reports/@webpack/stats.json');
      makeNeededFolder();
      const freshResult = {
        packageTime: packageTime,
        packageDir: distReactivePath,
        packageNum: 1,
        packageAvgTime: packageTime.end - packageTime.begin
      };
      if (fs.existsSync(filePath)) {
        try {
          const preResult = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
          const packageNum = preResult.packageNum + 1;
          fs.writeFileSync(filePath, JSON.stringify({
            packageTime: packageTime,
            packageDir: distReactivePath,
            packageNum: packageNum,
            packageAvgTime: Math.floor(((preResult.packageNum * preResult.packageAvgTime) + (packageTime.end - packageTime.begin)) / packageNum)
          }))
        } catch (err) {
          fs.writeFileSync(filePath, JSON.stringify(freshResult));
        }
      } else {
        fs.writeFileSync(filePath, JSON.stringify(freshResult));
      }
    }
  }
}

export const ideConfigs = [
  dragonflyUtil(),
  visualizer({
    emitFile: false,
    filename: '@reports/@webpack/index.html',
    open: false,
  })
];
