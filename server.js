//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      http = require('http');
var {exec} = require('child_process');

var port = 8080; //port for local host

var reqque=[];

var {vapiuser,ADMINrouter,LOADstoremap}=require('./bin/vapi-admin.js');

var {AppStoreRouter,AppStore} = require('./bin/vapi-store.js');

var {vapilogger,arequestlog}=require('./logger/db/logger-db.js');


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
setupgit();
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

/* Setup API appstores

    appdbs - json file holding app db info
    vapiapps - holds AppStore classes created from the appplication information
    found on appdbs.
*/
var vstore = LOADstoremap(path.join(__dirname,'store/apps'),path.join(__dirname,'store/storemaps/storemap.json'));

var RouteVAPI = (url,pak) =>{
  let mod = url[1].toUpperCase() || ''; //module name
  let task = '';
  try{task = url[2].toUpperCase() || ''} //task in module}
  catch{}
  return new Promise((resolve,reject)=>{
    switch(mod){
      /*
      case 'REPORTING':{
        console.log(333);
        fs.readFile('./controllers/index.html',(err,doc)=>{
        if(err){
          res.writeHead(500);
          res.end('Error');
        }
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end(doc,'utf-8');
      });
      return true;
      break;
    }*/
      case 'APP':{return resolve(AppStoreRouter(pak,vstore));}
      case 'ADMIN':{return resolve(ADMINrouter(task,pak,vstore));}
    }
  });
}

http.createServer((req,res)=>{
  let reqlog=arequestlog({ //request tracking object
      url:req.url,
      timein:new Date().getTime()
    });

  let data=''; //to accept data
  req.on('data',chunk=>{data+=chunk;});
  req.on('end',()=>{
    try{data=JSON.parse(data);}catch{data={}}
    if(data!=''&&data.access!=undefined){ //check if data is formated
      let rspak={ //prep api response object
        msg:'Could not log in..',
        success:false,
        body:{}
      }
      vapiuser.AUTHuser(data.access).then(//check user can access
        auth=>{
          if(auth){//user cleared
            rspak.success=true;
            rspak.msg='Has Logged in'
            rspak.data = data; //attach the request data
            reqlog.success=true; //update request log item

            RouteVAPI(req.url.split('/'),rspak).then(
              answr=>{
                  rspak.success = answr;
                  res.write(JSON.stringify(rspak)); //write the result to the response
                  vapilogger.LOGrequestend(reqlog); //log the end of the request
                  res.end();
              }
            );
          }else{//user not cleard
          res.write(JSON.stringify(rspak)); //write the result to the response
          vapilogger.LOGrequestend(reqlog); //log the end of the request
          res.end(); //end the request
          }
        }
      );
    }else{
      fs.readFile('./controllers/index.html',(err,doc)=>{
          if(err){
            res.writeHead(500);
            res.end();
          }else{
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(doc,'utf-8');
          }
          vapilogger.LOGrequestend(reqlog); //log the end of the request
        });
      //res.write('bad request');console.log('BAD BODY');res.end()
    }
  });
}).listen(port);
