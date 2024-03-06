const fs = require('fs');

const EDSDK_VERSION = process.env.EDSDK_VERSION || 131712;

for (const file of [
    `third_party/EDSDKv${EDSDK_VERSION}L/Linux/EDSDK/Header/EDSDKTypes.h`,
    `third_party/EDSDKv${EDSDK_VERSION}W/Windows/EDSDK/Header/EDSDKTypes.h`,
]) {
    let originalData = '';
    try {
        originalData = fs.readFileSync(file, 'utf8');
    } catch (e) {
        continue;
    }
    const patchedData = originalData
        .replace(' UNKNOWN   = 0x00000000,', ' kEdsObjectFormat_Unknown   = 0x00000000,')
        .replace(' Jpeg      = 0x3801,', ' kEdsObjectFormat_Jpeg      = 0x3801,')
        .replace(' CR2       = 0xB103,', ' kEdsObjectFormat_CR2       = 0xB103,')
        .replace(' MP4       = 0xB982,', ' kEdsObjectFormat_MP4       = 0xB982,')
        .replace(' CR3       = 0xB108,', ' kEdsObjectFormat_CR3       = 0xB108,')
        .replace(' HEIF_CODE = 0xB10B,', ' kEdsObjectFormat_HEIF_CODE = 0xB10B,')
    if (originalData !== patchedData) {
        fs.rmSync(file);
        fs.writeFileSync(file, patchedData);
        console.log("Patched file", file);
    } else {
        console.log("File not patched", file)
    }
}

const file = 'binding.gyp';
const originalData = fs.readFileSync(file, 'utf8');
const regex = /"edsdk_version": "([0-9]+)"/gm;
const patchedData = originalData.replace(regex, `"edsdk_version": "${EDSDK_VERSION}"`)

if (originalData !== patchedData) {
    fs.rmSync(file);
    fs.writeFileSync(file, patchedData);
    console.log("Patched file", file);
} else {
    console.log("File not patched", file)
}