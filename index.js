const axios = require("axios");
String.prototype.hashCode = function () {
    var hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

(async () => {
    async function getSeating() {
        const resp = await axios({
            "method": "get",
            "url": "https://classes.uwaterloo.ca//cgi-bin/cgiwrap/infocour/salook.pl?level=under&sess=1229&subject=CS&cournum=246"
        });
        const re = /<TR>.*<\/TR>/g;
        let n = 0;
        let res;
        let matches = [];
        while ((res = re.exec(resp.data)) !== null && n < 10) {
            if (n < 10 && n % 2 == 1) {
                matches.push(res[0]);
            }
            n++;
        }
        return matches;
    }

    let prev_matches = JSON.stringify(await getSeating());

    setInterval(async () => {
        let current = JSON.stringify(await getSeating());
        let diff = current != prev_matches;
        if (diff) {
            prev_matches = current
        }
        if (diff) {
            console.log("sending webhook");
            axios({
                "method": "post",
                "url": "https://discord.com/api/webhooks/1020341718752698419/ftKV36TGQw6erb0lZX4bxfGUaNNlzlZuwwu7Dil1gjSCNs8z3yg4kc_bNyvh84JEuik4",
                "data": {
                    "content": "seating changed: https://classes.uwaterloo.ca//cgi-bin/cgiwrap/infocour/salook.pl?level=under&sess=1229&subject=CS&cournum=246"
                }
            });
        }
    }, 30*1000);
})()