

var {NEDBconnect}=require('./bin/storage/nedb-connector.js');
var fs = require('fs');
var {exec} = require('child_process');
var testvar = {}

var result = {};

var testgitfun=()=>{
  var teststore = require('./store/storemaps/storemap.json').store.apps.VMT.wos;

  var testcon = new NEDBconnect({filename:path.join(__dirname,'store/apps/VMT/masterwos.db')},teststore.ensure);
  testcon.docs.loadDatabase();

  testvar.id=81;
  var addvar = {};
  testcon.INSERTdb(testvar).then(
    res=>{
      exec(`git add .`,(err,stdout,stderr)=>{
        addvar.gitadd={err:err,stdout:stdout,stderr:stderr};
        exec(`git commit -m "database add"`,(err,stdout,stderr)=>{
          addvar.gitcomitt={err:err,stdout:stdout,stderr:stderr};
          exec(`git push origin main`,(err,stdout,stderr)=>{
            addvar.gitpush={err:err,stdout:stdout,stderr:stderr};
          });
        });
      });
    }
  );
}

module.exports = {
  testgitfun
}
