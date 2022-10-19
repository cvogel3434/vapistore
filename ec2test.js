

var {NEDBconnect}=require('./bin/storage/nedb-connector.js');

var testvar = {}


var SETUPvapistoregitrepo=()=>{
  exec('git config --global user.name cvogel3434' && 'git config --global user.email christianv@vogelheating.com',(err,stdout,stderr)=>{
    exec('git init',(err,stdout,stderr)=>{
      exec('git remote add origin git@github.com:cvogel3434/vapistore.git',(err,stdout,stderr)=>{
        exec('git pull origin main',(err,stdout,stderr)=>{
          exec('git reset --hard origin/main',(err,stdout,stderr)=>{
            exec('git pull origin main',(err,stdout,stderr)=>{
            });
          });
        });
      });
    });
  });
}
var testgitfun=()=>{
  var teststore = require('./store/storemaps/storemap.json').store.apps.VMT.wos;


  var testcon = new NEDBconnect({filename:path.join(__dirname,'store/apps/VMT/masterwos.db')},teststore.ensure);

  testcon.docs.loadDatabase();
  testvar.id=81;
  var addvar = {};
  testcon.INSERTdb(testvar).then(
    res=>{
      console.log(res);
      exec(`ls`,{cwd:'store'},(err,stdout,stderr)=>{
        addvar.root = stdout;
        exec(`git add .`,{cwd:'store'},(err,stdout,stderr)=>{
          addvar.gitadd={err:err,stdout:stdout,stderr:stderr};
          exec(`git commit -m "database add"`,{cwd:'store'},(err,stdout,stderr)=>{
            addvar.gitcomitt={err:err,stdout:stdout,stderr:stderr};
            exec(`git push origin main`,{cwd:'store'},(err,stdout,stderr)=>{
              addvar.gitpush={err:err,stdout:stdout,stderr:stderr};
              addvar.id=82;
              testcon.INSERTdb(addvar);
              if(err){
                console.log(err.stack);
                console.log(err.code);
              }else{
                console.log(stdout);
              }
            });
          });
        });
      });
    }
  );
}

module.exports = {
  SETUPvapistoregitrepo
}
