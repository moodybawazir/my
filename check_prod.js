import https from 'https';

https.get('https://basserahai.com/', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(data.slice(0, 1000));
        const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
        if (match) {
            console.log('Found:', match[1]);
        } else {
            console.log('No match found');
            // let's try any JS file
            const matchAny = data.match(/src="(\/[^"]+\.js)"/);
            console.log('Any JS?', matchAny ? matchAny[1] : 'No');
        }
    });
}).on('error', (err) => {
    console.log('Error: ' + err.message);
});
