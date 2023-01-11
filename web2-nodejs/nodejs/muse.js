/*var M = {
    v: 'v',
    f: function(){
        console.log(this.v);
    }
}
*/

var part = require('./mpart.js');
console.log(part);  // M객체가 담겨있음
part.f();
part.v;