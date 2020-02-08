const regex = /(.*):(\s+)(.*)\n/gm;
const str = `Temperature:                    23.5°C
Valve:                          0%
Mode:                           auto dst
Vacation mode:                  off
`;
let m;

while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
    });
}
