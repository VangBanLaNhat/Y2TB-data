const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = '/media/key/Data/Develop/Language/Javascript/VBLN-Bot-lite-noPanel-main/plugins';
const destDir = '/media/key/Data/Develop/Language/Javascript/VBLN-data/plugins';

const plugins = fs.readdirSync(srcDir);

plugins.forEach(plugin => {
    const pluginPath = path.join(srcDir, plugin);
    if (fs.statSync(pluginPath).isDirectory() && plugin !== 'lib' && plugin !== 'cache') {
        const destPath = path.join(destDir, `${plugin}.zip`);
        console.log(`Zipping ${plugin} to ${destPath}`);
        try {
            // Remove old zip if exists
            if (fs.existsSync(destPath)) {
                fs.unlinkSync(destPath);
            }
            // Execute zip command
            execSync(`cd "${pluginPath}" && zip -r "${destPath}" ./*`);
        } catch (e) {
            console.error(`Error zipping ${plugin}:`, e.message);
        }
    }
});
