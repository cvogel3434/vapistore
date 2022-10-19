

var {NEDBconnect}=require('./bin/storage/nedb-connector.js');

var testvar = {}
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

/*
launch-wizard-1

git remote add origin https://github.com/cvogel3434/vapistoredatatest.git
git branch -M main
git push -u origin main
*/
var setupgit=()=>{
  //exec(`sudo yum install git`,(err,stdout,stderr)=>{
    exec(`git config --global user.name cvogel3434`,(err,stdout,stderr)=>{
      testvar.gitusername={err:err,stdout:stdout,stderr:stderr};
      exec(`git config --global user.email christianv@vogelheating.com`,(err,stdout,stderr)=>{
        testvar.gituseremail={err:err,stdout:stdout,stderr:stderr};
        setupgitfun();
      });
    });
  //});
}
//setupgit();
var setupgitfun=()=>{
  //exec(`sudo yum install git -y`,(err,stdout,stderr)=>{
    exec(`git init`,{cwd:'store'},(err,stdout,stderr)=>{
      testvar.gitinit={err:err,stdout:stdout,stderr:stderr};
      exec(`git remote set-url origin git@github.com:cvogel3434/vapistoredatatest.git`,{cwd:'store'},(err,stdout,stderr)=>{
        testvar.gitremote={err:err,stdout:stdout,stderr:stderr};
        exec(`git branch -M main`,{cwd:'store'},(err,stdout,stderr)=>{
          testvar.gitbranch={err:err,stdout:stdout,stderr:stderr};
          exec(`git pull origin main`,{cwd:'store'},(err,stdout,stderr)=>{
            testvar.gitpull={err:err,stdout:stdout,stderr:stderr};
              //exec(`git push - origin main`,{cwd:'store'},(err,stdout,stderr)=>{
                testgitfun();
              //});
          });
        });
      });
    });
  //});
}

console.log(33);
