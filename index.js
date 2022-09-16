const { match } = require("assert");
const axios = require("axios");
const fs = require("fs");
(async () => {
    const original = fs.readFileSync("./data");
    const resp = await axios({
        "method": "get",
        "url": "https://classes.uwaterloo.ca//cgi-bin/cgiwrap/infocour/salook.pl?level=under&sess=1229&subject=CS&cournum=246"
    });

    function seatingChanged(response) {
        const re = /<TR>.*<\/TR>/g;
        let n = 0;
        let res;
        let matches = [];
        while ((res = re.exec(resp.data)) !== null && n < 10) {
            if(n < 10 && n%2==1){
                matches.push(res[0]);
            }
            n++;
        }
        // console.log(JSON.stringify(matches));
        return JSON.stringify(matches) != original;
        // return false;
    }
    if (seatingChanged(resp.data)) {
        // console.log("true");
        axios({
            "method": "post",
            "url": "https://discord.com/api/webhooks/1020341718752698419/ftKV36TGQw6erb0lZX4bxfGUaNNlzlZuwwu7Dil1gjSCNs8z3yg4kc_bNyvh84JEuik4",
            "data": {
                "content": "seating changed"
            }
        });
    }
})();