
var {NEDBconnect}=require('./bin/storage/nedb-connector.js');
var fs = require('fs');
var {exec} = require('child_process');
var result = {};

var testgitfun=()=>{
  var teststore = require('./store/storemaps/storemap.json').store.apps.VMT.wos;

  var testcon = new NEDBconnect({filename:path.join(__dirname,'store/apps/VMT/masterwos.db')},teststore.ensure);
  testcon.docs.loadDatabase();

  testvar.id=81;
  testcon.INSERTdb(testvar).then(
    res=>{
    }
  );
}

module.exports = {
  testgitfun
}
