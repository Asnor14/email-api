const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const keyData = {
    FIREBASE_PROJECT_ID: "pill-pall-9b50f",
    FIREBASE_CLIENT_EMAIL: "firebase-adminsdk-fbsvc@pill-pall-9b50f.iam.gserviceaccount.com",
    FIREBASE_PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCdDapS3dn6EsoN\nH3b4XbVTeuchKmd4NsvmmKaVHN1ZbQofllZwpJ2n4hvF5gUBp3/O6k4T30CVG1bp\n0qhkx9/zb2o1UUyJGLiL6V3EIMsOG8FK3j63jd2RcjVfD0eAVqxGHP3+l9Xe8pO7\nvDWmOY0Hc0cwDlqzXnAQpceja9lth6Heo2RQP5cEVq3m5n+ba0Yk4ORUSvYlg4+W\nGKRLO2jfcHw6SVUBKl0rSGyUOlq5p2V/+ybpMO8clcLko937dlmcH7UHIEUabMoG\nWXKQ/xotOI2zMc2QdW9SMVDKtfvJisVERodJ3nvEvEcKyEcbV5Nzp8jwSkNXCbsB\nRo3HjrGdAgMBAAECgf8ziEha6HCdnYyuwaRH2nek7K7qMv/Acjp1b6E5TD9VGHI5\n6xpx25HfhFGYneEGqe9F9Zuo6ZhHVLEwB+85IlxZhDVVSVfTpEjpn6kksZ3vAyxp\nZIMvt1z8XH0ms9zCP65HUzwETc3fWbkf4KG56ShdSXYSTqN0N4iN7deTx8+QIGzi\n+tIvpFchGpsiVS2PnlG75GCnIYT8XLhlx8+yPhL0oofmTQP5mq8W6hBJgDm5vfZL\nRAEeCC0FLwDEfgDDiJwqBw3YAEV/zAE/BNka/AhgPcf+mjTLQvnEzQHa8LJSy/Su\nZXjl/EC5ZEeNXtBGjjFPntsArBHhXDm/BQ9+/gECgYEA2wWYLFujTWYwpyS9Av1t\npIZQ9PyyiqX7SftlsgK/wfd5JtX+aTYCLc9hkmwM4r2Dpono7MS5N1/lN/L1dcb8\n+Jot1ADHk3S6qtextEDGZLHPSixkHDaHh55LmgCXMu65EVbsUcvecVjVkdXyqJf3\nhDdeTOuoFsRjLhtbqJype6ECgYEAt5G2xrAm36Xv+deuoYMuwhG6QwPCj7bABlYg\nBinXx9OFFs945NuNy7iOASmBPWPbjhbmprCMKFcFziP7S/8Hek89Z4MhfFAncVYz\npY2vJSU+Hjx918Mrjzqsfe7aDiWBnSMi4k7kJrw4+3jy+wVMWMkMBk83SV2HwGIf\nSzbs1H0CgYBnIf9CA/SloZUPX5FRMxzJ+CVu9v7rorTtZV/BruG06F84FlQyHqhw\nAdMkK5T1v9+aMB5qP0gn9xPsgI9s4kKEnbUuux8/JBwyDlczVb0V9VRyzOxnDJZN\nGhDnd5e6+AZVT+T/r0wTe401mtUk5ko7DAdvmRgRgHBjaaaDgyGbgQKBgQCp9Ymq\nsBFt5G8pfV48P/8cw9kWjvampOdpdngz/K3CX77LfdBK5FSGmBsyTEFSm4/+IInx\nL2i1OM0xLPNQS5Ga1p7dpfVs6bF7J/qtf174H2FCEXPaPuOnuwVVm73cdzFoUc3M\nhoqKqp5/hl5Bt4gWdB5kARgJH0W/A5pBw1rG6QKBgArh1MxZchqqKeC+KppL39z+\nA4Sr3+0pXx/uihWFtkBY1iPFjJ1mCBNJiLfjZuQY9k6nYwImgTiBmhttro1UTGD6\nz5kwPQc6eWv5zOdJ8Qznqdr4bdXHTrENuOQ1Y0r0BYY2mb5/WwAuTjss5Cvha3of\n+OsqwLSshc8oAu7dc4tV\n-----END PRIVATE KEY-----\n`
};

let content = '';
if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
}

Object.entries(keyData).forEach(([key, value]) => {
    // Quote the private key value
    const finalValue = key === 'FIREBASE_PRIVATE_KEY' ? `"${value}"` : value;
    content += `\n${key}=${finalValue}`;
});

fs.writeFileSync(envPath, content);
console.log('Updated .env.local');
